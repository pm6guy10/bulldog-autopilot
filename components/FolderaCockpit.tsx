'use client';

import { useState } from 'react';

type CaseItem = {
  name: string;
  exposure: string;
  urgent?: boolean;
  details?: string;
};

export default function FolderaCockpit() {
  const [expanded, setExpanded] = useState<number | null>(null);

  // Mock data — replace with API calls
  const briefing =
    '3 urgent items → King County PRA idle 455d, Grant “STEM Lab” missing budget, Acme renewal stalled 18d';

  const stats = [
    { label: 'Active', value: '7' },
    { label: 'Value at Risk', value: '$215,000' },
    { label: 'Action Items', value: '3' },
    { label: 'Recent Activity', value: '2' },
  ];

  const cases: CaseItem[] = [
    { name: 'King County PRA', exposure: '$6,500 exposure', urgent: true, details: 'Idle 455 days' },
    { name: 'Grant: STEM Lab', exposure: 'Missing budget section', urgent: true, details: 'Narrative reuse suggested' },
    { name: 'Acme Renewal', exposure: '$150,000 pipeline', urgent: true, details: 'Stalled 18 days' },
    { name: 'Adoption: Rivera Family', exposure: 'Eligibility docs pending', details: 'Caseworker follow-up required' },
    { name: '9th Circuit Appeal', exposure: 'On track', details: 'Filed last week' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-200 font-sans">
      {/* Greeting */}
      <div className="px-6 py-4 text-slate-400 text-sm">Good Morning Brandon</div>

      {/* Executive Briefing */}
      <div className="px-6 py-3 border-b border-amber-600/40">
        <div className="text-xl font-medium tracking-wide text-amber-400">
          Executive Briefing
        </div>
        <div className="mt-1 text-lg">{briefing}</div>
      </div>

      {/* Telemetry Strip */}
      <div className="px-6 py-2 text-sm flex gap-6 border-b border-slate-800 text-slate-400">
        {stats.map((s, i) => (
          <div key={i} className="flex items-baseline gap-1">
            <span className="text-slate-500">{s.label}:</span>
            <span className="text-slate-200 font-medium">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Cases List */}
      <div className="px-6 divide-y divide-slate-800">
        {cases.map((c, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-3 cursor-pointer hover:bg-slate-800/30"
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="flex items-center gap-2">
              {c.urgent && <span className="h-2 w-2 rounded-full bg-amber-500"></span>}
              <span>{c.name}</span>
            </div>
            <div className="text-slate-300">{c.exposure}</div>
          </div>
        ))}

        {/* Expanded Row */}
        {expanded !== null && (
          <div className="px-6 py-2 text-sm text-slate-400 bg-slate-950/60">
            {cases[expanded].details}
          </div>
        )}
      </div>

      {/* Upload Zone */}
      <div className="px-6 py-6 border-t border-slate-800 text-center text-slate-500 text-sm">
        Drop folders, PDFs, emails to process
      </div>
    </div>
  );
}
