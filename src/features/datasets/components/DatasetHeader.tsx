"use client";

import React from "react";

interface DatasetHeaderProps {
  totalDatasets: number;
  totalRecordsFormatted: string;
  totalStorageFormatted: string;
  totalBandwidth: string;
}

export function DatasetHeader({
  totalDatasets,
  totalRecordsFormatted,
  totalStorageFormatted,
  totalBandwidth,
}: DatasetHeaderProps) {
  return (
    <div className="w-full border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Header Title & Mission */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#00D69A]/10 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/20 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-pulse" />
              Connected Data Catalog
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Dataset Library
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Explore active data streams, inspect auto-inferred schemas, and launch zero-delay queries across distributed enterprise storage clusters.
            </p>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
              <div className="text-[10px] text-slate-400 uppercase">Datasets</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{totalDatasets} Active</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
              <div className="text-[10px] text-slate-400 uppercase">Records</div>
              <div className="text-lg font-extrabold text-[#008A64] dark:text-[#00D69A] mt-0.5">{totalRecordsFormatted}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
              <div className="text-[10px] text-slate-400 uppercase">Volume</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{totalStorageFormatted}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
              <div className="text-[10px] text-slate-400 uppercase">Bandwidth</div>
              <div className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5">{totalBandwidth}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

