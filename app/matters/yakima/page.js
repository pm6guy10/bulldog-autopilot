// File: app/matters/yakima/page.js (LIVE DASHBOARD)

"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { FileUpload } from '@/components/FileUpload';

export default function YakimaPage() {
  // State to hold our live data
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // This function fetches the live data when the component mounts
  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      const response = await fetch('/api/matters/yakima/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setChartData(data.chartData);
      }
      setIsLoading(false);
    }
    fetchDashboardData();
  }, []);

  // Show a loading state while fetching data
  if (isLoading) {
    return (
      <main className="min-h-screen p-6 flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl">Connecting to Case File...</p>
          <p className="text-gray-400">Loading live metrics from database...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 pb-28 lg:max-w-4xl lg:mx-auto"> 
      <h1 className="glow-text text-3xl font-bold mb-6 text-center">
        Yakima PRA Litigation
      </h1>

      <div className="card-enhanced mb-6">
        <h2 className="text-lg font-semibold mb-3">Case Memory Vault</h2>
        <FileUpload caseId="yakima" />
      </div>

      <div className="lg:flex lg:gap-6">
        <div className="flex-1">
          <div className="card-enhanced text-center mb-6">
            <p className="text-lg text-gray-400 mb-2">Total Violations Logged</p>
            {/* These now display LIVE data */}
            <p className="text-6xl font-bold">{metrics.totalViolations}</p>
          </div>
          <div className="card-enhanced mb-6">
            <p className="text-lg font-semibold mb-4">Live Case Metrics</p>
            <div className="space-y-3">
              {/* These now display LIVE data */}
              <div className="flex justify-between"><span>High-Risk Violations:</span><span className="font-bold">{metrics.highRiskViolations}</span></div>
              <div className="flex justify-between"><span>Constructive Denials:</span><span className="font-bold">{metrics.constructiveDenials}</span></div>
              <div className="flex justify-between"><span>Privilege Log Failures:</span><span className="font-bold">{metrics.privilegeLogFailures}</span></div>
              <div className="flex justify-between"><span>Average Delay (Days):</span><span className="font-bold">{metrics.averageDelay}</span></div>
            </div>
          </div>
        </div>
        <div className="card-enhanced flex-1">
          <p className="text-lg font-semibold mb-4 text-center">Yousoufian Score</p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              {/* The chart now uses LIVE data */}
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#e5e7eb', fontSize: 12 }} />
                <Radar name="Score" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="lg:max-w-4xl lg:mx-auto">
          <Link href="/matters/yakima/draft" className="btn w-full text-center">
            Draft Motion
          </Link>
        </div>
      </div>
    </main>
  );
}
