"use client";

import React from "react";
import { DatasetCategory } from "../types";

const CATEGORIES: DatasetCategory[] = ["All", "Streaming", "Financial", "Security", "IoT", "Infrastructure"];

interface DatasetFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: DatasetCategory;
  onSelectCategory: (cat: DatasetCategory) => void;
  viewMode: "grid" | "table";
  onChangeViewMode: (mode: "grid" | "table") => void;
  matchCount: number;
}

export function DatasetFilterBar({
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  viewMode,
  onChangeViewMode,
  matchCount,
}: DatasetFilterBarProps) {
  return (
    <div className="w-full border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.01] px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="dataset-search" className="sr-only">Search datasets</label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="dataset-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by dataset name, schema tag, cluster..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm font-sans rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D69A] transition-all"
          />
        </div>

        {/* Category Pills & View Switcher */}
        <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    isActive
                      ? "bg-[#00D69A] text-slate-950 font-bold shadow-sm"
                      : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Match Count Badge & View Mode Toggle */}
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-block text-xs font-mono text-slate-500 dark:text-slate-400">
              {matchCount} datasets
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-white/10 p-0.5 bg-white dark:bg-[#051013] text-xs shrink-0">
              <button
                type="button"
                onClick={() => onChangeViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#00D69A] text-slate-950 font-bold" : "text-slate-400 hover:text-slate-700 dark:hover:text-white"}`}
                title="Grid View"
                aria-label="Grid View"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onChangeViewMode("table")}
                className={`p-1.5 rounded ${viewMode === "table" ? "bg-[#00D69A] text-slate-950 font-bold" : "text-slate-400 hover:text-slate-700 dark:hover:text-white"}`}
                title="Table View"
                aria-label="Table View"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
