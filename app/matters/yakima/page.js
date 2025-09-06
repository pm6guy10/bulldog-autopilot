// File: app/matters/yakima/page.js (FINAL AND COMPLETE)

"use client";
import Link from 'next/link';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { FileUpload } from '@/components/FileUpload'; // Correctly import the component

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

      {/* --- The Case Memory Vault Uploader --- */}
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
              <div className="flex justify-between"><span>High-Risk Violations:</span><span className="font-bold">2</span></div>
              <div className="flex justify-between"><span>Constructive Denials:</span><span className="font-bold">4</span></div>
              <div className="flex justify-between"><span>Privilege Log Failures:</span><span className="font-bold">2</span></div>
              <div className="flex justify-between"><span>Average Delay (Days):</span><span className="font-bold">0</span></div>
            </div>
          </div>
        </div>

        {/* --- Column 2: For the radar chart --- */}
        <div className="card-enhanced flex-1">
          <p className="text-lg font-semibold mb-4 text-center">Yousoufian Score</p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#e5e7eb', fontSize: 12 }} />
                <Radar name="Score" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- Floating Bottom Button --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="lg:max-w-4xl lg:mx-auto">
          <Link href="/matters/yakima/draft" className="btn w-full text-center">
            Draft Motion
          </Link>
        </div>
      </div>
    </main>
  );
}
