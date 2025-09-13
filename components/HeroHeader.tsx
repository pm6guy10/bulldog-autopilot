'use client';

import { Plus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-card p-6 text-center">
      <div className="text-highlight text-textPrimary font-bold">{value}</div>
      <div className="text-body text-white/80">{label}</div>
    </div>
  );
}

interface HeroHeaderProps {
  onNewCase: () => void;
  stats: {
    activeCases: number;
    exposure: string;
    actionItems: number;
    recentActivity: number;
  };
}

export function HeroHeader({ onNewCase, stats }: HeroHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-gradientFrom to-gradientTo p-heroY rounded-card">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-display text-textPrimary">
          Good Morning Brandon 👋
        </h1>
        <button
          onClick={onNewCase}
          className="bg-action hover:bg-action/90 text-background font-semibold px-6 py-3 rounded-full shadow-card transition-all duration-200 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Case
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Cases" value={stats.activeCases.toString()} />
        <StatCard label="Exposure" value={stats.exposure} />
        <StatCard label="Action Items" value={stats.actionItems.toString()} />
        <StatCard label="Recent Activity" value={stats.recentActivity.toString()} />
      </div>
    </div>
  );
}