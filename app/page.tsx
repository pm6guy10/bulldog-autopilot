'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Calendar, AlertTriangle, CheckCircle, User, DollarSign } from 'lucide-react';

interface Violation {
  date: string;
  type: string;
  description: string;
  penalty: number;
}

interface Case {
  id: number;
  name: string;
  client: string;
  type: string;
  status: string;
  created: string;
  violations: Violation[];
  documents: string[];
  totalPenalty: number;
}

// Simple case tracker that actually works
export default function LegalTracker() {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [newCase, setNewCase] = useState({ name: '', client: '', type: '' });
  const [showNewCase, setShowNewCase] = useState(false);

  // Load cases from localStorage (since we can't use external storage in Claude artifacts)
  useEffect(() => {
    const saved = localStorage.getItem('legalCases');
    if (saved) {
      setCases(JSON.parse(saved));
    } else {
      // Sample data to show functionality
      const sampleCases: Case[] = [
        {
          id: 1,
          name: "King County PRA",
          client: "Kapp Legal",
          type: "Public Records",
          status: "active",
          created: "2025-01-15",
          violations: [
            { date: "2025-01-20", type: "Delay", description: "Response overdue by 15 days", penalty: 1500 },
            { date: "2025-01-25", type: "Constructive Denial", description: "Claimed no records exist", penalty: 5000 }
          ],
          documents: ["Initial Request", "Agency Response", "Follow-up Email"],
          totalPenalty: 6500
        },
        {
          id: 2,
          name: "Yakima PRA",
          client: "Kapp Legal", 
          type: "Public Records",
          status: "active",
          created: "2025-02-01",
          violations: [
            { date: "2025-02-10", type: "Privilege Log Missing", description: "No privilege log provided", penalty: 2500 }
          ],
          documents: ["PRA Request", "Partial Response"],
          totalPenalty: 2500
        }
      ];
      setCases(sampleCases);
      localStorage.setItem('legalCases', JSON.stringify(sampleCases));
    }
  }, []);

  // Save cases when they change
  useEffect(() => {
    if (cases.length > 0) {
      localStorage.setItem('legalCases', JSON.stringify(cases));
    }
  }, [cases]);

  const addCase = () => {
    if (!newCase.name || !newCase.client) return;
    
    const caseToAdd: Case = {
      id: Date.now(),
      ...newCase,
      status: 'active',
      created: new Date().toISOString().split('T')[0],
      violations: [],
      documents: [],
      totalPenalty: 0
    };
    
    setCases([...cases, caseToAdd]);
    setNewCase({ name: '', client: '', type: '' });
    setShowNewCase(false);
  };

  const addViolation = (caseId: number, violation: Omit<Violation, 'date'>) => {
    setCases(cases.map(c => 
      c.id === caseId 
        ? { 
            ...c, 
            violations: [...c.violations, { ...violation, date: new Date().toISOString().split('T')[0] }],
            totalPenalty: c.totalPenalty + (violation.penalty || 0)
          }
        : c
    ));
  };

  const generateMotionDraft = (caseData: Case) => {
    const totalViolations = caseData.violations.length;
    const totalPenalty = caseData.totalPenalty;
    const daysElapsed = Math.floor((new Date().getTime() - new Date(caseData.created).getTime()) / (1000 * 60 * 60 * 24));

    return `MOTION FOR STATUTORY PENALTIES

Case: ${caseData.name}
Client: ${caseData.client}

INTRODUCTION
Plaintiff moves for statutory penalties under RCW 42.56.550(4) for defendant's willful violations of the Public Records Act.

FACTUAL BACKGROUND
1. On ${caseData.created}, Plaintiff submitted a public records request
2. ${totalViolations} violations have been documented over ${daysElapsed} days
3. Pattern of obstruction demonstrates willful conduct

VIOLATIONS IDENTIFIED:
${caseData.violations.map((v, i) => `${i+1}. ${v.type}: ${v.description} (Penalty: $${v.penalty})`).join('\n')}

LEGAL STANDARD
Under Yousoufian factors:
- Culpability: Pattern of ${totalViolations} violations shows willful conduct
- Clarity: Statutory requirements are unambiguous  
- Delay: ${daysElapsed} days demonstrates unreasonable delay
- Deterrence: Penalties necessary to prevent future violations

CONCLUSION
Plaintiff respectfully requests statutory penalties of $${totalPenalty} plus costs and fees.

Total Requested: $${totalPenalty}`;
  };

  if (selectedCase) {
    const caseData = cases.find(c => c.id === selectedCase);
    if (!caseData) return null;
    
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button 
                onClick={() => setSelectedCase(null)}
                className="text-cyan-400 hover:text-cyan-300 mb-2"
              >
                ← Back to Cases
              </button>
              <h1 className="text-3xl font-bold">{caseData.name}</h1>
              <p className="text-slate-400">Client: {caseData.client}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">${caseData.totalPenalty.toLocaleString()}</div>
              <div className="text-slate-400">Total Penalties</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Violations */}
            <div className="bg-slate-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                  Violations ({caseData.violations.length})
                </h2>
                <button
                  onClick={() => {
                    const type = prompt("Violation type (Delay, Constructive Denial, etc.):");
                    const description = prompt("Description:");
                    const penalty = parseInt(prompt("Penalty amount:") || "0");
                    if (type && description) {
                      addViolation(caseData.id, { type, description, penalty });
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  + Add Violation
                </button>
              </div>
              
              <div className="space-y-3">
                {caseData.violations.map((violation, i) => (
                  <div key={i} className="border border-slate-700 rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-red-400">{violation.type}</span>
                      <span className="text-green-400 font-mono">${violation.penalty}</span>
                    </div>
                    <p className="text-slate-300 text-sm">{violation.description}</p>
                    <p className="text-slate-500 text-xs mt-1">{violation.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Motion Draft */}
            <div className="bg-slate-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-400" />
                Motion Draft
              </h2>
              
              <div className="bg-slate-800 rounded p-4 font-mono text-sm whitespace-pre-wrap overflow-y-auto max-h-96">
                {generateMotionDraft(caseData)}
              </div>
              
              <button 
                onClick={() => {
                  const draft = generateMotionDraft(caseData);
                  navigator.clipboard.writeText(draft);
                  alert('Motion draft copied to clipboard!');
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Copy Motion Text
              </button>
            </div>
          </div>

          {/* Documents */}
          <div className="mt-8 bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-cyan-400" />
              Documents ({caseData.documents.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {caseData.documents.map((doc, i) => (
                <div key={i} className="border border-slate-700 rounded p-3 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm">{doc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">Legal Case Tracker</h1>
            <p className="text-slate-400">Track violations, calculate penalties, draft motions</p>
          </div>
          <button
            onClick={() => setShowNewCase(true)}
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </button>
        </div>

        {/* New Case Form */}
        {showNewCase && (
          <div className="bg-slate-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Case</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Case Name"
                value={newCase.name}
                onChange={(e) => setNewCase({...newCase, name: e.target.value})}
                className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Client Name"
                value={newCase.client}
                onChange={(e) => setNewCase({...newCase, client: e.target.value})}
                className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
              />
              <select
                value={newCase.type}
                onChange={(e) => setNewCase({...newCase, type: e.target.value})}
                className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
              >
                <option value="">Case Type</option>
                <option value="Public Records">Public Records</option>
                <option value="Employment">Employment</option>
                <option value="Contract">Contract</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={addCase}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                Create Case
              </button>
              <button
                onClick={() => setShowNewCase(false)}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map(caseItem => (
            <div
              key={caseItem.id}
              onClick={() => setSelectedCase(caseItem.id)}
              className="bg-slate-900 hover:bg-slate-800 rounded-lg p-6 cursor-pointer border border-slate-700 hover:border-cyan-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{caseItem.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  caseItem.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-300'
                }`}>
                  {caseItem.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-slate-400">
                  <User className="w-4 h-4 mr-2" />
                  {caseItem.client}
                </div>
                <div className="flex items-center text-slate-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {caseItem.created}
                </div>
                <div className="flex items-center text-slate-400">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {caseItem.violations.length} violations
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-400">
                  ${caseItem.totalPenalty.toLocaleString()}
                </span>
                <span className="text-slate-500 text-sm">Total Penalties</span>
              </div>
            </div>
          ))}
        </div>

        {cases.length === 0 && !showNewCase && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No cases yet</h2>
            <p className="text-slate-400 mb-4">Create your first case to start tracking violations and penalties</p>
            <button
              onClick={() => setShowNewCase(true)}
              className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded"
            >
              Create First Case
            </button>
          </div>
        )}
      </div>
    </div>
  );
}