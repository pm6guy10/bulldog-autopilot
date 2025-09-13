// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import JSZip from 'jszip';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ProcessedFile {
  filename: string;
  filetype: string;
  raw_text: string;
  metadata: any;
  causality_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caseId = formData.get('case_id') as string;
    
    if (!file || !caseId) {
      return NextResponse.json({ error: 'File and case_id required' }, { status: 400 });
    }

    console.log(`🌬️ Woodchipper: Processing ${file.name} for case ${caseId}`);
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const processedFiles: ProcessedFile[] = [];
    
    // Generate causality chain for audit trail
    const rootCausalityId = generateCausalityId();
    
    // Log upload event
    await logEvent('file.uploaded', rootCausalityId, {
      filename: file.name,
      size: file.size,
      case_id: caseId
    });

    if (file.name.endsWith('.zip')) {
      // Handle ZIP extraction
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(buffer);
      
      for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
        if (!zipEntry.dir) {
          const fileBuffer = await zipEntry.async('nodebuffer');
          const processed = await processFile(filename, fileBuffer, rootCausalityId);
          if (processed) processedFiles.push(processed);
        }
      }
    } else {
      // Handle single file
      const processed = await processFile(file.name, buffer, rootCausalityId);
      if (processed) processedFiles.push(processed);
    }

    // Insert processed files into database
    const documents = await Promise.all(
      processedFiles.map(async (processed) => {
        const { data, error } = await supabase
          .from('documents')
          .insert({
            case_id: caseId,
            filename: processed.filename,
            filetype: processed.filetype,
            raw_text: processed.raw_text,
            metadata: processed.metadata
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Log document processing
        await logEvent('document.processed', processed.causality_id, {
          document_id: data.id,
          filename: processed.filename,
          text_length: processed.raw_text.length
        });
        
        return data;
      })
    );

    // Trigger insight generation (could be queued for async processing)
    await generateInsights(caseId, documents);

    return NextResponse.json({
      success: true,
      processed_files: processedFiles.length,
      causality_id: rootCausalityId,
      documents: documents.map(d => ({ id: d.id, filename: d.filename }))
    });

  } catch (error) {
    console.error('Woodchipper error:', error);
    return NextResponse.json(
      { error: 'Processing failed', details: error.message },
      { status: 500 }
    );
  }
}

async function processFile(filename: string, buffer: Buffer, parentCausalityId: string): Promise<ProcessedFile | null> {
  const causalityId = generateCausalityId(parentCausalityId);
  const filetype = getFileType(filename);
  
  try {
    let raw_text = '';
    let metadata: any = { size: buffer.length };

    switch (filetype) {
      case 'pdf':
        const pdfData = await pdf(buffer);
        raw_text = pdfData.text;
        metadata.pages = pdfData.numpages;
        metadata.info = pdfData.info;
        break;

      case 'docx':
        const docxResult = await mammoth.extractRawText({ buffer });
        raw_text = docxResult.value;
        metadata.warnings = docxResult.messages;
        break;

      case 'msg':
        // For .msg files, you'd need a library like node-msg
        // This is a placeholder - .msg parsing is complex
        raw_text = buffer.toString('utf8').slice(0, 10000); // Fallback
        metadata.type = 'email';
        break;

      case 'txt':
        raw_text = buffer.toString('utf8');
        break;

      case 'image':
        // OCR processing
        const worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(buffer);
        await worker.terminate();
        raw_text = text;
        metadata.ocr = true;
        break;

      default:
        console.warn(`🚫 Unsupported file type: ${filename}`);
        return null;
    }

    // Clean and validate extracted text
    raw_text = raw_text.trim();
    if (raw_text.length < 10) {
      console.warn(`⚠️ Minimal text extracted from ${filename}`);
    }

    return {
      filename,
      filetype,
      raw_text,
      metadata,
      causality_id: causalityId
    };

  } catch (error) {
    console.error(`Failed to process ${filename}:`, error);
    await logEvent('document.failed', causalityId, {
      filename,
      error: error.message
    });
    return null;
  }
}

function getFileType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  switch (ext) {
    case 'pdf': return 'pdf';
    case 'docx': case 'doc': return 'docx';
    case 'msg': return 'msg';
    case 'txt': return 'txt';
    case 'png': case 'jpg': case 'jpeg': case 'gif': return 'image';
    default: return 'unknown';
  }
}

function generateCausalityId(parent?: string): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex');
  const id = `cau_${timestamp}_${random}`;
  return parent ? `${parent}→${id}` : id;
}

async function logEvent(eventType: string, causalityId: string, data: any) {
  await supabase.from('audit_log').insert({
    event_type: eventType,
    causality_id: causalityId,
    data
  });
}

async function generateInsights(caseId: string, documents: any[]) {
  console.log(`🧩 Generating insights for case ${caseId} with ${documents.length} documents`);
  
  // Get case data for analysis
  const { data: caseData } = await supabase
    .from('cases')
    .select('*, documents(*)')
    .eq('id', caseId)
    .single();
  
  if (!caseData) return;

  const insights = [];
  
  // Playbook 1: High Exposure Detection
  if (caseData.exposure > 5000) {
    insights.push({
      case_id: caseId,
      insight_type: 'high_exposure',
      summary: `Case exposure of $${caseData.exposure.toLocaleString()} exceeds $5,000 threshold`,
      causality_id: generateCausalityId()
    });
  }
  
  // Playbook 2: Idle Case Detection
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(caseData.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceUpdate > 200) {
    insights.push({
      case_id: caseId,
      insight_type: 'idle_risk',
      summary: `Case has been idle for ${daysSinceUpdate} days (>200 day threshold)`,
      causality_id: generateCausalityId()
    });
  }
  
  // Playbook 3: Missing Attachment Detection
  const allText = documents.map(d => d.raw_text).join(' ');
  const attachmentRefs = allText.match(/attachment|attached|see\s+file|pdf|document/gi);
  
  if (attachmentRefs && attachmentRefs.length > documents.length) {
    insights.push({
      case_id: caseId,
      insight_type: 'missing_file',
      summary: `Found ${attachmentRefs.length} file references but only ${documents.length} documents uploaded`,
      causality_id: generateCausalityId()
    });
  }
  
  // Insert insights
  if (insights.length > 0) {
    await supabase.from('case_insights').insert(insights);
    
    // Log insight generation
    await logEvent('insights.generated', generateCausalityId(), {
      case_id: caseId,
      insights_count: insights.length,
      types: insights.map(i => i.insight_type)
    });
  }
}