"use client";
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// This is the UI component for our file uploader.
export function FileUpload({ caseId }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('Drag & drop case files here, or click to select (PDF only)');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0 || uploading) return;
    
    setUploading(true);
    const file = acceptedFiles[0];
    setMessage(`Uploading ${file.name}...`);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId);

    // This is the backend API route we will create next.
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    setUploading(false);
    if (response.ok) {
      setMessage(`✅ Successfully uploaded ${file.name}! The AI brain will now process it.`);
    } else {
      const result = await response.json();
      setMessage(`❌ Upload failed: ${result.error || 'Please try again.'}`);
    }
  }, [caseId, uploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }, // Only accepts PDF files for now
    multiple: false,
  });

  return (
    <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-cyan-400 bg-cyan-900/50' : 'border-gray-600 hover:border-gray-400'}`}>
      <input {...getInputProps()} />
      <p className="text-gray-300">{message}</p>
    </div>
  );
}
