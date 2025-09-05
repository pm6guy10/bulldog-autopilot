"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2, BrainCircuit } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function StatusPill({ connected }) { /* ... full component code ... */ }
const MatterSelectionScreen = ({ matters, onSelect, connected }) => { /* ... full component code ... */ };
const MatterDashboard = ({ matter, summary, onBack, onDraft, isDrafting }) => { /* ... full component code ... */ };

export default function Page() { /* ... full component logic ... */ }

// --- Full Implementations ---
StatusPill.defaultProps = {
    connected: false
};
function StatusPill({ connected }) {
    const isConnected = connected;
    const bgColor = isConnected ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400";
    const dotColor = isConnected ? "bg-green-500" : "bg-red-500";
    return (
        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}>
            <span className={`h-2 w-2 rounded-full ${dotColor}`}></span>
            {isConnected ? "Supabase Connected" : "Connection Failed"}
        </div>