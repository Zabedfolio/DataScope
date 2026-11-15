"use client";

import React from "react";
import { StreamRecord, ViewDensity, ColumnConfig, SortField, SortDirection } from "../types";

interface DataGridProps {
  records: StreamRecord[];
  density: ViewDensity;
  columns: ColumnConfig[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  selectedRecord: StreamRecord | null;
  onSelectRecord: (record: StreamRecord) => void;
  onResetFilters: () => void;
  newlyIngestedIds?: Set<string>;
}

export function DataGrid({
  records,
  density,
  columns,
  sortField,
  sortDirection,
  onSort,
  selectedRecord,
  onSelectRecord,
  onResetFilters,
  newlyIngestedIds,
}: DataGridProps) {
  const isColVisible = (key: ColumnConfig["key"]) => columns.find((c) => c.key === key)?.visible ?? true;

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-[#00D69A]/15 text-[#009E73] dark:text-[#00D69A] border-[#00D69A]/30";
    if (status >= 400 && status < 500) return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
    return "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30";
  };

  const getMethodBadge = (method: StreamRecord["method"]) => {
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

  const rowPadding = density === "compact" ? "py-2 px-3" : "py-3.5 px-4";

  return (
    <div className="relative w-full flex-1 overflow-x-auto bg-white dark:bg-[#061418]">
      {/* Desktop / Tablet Tabular Grid */}
      <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[760px]">
        {/* Sticky Table Header */}
        <thead className="sticky top-0 z-20 bg-slate-50/95 dark:bg-[#07171C]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
          <tr>
            {isColVisible("timestamp") && (
              <th scope="col" className="py-2.5 px-4">
                <button
                  type="button"
                  onClick={() => onSort("timestamp")}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Time {sortField === "timestamp" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
            )}

            {isColVisible("id") && (
              <th scope="col" className="py-2.5 px-4 sticky left-0 z-10 bg-slate-50/95 dark:bg-[#07171C]/95">
                <button
                  type="button"
                  onClick={() => onSort("id")}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Stream ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
            )}

            {isColVisible("service") && (
              <th scope="col" className="py-2.5 px-4">
                <button
                  type="button"
                  onClick={() => onSort("service")}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Service / Method {sortField === "service" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
            )}

            {isColVisible("cluster") && (
              <th scope="col" className="py-2.5 px-4">
                <button
                  type="button"
                  onClick={() => onSort("cluster")}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cluster {sortField === "cluster" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
            )}

            <th scope="col" className="py-2.5 px-4">Summary Payload</th>

            {isColVisible("latency") && (
              <th scope="col" className="py-2.5 px-4 text-right">
                <button
                  type="button"
                  onClick={() => onSort("latency")}
                  className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors ml-auto"
                >
                  Latency {sortField === "latency" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
            )}

            {isColVisible("status") && (
              <th scope="col" className="py-2.5 px-4 text-center">
                <button
                  type="button"
                  onClick={() => onSort("status")}
                  className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors mx-auto"
                >
                  Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
            )}

            <th scope="col" className="py-2.5 px-4 text-right">Inspect</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
          {records.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-16 text-center text-slate-500 dark:text-slate-400">
                <p className="text-sm">No streaming packets match the active query filter.</p>
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="mt-3 text-xs text-[#00B884] dark:text-[#00D69A] underline underline-offset-4 hover:opacity-80"
                >
                  Reset active filters
                </button>
              </td>
            </tr>
          ) : (
            records.map((rec) => {
              const isSelected = selectedRecord?.id === rec.id;
              const isNew = newlyIngestedIds?.has(rec.id);
              return (
                <tr
                  key={rec.id}
                  onClick={() => onSelectRecord(rec)}
                  className={`group cursor-pointer transition-colors ${
                    isNew
                      ? "bg-[#00D69A]/30 dark:bg-[#00D69A]/35 transition-all duration-700 animate-in fade-in"
                      : isSelected
                      ? "bg-[#00D69A]/15 dark:bg-[#00D69A]/20"
                      : "hover:bg-[#00D69A]/[0.05] dark:hover:bg-[#00D69A]/[0.06]"
                  }`}
                >
                  {isColVisible("timestamp") && (
                    <td className={`${rowPadding} text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs`}>
                      {rec.timestamp}
                    </td>
                  )}

                  {isColVisible("id") && (
                    <td className={`${rowPadding} font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap sticky left-0 z-10 bg-white dark:bg-[#061418] group-hover:bg-[#f2faf7] dark:group-hover:bg-[#091e23]`}>
                      <span className="group-hover:text-[#00B884] dark:group-hover:text-[#00D69A] transition-colors">
                        {rec.id}
                      </span>
                    </td>
                  )}

                  {isColVisible("service") && (
                    <td className={`${rowPadding} whitespace-nowrap`}>
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getMethodBadge(rec.method)}`}>
                          {rec.method}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 text-xs">
                          {rec.service}
                        </span>
                      </div>
                    </td>
                  )}

                  {isColVisible("cluster") && (
                    <td className={`${rowPadding} text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs`}>
                      {rec.cluster}
                    </td>
                  )}

                  <td className={`${rowPadding} text-slate-600 dark:text-slate-300 font-sans text-xs max-w-sm truncate`}>
                    {rec.summary}
                  </td>

                  {isColVisible("latency") && (
                    <td className={`${rowPadding} text-right whitespace-nowrap`}>
                      <span className={`text-xs font-semibold ${
                        rec.latency > 50
                          ? "text-rose-600 dark:text-rose-400"
                          : rec.latency > 20
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-700 dark:text-[#00D69A]"
                      }`}>
                        {rec.latency < 1 ? `${rec.latency}ms` : `${rec.latency.toFixed(1)}ms`}
                      </span>
                    </td>
                  )}

                  {isColVisible("status") && (
                    <td className={`${rowPadding} text-center whitespace-nowrap`}>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(rec.status)}`}>
                        {rec.status}
                      </span>
                    </td>
                  )}

                  <td className={`${rowPadding} text-right whitespace-nowrap`}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRecord(rec);
                      }}
                      className="px-2.5 py-1 rounded text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all"
                      aria-label={`Inspect packet ${rec.id}`}
                    >
                      Inspect &rarr;
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

