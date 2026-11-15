"use client";

import React, { useState } from "react";

interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  scanTimeMs?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function TablePagination({
  page,
  pageSize,
  totalRecords,
  totalPages,
  scanTimeMs,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const [jumpPage, setJumpPage] = useState("");

  const startRecord = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalRecords);

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpPage, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      onPageChange(target);
      setJumpPage("");
    }
  };

  return (
    <div className="w-full border-t border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-[#07171C]/90 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs select-none">
      {/* Left: Record Range & Scan Telemetry */}
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <span>
          Showing{" "}
          <strong className="text-slate-900 dark:text-white font-bold">
            {startRecord.toLocaleString()}
          </strong>
          –
          <strong className="text-slate-900 dark:text-white font-bold">
            {endRecord.toLocaleString()}
          </strong>{" "}
          of{" "}
          <strong className="text-slate-900 dark:text-white font-bold">
            {totalRecords.toLocaleString()}
          </strong>{" "}
          records
        </span>

        {scanTimeMs !== undefined && (
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#008A64] dark:text-[#00D69A] border border-emerald-500/20 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-pulse" />
            Scan: {scanTimeMs}ms • Indexed
          </span>
        )}
      </div>

      {/* Right: Controls (Page Size + Navigation + Jump) */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Page Size Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#00D69A]"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Page Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            title="First Page"
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors"
          >
            «
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
          >
            <span>‹ Prev</span>
          </button>

          <span className="px-2.5 py-1 rounded-lg bg-[#00D69A]/15 text-[#008A64] dark:text-[#00D69A] font-bold">
            Page {page} of {totalPages || 1}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
          >
            <span>Next ›</span>
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            title="Last Page"
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors"
          >
            »
          </button>
        </div>

        {/* Quick Jump Input */}
        <form onSubmit={handleJumpSubmit} className="hidden sm:flex items-center gap-1">
          <label htmlFor="jump-page" className="sr-only">
            Jump to page
          </label>
          <input
            id="jump-page"
            type="number"
            min={1}
            max={totalPages}
            placeholder="Go to"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            className="w-16 px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00D69A]"
          />
          <button
            type="submit"
            className="px-2 py-1 rounded-lg bg-slate-200/80 dark:bg-white/10 hover:bg-[#00D69A] hover:text-slate-950 text-slate-700 dark:text-slate-300 font-bold transition-colors"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}
