"use client";

import React, { useState } from "react";
import { DatasetMetadata } from "../types";
import { AVAILABLE_DATASETS } from "../constants/datasets";

interface ExplorerHeaderProps {
  currentDataset: DatasetMetadata;
  onSelectDataset: (dataset: DatasetMetadata) => void;
}

export function ExplorerHeader({ currentDataset, onSelectDataset }: ExplorerHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative w-full border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Dataset Selector Dropdown */}
        <div className="relative">
          <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
            Active Data Stream
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-2.5 text-left py-1 px-2.5 -ml-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D69A]"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D69A] shadow-sm shadow-[#00D69A]/50" />
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
              {currentDataset.name}
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dataset Popover Menu */}
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />
              <div
                role="listbox"
                className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#091B21] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 text-[11px] font-mono text-slate-400 border-b border-slate-100 dark:border-white/5">
                  AVAILABLE ENTERPRISE DATASETS
                </div>
                <div className="py-1 space-y-1">
                  {AVAILABLE_DATASETS.map((ds) => {
                    const isSelected = ds.id === currentDataset.id;
                    return (
                      <button
                        key={ds.id}
                        type="button"
                        onClick={() => {
                          onSelectDataset(ds);
                          setIsOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start justify-between gap-2 ${
                          isSelected
                            ? "bg-[#00D69A]/10 text-slate-900 dark:text-white font-semibold"
                            : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold font-sans flex items-center gap-1.5">
                            <span>{ds.name}</span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                              ds.accessLevel === "Restricted"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                : ds.accessLevel === "Enterprise"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            }`}>
                              {ds.accessLevel || "Public"}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{ds.description}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono text-[#009E73] dark:text-[#00D69A]">
                            {ds.throughputRate}
                          </span>
                          <span className="block text-[9px] font-mono text-slate-400">
                            {ds.byteSizeFormatted}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Live Cluster Stats Strip */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono">
          {/* Ingestion Rate */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 dark:bg-[#00D69A]/10 border border-emerald-500/20 text-[#008A64] dark:text-[#00D69A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-ping" />
            <span>Ingest: <strong>{currentDataset.throughputRate}</strong></span>
          </div>

          {/* Shards Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>{currentDataset.cluster}</span>
          </div>

          {/* Total Record Count */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
            <span>Size: <strong>{currentDataset.byteSizeFormatted}</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
}

