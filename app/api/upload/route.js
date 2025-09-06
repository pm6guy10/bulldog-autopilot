import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import MsgReader from 'node-msg';
import pdf from 'pdf-parse';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// --- Dummy Processor Functions (These will be built out in the next phase) ---
async function processAndSaveChunks(text, metadata) {
  // In the next phase, this function will chunk the text, create embeddings,
  // and save everything to the 'documents' table in Supabase.
  console.log(`Processing text from ${metadata.fileName}. Length: ${text.length}`);
  // For now, it just logs a message.
  return;
}

// --- The File Processors ---
async function processPdf(buffer, metadata) {
  const data = await pdf(buffer);
  await processAndSaveChunks(data.text, metadata);
}

async function processDocx(buffer, metadata) {
  const { value } = await mammoth.extractRawText({ buffer });
  await processAndSaveChunks(value, metadata);
}

async function processMsg(buffer, metadata) {
  const msg = new MsgReader(buffer);
  const data = msg.getFileData();
  const text = `${data.subject}\n\n${data.body}`;
  await processAndSaveChunks(text, metadata);
}

async function processZip(buffer, metadata) {
  const zip = await JSZip.loadAsync(buffer);
  for (const filename in zip.files) {
    if (!zip.files[filename].dir) {
      const fileBuffer = await zip.files[filename].async('nodebuffer');
      // Recursively call the main processor for each file inside the zip
      await processFile(fileBuffer, { ...metadata, fileName: filename, originalFile: metadata.fileName });
    }
  }
}

// --- The Main Router ---
async function processFile(buffer, metadata) {
  const extension = metadata.fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf': await processPdf(buffer, metadata); break;
    case 'docx': await processDocx(buffer, metadata); break;
    case 'msg': await processMsg(buffer, metadata); break;
    case 'zip': await processZip(buffer, metadata); break;
    default: console.log(`Skipping unsupported file type: ${metadata.fileName}`);
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files'); // getAll retrieves all files
    const caseId = formData.get('caseId');

    if (!files || files.length === 0 || !caseId) {
      return NextResponse.json({ error: 'At least one file and a Case ID are required.' }, { status: 400 });
    }
    
    // Process each file in the batch
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      await supabase.storage.from('case-files').upload(`${caseId}/${file.name}`, buffer, { upsert: true });
      await processFile(buffer, { caseId, fileName: file.name });
    }

    return NextResponse.json({ message: 'Batch upload successful.', processed: files.length });

  } catch (error) {
    console.error("Error in upload API:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
