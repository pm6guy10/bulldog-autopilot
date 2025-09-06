// File: app/matters/yakima/page.js (FINAL VERSION WITH UPLOADER)

"use client";
import Link from 'next/link';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { FileUpload } from '@/components/FileUpload'; // Import the new component

// Sample data for the chart
const data = [
  { subject: 'Culpability', A: 100, fullMark: 150 },
  { subject: 'Clarity', A: 85, fullMark: 150 },
  { subject: 'Deterrence', A: 90, fullMark: 150 },
  { subject: 'Delay', A: 40, fullMark: 150 },
];

export default function YakimaPage() {
  return (
    // This is the responsive container for the dashboard page
    <main className="min-h-screen p-6 pb-28 lg:max-w-4xl lg:mx-auto"> 
      
      <h1 className="glow-text text-3xl font-bold mb-6 text-center">
        Yakima PRA Litigation
      </h1>

      {/* === THIS IS THE NEW CASE MEMORY VAULT SECTION === */}
      <div className="card-enhanced mb-6">
        <h2 className="text-lg font-semibold mb-3">Case Memory Vault</h2>
        <p className="text-gray-400 text-sm mb-4">Upload case documents (PDFs) to the AI's persistent memory. The brain will begin processing them immediately.</p>
        <FileUpload caseId="yakima" />
      </div>

      {/* --- This is the rest of your original dashboard page --- */}
      <div className="lg:flex lg:gap-6">
        
        {/* --- Column 1: For the first two cards --- */}
        <div className="flex-1">
          <div className="card-enhanced text-center mb-6">
            <p className="text-lg text-gray-400 mb-2">Total Violations Logged</p>
            <p className="text-6xl font-bold">10</p>
          </div>

          <div className="card-enhanced mb-6">
            <p className="text-lg font-semibold mb-4">Live Case Metrics</p>
            <div className="space-y-3">
              <div className="flex justify-between"><span>Hig
