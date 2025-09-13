'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface PriorityItem {
  case: string;
  action: string;
  description: string;
}

interface PriorityBannerProps {
  urgentItems: PriorityItem[];
}

export function PriorityBanner({ urgentItems }: PriorityBannerProps) {
  const [expanded, setExpanded] = useState(false);

  if (urgentItems.length === 0) return null;

  return (
    <div 
      className="bg-background border border-textSecondary/20 rounded-card p-6 shadow-card cursor-pointer transition-all duration-200 hover:bg-textSecondary/5"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-h2 text-warning font-semibold flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {urgentItems.length} Cases Need Attention
        </h2>
        <span 
          className="text-textSecondary transition-transform duration-200"
          style={{
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)'
          }}
        >
          ▶
        </span>
      </div>
      
      {expanded && (
        <div className="mt-4 space-y-3 animate-fadeIn">
          {urgentItems.slice(0, 3).map((item, i) => (
            <div key={i} className="text-textSecondary text-body">
              <div className="font-medium text-textPrimary">{item.action}</div>
              <div className="text-sm mt-1">{item.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}