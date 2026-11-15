"use client";

import React, { useState } from "react";
import { ViewDensity, ColumnConfig } from "../types";

interface TableCommandBarProps {
  density: ViewDensity;
  onChangeDensity: (d: ViewDensity) => void;
  columns: ColumnConfig[];
  onToggleColumn: (key: ColumnConfig["key"]) => void;
  onExport: (format: "csv" | "json") => void;
  recordCount: number;
  isStreaming?: boolean;
  onToggleStreaming?: () => void;
  streamRate?: 1 | 3 | 5 | 10;
  onChangeStreamRate?: (rate: 1 | 3 | 5 | 10) => void;
  ingestedCount?: number;
  userRole?: string;
}

export function TableCommandBar({
  density,
  onChangeDensity,
  columns,
  onToggleColumn,
  onExport,
  recordCount,
  isStreaming = false,
  onToggleStreaming,
  streamRate = 1,
  onChangeStreamRate,
  ingestedCount = 0,
  userRole,
}: TableCommandBarProps) {
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  return (
    <div className="w-full border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Record Count & Status */}
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-xs">
          <div>
            Displaying <strong className="text-slate-900 dark:text-white">{recordCount}</strong> active streaming frames
          </div>
          {ingestedCount > 0 && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00D69A]/10 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/20">
              +{ingestedCount} live ingested
            </span>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Live Ingestion Simulator Pill */}
          {onToggleStreaming && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013]">
              <button
                type="button"
                onClick={onToggleStreaming}
                className="flex items-center gap-1.5 text-xs font-semibold focus:outline-none"
                title={isStreaming ? "Pause real-time stream simulation" : "Resume real-time stream simulation"}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-all ${
                    isStreaming
                      ? "bg-[#00D69A] shadow-sm shadow-[#00D69A]/80 animate-ping"
                      : "bg-amber-400"
                  }`}
                />
                <span
                  className={
                    isStreaming
                      ? "text-[#008A64] dark:text-[#00D69A] font-bold"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }
                >
                  {isStreaming ? "LIVE INGEST" : "STREAM PAUSED"}
                </span>
              </button>

              {isStreaming && onChangeStreamRate && (
                <div className="flex items-center pl-1 border-l border-slate-200 dark:border-white/10">
                  <select
                    value={streamRate}
                    onChange={(e) =>
                      onChangeStreamRate(Number(e.target.value) as 1 | 3 | 5 | 10)
                    }
                    aria-label="Stream ingestion rate"
                    className="bg-transparent text-[10px] font-mono text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value={1} className="bg-white dark:bg-[#091B21]">1/s</option>
                    <option value={3} className="bg-white dark:bg-[#091B21]">3/s</option>
                    <option value={5} className="bg-white dark:bg-[#091B21]">5/s</option>
                    <option value={10} className="bg-white dark:bg-[#091B21]">10/s</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Density Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-white/10 p-0.5 bg-white dark:bg-[#051013]">
            <button
              type="button"
              onClick={() => onChangeDensity("compact")}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                density === "compact"
                  ? "bg-[#00D69A] text-slate-950 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Compact rows (32px)"
            >
              Compact
            </button>
            <button
              type="button"
              onClick={() => onChangeDensity("comfortable")}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                density === "comfortable"
                  ? "bg-[#00D69A] text-slate-950 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Comfortable rows (44px)"
            >
              Comfortable
            </button>
          </div>

          {/* Column Visibility Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColumnMenu((prev) => !prev)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Columns</span>
              <svg
                className="w-3.5 h-3.5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showColumnMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowColumnMenu(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#091B21] shadow-xl p-2 z-40 text-xs">
                  <div className="text-[10px] uppercase font-mono text-slate-400 px-2 py-1 border-b border-slate-100 dark:border-white/5 mb-1">
                    Toggle Column View
                  </div>
                  <div className="space-y-1">
                    {columns.map((col) => (
                      <label
                        key={col.key}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        <input
                          type="checkbox"
                          checked={col.visible}
                          onChange={() => onToggleColumn(col.key)}
                          className="rounded border-slate-300 dark:border-slate-700 text-[#00D69A] focus:ring-[#00D69A]"
                        />
                        <span>{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Export Actions (§2, §13) */}
          {userRole === "Viewer" ? (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400 text-xs font-mono select-none"
              title="Exporting data requires Data Analyst or Administrator role clearance"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Export Restricted (Viewer)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onExport("csv")}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs transition-colors"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => onExport("json")}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs transition-colors"
              >
                JSON
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
