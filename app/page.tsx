'use client';

import { useState, useEffect, useCallback } from 'react';
import { HeroHeader } from '../components/HeroHeader';
import { PriorityBanner } from '../components/PriorityBanner';
import { CaseCard } from '../components/CaseCard';

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
  insights: Array<{ type: string; content: string; confidence: number; }>;
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

export default function LockedDashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [showNewCase, setShowNewCase] = useState(false);
  const [newCase, setNewCase] = useState({ name: '', client: '', caseNumber: '', type: '' });

  // Generate daily briefing with useCallback to avoid dependency issues
  const generateDailyBriefing = useCallback(() => {
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
  }, [cases]);

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

  // Generate daily briefing when cases change
  useEffect(() => {
    if (cases.length > 0) {
      generateDailyBriefing();
    }
  }, [cases, generateDailyBriefing]);

  // Save cases when they change
  useEffect(() => {
    if (cases.length > 0) {
      localStorage.setItem('realLegalCases', JSON.stringify(cases));
    }
  }, [cases]);

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

  // Calculate case details for display
  const getCaseDisplayData = (caseItem: Case) => {
    const daysSinceActivity = Math.floor((new Date().getTime() - new Date(caseItem.lastActivity).getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      title: caseItem.name,
      exposure: `$${caseItem.totalPenalty.toLocaleString()}`,
      details: {
        caseNumber: caseItem.caseNumber,
        created: caseItem.created,
        files: caseItem.files.length,
        violations: caseItem.violations.length,
        daysIdle: daysSinceActivity
      }
    };
  };

  // LOCKED STATS
  const stats = briefing ? {
    activeCases: briefing.activeCases,
    exposure: `$${briefing.totalPenalties.toLocaleString()}`,
    actionItems: briefing.urgentItems.length,
    recentActivity: briefing.recentActivity
  } : {
    activeCases: 0,
    exposure: "$0",
    actionItems: 0,
    recentActivity: 0
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary">
      <div className="max-w-6xl mx-auto p-8 space-y-sectionGap">
        {/* HERO - LOCKED */}
        <HeroHeader 
          stats={stats}
          onNewCase={() => setShowNewCase(true)}
        />

        {/* PRIORITY BANNER - LOCKED */}
        {briefing && (
          <PriorityBanner urgentItems={briefing.urgentItems} />
        )}

        {/* NEW CASE FORM */}
        {showNewCase && (
          <div className="bg-background border border-textSecondary/20 rounded-card p-6 shadow-card">
            <h2 className="text-h2 text-textPrimary font-semibold mb-4">Add New Case</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Case Name"
                value={newCase.name}
                onChange={(e) => setNewCase({...newCase, name: e.target.value})}
                className="bg-textSecondary/10 border border-textSecondary/20 rounded-card px-4 py-3 text-textPrimary focus:border-gradientFrom focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Case Number"
                value={newCase.caseNumber}
                onChange={(e) => setNewCase({...newCase, caseNumber: e.target.value})}
                className="bg-textSecondary/10 border border-textSecondary/20 rounded-card px-4 py-3 text-textPrimary focus:border-gradientFrom focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Client"
                value={newCase.client}
                onChange={(e) => setNewCase({...newCase, client: e.target.value})}
                className="bg-textSecondary/10 border border-textSecondary/20 rounded-card px-4 py-3 text-textPrimary focus:border-gradientFrom focus:outline-none transition-colors"
              />
              <select
                value={newCase.type}
                onChange={(e) => setNewCase({...newCase, type: e.target.value})}
                className="bg-textSecondary/10 border border-textSecondary/20 rounded-card px-4 py-3 text-textPrimary focus:border-gradientFrom focus:outline-none transition-colors"
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
                className="bg-success hover:bg-success/90 px-6 py-3 rounded-card text-background font-semibold transition-colors"
              >
                Create Case
              </button>
              <button
                onClick={() => setShowNewCase(false)}
                className="bg-textSecondary/20 hover:bg-textSecondary/30 px-6 py-3 rounded-card text-textPrimary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* CASE GRID - LOCKED */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-cardGap">
          {cases.map((caseItem) => {
            const displayData = getCaseDisplayData(caseItem);
            return (
              <CaseCard
                key={caseItem.id}
                title={displayData.title}
                exposure={displayData.exposure}
                details={displayData.details}
                onClick={() => console.log('Navigate to case:', caseItem.name)}
              />
            );
          })}
        </div>

        {/* EMPTY STATE - LOCKED */}
        {cases.length === 0 && !showNewCase && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚖️</div>
            <h2 className="text-display text-textPrimary mb-4">No cases yet</h2>
            <p className="text-textSecondary mb-8">Add your first case to get started</p>
            <button
              onClick={() => setShowNewCase(true)}
              className="bg-gradientFrom hover:bg-gradientFrom/90 px-8 py-4 rounded-card text-h2 text-textPrimary transition-colors"
            >
              Create First Case
            </button>
          </div>
        )}
      </div>
    </div>
  );
}