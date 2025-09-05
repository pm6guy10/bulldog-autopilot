Perfect. Here’s a full new app/page.jsx that matches your sleek cobalt + neon theme, with glowing matter cards, rounded panels, and a 🧠 brain draft button.


---

app/page.jsx

"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Brain, ChevronRight } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { createClient } from "@supabase/supabase-js";

// Connect to Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Status indicator
function StatusPill({ connected }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
        connected ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {connected ? "Supabase Connected" : "Connection Failed"}
    </div>
  );
}

// Matter selection screen
const MatterSelectionScreen = ({ matters, onSelect, connected }) => (
  <div className="max-w-5xl mx-auto space-y-10">
    <header className="space-y-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold glow-text"
      >
        Bulldog PRA Autopilot
      </motion.h1>
      <StatusPill connected={connected} />
    </header>
    <main className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {(matters || []).map((matter) => (
        <motion.div
          key={matter.id}
          whileHover={{ scale: 1.05 }}
          className="panel cursor-pointer flex justify-between items-center"
          onClick={() => onSelect(matter)}
        >
          <div>
            <p className="font-bold text-lg">{matter.name}</p>
            <p className="text-sm text-[var(--text-secondary)]">
              {matter.client_name || "Unknown"} — {matter.case_number || "No Case #"}
            </p>
          </div>
          <ChevronRight className="text-[var(--text-secondary)]" />
        </motion.div>
      ))}
    </main>
  </div>
);

// Matter dashboard
const MatterDashboard = ({ matter, summary, onBack, onDraft, isDrafting }) => {
  const factorData = summary.factors
    ? [
        { subject: "Culpability", A: summary.factors.culpability, fullMark: 10 },
        { subject: "Clarity", A: summary.factors.clarity, fullMark: 10 },
        { subject: "Delay", A: summary.factors.delay, fullMark: 10 },
        { subject: "Deterrence", A: summary.factors.deterrence, fullMark: 10 },
      ]
    : [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <button
          onClick={onBack}
          className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors mb-6"
        >
          ← Back to All Matters
        </button>
        <h1 className="text-4xl sm:text-5xl font-bold">{matter.name}</h1>
      </header>
      <main className="grid md:grid-cols-2 gap-6">
        {/* Total Violations */}
        <div className="panel md:col-span-2 text-center">
          <h3 className="font-semibold text-[var(--text-secondary)]">
            Total Violations Logged
          </h3>
          <p className="text-6xl font-extrabold text-white mt-2">
            {summary.total ?? <Loader2 className="animate-spin inline" />}
          </p>
        </div>

        {/* Live Metrics */}
        <div className="panel">
          <h3 className="font-semibold text-[var(--text-secondary)] mb-4">
            Live Case Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>High-Risk Violations:</span>
              <span className="font-bold">{summary.factors?.high_risk_count ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Constructive Denials:</span>
              <span className="font-bold">{summary.factors?.denial_count ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Privilege Log Failures:</span>
              <span className="font-bold">{summary.factors?.privilege_log_failures ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Delay (Days):</span>
              <span className="font-bold">{summary.factors?.avg_delay ?? "-"}</span>
            </div>
          </div>
        </div>

        {/* Yousoufian Chart */}
        <div className="panel">
          <h3 className="font-semibold text-[var(--text-secondary)] mb-4">
            Yousoufian Factor Score
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={factorData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              />
              <Radar
                name="Score"
                dataKey="A"
                stroke="var(--accent)"
                fill="var(--highlight)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Draft Button */}
        <div className="md:col-span-2 flex justify-center mt-6">
          <button
            onClick={onDraft}
            className="btn-primary w-full max-w-md flex items-center justify-center gap-3 text-lg"
            disabled={isDrafting}
          >
            {isDrafting ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Drafting...
              </>
            ) : (
              <>
                <Brain size={22} /> Ask AI Partner to Draft Motion
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

// Main App
export default function Page() {
  const [matters, setMatters] = useState([]);
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [summary, setSummary] = useState({ total: 0, factors: null });
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch matters
  useEffect(() => {
    async function fetchMatters() {
      try {
        const { data, error } = await supabase.from("matters").select("*");
        if (error) throw error;
        setMatters(data);
        setConnectionStatus(true);
      } catch (err) {
        setConnectionStatus(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMatters();
  }, []);

  // Fetch summary
  useEffect(() => {
    if (!selectedMatter) return;
    setSummary({ total: null, factors: null });
    async function fetchSummary() {
      try {
        const res = await fetch(`/api/violations/summary?matter_id=${selectedMatter.id}`);
        if (!res.ok) throw new Error("Failed to fetch summary");
        setSummary(await res.json());
      } catch (err) {
        setSummary({ total: "Error", factors: null });
      }
    }
    fetchSummary();
  }, [selectedMatter]);

  // Handle draft motion
  const handleDraftMotion = async () => {
    if (!selectedMatter) return;
    setIsDrafting(true);
    try {
      const response = await fetch("/api/draft/motion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matter_id: selectedMatter.id }),
      });
      if (!response.ok) throw new Error((await response.json()).error || "Drafting failed");
      const { draft } = await response.json();
      const blob = new Blob([draft], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedMatter.name}_Motion_Draft.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Drafting Failed: ${error.message}`);
    } finally {
      setIsDrafting(false);
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-[var(--accent)]" />
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen p-6 sm:p-10 font-sans">
      <AnimatePresence mode="wait">
        {!selectedMatter ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MatterSelectionScreen
              matters={matters}
              onSelect={setSelectedMatter}
              connected={connectionStatus}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MatterDashboard
              matter={selectedMatter}
              summary={summary}
              onBack={() => setSelectedMatter(null)}
              onDraft={handleDraftMotion}
              isDrafting={isDrafting}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


---

✅ What changed:

Top branding: glowing “Bulldog PRA Autopilot” wordmark.

Matter cards: clean glowing panels, hover scale, chevron arrow.

Dashboard panels: rounded, glowing, neat grid.

Draft button: glowing oval with 🧠 brain icon.

Colors: tied into your cobalt + neon CSS theme.



---

Do you want me to also give you a matching updated summary API file (/app/api/violations/summary/route.js) so the data definitely loads without breaking?

