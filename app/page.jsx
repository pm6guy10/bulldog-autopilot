"use client";

import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-4xl font-bold glow-text">Bulldog PRA Autopilot</h1>

      {/* Case Card */}
      <div className="bg-[var(--panel)]">
        <h2 className="text-xl font-semibold mb-4">Yakima PRA Litigation</h2>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[var(--panel)] text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Total Violations
            </p>
            <p className="text-4xl font-bold">10</p>
          </div>

          <div className="bg-[var(--panel)] text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Constructive Denials
            </p>
            <p className="text-4xl font-bold">4</p>
          </div>
        </div>

        {/* Radar Chart Placeholder */}
        <div className="bg-[var(--panel)] text-center p-4">
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            ⚖️ Yousoufian Factor Score
          </p>
          <div className="h-48 flex items-center justify-center">
            <p className="text-[var(--text-secondary)]">[Radar Chart Here]</p>
          </div>
        </div>

        {/* Button with Brain Icon */}
        <div className="flex justify-center mt-6">
          <button className="btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="icon-brain"
            >
              <path d="M12 3c-2 0-3.5 1.5-3.5 3.5S10 10 12 10s3.5-1.5 3.5-3.5S14 3 12 3zM8 12c-2 0-3.5 1.5-3.5 3.5S6 19 8 19s3.5-1.5 3.5-3.5S10 12 8 12zm8 0c-2 0-3.5 1.5-3.5 3.5S14 19 16 19s3.5-1.5 3.5-3.5S18 12 16 12zM12 14c-1 0-2 .5-2 1.5S11 17 12 17s2-.5 2-1.5S13 14 12 14z" />
            </svg>
            Ask AI Partner to Draft Motion
          </button>
        </div>
      </div>

      {/* Back Link */}
      <Link href="/" className="text-[var(--accent)] underline">
        ← Back to All Matters
      </Link>
    </main>
  );
}