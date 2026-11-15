"use client";

import React from "react";
import Link from "next/link";
import { StreamRecord } from "@/features/explorer/types";

interface SearchResultsPreviewProps {
  results: StreamRecord[];
  executionTimeMs: number;
}

export function SearchResultsPreview({
  results,
  executionTimeMs,
}: SearchResultsPreviewProps) {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-[#00D69A]/15 text-[#009E73] dark:text-[#00D69A] border-[#00D69A]/30";
    if (status >= 400 && status < 500) return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
    return "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30";
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 shadow-xl overflow-hidden mt-6">
      {/* Results Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#00D69A]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Query Execution Results ({results.length} matches)
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#008A64] dark:text-[#00D69A] font-bold">
            Execution: {executionTimeMs}ms
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-500">Scanned: 1.2M rows</span>
        </div>
      </div>

      {/* Table Results */}
      <div className="overflow-x-auto">
        {results.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-slate-500">
            No stream records match the current AST predicate tree.
          </div>
        ) : (
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50/80 dark:bg-white/[0.01] border-b border-slate-200/80 dark:border-white/10 text-slate-400 text-[10px] uppercase">
              <tr>
                <th scope="col" className="py-2.5 px-4">Time</th>
                <th scope="col" className="py-2.5 px-4">Stream ID</th>
                <th scope="col" className="py-2.5 px-4">Service</th>
                <th scope="col" className="py-2.5 px-4 font-sans">Summary</th>
                <th scope="col" className="py-2.5 px-4 text-right">Latency</th>
                <th scope="col" className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {results.slice(0, 8).map((rec) => (
                <tr key={rec.id} className="hover:bg-[#00D69A]/[0.05] transition-colors">
                  <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{rec.timestamp}</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">{rec.id}</td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{rec.service}</td>
                  <td className="py-2.5 px-4 font-sans text-xs text-slate-600 dark:text-slate-300 max-w-sm truncate">{rec.summary}</td>
                  <td className="py-2.5 px-4 text-right text-emerald-600 dark:text-[#00D69A] font-bold whitespace-nowrap">{rec.latency}ms</td>
                  <td className="py-2.5 px-4 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(rec.status)}`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer link to explorer */}
      <div className="px-5 py-3 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] flex items-center justify-between text-xs font-mono">
        <span className="text-slate-500">Showing top results</span>
        <Link
          href="/dashboard/explorer"
          className="text-[#008A64] dark:text-[#00D69A] hover:underline font-bold"
        >
          Open full results in Explorer &rarr;
        </Link>
      </div>
    </div>
  );
}

