import React from 'react';

// App Shell with atmospheric background and navigation
function AppShell({ children }) {
  const navItems = [
    { name: 'Executive Briefing', href: '/', active: true },
    { name: 'Legal', href: '/legal' },
    { name: 'Grants', href: '/grants' },
    { name: 'Sales', href: '/sales' },
    { name: 'Adoption', href: '/adoption' },
  ];

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 30% 30%, rgba(0, 180, 255, 0.08), transparent 70%),
          radial-gradient(circle at 70% 70%, rgba(0, 255, 150, 0.06), transparent 80%),
          linear-gradient(180deg, #0a0f1f, #05080f)
        `,
      }}
    >
      {/* Particle texture */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.4'%3E%3Ccircle cx='2' cy='2' r='0.5'/%3E%3Ccircle cx='40' cy='60' r='0.5'/%3E%3Ccircle cx='80' cy='20' r='0.5'/%3E%3Ccircle cx='20' cy='80' r='0.5'/%3E%3Ccircle cx='60' cy='15' r='0.5'/%3E%3Ccircle cx='85' cy='75' r='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />
      
      {/* Navigation */}
      <nav className="w-full border-b border-slate-700 bg-gradient-to-r from-slate-950 to-slate-900">
        <div className="flex items-center justify-between mx-auto max-w-6xl px-6 py-4">
          <div className="font-semibold tracking-tight text-lg text-cyan-400">
            Foldera
          </div>
          <div className="flex space-x-6">
            {navItems.map((item, i) => (
              
                key={i}
                href={item.href}
                className={`transition-colors text-sm ${
                  item.active 
                    ? 'text-white font-semibold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 relative">
        {children}
      </div>
    </div>
  );
}

// Semantic components
function StatCard({ label, value, status = 'normal' }) {
  const getStatusStyle = () => {
    switch (status) {
      case 'urgent': 
        return {
          color: '#fbbf24',
          textShadow: '0 0 8px rgba(251, 191, 36, 0.4)'
        };
      case 'success': 
        return {
          color: '#22c55e',
          textShadow: '0 0 8px rgba(34, 197, 94, 0.3)'
        };
      case 'pending': 
        return {
          color: '#94a3b8',
        };
      default: 
        return {
          color: '#ffffff',
        };
    }
  };

  return (
    <div className="flex flex-col items-start">
      <span className="text-xs uppercase tracking-wide text-slate-500 mb-1">
        {label}
      </span>
      <span 
        className="text-xl font-semibold"
        style={getStatusStyle()}
      >
        {value}
      </span>
    </div>
  );
}

function TelemetryStrip({ active, valueAtRisk, actionItems, recentActivity }) {
  return (
    <div className="grid grid-cols-4 gap-6 p-6 rounded-xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm">
      <StatCard label="Active" value={active} />
      <StatCard label="Value at Risk" value={valueAtRisk} status="urgent" />
      <StatCard label="Action Items" value={actionItems} />
      <StatCard label="Recent Activity" value={recentActivity} />
    </div>
  );
}

function CaseRow({ title, value, status = 'neutral' }) {
  const getStatusStyle = () => {
    switch (status) {
      case 'urgent': 
        return {
          color: '#fbbf24',
          textShadow: '0 0 8px rgba(251, 191, 36, 0.4)'
        };
      case 'success': 
        return {
          color: '#22c55e',
          textShadow: '0 0 8px rgba(34, 197, 94, 0.3)'
        };
      case 'pending': 
        return {
          color: '#94a3b8',
        };
      default: 
        return {
          color: '#ffffff',
        };
    }
  };

  return (
    <div className="flex justify-between py-4 px-4 border-b border-slate-700/50 hover:bg-slate-800/30 hover:border-slate-600/60 transition-all duration-200">
      <span className="text-white font-medium">{title}</span>
      {value && (
        <span 
          className="font-medium"
          style={getStatusStyle()}
        >
          {value}
        </span>
      )}
    </div>
  );
}

function CaseList({ cases, heading = 'Active Items' }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm uppercase text-slate-400 mb-4 tracking-wide">{heading}</h3>
      <div className="divide-y divide-slate-800">
        {cases.map((c, i) => (
          <CaseRow
            key={i}
            title={c.title}
            value={c.value}
            status={c.status}
          />
        ))}
      </div>
    </div>
  );
}

function DomainBriefing({ domains }) {
  return (
    <div className="space-y-12">
      {domains.map((domain, i) => (
        <div key={i} className="space-y-6">
          <div>
            <h2 className="text-cyan-400 font-semibold uppercase tracking-wide text-sm mb-3">
              {domain.name} Executive Briefing
            </h2>
            <div className="h-px w-full bg-gradient-to-r from-cyan-500/40 to-transparent mb-4"></div>
            <p className="text-lg text-white/90 leading-relaxed">{domain.summary}</p>
          </div>
          <CaseList cases={domain.cases} heading="Active Items" />
        </div>
      ))}
    </div>
  );
}

// Main Executive Briefing Component
export default function ExecutiveBriefing() {
  const domains = [
    {
      name: 'Legal',
      summary: "3 urgent items → PRA idle 455d, 9th Circuit on track",
      cases: [
        { title: 'King County PRA', value: '$6,500 exposure', status: 'urgent' },
        { title: '9th Circuit Appeal', value: 'On track', status: 'success' },
      ],
    },
    {
      name: 'Grants',
      summary: "Grant 'STEM Lab' missing budget, timeline slip flagged",
      cases: [
        { title: 'Grant: STEM Lab', value: 'Missing budget section', status: 'urgent' },
        { title: 'Education Initiative', value: 'Review pending', status: 'pending' },
      ],
    },
    {
      name: 'Sales',
      summary: "Acme renewal stalled 18d, $150k pipeline at risk",
      cases: [
        { title: 'Acme Renewal', value: '$150,000 pipeline', status: 'urgent' },
        { title: 'TechCorp Partnership', value: 'Contract signed', status: 'success' },
      ],
    },
    {
      name: 'Adoption',
      summary: "Rivera Family eligibility docs pending review",
      cases: [
        { title: 'Adoption: Rivera Family', value: 'Eligibility docs pending', status: 'pending' },
        { title: 'Johnson Family', value: 'Home study completed', status: 'success' },
      ],
    },
  ];

  return (
    <AppShell>
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Good Morning Brandon</h1>
        <p className="text-slate-400 mt-1">Foldera Executive Briefing</p>
      </header>

      <main className="space-y-10">
        <TelemetryStrip
          active={7}
          valueAtRisk="$215,000"
          actionItems={3}
          recentActivity={2}
        />

        <DomainBriefing domains={domains} />

        <div className="mt-12 border-2 border-dashed border-slate-700/50 rounded-xl p-12 text-center hover:border-slate-600/50 transition-all duration-300 bg-slate-900/20 backdrop-blur-sm">
          <div className="text-slate-400 text-lg mb-2">Drop folders, PDFs, emails to process</div>
          <div className="text-slate-500 text-sm">Drag and drop files here or click to browse</div>
        </div>
      </main>
    </AppShell>
  );
}