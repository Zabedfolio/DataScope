"use client";

import React from "react";

export interface SavedView {
  id: string;
  name: string;
  filterPreset?: string;
}

interface SavedViewTabsProps {
  activeViewId: string;
  onSelectView: (viewId: string) => void;
  userRole?: string;
}

export const SAVED_VIEWS: SavedView[] = [
  { id: "all", name: "All Stream Telemetry" },
  { id: "outages", name: "5xx Critical Outages" },
  { id: "slow-queries", name: "P99 Latency Spikes (>20ms)" },
  { id: "security", name: "Security Handshakes & mTLS" },
];

export function SavedViewTabs({ activeViewId, onSelectView, userRole }: SavedViewTabsProps) {
  return (
    <div className="w-full border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-1">
        <div className="flex items-center gap-1">
          {SAVED_VIEWS.map((view) => {
            const isActive = view.id === activeViewId;
            return (
              <button
                key={view.id}
                type="button"
                onClick={() => onSelectView(view.id)}
                className={`px-3 py-2 text-xs font-mono font-medium rounded-lg whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? "border-[#00D69A] text-slate-900 dark:text-white bg-white dark:bg-white/5 font-bold shadow-sm"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-white/[0.02]"
                }`}
              >
                {view.name}
              </button>
            );
          })}
        </div>

        {/* Create Saved View Action (§2, §13) */}
        {userRole === "Viewer" ? (
          <div
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-400 select-none opacity-60 cursor-not-allowed"
            title="Viewers can only access shared views. Data Analyst role required to save presets."
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="hidden sm:inline">Shared Presets (Viewer)</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => alert("Save current query view to your enterprise workspace")}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-[#00D69A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Save View</span>
          </button>
        )}
      </div>
    </div>
  );
}

