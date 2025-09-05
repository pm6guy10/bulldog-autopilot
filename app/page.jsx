"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, ChevronRight, Loader2 } from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

function StatusPill({ connected }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${
        connected
          ? "bg-green-500/10 text-green-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="space-y-3"
      >
        {(matters || []).map((matter) => (
          <motion.div
            key={matter.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            onClick={() => onSelect(matter)}
            className="bg-[var(--panel)] p-4 rounded-lg border border-[var(--border)] flex items-center justify-between cursor-pointer transition-all hover:border-[var(--accent)] hover:bg-slate-800"
          >
            <div>
              <p className="font-bold text-lg">{matter.name}</p>
              <p className="text-sm text-[var(--text-secondary)]">
                {matter.case_number || "No case number"}
              </p>
            </div>
            <ChevronRight className="text-[var(--text-secondary)]" />
          </motion.div>
        ))}
      </motion.div>
    </main>
  </div>
);

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
        <div className="bg-[var(--panel)] p-6 rounded-lg border border-[var(--border)] text-center md:col-span-2">
          <h3 className="font-semibold text-[var(--text-secondary)]">
            Total Violations
          </h3>
          <p className="text-6xl font-bold mt-2">
            {summary.total ?? (
              <Loader2 className="animate-spin inline text-[var(--accent)]" />
            )}
          </p>
        </div>
        <div className="bg-[var(--panel)] p-6 rounded-lg border border-[var(--border)]">
          <h3 className="font-semibold text-[var(--text-secondary)] mb-2 text-center">
            ⚖️ Yousoufian Factor Score
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={factorData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              />
              <Radar
                name="Score"
                dataKey="A"
                stroke="var(--accent)"
                fill="var(--accent)"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            onClick={onDraft}
            className="btn-primary font-bold py-4 px-6 rounded-lg text-lg flex items-center justify-center gap-3"
            disabled={isDrafting}
          >
            {isDrafting ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Drafting...
              </>
            ) : (
              <>
                <BrainCircuit size={20} /> Ask AI Partner to Draft Motion
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
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [summary, setSummary] = useState({ total: 0, factors: null });
  const [isDrafting, setIsDrafting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function fetchMatters() {
      try {
        const res = await fetch("/api/matters");
        if (!res.ok) throw new Error("Failed to fetch matters");
        setMatters(await res.json());
        setConnected(true);
      } catch (e) {
        setConnected(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMatters();
  }, []);

  useEffect(() => {
    if (!selectedMatter) return;
    async function fetchSummary() {
      try {
        const res = await fetch(
          `/api/violations/summary?matter_id=${selectedMatter.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch summary");
        setSummary(await res.json());
      } catch (e) {
        setSummary({ total: "Error", factors: null });
      }
    }
    fetchSummary();
  }, [selectedMatter]);

  const handleDraftMotion = async () => {
    if (!selectedMatter) return alert("Select a matter first");
    setIsDrafting(true);
    try {
      const res = await fetch("/api/draft/motion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matter_id: selectedMatter.id }),
      });
      if (!res.ok) throw new Error("Drafting failed");
      const { draft } = await res.json();
      console.log("Draft received:", draft);
    } catch (err) {
      alert(`Drafting failed: ${err.message}`);
    } finally {
      setIsDrafting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 font-sans">
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
              connected={connected}
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
