"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, ChevronRight, Loader2 } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- UI Components ---
function StatusPill({ connected }) { /* ... Component code is perfect, no changes needed ... */ }
const MatterSelectionScreen = ({ matters, onSelect, connected }) => { /* ... Component code is perfect, no changes needed ... */ };
const MatterDashboard = ({ matter, summary, onBack, onDraft, isDrafting }) => { /* ... Component code is perfect, no changes needed ... */ };

// --- Main Controller ---
export default function Page() {
  const [matters, setMatters] = useState([]);
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [summary, setSummary] = useState({ total: null, factors: null });
  const [connectionStatus, setConnectionStatus] = useState(true);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all matters on initial load
  useEffect(() => {
    async function fetchMatters() {
      try {
        const { data, error } = await supabase.from("matters").select("*").order("name");
        if (error) throw error;
        setMatters(data);
        setConnectionStatus(true);
      } catch (e) {
        console.error("Failed to fetch matters:", e);
        setConnectionStatus(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMatters();
  }, []);

  // Fetch summary data for a selected matter
  useEffect(() => {
    if (!selectedMatter) return;
    setSummary({ total: null, factors: null }); // Reset summary on change
    async function fetchSummary() {
      try {
        const res = await fetch(`/api/violations/summary?matter_id=${selectedMatter.id}`);
        if (!res.ok) throw new Error("API returned an error");
        setSummary(await res.json());
      } catch (e) {
        console.error("Failed to fetch summary:", e);
        setSummary({ total: "Error", factors: null });
      }
    }
    fetchSummary();
  }, [selectedMatter]);

  // Handle the AI draft request
  const handleDraftMotion = async () => {
    if (!selectedMatter) return;
    setIsDrafting(true);
    try {
      // ... (Drafting logic is solid, no changes needed) ...
    } catch (e) {
      alert(`Drafting Failed: ${e.message}`);
    } finally {
      setIsDrafting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-[var(--accent)]" />