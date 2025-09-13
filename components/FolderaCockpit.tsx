'use client';

import { useState } from 'react';

interface TelemetryMetricProps {
  label: string;
  value: string | number;
}

export default function FolderaCockpit() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const briefingLine = "3 urgent items → King County PRA idle 455d, Grant 'STEM Lab' missing budget, Acme renewal stalled 18d";
  
  const telemetry = {
    active: 7,
    valueAtRisk: '$215,000',
    actionItems: 3,
    recentActivity: 2
  };

  const universalRows = [
    { id: '1', title: 'King County PRA', metric: '$6,500 exposure', urgent: true, detail: 'Draft penalty motion for next hearing' },
    { id: '2', title: 'Grant: STEM Lab', metric: 'Missing budget section', urgent: true, detail: 'Reuse winning narrative from 2023 proposal' },
    { id: '3', title: 'Acme Renewal', metric: '$150,000 pipeline', urgent: true, detail: 'Schedule follow-up call with decision maker' },
    { id: '4', title: 'Adoption: Rivera Family', metric: 'Eligibility docs pending', urgent: false },
    { id: '5', title: '9th Circuit Appeal', metric: 'On track', urgent: false }
  ];

  return (
    <div 
      className="min-h-screen text-slate-100 px-10 py-12 relative"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 25s ease-in-out infinite'
      }}
    >
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      <div className="absolute top-20 left-20 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto space-y-12">
        <header>
          <h1 className="text-lg font-light text-slate-200 tracking-wide mb-2">Good Morning Brandon</h1>
          <p className="text-slate-500 text-sm">Foldera Executive Briefing</p>
        </header>

        <div className="py-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-slate-400 text-xs font-light tracking-wider uppercase">Executive Briefing</span>
          </div>
          <div className="text-xl font-medium text-slate-100 tracking-wide leading-relaxed">
            {briefingLine}
          </div>
        </div>

        <div className="flex items-center gap-8 text-sm py-4">
          <TelemetryMetric label="Active" value={telemetry.active} />
          <TelemetryDivider />
          <TelemetryMetric label="Value at Risk" value={telemetry.valueAtRisk} />
          <TelemetryDivider />
          <TelemetryMetric label="Action Items" value={telemetry.actionItems} />
          <TelemetryDivider />
          <TelemetryMetric label="Recent Activity" value={telemetry.recentActivity} />
        </div>

        <div className="space-y-0">
          <h3 className="text-slate-500 text-sm font-light tracking-wide uppercase mb-6">Active Items</h3>
          
          {universalRows.map((row, index) => (
            <div key={row.id}>
              <div 
                className="group py-4 px-3 cursor-pointer transition-all duration-200 hover:bg-slate-800/20 rounded"
                onClick={() => setExpanded(expanded === row.id ? null : row.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {row.urgent && (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    )}
                    <span className="text-slate-200 font-light tracking-wide">
                      {row.title}
                    </span>
                  </div>
                  <span className={`text-sm tabular-nums ${
                    row.urgent ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    {row.metric}
                  </span>
                </div>
              </div>

              {index < universalRows.length - 1 && (
                <div className="h-px bg-slate-800/20 mx-3" />
              )}

              {expanded === row.id && row.detail && (
                <div className="bg-slate-800/10 mx-3 my-2 p-4 border-l-2 border-slate-700/30 rounded-r">
                  <div className="text-slate-300 text-sm mb-3">
                    Suggested Action: {row.detail}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded text-xs hover:bg-cyan-600/30 transition-colors">
                      Approve
                    </button>
                    <button className="text-slate-500 text-xs hover:text-slate-400 transition-colors">
                      Show Sources
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-800/30">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-slate-700/30 rounded-lg text-slate-400 text-sm hover:border-slate-600/50 transition-colors cursor-pointer">
              <span>Drop folders, PDFs, emails to process</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TelemetryMetric = ({ label, value }: TelemetryMetricProps) => (
  <div className="flex items-center gap-2">
    <span className="text-slate-500 font-light text-xs">{label}:</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

const TelemetryDivider = () => (
  <div className="w-px h-4 bg-slate-600/40" />
);