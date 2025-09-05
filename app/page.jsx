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

export default function LitigationPage() {
  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <h1 className="glow-text text-3xl font-bold">Yakima PRA Litigation</h1>

      {/* Violations */}
      <div className="card p-4 rounded-xl bg-panel border border-border">
        <p className="text-lg font-semibold text-text-secondary">
          Total Violations Logged
        </p>
        <p className="text-4xl font-bold text-text-primary mt-2">10</p>
      </div>

      {/* Metrics */}
      <div className="card p-4 rounded-xl bg-panel border border-border">
        <h2 className="text-lg font-semibold text-text-secondary">
          Live Case Metrics
        </h2>
        <ul className="mt-2 space-y-1 text-text-primary">
          <li>High-Risk Violations: 2</li>
          <li>Constructive Denials: 4</li>
          <li>Privilege Log Failures: 2</li>
          <li>Average Delay (Days): 0</li>
        </ul>
      </div>

      {/* Yousoufian Score */}
      <div className="card p-4 rounded-xl bg-panel border border-border">
        <h2 className="text-lg font-semibold text-text-secondary mb-4">
          Yousoufian Score
        </h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <RadarChart data={data}>
              {/* Gradient definition */}
              <defs>
                <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" /> {/* cyan */}
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
                fill="url(#radarGradient)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Draft Motion button */}
      <button className="btn-primary w-full">Draft Motion</button>
    </main>
  );
}