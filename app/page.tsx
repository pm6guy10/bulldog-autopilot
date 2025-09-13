'use client';

import { useState } from 'react';
import { Scale, DollarSign, AlertCircle, TrendingUp, Calendar, Upload } from 'lucide-react';

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

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl bg-slate-800/60 backdrop-blur-lg border border-slate-700/40 p-8 shadow-sm hover:shadow-md hover:border-slate-600/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-slate-400 text-xs tracking-wide uppercase mb-2">{label}</p>
      <p className="text-4xl font-semibold text-white">{value}</p>
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
  const hasHighExposure = parseInt(exposure.replace(/[$,]/g, '')) > 5000;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        relative rounded-2xl bg-slate-800/60 backdrop-blur-lg border transition-all duration-300 cursor-pointer
        ${isIdle || hasHighExposure 
          ? 'border-amber-400/50 shadow-lg shadow-amber-400/10' 
          : 'border-slate-700/40 hover:border-slate-600/60'
        }
        p-8 shadow-sm hover:shadow-md hover:scale-[1.01]
      `}
    >
      {/* Clean Default View */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-2xl font-light text-white leading-tight pr-4">{title}</h3>
          <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm flex-shrink-0 mt-2" />
        </div>
        
        <div>
          <p className="text-3xl font-semibold text-blue-400 mb-1">
            {exposure}
          </p>
          <p className="text-slate-400 text-xs tracking-wide">TOTAL EXPOSURE</p>
        </div>
      </div>

      {/* Smooth Details Expansion */}
      <div className={`transition-all duration-300 overflow-hidden ${expanded ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-slate-700/30 pt-6 space-y-4">
          <div className="text-slate-400 text-sm font-mono">#{details.number}</div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 text-xs tracking-wide">FILED</p>
              <p className="text-slate-300">{details.date}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs tracking-wide">FILES</p>
              <p className="text-slate-300">{details.files}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs tracking-wide">VIOLATIONS</p>
              <p className="text-slate-300">{details.violations}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs tracking-wide">LAST ACTIVITY</p>
              <p className={details.idle > 200 ? 'text-amber-400' : 'text-slate-300'}>
                {details.idle}d ago
              </p>
            </div>
          </div>
          
          {/* Clean Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium text-white shadow-sm hover:shadow-md transition-all"
              onClick={(e) => { e.stopPropagation(); }}
            >
              <Calendar className="w-4 h-4" />
              Follow up
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-medium text-slate-200 shadow-sm hover:shadow-md transition-all"
              onClick={(e) => { e.stopPropagation(); }}
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RefinedDashboard() {
  const [expandedPriority, setExpandedPriority] = useState(false);
  const [showNewCase, setShowNewCase] = useState(false);

  const cases: Case[] = [
    {
      id: 1,
      title: "King County PRA",
      exposure: "$6,500",
      details: {
        number: "25-2-25387-2 SEA",
        date: "Jan 15, 2025",
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
        date: "Feb 1, 2025",
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
        date: "Jan 20, 2025",
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
        date: "Jan 10, 2025",
        files: 0,
        violations: 0,
        idle: 246,
      },
    },
  ];

  const urgentCases = cases.filter(c => c.details.idle > 200 || parseInt(c.exposure.replace(/[$,]/g, '')) > 5000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Clean Hero Header */}
      <div className="max-w-8xl mx-auto px-8 pt-16 pb-8">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-light text-white tracking-tight">
              Good Morning Brandon
            </h1>
            <p className="text-slate-400 text-lg tracking-wide">YOUR EXECUTIVE BRIEFING</p>
          </div>
          <button 
            onClick={() => setShowNewCase(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            + New Case
          </button>
        </div>

        {/* Clean Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Active Cases" value="4" icon={Scale} />
          <StatCard label="Total Exposure" value="$9,000" icon={DollarSign} />
          <StatCard label="Action Items" value={urgentCases.length.toString()} icon={AlertCircle} />
          <StatCard label="Recent Activity" value="1" icon={TrendingUp} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-8 pb-16 space-y-8">
        {/* Slim Priority Banner */}
        {urgentCases.length > 0 && (
          <div 
            className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-6 shadow-sm cursor-pointer transition-all hover:shadow-md"
            onClick={() => setExpandedPriority(!expandedPriority)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-lg font-medium text-white">
                    {urgentCases.length} Cases Need Attention
                  </h2>
                  <p className="text-amber-200/80 text-sm">Click to view details</p>
                </div>
              </div>
              <div 
                className="w-6 h-6 flex items-center justify-center transition-transform duration-300"
                style={{ transform: expandedPriority ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                <span className="text-amber-400">▶</span>
              </div>
            </div>
            
            {expandedPriority && (
              <div className="mt-6 space-y-4 animate-in fade-in duration-300">
                {urgentCases.map((caseItem, i) => (
                  <div key={i} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/20">
                    <div className="font-medium text-white mb-1">
                      {caseItem.details.idle > 200 
                        ? `Review ${caseItem.title} case files and schedule follow-up` 
                        : `Draft motion for statutory penalties in ${caseItem.title}`
                      }
                    </div>
                    <div className="text-amber-200/70 text-sm">
                      {caseItem.details.idle > 200 
                        ? `No activity for ${caseItem.details.idle} days`
                        : `High penalty exposure: ${caseItem.exposure}`
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Clean New Case Form */}
        {showNewCase && (
          <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/40 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-light text-white mb-8">Add New Case</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <input
                type="text"
                placeholder="Case Name"
                className="bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Case Number"
                className="bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Client"
                className="bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:outline-none transition-colors"
              />
              <select className="bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white focus:border-blue-400/50 focus:outline-none transition-colors">
                <option className="bg-slate-800 text-white" value="">Case Type</option>
                <option className="bg-slate-800 text-white" value="pra">Public Records Act</option>
                <option className="bg-slate-800 text-white" value="appeal">Administrative Appeal</option>
                <option className="bg-slate-800 text-white" value="federal">Federal Appeal</option>
                <option className="bg-slate-800 text-white" value="other">Other</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-medium text-white shadow-md hover:shadow-lg transition-all">
                Create Case
              </button>
              <button 
                onClick={() => setShowNewCase(false)}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-medium text-slate-200 shadow-md hover:shadow-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Refined Case Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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