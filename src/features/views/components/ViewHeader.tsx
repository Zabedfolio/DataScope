"use client";

import React from "react";

interface ViewHeaderProps {
  totalViews: number;
  sharedCount: number;
  onCreateNew: () => void;
  isViewer?: boolean;
}

export function ViewHeader({
  totalViews,
  sharedCount,
  onCreateNew,
  isViewer = false,
}: ViewHeaderProps) {
  return (
    <div className="w-full border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#00D69A]/10 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/20 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-pulse" />
            Workspace Manager
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Saved Views &amp; Alert Presets
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {isViewer
              ? "Access team-shared multidimensional filter presets and operational views (Viewer Mode)."
              : "Persistent multidimensional filter views, team monitoring dashboards, and one-click query bookmarks."}
          </p>
        </div>

        {/* Stats & Create Action */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono">
            {isViewer ? (
              <span className="text-[#008A64] dark:text-[#00D69A]">
                <strong>{sharedCount}</strong> Authorized Shared Views
              </span>
            ) : (
              <>
                <span>
                  <strong>{totalViews}</strong> Total Views
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-[#008A64] dark:text-[#00D69A]">
                  <strong>{sharedCount}</strong> Shared with Team
                </span>
              </>
            )}
          </div>

          {/* New Saved View button: Only for Analysts/Admins; Replaced with Read-Only Lock for Viewers */}
          {isViewer ? (
            <div
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 cursor-not-allowed"
              title="Viewers cannot create new saved views. Upgrade to Data Analyst role."
            >
              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Shared Views Only (Viewer)</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 shadow-md shadow-[#00D69A]/20 transition-all hover:scale-[1.02]"
            >
              <span>+ New Saved View</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
