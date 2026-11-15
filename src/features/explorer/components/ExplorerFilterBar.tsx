"use client";

import React, { useRef, useEffect } from "react";
import { SearchHistoryDropdown } from "@/features/search/components";

interface ExplorerFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeChips: string[];
  onRemoveChip: (chip: string) => void;
  onAddChip: (chip: string) => void;
  matchCount: number;
  totalCount: number;
}

export function ExplorerFilterBar({
  searchQuery,
  onSearchChange,
  activeChips,
  onRemoveChip,
  onAddChip,
  matchCount,
  totalCount,
}: ExplorerFilterBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full border-b border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Universal Search Input */}
        <div className="relative flex-1 max-w-2xl">
          <label htmlFor="explorer-search" className="sr-only">Universal Stream Query</label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="explorer-search"
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Query streams by ID, service, cluster, payload key, or predicate (e.g. status:500)..."
            className="w-full pl-10 pr-28 py-2 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#051013] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D69A] transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 rounded pointer-events-none">
              /
            </kbd>
            <SearchHistoryDropdown onSelectQuery={onSearchChange} />
          </div>
        </div>

        {/* Filter Chips & Performance Pill */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2 text-xs font-mono">
          
          {/* Quick preset filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0">
            {activeChips.length === 0 ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400">Quick Filters:</span>
                <button
                  type="button"
                  onClick={() => onAddChip("status:500")}
                  className="px-2 py-0.5 rounded-md text-[11px] bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                >
                  + status:500
                </button>
                <button
                  type="button"
                  onClick={() => onAddChip("latency:>20ms")}
                  className="px-2 py-0.5 rounded-md text-[11px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                >
                  + latency:&gt;20ms
                </button>
                <button
                  type="button"
                  onClick={() => onAddChip("service:auth")}
                  className="px-2 py-0.5 rounded-md text-[11px] bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                >
                  + service:auth
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {activeChips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[#00D69A]/15 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/30 font-semibold"
                  >
                    <span>{chip}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveChip(chip)}
                      className="hover:text-rose-500 transition-colors"
                      aria-label={`Remove filter ${chip}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sub-Millisecond Speed Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 dark:bg-[#00D69A]/10 border border-emerald-500/20 text-[#008A64] dark:text-[#00D69A] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-ping" />
            <span>0.38ms</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>{matchCount}/{totalCount} matched</span>
          </div>
        </div>
      </div>
    </div>
  );
}

