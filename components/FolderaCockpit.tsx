'use client';

import { useState } from 'react';

export default function FolderaCockpit() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white p-8">
      {/* Executive Briefing */}
      <div className="mb-6">
        <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-2">
          Executive Briefing
        </h2>
        <div
          className="text-xl font-medium border-b-2 border-amber-500 pb-2 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          3 urgent items → King County PRA idle 455d, Grant ‘STEM Lab’ missing budget,
          Acme renewal stalled 18d
        </div>
        {expanded && (
          <div className="mt-4 space-y-2 text-slate-300">
            <p>• Schedule follow-up for King County PRA</p>
            <p>• Add missing budget section to Grant ‘STEM Lab’</p>
            <p>• Call Acme re: renewal pipeline</p>
          </div>
        )}
      </div>

      {/* Telemetry Strip */}
      <div className="flex space-x-6 text-sm text-slate-400 border-b border-slate-700/30 pb-2 mb-6">
        <div>Active Cases: <span className="text-white">7</span></div>
        <div>Value at Risk: <span className="text-white">$215,000</span></div>
        <div>Action Items: <span className="text-white">3</span></div>
        <div>Recent Activity: <span className="text-white">2</span></div>
      </div>

      {/* Case List */}
      <div className="space-y-2">
        {[
          { name: 'King County PRA', status: 'urgent', metric: '$6,500 exposure' },
          { name: 'Grant: STEM Lab', status: 'urgent', metric: 'Missing budget section' },
          { name: 'Acme Renewal', status: 'urgent', metric: '$150,000 pipeline' },
          { name: 'Adoption: Rivera Family', status: '', metric: 'Eligibility docs pending' },
          { name: '9th Circuit Appeal', status: '', metric: 'On track' },
        ].map((c, i) => (
          <div
            key={i}
            className="flex j
