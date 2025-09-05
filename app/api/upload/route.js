// File: app/api/upload/route.js

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  const caseId = formData.get('caseId');

  if (!file || !caseId) {
    return NextResponse.json({ error: 'File and Case ID are required.' }, { status: 400 });
  }

  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage
    .from('case-files') // Make sure you have a bucket named 'case-files'
    .upload(`${caseId}/${file.name}`, file, {
      upsert: true,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Later, we will trigger the "brain" to process this file.
  return NextResponse.json({ message: 'File uploaded successfully.', path: data.path });
}
