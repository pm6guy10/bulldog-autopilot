import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize the Supabase client for backend operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use the powerful service key on the backend
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const caseId = formData.get('caseId'); // e.g., "yakima"

    if (!file || !caseId) {
      return NextResponse.json({ error: 'File and Case ID are required.' }, { status: 400 });
    }

    // Securely upload the file to Supabase Storage, organized by caseId
    const { data, error } = await supabase.storage
      .from('case-files') // This MUST be the name of your storage bucket
      .upload(`${caseId}/${file.name}`, file, {
        upsert: true, // This will overwrite a file if it has the same name
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(error.message);
    }

    // In Week 2, we will trigger the AI processing from here.
    // For now, a successful upload is the goal.

    return NextResponse.json({ message: 'File uploaded successfully.', path: data.path });

  } catch (error) {
    console.error("Error in upload API:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
