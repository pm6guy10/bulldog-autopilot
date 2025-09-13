'use client';

import { useState } from 'react';
import { Calendar, FolderOpen, AlertTriangle } from 'lucide-react';

interface CaseDetails {
  caseNumber: string;
  created: string;
  files: number;
  violations: number;
  daysIdle: number;
}

interface CaseCardProps {
  title: string;
  exposure: string;
  details: CaseDetails;
  onClick: () => void;
}

export function CaseCard({ title, exposure, details, onClick }: CaseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isIdle = details.daysIdle > 180;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        bg-background border border-transparent rounded-card p-6 shadow-card 
        cursor-pointer transition-all duration-300 ease-out
        hover:border-gradientFrom hover:shadow-cardHover hover:translate-y-[-4px]
        ${isIdle ? 'opacity-80' : 'opacity-100'}
      `}
    >
      {/* DEFAULT VIEW - CALM */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-h2 text-textPrimary">{title}</h2>
          <div className="w-3 h-3 rounded-full bg-success" />
        </div>
        
        <div className="text-highlight bg-gradient-to-r from-gradientFrom to-gradientTo text-transparent bg-clip-text">
          {exposure}
        </div>
      </div>

      {/* EXPANDED VIEW - DETAILS ON DEMAND */}
      {expanded && (
        <div className="mt-6 pt-6 border-t border-textSecondary/20 space-y-3 animate-fadeIn">
          <div className="text-textSecondary text-body">#{details.caseNumber}</div>
          
          <div className="flex justify-between text-textSecondary text-body">
            <div className="flex items-center">
              <FolderOpen className="w-4 h-4 mr-1" />
              {details.files} files
            </div>
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {details.violations} violations
            </div>
          </div>
          
          <div className="text-textSecondary/70 text-body flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {details.daysIdle === 0 ? 'Active today' : `${details.daysIdle}d ago`}
          </div>
          
          {/* QUICK ACTIONS */}
          <div className="flex space-x-2 pt-2">
            <button 
              className="px-3 py-1 bg-gradientFrom hover:bg-gradientFrom/90 rounded-full text-body text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); console.log('Schedule follow-up for', title); }}
            >
              📅 Follow up
            </button>
            <button 
              className="px-3 py-1 bg-action hover:bg-action/90 rounded-full text-body text-background transition-colors"
              onClick={(e) => { e.stopPropagation(); console.log('Upload files for', title); }}
            >
              📂 Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}