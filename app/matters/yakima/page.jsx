"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Culpability", value: 85 },
  { subject: "Clarity", value: 70 },
  { subject: "Deterrence", value: 90 },
  { subject: "Delay", value: 60 },
];

export default function YakimaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#111827] to-[#0a0a0f] text-gray-200 p-6 space-y-6">
      <h1 className="glow-text text-3xl font-bold">Yakima PRA Litigation</h1>

      <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
        <p className="text-lg font-semibold text-gray-400">
          Total Violations Logged
        </p>
        <p className="text-4xl font-bold mt-2">10</p>
      </div>

      <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
        <h2 className="text-lg font-semibold text-gray-400">Live Case Metrics</h2>
        <ul className="mt-2 space-y-1">
          <li>High-Risk Violations: 2</li>
          <li>Constructive Denials: 4</li>
          <li>Privilege Log Failures: 2</li>
          <li>Average Delay (Days): 0</li>
        </ul>
      </div>

      <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
        <h2 className="text-lg font-semibold text-gray-400 mb-4">Yousoufian Score</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <RadarChart data={data}>
              <defs>
                <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis
                dataKey="subject"
                stroke="#e5e7eb"
                tick={{ fill: "#e5e7eb", fontSize: 12 }}
              />
              <Radar
                name="Violations"
                dataKey="value"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#radarGradient)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-[#06b6d4] to-[#10b981] text-black font-bold py-2 rounded-lg shadow-lg hover:opacity-90">
        Draft Motion
      </button>
    </main>
  );
}