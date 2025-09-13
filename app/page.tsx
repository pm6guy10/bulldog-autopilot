'use client';

import { useState, useEffect, useCallback } from 'react';

interface Case {
  id: number;
  title: string;
  exposure: string;
  details: {
    number: string;
    date: string;
    files: number;
    violations: number;
    idle: number;
  };
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-white/70 mt-1">{label}</p>
    </div>
  );
}

function CaseCard({ title, exposure, details, onClick }: { 
  title: string; 
  exposure: string; 
  details: Case['details']; 
  onClick: () => void; 
}) {
  const [expanded, setExpanded] = useState(false);
  const isIdle = details.idle > 200;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        relative bg-white/5 backdrop-blur-md border 
        ${isIdle 
          ? 'border-warning/50 shadow-lg shadow-warning/20' 
          : 'border-white/10 hover:border-gradientFrom'
        }
        rounded-2xl p-6 shadow-lg transition-all duration-300 cursor-pointer
        hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-gradientFrom/20
      `}
    >
      {/* Default View - Clean */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <div className="w-3 h-3 rounded-full bg-success shadow-lg shadow-success/50" />
        </div>
        
        <p className="text-3xl font-bold bg-gradient-to-r from-gradientFrom to-gradientTo text-transparent bg-clip-text">
          {exposure}
        </p>
      </div>

      {/* Expanded Details - Smooth Reveal */}
      {expanded && (
        <div className="mt-6 pt-4 border-t border-white/10 space-y-2 animate-in fade-in duration-300">
          <p className="text-textSecondary text-sm">#{details.number}</p>
          <div className="grid grid-cols-2 gap-2 text-textSecondary text-sm">
            <span>Filed: {details.date}</span>
            <span>Files: {details.files}</span>
            <span>Violations: {details.violations}</span>
            <span className={details.idle > 200 ? 'text-warning font-medium' : ''}>
              Idle: {details.idle}d
            </span>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 pt-3">
            <button 
              className="px-3 py-1 bg-gradientFrom hover:bg-gradientFrom/90 rounded-full text-sm font-medium text-white transition-all duration-200 hover:scale-105"
              onClick={(e) => { e.stopPropagation(); }}
            >
              📅 Follow up
            </button>
            <button 
              className="px-3 py-1 bg-action hover:bg-action/90 rounded-full text-sm font-medium text-background transition-all duration-200 hover:scale-105"
              onClick={(e) => { e.stopPropagation(); }}
            >
              📂 Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobsLevelDashboard() {
  const [expandedPriority, setExpandedPriority] = useState(false);
  const [showNewCase, setShowNewCase] = useState(false);

  const cases: Case[] = [
    {
      id: 1,
      title: "King County PRA",
      exposure: "$6,500",
      details: {
        number: "25-2-25387-2 SEA",
        date: "2025-01-15",
        files: 0,
        violations: 2,
        idle: 455,
      },
    },
    {
      id: 2,
      title: "Yakima PRA",
      exposure: "$2,500",
      details: {
        number: "25-2-02050-39",
        date: "2025-02-01",
        files: 0,
        violations: 1,
        idle: 215,
      },
    },
    {
      id: 3,
      title: "Kittitas County ALR ESD Appeal",
      exposure: "$0",
      details: {
        number: "25-2-00320-19",
        date: "2025-01-20",
        files: 0,
        violations: 0,
        idle: 236,
      },
    },
    {
      id: 4,
      title: "9th Circuit Appeal",
      exposure: "$0",
      details: {
        number: "25-3764",
        date: "2025-01-10",
        files: 0,
        violations: 0,
        idle: 246,
      },
    },
  ];

  const urgentCases = cases.filter(c => c.details.idle > 200 || parseInt(c.exposure.replace(/[$,]/g, '')) > 5000);

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Hero Header - Gradient Strip */}
      <div className="bg-gradient-to-r from-gradientFrom to-gradientTo">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Good Morning Brandon 👋</h1>
            <button 
              onClick={() => setShowNewCase(true)}
              className="bg-action hover:bg-action/90 text-background font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            >
              + New Case
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard label="Active Cases" value="4" />
            <StatCard label="Exposure" value="$9,000" />
            <StatCard label="Action Items" value={urgentCases.length.toString()} />
            <StatCard label="Recent Activity" value="1" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Priority Banner - Collapsible */}
        {urgentCases.length > 0 && (
          <div 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:bg-white/10"
            onClick={() => setExpandedPriority(!expandedPriority)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-warning flex items-center">
                🔥 {urgentCases.length} Cases Need Attention
              </h2>
              <span 
                className="text-textSecondary transition-transform duration-300"
                style={{ transform: expandedPriority ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                ▶
              </span>
            </div>
            
            {expandedPriority && (
              <div className="mt-4 space-y-3 animate-in fade-in duration-300">
                {urgentCases.map((caseItem, i) => (
                  <div key={i} className="text-textSecondary">
                    <div className="font-medium text-white">
                      {caseItem.details.idle > 200 
                        ? `Review ${caseItem.title} case files and schedule follow-up` 
                        : `Draft motion for statutory penalties in ${caseItem.title}`
                      }
                    </div>
                    <div className="text-sm mt-1">
                      {caseItem.details.idle > 200 
                        ? `Idle: ${caseItem.details.idle} days`
                        : `Exposure: ${caseItem.exposure}`
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* New Case Form */}
        {showNewCase && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Add New Case</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <input
                type="text"
                placeholder="Case Name"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:border-gradientFrom focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Case Number"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:border-gradientFrom focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Client"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:border-gradientFrom focus:outline-none transition-colors"
              />
              <select className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-gradientFrom focus:outline-none transition-colors">
                <option className="bg-background text-white" value="">Case Type</option>
                <option className="bg-background text-white" value="pra">Public Records Act</option>
                <option className="bg-background text-white" value="appeal">Administrative Appeal</option>
                <option className="bg-background text-white" value="federal">Federal Appeal</option>
                <option className="bg-background text-white" value="other">Other</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button className="bg-success hover:bg-success/90 px-6 py-3 rounded-xl font-semibold text-background transition-colors">
                Create Case
              </button>
              <button 
                onClick={() => setShowNewCase(false)}
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Case Grid - Wallet Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((caseItem) => (
            <CaseCard
              key={caseItem.id}
              title={caseItem.title}
              exposure={caseItem.exposure}
              details={caseItem.details}
              onClick={() => console.log('Navigate to case:', caseItem.title)}
            />
          ))}
        </div>

        {/* Empty State */}
        {cases.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">⚖️</div>
            <h2 className="text-3xl font-bold mb-4">No cases yet</h2>
            <p className="text-textSecondary mb-8 text-lg">Add your first case to get started</p>
            <button 
              onClick={() => setShowNewCase(true)}
              className="bg-gradientFrom hover:bg-gradientFrom/90 px-8 py-4 rounded-2xl text-xl font-semibold transition-colors"
            >
              Create First Case
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}