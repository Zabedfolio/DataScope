"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/AuthContext";
import { AVAILABLE_DATASETS } from "@/features/explorer/constants/datasets";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeClusterTab, setActiveClusterTab] = useState<"all" | "us-east" | "us-west" | "eu" | "global">("all");

  const displayName = user?.name || "Lead Analyst";
  const displayRole = user?.role || "Enterprise Analyst";

  return (
    <div className="flex-1 flex flex-col min-h-screen pt-20 sm:pt-24 pb-16 bg-slate-50/50 dark:bg-[#040C0E] transition-colors">
      
      {/* 1. Header Overview Banner */}
      <div className="w-full border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#00D69A]/10 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-ping" />
                Cluster Health: 100% Operational
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                {displayRole}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Multi-region streaming telemetry, vectorized query indexes, and live cluster health.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 shadow-md shadow-[#00D69A]/20 transition-all hover:-translate-y-0.5"
            >
              <span>Launch Explorer</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-all"
            >
              <svg className="w-3.5 h-3.5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Visual Query</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        
        {/* 2. Key Telemetry KPIs (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-mono">
          {/* KPI 1 */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-[#00D69A]/40">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="uppercase text-[10px] tracking-wider font-semibold">Total Ingestion Rate</span>
              <span className="w-2 h-2 rounded-full bg-[#00D69A]" />
            </div>
            <div className="text-2xl font-bold font-sans text-slate-900 dark:text-white">
              9.32 <span className="text-xs font-mono font-normal text-slate-400">Gbps</span>
            </div>
            <div className="mt-2 text-[11px] text-[#008A64] dark:text-[#00D69A] flex items-center gap-1">
              <span>↑ +14.2%</span>
              <span className="text-slate-400">vs 1h avg (382.4k evt/s)</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-[#00D69A]/40">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="uppercase text-[10px] tracking-wider font-semibold">Scan Latency (P99)</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-sans text-slate-900 dark:text-white">
              0.34 <span className="text-xs font-mono font-normal text-slate-400">ms</span>
            </div>
            <div className="mt-2 text-[11px] text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
              <span>AVX-512 SIMD</span>
              <span className="text-slate-400">• sub-millisecond</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-[#00D69A]/40">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="uppercase text-[10px] tracking-wider font-semibold">Distributed Shards</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-sans text-slate-900 dark:text-white">
              60 / 60
            </div>
            <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Quorum Synced</span>
              <span className="text-slate-400">• 0 dropped frames</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-[#00D69A]/40">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="uppercase text-[10px] tracking-wider font-semibold">Buffered Volume</span>
              <span className="w-2 h-2 rounded-full bg-purple-400" />
            </div>
            <div className="text-2xl font-bold font-sans text-slate-900 dark:text-white">
              638.4 <span className="text-xs font-mono font-normal text-slate-400">GB</span>
            </div>
            <div className="mt-2 text-[11px] text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <span>Zstd 0.42 Ratio</span>
              <span className="text-slate-400">• NVMe-mmap</span>
            </div>
          </div>
        </div>

        {/* 3. Ingestion Activity Waveform */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Real-Time Cluster Throughput Dynamics
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Aggregate streaming packet velocity measured at 500ms sampling window
              </p>
            </div>

            {/* Cluster Tabs */}
            <div className="flex items-center gap-1 text-xs font-mono p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setActiveClusterTab("all")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeClusterTab === "all"
                    ? "bg-[#00D69A] text-slate-950 font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All (4)
              </button>
              <button
                type="button"
                onClick={() => setActiveClusterTab("us-east")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeClusterTab === "us-east"
                    ? "bg-[#00D69A] text-slate-950 font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                US-East
              </button>
              <button
                type="button"
                onClick={() => setActiveClusterTab("us-west")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeClusterTab === "us-west"
                    ? "bg-[#00D69A] text-slate-950 font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                US-West
              </button>
              <button
                type="button"
                onClick={() => setActiveClusterTab("eu")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeClusterTab === "eu"
                    ? "bg-[#00D69A] text-slate-950 font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                EU-Vault
              </button>
            </div>
          </div>

          {/* SVG Waveform Graphic */}
          <div className="relative w-full h-44 sm:h-56 bg-slate-900/60 rounded-xl border border-slate-800 p-4 overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Peak: 12.4 Gbps</span>
              <span className="text-[#00D69A]">Current: 9.32 Gbps (Active)</span>
            </div>

            {/* Dynamic Waveform SVG */}
            <svg
              className="w-full h-28 sm:h-36 overflow-visible"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00D69A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00D69A" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Under Wave */}
              <path
                d="M 0,160 Q 120,40 250,110 T 500,80 T 750,140 T 1000,60 L 1000,200 L 0,200 Z"
                fill="url(#waveGradient)"
              />

              {/* Wave Line */}
              <path
                d="M 0,160 Q 120,40 250,110 T 500,80 T 750,140 T 1000,60"
                stroke="#00D69A"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data Pin Indicator */}
              <circle cx="750" cy="140" r="5" fill="#00D69A" className="animate-ping" />
              <circle cx="750" cy="140" r="4" fill="#FFFFFF" stroke="#00D69A" strokeWidth="2" />
            </svg>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
              <span>-60 mins</span>
              <span>-45 mins</span>
              <span>-30 mins</span>
              <span>-15 mins</span>
              <span>Live Now</span>
            </div>
          </div>
        </div>

        {/* 4. Active Enterprise Streams Matrix */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                Active Enterprise Data Streams
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Subscribed ingest channels available for real-time inspection
              </p>
            </div>
            <Link
              href="/datasets"
              className="text-xs font-mono text-[#008A64] dark:text-[#00D69A] hover:underline"
            >
              View Full Catalog &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_DATASETS.map((ds) => (
              <div
                key={ds.id}
                className="group relative rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 p-5 shadow-sm hover:border-[#00D69A]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00D69A]/10 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A]" />
                      {ds.syncFrequency}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {ds.cluster}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#00B884] dark:group-hover:text-[#00D69A] transition-colors">
                    {ds.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {ds.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-[#008A64] dark:text-[#00D69A] font-bold">
                      {ds.throughputRate}
                    </span>
                    <span className="text-slate-400">{ds.byteSizeFormatted}</span>
                  </div>

                  <Link
                    href={`/explorer?dataset=${ds.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-[#00D69A] text-slate-700 dark:text-slate-300 hover:text-slate-950 font-bold text-xs transition-all"
                  >
                    <span>Open Workstation &rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Incident & Security Telemetry Ticker */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 p-5 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider">
                Live Anomaly Radar &amp; Outage Monitor
              </span>
            </div>
            <span className="text-slate-400 text-[10px]">Zero dropped frames in last 24h</span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  500 ERROR
                </span>
                <span className="text-slate-800 dark:text-slate-200">
                  Disk I/O backpressure reached 98% queue capacity on storage-node-03
                </span>
              </div>
              <span className="text-slate-400 text-[10px] shrink-0">1 min ago</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  429 WARN
                </span>
                <span className="text-slate-800 dark:text-slate-200">
                  Tenant quota exceeded on rate-limiter: IP 198.51.100.41 hit 50k req/min
                </span>
              </div>
              <span className="text-slate-400 text-[10px] shrink-0">4 mins ago</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00D69A]/15 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/20">
                  200 OK
                </span>
                <span className="text-slate-800 dark:text-slate-200">
                  Cross-region quorum sync confirmed with Blake3 cryptographic sign
                </span>
              </div>
              <span className="text-slate-400 text-[10px] shrink-0">8 mins ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

