// File: app/matters/yakima/page.js (FINAL ROBUST VERSION)

"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { FileUpload } from '@/components/FileUpload';

export default function YakimaPage() {
  // State to hold our live data, loading status, and any potential errors
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // This function fetches the live data when the component mounts
  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setError(null); // Reset error on each fetch
      try {
        const response = await fetch('/api/matters/yakima/metrics');
        if (!response.ok) {
          // If the server gives a bad response, create an error
          throw new Error(`The server responded with an error: ${response.status}`);
        }
        const data = await response.json();
        setMetrics(data.metrics);
        setChartData(data.chartData);
      } catch (e) {
        // Catch any network errors or thrown errors
        console.error("Failed to fetch dashboard data:", e);
        setError("Could not connect to the case database. The API might be down or there's a connection issue.");
      } finally {
        // This always runs, after success or failure
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // STATE 1: Show a loading screen while fetching data
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

  // STATE 2: If an error occurred, show an error message
  if (error) {
    return (
      <main className="min-h-screen p-6 flex justify-center items-center">
        <div className="card-enhanced text-center border-red-500/50">
          <h2 className="text-xl font-semibold mb-3 text-red-400">Connection Error</h2>
          <p className="text-gray-300">{error}</p>
          <p className="text-gray-400 text-sm mt-2">Please check the Vercel logs for the `/api/matters/yakima/metrics` route for more details.</p>
        </div>
      </main>
    );
  }

  // STATE 3: If everything is successful, show the dashboard
  return (
    <main className="min-h-screen p-6 pb-28 lg:max-w-4xl lg:mx-auto"> 
      <h1 className="glow-text text-3xl font-bold mb-6 text-center">
        Yakima PRA Litigation
      </h1>

      <div className="card-enhanced mb-6 border-cyan-400/50">
        <h2 className="text-lg font-semibold mb-3">AI Strategy Briefing</h2>
        <p className="text-gray-300">{metrics.strategicRecommendation}</p>
        {metrics.recommendedAction === 'draft_motion_compel' && (
            <Link href="/matters/yakima/draft" className="btn w-full text-center mt-4">
              AI Recommended Action: Draft Motion to Compel
            </Link>
        )}
      </div>

      <div className="card-enhanced mb-6">
        <h2 className="text-lg font-semibold mb-3">Case Memory Vault</h2>
        <FileUpload caseId="yakima" />
      </div>

      <div className="lg:flex lg:flex-wrap lg:gap-6">
        <div className="flex-1">
          <div className="card-enhanced text-center mb-6">
            <p className="text-lg text-gray-400 mb-2">Total Violations Logged</p>
            <p className="text-6xl font-bold">{metrics.totalViolations}</p>
          </div>
          <div className="card-enhanced mb-6">
            <p className="text-lg font-semibold mb-4">Live Case Metrics</p>
            <div className="space-y-3">
              <div className="flex justify-between"><span>High-Risk Violations:</span><span className="font-bold">{metrics.highRiskViolations}</span></div>
              <div className="flex justify-between"><span>Constructive Denials:</span><span className="font-bold">{metrics.constructiveDenials}</span></div>
              <div className="flex justify-between"><span>Privilege Log Failures:</span><span className="font-bold">{metrics.privilegeLogFailures}</span></div>
            </div>
          </div>
        </div>
        <div className="card-enhanced flex-1">
          <p className="text-lg font-semibold mb-4 text-center">Yousoufian Score</p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#e5e7eb', fontSize: 12 }} />
                <Radar name="Score" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}
