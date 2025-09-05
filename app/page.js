// File: app/matters/yakima/page.js

"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

// This is sample data for the chart.
const data = [
  { subject: 'Culpability', A: 100, fullMark: 150 },
  { subject: 'Clarity', A: 85, fullMark: 150 },
  { subject: 'Deterrence', A: 90, fullMark: 150 },
  { subject: 'Delay', A: 40, fullMark: 150 },
];

export default function YakimaPage() {
  return (
    // Add some extra bottom padding to make space for the floating button
    <main className="min-h-screen p-6 pb-28"> 
      <h1 className="glow-text text-3xl font-bold mb-6 text-center">
        Yakima PRA Litigation
      </h1>

      {/* --- Card 1: Total Violations Logged --- */}
      <div className="card-enhanced text-center mb-6">
        <p className="text-lg text-gray-400 mb-2">Total Violations Logged</p>
        <p className="text-6xl font-bold">10</p>
      </div>

      {/* --- Card 2: Live Case Metrics --- */}
      <div className="card-enhanced mb-6">
        <p className="text-lg font-semibold mb-4">Live Case Metrics</p>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>High-Risk Violations:</span>
            <span className="font-bold">2</span>
          </div>
          <div className="flex justify-between">
            <span>Constructive Denials:</span>
            <span className="font-bold">4</span>
          </div>
          <div className="flex justify-between">
            <span>Privilege Log Failures:</span>
            <span className="font-bold">2</span>
          </div>
          <div className="flex justify-between">
            <span>Average Delay (Days):</span>
            <span className="font-bold">0</span>
          </div>
        </div>
      </div>

      {/* --- Card 3: Yousoufian Score --- */}
      <div className="card-enhanced">
        <p className="text-lg font-semibold mb-4 text-center">Yousoufian Score</p>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            {/* 
              FIX #1: Changed outerRadius from "80%" to "70%"
              This shrinks the chart and gives the labels more room.
            */}
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="#334155" />
              {/*
                FIX #2: Changed fontSize from 14 to 12
                This makes the text itself slightly smaller.
              */}
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#e5e7eb', fontSize: 12 }} />
              <Radar name="Score" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Bottom Button --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button className="btn w-full">
          Draft Motion
        </button>
      </div>
    </main>
  );
}