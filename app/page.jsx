"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, ChevronRight, Loader2 } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function StatusPill({ connected }) {
  const style = connected
    ? "bg-green-500/10 text-green-400"
    : "bg-red-500/10 text-red-400";
  const dot = connected ? "bg-green-500" : "bg-red-500";
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {connected ? "Supabase Connected" : "Connection Failed"}
    </div>
  );
}

const MatterSelectionScreen = ({ matters, onSelect, connected }) => (
  <div className="max-w-4xl mx-auto space-y-8">
    <header className="space-y-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold glow-text"
      >
        Bulldog PRA Autopilot
      </motion.h1>
      <StatusPill connected={connected} />
    </header>
    <main className="space-y-4">
      <h2 className="text-2xl font-semibold text-[var(--text-secondary)]">
        Select a Matter
      </h2>
      <div className="space-y-3">
        {(matters || []).map((m) => (
          <motion.div
            key={m.id}
            onClick={() => onSelect(m)}
            className="panel cursor-pointer transition-all hover:border-[var(--accent)] hover:bg-slate-800"
            whileHover={{ scale: 1.02 }}
          >
            <p className="font-bold text-lg text-white">{m.name}</p>
            <p className="text-sm text-[var(--text-secondary)]">
              {m.client_name || "Unknown"} — {m.case_number || "No Case #"}
            </p>
          </motion.div>
        ))}
      </div>
    </main>
  </div>
);

const MatterDashboard = ({ matter, summary, onBack, onDraft, isDrafting }) => {
  const radarData = summary.factors
    ? [
        { subject: "Culpability", A: summary.factors.culpability, fullMark: 10 },
        { subject: "Clarity", A: summary.factors.clarity, fullMark: 10 },
        { subject: "Delay", A: summary.factors.delay, fullMark: 10 },
        { subject: "Deterrence", A: summary.factors.deterrence, fullMark: 10 },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <button
          onClick={onBack}
          className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors mb-4"
        >
          ← Back to All Matters
        </button>
        <h1 className="text-4xl sm:text-5xl font-bold">{matter.name}</h1>
      </header>

      <main className="grid md:grid-cols-2 gap-6">
        {/* Total Violations */}
        <div className="panel text-center md:col-span-2">
          <h3 className="font-semibold text-[var(--text-secondary)]">
            Total Violations Logged
          </h3>
          <p className="text-6xl font-bold text-white mt-2">
            {summary.total ?? <Loader2 className="animate-spin inline" />}
          </p>
        </div>

        {/* Case Metrics */}
        <div className="panel">
          <h3 className="font-semibold text-[var(--text-secondary)] mb-4">
            Live Case Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>High-Risk Violations:</span>
              <span className="font-bold">
                {summary.factors?.high_risk_count ?? "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Constructive Denials:</span>
              <span className="font-bold">
                {summary.factors?.denial_count ?? "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Privilege Log Failures:</span>
              <span className="font-bold">
                {summary.factors?.privilege_log_failures ?? "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Average Delay (Days):</span>
              <span className="font-bold">
                {summary.factors?.avg_delay ?? "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="panel">
          <h3 className="font-semibold text-[var(--text-secondary)] mb-4">
            Yousoufian Score
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              />
              <Radar
                name="Score"
                dataKey="A"
                stroke="var(--accent)"
                fill="var(--accent-2)"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Draft Motion Button */}
        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            onClick={onDraft}
            disabled={isDrafting}
            className="btn-primary w-full max-w-sm flex items-center justify-center gap-2"
          >
            {isDrafting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Drafting...
              </>
            ) : (
              <>
                <BrainCircuit size={18} /> Ask AI Partner to Draft Motion
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default function Page() {
  const [matters, setMatters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState({ total: 0, factors: null });
  const [isDrafting, setIsDrafting] = useState(false);
  const [connected, setConnected] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatters() {
      try {
        const { data, error } = await supabase.from("matters").select("*");
        if (error) throw error;
        setMatters(data);
        setConnected(true);
      } catch (e) {
        setConnected(false);
      } finally {
        setLoading(false);
      }
    }
    fetchMatters();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setSummary({ total: null, factors: null });
    async function fetchSummary() {
      try {
        const res = await fetch(`/api/violations/summary?matter_id=${selected.id}`);
        if (!res.ok) throw new Error("Failed to fetch summary");
        setSummary(await res.json());
      } catch {
        setSummary({ total: "Error", factors: null });
      }
    }
    fetchSummary();
  }, [selected]);

  const handleDraft = async () => {
    if (!selected) return;
    setIsDrafting(true);
    try {
      const res = await fetch("/api/draft/motion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matter_id: selected.id }),
      });
      if (!res.ok) throw new Error("Drafting failed");
      const { draft } = await res.json();
      const blob = new Blob([draft], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selected.name}_Motion_Draft.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(`Drafting Failed: ${e.message}`);
    } finally {
      setIsDrafting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 font-sans">
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MatterDashboard
              matter={selected}
              summary={summary}
              onBack={() => setSelected(null)}
              onDraft={handleDraft}
              isDrafting={isDrafting}
            />
          </motion.div>
        ) : (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MatterSelectionScreen
              matters={matters}
              onSelect={setSelected}
              connected={connected}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}