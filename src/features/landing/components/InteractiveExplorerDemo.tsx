"use client";

import React, { useState, useMemo, useId } from "react";
import Link from "next/link";
import {
  MOCK_EXPLORER_RECORDS,
  DEMO_PRESET_FILTERS,
  type PresetFilterId,
  type DemoRecord,
} from "../constants/explorer-demo";

type SortField = "timestamp" | "latency" | "status" | "service";
type SortDirection = "asc" | "desc";

export function InteractiveExplorerDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<PresetFilterId>("all");
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedRecord, setSelectedRecord] = useState<DemoRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const searchInputId = useId();

  // Filter & Search Logic
  const filteredRecords = useMemo(() => {
    return MOCK_EXPLORER_RECORDS.filter((rec) => {
      // 1. Preset filter check
      if (activeFilter === "errors" && rec.status < 400) return false;
      if (activeFilter === "high-latency" && rec.latency <= 20) return false;
      if (activeFilter === "auth" && rec.service !== "auth-gateway" && !rec.id.includes("auth")) return false;
      if (activeFilter === "ingestion" && rec.service !== "binary-ingest" && rec.method !== "STREAM") return false;

      // 2. Search query check
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        rec.id.toLowerCase().includes(q) ||
        rec.service.toLowerCase().includes(q) ||
        rec.cluster.toLowerCase().includes(q) ||
        rec.summary.toLowerCase().includes(q) ||
        rec.status.toString().includes(q) ||
        rec.method.toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === "timestamp") {
        comparison = a.timestamp.localeCompare(b.timestamp);
      } else if (sortField === "latency") {
        comparison = a.latency - b.latency;
      } else if (sortField === "status") {
        comparison = a.status - b.status;
      } else if (sortField === "service") {
        comparison = a.service.localeCompare(b.service);
      }
      return sortDirection === "desc" ? -comparison : comparison;
    });
  }, [searchQuery, activeFilter, sortField, sortDirection]);

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Copy JSON payload
  const handleCopyJson = (payload: Record<string, unknown>) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return "bg-[#00D69A]/15 text-[#009E73] dark:text-[#00D69A] border-[#00D69A]/30";
    }
    if (status >= 400 && status < 500) {
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
    }
    return "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30";
  };

  const getMethodBadge = (method: DemoRecord["method"]) => {
    switch (method) {
      case "STREAM":
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20";
      case "BATCH":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20";
      case "POST":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
  };

  return (
    <section
      aria-label="Interactive Data Explorer Preview"
      className="relative w-full py-20 sm:py-24 overflow-hidden bg-gradient-to-b from-[#FAFDFB] via-white to-[#F4F9F7] dark:from-[#040C0E] dark:via-[#071317] dark:to-[#040C0E] transition-colors duration-300"
    >
      {/* Background Ambience */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[48rem] h-[24rem] bg-[#00D69A]/5 dark:bg-[#00D69A]/8 rounded-full blur-[140px] pointer-events-none"
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#00D69A]/10 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-pulse" />
            Live Data Workstation
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Inspect raw streams with{" "}
            <span className="text-[#00B884] dark:text-[#00D69A]">sub-millisecond precision</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Search, filter, and drill into distributed event streams in real time. Experience how DataScope
            eliminates data warehouse delays without writing custom ingestion pipelines.
          </p>
        </div>

        {/* Workstation Terminal Container */}
        <div className="relative rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300">
          
          {/* Terminal Window Chrome / Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-4 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02]">
            {/* Window Controls & Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 pl-2 border-l border-slate-200 dark:border-white/10">
                DataScope Stream Explorer <span className="text-slate-400 dark:text-slate-500 font-normal">v2.4.0</span>
              </span>
            </div>

            {/* Query Engine Latency Badge */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 dark:bg-[#00D69A]/10 border border-emerald-500/20 text-xs font-mono text-emerald-800 dark:text-[#00D69A]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#00D69A] animate-ping" />
                <span>Query Time: <strong>0.38ms</strong></span>
                <span className="text-emerald-300 dark:text-emerald-700">|</span>
                <span>{filteredRecords.length} of {MOCK_EXPLORER_RECORDS.length} matches</span>
              </div>
            </div>
          </div>

          {/* Interactive Controls Bar: Search & Filter Chips */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 bg-white/50 dark:bg-transparent flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Instant Search Input */}
            <div className="relative flex-1 max-w-lg">
              <label htmlFor={searchInputId} className="sr-only">Search streams and payloads</label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id={searchInputId}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by packet ID, service, status (e.g. 500), cluster..."
                className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm font-mono rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D69A] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Preset Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {DEMO_PRESET_FILTERS.map((filter) => {
                const isActive = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#00D69A] text-slate-950 font-semibold shadow-sm shadow-[#00D69A]/30"
                        : "bg-slate-100 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop / Tablet Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort("timestamp")}
                      className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Time {sortField === "timestamp" && (sortDirection === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th scope="col" className="py-3 px-4">Stream ID</th>
                  <th scope="col" className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort("service")}
                      className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Service / Method {sortField === "service" && (sortDirection === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th scope="col" className="py-3 px-4">Cluster</th>
                  <th scope="col" className="py-3 px-4">Summary</th>
                  <th scope="col" className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort("latency")}
                      className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors ml-auto"
                    >
                      Latency {sortField === "latency" && (sortDirection === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th scope="col" className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleSort("status")}
                      className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors mx-auto"
                    >
                      Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <p className="text-sm">No streaming packets match query &ldquo;{searchQuery}&rdquo;</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setActiveFilter("all");
                        }}
                        className="mt-3 text-xs text-[#00B884] dark:text-[#00D69A] underline underline-offset-4 hover:opacity-80"
                      >
                        Reset filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => (
                    <tr
                      key={rec.id}
                      onClick={() => setSelectedRecord(rec)}
                      className="group hover:bg-[#00D69A]/[0.04] dark:hover:bg-[#00D69A]/[0.06] cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                        {rec.timestamp}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap group-hover:text-[#00B884] dark:group-hover:text-[#00D69A] transition-colors">
                        {rec.id}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getMethodBadge(rec.method)}`}>
                            {rec.method}
                          </span>
                          <span className="text-slate-700 dark:text-slate-300 text-xs">
                            {rec.service}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                        {rec.cluster}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-sans text-xs max-w-xs truncate">
                        {rec.summary}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className={`text-xs font-semibold ${
                          rec.latency > 20 ? "text-amber-600 dark:text-amber-400" : "text-emerald-700 dark:text-[#00D69A]"
                        }`}>
                          {rec.latency < 1 ? `${rec.latency}ms` : `${rec.latency.toFixed(1)}ms`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(rec.status)}`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(rec);
                          }}
                          className="px-2.5 py-1 rounded text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all"
                          aria-label={`Inspect packet ${rec.id}`}
                        >
                          View &rarr;
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (< 640px) */}
          <div className="sm:hidden divide-y divide-slate-100 dark:divide-white/5 p-3">
            {filteredRecords.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs font-mono">
                No matching packets.
              </div>
            ) : (
              filteredRecords.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className="py-3.5 px-2 hover:bg-[#00D69A]/5 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {rec.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${getStatusColor(rec.status)}`}>
                      {rec.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-mono">
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border ${getMethodBadge(rec.method)}`}>
                      {rec.method}
                    </span>
                    <span>{rec.service}</span>
                    <span>•</span>
                    <span className={rec.latency > 20 ? "text-amber-500" : "text-[#00D69A]"}>
                      {rec.latency}ms
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {rec.summary}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Footer Callout Strip inside Terminal */}
          <div className="px-5 py-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <svg className="w-4 h-4 text-[#00D69A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Click any record row to inspect full JSON byte metadata in real time.</span>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 shadow-sm transition-all hover:scale-[1.02]"
            >
              <span>Launch Live Workstation</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* JSON Inspector Slide-in Modal */}
      {selectedRecord && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-record-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#091B21] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getStatusColor(selectedRecord.status)}`}>
                  {selectedRecord.status}
                </span>
                <div>
                  <h3 id="modal-record-title" className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                    {selectedRecord.id}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {selectedRecord.cluster} • {selectedRecord.service} • {selectedRecord.latency}ms
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyJson(selectedRecord.payload)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {copied ? "✓ Copied" : "Copy JSON"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body: Summary & Formatted JSON */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Event Summary
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {selectedRecord.summary}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Decoded Stream Payload
                  </h4>
                  <span className="text-[10px] font-mono text-[#00D69A]">Zero-Copy Memory Slice</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                  <code>{JSON.stringify(selectedRecord.payload, null, 2)}</code>
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Timestamp: {selectedRecord.timestamp}</span>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-slate-600 dark:text-slate-300 hover:text-[#00D69A] transition-colors"
              >
                Press Escape or Click outside to close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

