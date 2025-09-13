'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, Plus, Calendar, AlertTriangle, Upload, FolderOpen, Mail, FileArchive } from 'lucide-react';

interface Violation {
  date: string;
  type: string;
  description: string;
  penalty: number;
  source: string;
}

interface CaseFile {
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  processed: boolean;
  insights: Array<{
    type: string;
    content: string;
    confidence: number;
  }>;
}

interface Case {
  id: number;
  name: string;
  client: string;
  caseNumber: string;
  type: string;
  status: string;
  created: string;
  files: CaseFile[];
  violations: Violation[];
  lastActivity: string;
  totalPenalty: number;
  daysActive: number;
}

interface Briefing {
  date: string;
  activeCases: number;
  totalPenalties: number;
  recentActivity: number;
  urgentItems: Array<{
    type: string;
    case: string;
    description: string;
    action: string;
  }>;
  suggestion: string;
}

// Jobs-style case card component
function CaseCard({ caseData, onClick }: { caseData: Case; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const daysSinceActivity = Math.floor((new Date().getTime() - new Date(caseData.lastActivity).getTime()) / (1000 * 60 * 60 * 24));
  const isIdle = daysSinceActivity > 180;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        bg-neutral-900 rounded-3xl p-8 cursor-pointer transition-all duration-300 ease-out
        ${isHovered ? 'transform translate-y-[-4px] shadow-2xl shadow-purple-500/20 border border-purple-500/30' : 'border border-transparent'}
        ${isIdle ? 'opacity-60' : ''}
      `}
    >
      {/* Default view - minimal and calm */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{caseData.name}</h3>
          <div className={`w-3 h-3 rounded-full ${caseData.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`} />
        </div>
        
        <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
          ${caseData.totalPenalty.toLocaleString()}
        </div>
      </div>

      {/* Expanded view - appears on hover */}
      {isHovered && (
        <div className="mt-6 pt-6 border-t border-gray-700 space-y-3 animate-fadeIn">
          <div className="text-gray-300 text-sm">#{caseData.caseNumber}</div>
          <div className="flex justify-between text-gray-400 text-sm">
            <span>{caseData.files.length} files</span>
            <span>{caseData.violations.length} violations</span>
          </div>
          <div className="text-gray-500 text-xs">
            {daysSinceActivity === 0 ? 'Active today' : `${daysSinceActivity}d ago`}
          </div>
          
          {/* Quick actions */}
          <div className="flex space-x-2 pt-2">
            <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-full text-xs transition-colors">
              📅 Follow up
            </button>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-full text-xs transition-colors">
              📂 Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Legal tracker with Jobs-level calm design
export default function CalmLegalTracker() {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [newCase, setNewCase] = useState({ name: '', client: '', caseNumber: '', type: '' });
  const [showNewCase, setShowNewCase] = useState(false);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [showPriorityDetails, setShowPriorityDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load cases from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('realLegalCases');
    if (saved) {
      setCases(JSON.parse(saved));
    } else {
      const actualCases: Case[] = [
        {
          id: 1,
          name: "King County PRA",
          client: "Kapp Legal",
          caseNumber: "25-2-25387-2 SEA",
          type: "Public Records Act",
          status: "active",
          created: "2025-01-15",
          files: [],
          violations: [
            { date: "2025-01-20", type: "Delay", description: "Response overdue by 15 days", penalty: 1500, source: "Email chain analysis" },
            { date: "2025-01-25", type: "Constructive Denial", description: "Claimed no records exist", penalty: 5000, source: "Agency response letter" }
          ],
          lastActivity: "2024-06-15", // Made this older to show idle state
          totalPenalty: 6500,
          daysActive: 10
        },
        {
          id: 2,
          name: "Yakima PRA",
          client: "Kapp Legal",
          caseNumber: "25-2-02050-39",
          type: "Public Records Act",
          status: "active", 
          created: "2025-02-01",
          files: [],
          violations: [
            { date: "2025-02-10", type: "Privilege Log Missing", description: "No privilege log provided with redactions", penalty: 2500, source: "Document review" }
          ],
          lastActivity: "2025-09-10",
          totalPenalty: 2500,
          daysActive: 8
        },
        {
          id: 3,
          name: "Kittitas County ALR ESD Appeal",
          client: "Kapp Legal",
          caseNumber: "25-2-00320-19",
          type: "Administrative Appeal",
          status: "active",
          created: "2025-01-20",
          files: [],
          violations: [],
          lastActivity: "2025-09-01",
          totalPenalty: 0,
          daysActive: 5
        },
        {
          id: 4,
          name: "9th Circuit Appeal",
          client: "Kapp Legal", 
          caseNumber: "25-3764",
          type: "Federal Appeal",
          status: "active",
          created: "2025-01-10",
          files: [],
          violations: [],
          lastActivity: "2025-09-05",
          totalPenalty: 0,
          daysActive: 15
        }
      ];
      setCases(actualCases);
      localStorage.setItem('realLegalCases', JSON.stringify(actualCases));
    }
  }, []);

  // Generate daily briefing
  useEffect(() => {
    if (cases.length > 0) {
      generateDailyBriefing();
    }
  }, [cases]);

  // Save cases when they change
  useEffect(() => {
    if (cases.length > 0) {
      localStorage.setItem('realLegalCases', JSON.stringify(cases));
    }
  }, [cases]);

  const generateDailyBriefing = () => {
    const today = new Date();
    const activeCases = cases.filter(c => c.status === 'active');
    const recentActivity = cases.filter(c => {
      const lastActivity = new Date(c.lastActivity);
      const daysDiff = (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    const urgentItems: Array<{
      type: string;
      case: string;
      description: string;
      action: string;
    }> = [];
    
    // Check for cases with no recent activity
    cases.forEach(c => {
      const daysSinceActivity = Math.floor((today.getTime() - new Date(c.lastActivity).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceActivity > 180 && c.status === 'active') {
        urgentItems.push({
          type: 'stale',
          case: c.name,
          description: `No activity for ${daysSinceActivity} days`,
          action: `Review ${c.name} case files and schedule follow-up`
        });
      }
    });

    // Check for high penalty cases
    cases.forEach(c => {
      if (c.totalPenalty > 5000) {
        urgentItems.push({
          type: 'high-penalty',
          case: c.name,
          description: `High penalty exposure: $${c.totalPenalty.toLocaleString()}`,
          action: `Draft motion for statutory penalties in ${c.name}`
        });
      }
    });

    setBriefing({
      date: today.toLocaleDateString(),
      activeCases: activeCases.length,
      totalPenalties: cases.reduce((sum, c) => sum + c.totalPenalty, 0),
      recentActivity: recentActivity.length,
      urgentItems,
      suggestion: urgentItems.length > 0 ? urgentItems[0].action : "All cases up to date - consider proactive outreach"
    });
  };

  const addCase = () => {
    if (!newCase.name || !newCase.caseNumber) return;
    
    const caseToAdd: Case = {
      id: Date.now(),
      ...newCase,
      status: 'active',
      created: new Date().toISOString().split('T')[0],
      files: [],
      violations: [],
      lastActivity: new Date().toISOString(),
      totalPenalty: 0,
      daysActive: 0
    };
    
    setCases([...cases, caseToAdd]);
    setNewCase({ name: '', client: '', caseNumber: '', type: '' });
    setShowNewCase(false);
  };

  // Handle case selection for detail view
  const handleCaseSelect = (caseId: number) => {
    setSelectedCase(caseId);
  };

  const handleFileUpload = async (caseId: number, files: FileList | null) => {
    if (!files) return;
    
    setIsProcessing(true);
    
    // Simulate file processing
    const processedFiles: CaseFile[] = Array.from(files).map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      processed: false,
      insights: []
    }));

    // Update case with new files
    setCases(cases.map(c => 
      c.id === caseId 
        ? { ...c, files: [...c.files, ...processedFiles], lastActivity: new Date().toISOString() }
        : c
    ));

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      generateDailyBriefing();
    }, 3000);
  };

  // Detail view for selected case
  if (selectedCase) {
    const caseData = cases.find(c => c.id === selectedCase);
    if (!caseData) return null;
    
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => setSelectedCase(null)}
            className="text-purple-400 hover:text-purple-300 mb-8 transition-colors"
          >
            ← Back to Command Center
          </button>
          
          <div className="bg-neutral-900 rounded-3xl p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">{caseData.name}</h1>
                <p className="text-gray-400">#{caseData.caseNumber}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400">${caseData.totalPenalty.toLocaleString()}</div>
                <div className="text-gray-400">Total Exposure</div>
              </div>
            </div>

            {/* File upload area */}
            <div 
              className="border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer mb-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-300 text-lg mb-2">Drop case files here</p>
              <p className="text-gray-500">PDFs, Word docs, .msg files, ZIP archives</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(caseData.id, e.target.files)}
              />
            </div>

            {/* Violations and files in a clean layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Violations ({caseData.violations.length})</h3>
                <div className="space-y-3">
                  {caseData.violations.map((violation, i) => (
                    <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <div className="font-medium text-red-400">{violation.type}</div>
                      <div className="text-gray-300 text-sm mt-1">{violation.description}</div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{violation.source}</span>
                        <span className="text-green-400 font-mono">${violation.penalty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Files ({caseData.files.length})</h3>
                <div className="space-y-2">
                  {caseData.files.map((file, i) => (
                    <div key={i} className="bg-neutral-800 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <span className="text-xs text-green-400">✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero section with gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Good Morning Brandon 👋</h1>
            <button
              onClick={() => setShowNewCase(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-2xl flex items-center transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Case
            </button>
          </div>

          {/* Summary metrics */}
          {briefing && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold">{briefing.activeCases}</div>
                <div className="text-white/80 text-sm">Active Cases</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold">${briefing.totalPenalties.toLocaleString()}</div>
                <div className="text-white/80 text-sm">Exposure</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold">{briefing.urgentItems.length}</div>
                <div className="text-white/80 text-sm">Action Items</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold">{briefing.recentActivity}</div>
                <div className="text-white/80 text-sm">Recent Activity</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Priority actions - collapsible */}
        {briefing && briefing.urgentItems.length > 0 && (
          <div 
            className="bg-neutral-900 rounded-2xl p-6 cursor-pointer transition-all hover:bg-neutral-800"
            onClick={() => setShowPriorityDetails(!showPriorityDetails)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">🔥 {briefing.urgentItems.length} Cases Need Attention</h2>
              <span className="text-gray-400">{showPriorityDetails ? '▼' : '▶'}</span>
            </div>
            {showPriorityDetails && (
              <div className="mt-4 space-y-3">
                {briefing.urgentItems.map((item, i) => (
                  <div key={i} className="text-gray-300 text-sm">
                    {item.action}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* New case form */}
        {showNewCase && (
          <div className="bg-neutral-900 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Case</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Case Name"
                value={newCase.name}
                onChange={(e) => setNewCase({...newCase, name: e.target.value})}
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Case Number"
                value={newCase.caseNumber}
                onChange={(e) => setNewCase({...newCase, caseNumber: e.target.value})}
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Client"
                value={newCase.client}
                onChange={(e) => setNewCase({...newCase, client: e.target.value})}
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
              />
              <select
                value={newCase.type}
                onChange={(e) => setNewCase({...newCase, type: e.target.value})}
                className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Case Type</option>
                <option value="Public Records Act">Public Records Act</option>
                <option value="Administrative Appeal">Administrative Appeal</option>
                <option value="Federal Appeal">Federal Appeal</option>
                <option value="Employment">Employment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                onClick={addCase}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl transition-colors"
              >
                Create Case
              </button>
              <button
                onClick={() => setShowNewCase(false)}
                className="bg-neutral-700 hover:bg-neutral-600 px-6 py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Case grid - calm and minimal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map(caseItem => (
            <CaseCard 
              key={caseItem.id} 
              caseData={caseItem} 
              onClick={() => handleCaseSelect(caseItem.id)}
            />
          ))}
        </div>

        {cases.length === 0 && !showNewCase && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚖️</div>
            <h2 className="text-2xl font-semibold mb-4">No cases yet</h2>
            <p className="text-gray-400 mb-8">Add your first case to get started</p>
            <button
              onClick={() => setShowNewCase(true)}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-2xl text-lg transition-colors"
            >
              Create First Case
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}