"use client";

import React from "react";
import Link from "next/link";
import { CatalogDataset } from "../types";

interface DatasetCardProps {
  dataset: CatalogDataset;
  onInspectSchema: (dataset: CatalogDataset) => void;
}

export function DatasetCard({ dataset, onInspectSchema }: DatasetCardProps) {
  const getAccessBadge = (level: CatalogDataset["accessLevel"]) => {
    switch (level) {
      case "Public":
        return "bg-emerald-500/10 text-emerald-700 dark:text-[#00D69A] border-emerald-500/30";
      case "Enterprise":
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30";
      case "Restricted":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:border-[#00D69A]/40 hover:-translate-y-1">
      <div>
        {/* Header: Access Badge & Category */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${getAccessBadge(dataset.accessLevel)}`}>
            {dataset.accessLevel}
          </span>
          <span className="text-[10px] font-mono uppercase text-slate-400">
            {dataset.category}
          </span>
        </div>

        {/* Dataset Title & Description */}
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#00B884] dark:group-hover:text-[#00D69A] transition-colors">
          {dataset.name}
        </h2>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {dataset.description}
        </p>

        {/* Primary Metrics Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 font-mono text-center">
          <div>
            <div className="text-[9px] uppercase text-slate-400">Records</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
              {(dataset.recordCount / 1000000).toFixed(1)}M
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase text-slate-400">Size</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
              {dataset.byteSizeFormatted}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase text-slate-400">Throughput</div>
            <div className="text-xs font-bold text-[#009E73] dark:text-[#00D69A] mt-0.5">
              {dataset.throughputRate}
            </div>
          </div>
        </div>

        {/* Schema Fields Preview */}
        <div className="mt-4">
          <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Inferred Schema ({dataset.schemaFields.length} fields)</span>
            <span className="text-[#00D69A] text-[9px]">{dataset.syncFrequency}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {dataset.schemaFields.slice(0, 4).map((f) => (
              <span
                key={f.name}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10"
              >
                {f.name}: <span className="text-emerald-600 dark:text-emerald-400">{f.type}</span>
              </span>
            ))}
            {dataset.schemaFields.length > 4 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400">
                +{dataset.schemaFields.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2 text-xs font-mono">
        <button
          type="button"
          onClick={() => onInspectSchema(dataset)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors"
        >
          Inspect Schema
        </button>

        <Link
          href="/explorer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 font-bold transition-all hover:scale-[1.02]"
        >
          <span>Open Explorer</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

