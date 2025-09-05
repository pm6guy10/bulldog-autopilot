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

export default function Page() {
  return (
    <main className="p-10">
      <h1 className="glow-text text-3xl font-bold mb-6">Litigation Triangle</h1>

      <div className="card">
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            {/* === Gradient definition for polygon === */}
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#06b6d4" />   {/* cyan */}
                <stop offset="100%" stopColor="#10b981" /> {/* green */}
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
              fill="url(#radarGradient)"  // gradient fill
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}