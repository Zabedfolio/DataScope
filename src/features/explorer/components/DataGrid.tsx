"use client";

import React, { useState } from "react";
import { StreamRecord, ViewDensity, ColumnConfig, SortField, SortDirection } from "../types";

interface DataGridProps {
  records: StreamRecord[];
  density: ViewDensity;
  columns: ColumnConfig[];
  sortField: SortField;
  sortDirection: SortDirection;
  sortRules?: Array<{ field: string; direction: "asc" | "desc" }>;
  onSort: (field: SortField, isMulti?: boolean) => void;
  selectedRecord: StreamRecord | null;
  onSelectRecord: (record: StreamRecord) => void;
  onResetFilters: () => void;
  newlyIngestedIds?: Set<string>;
  searchQuery?: string;
  userRole?: string;
}

function highlightMatch(text: string, query?: string) {
  if (!query || !query.trim()) return text;
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return text;
  const pattern = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-[#00D69A]/30 text-emerald-950 dark:text-[#00D69A] font-semibold px-0.5 rounded"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function DataGrid({
  records,
  density,
  columns,
  sortField,
  sortDirection,
  sortRules,
  onSort,
  selectedRecord,
  onSelectRecord,
  onResetFilters,
  newlyIngestedIds,
  searchQuery = "",
  userRole = "Data Analyst",
}: DataGridProps) {
  const isViewer = userRole.toLowerCase().includes("viewer");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [copiedBatch, setCopiedBatch] = useState(false);

  const isColVisible = (key: ColumnConfig["key"]) =>
    columns.find((c) => c.key === key)?.visible ?? true;

  // Batch selection handlers (§3.B, §7)
  const isAllSelected = records.length > 0 && selectedIds.size === records.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < records.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(records.map((r) => r.id)));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopySelectedIds = () => {
    const text = Array.from(selectedIds).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
  };

  const handleExportSelected = () => {
    if (isViewer) return;
    const selectedRecords = records.filter((r) => selectedIds.has(r.id));
    const header = "id,timestamp,service,method,cluster,status,latency,summary\n";
    const rows = selectedRecords
      .map(
        (r) =>
          `"${r.id}","${r.timestamp}","${r.service}","${r.method}","${r.cluster}",${r.status},${r.latency},"${r.summary.replace(/"/g, '""')}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `datascope_selected_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSortBadge = (field: SortField) => {
    if (sortRules && sortRules.length > 0) {
      const idx = sortRules.findIndex((r) => r.field === field);
      if (idx !== -1) {
        const rule = sortRules[idx];
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#00D69A]/20 text-[#008A64] dark:text-[#00D69A] font-bold text-[10px]">
            {sortRules.length > 1 && <span className="text-[9px] opacity-75">{idx + 1}</span>}
            <span>{rule.direction === "asc" ? "↑" : "↓"}</span>
          </span>
        );
      }
    }
    if (sortField === field) {
      return (
        <span className="text-[#008A64] dark:text-[#00D69A] font-bold">
          {sortDirection === "asc" ? "↑" : "↓"}
        </span>
      );
    }
    return null;
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return "bg-[#00D69A]/15 text-[#009E73] dark:text-[#00D69A] border-[#00D69A]/30";
    if (status >= 400 && status < 500)
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
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
      <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[800px]">
        {/* Sticky Table Header */}
        <thead className="sticky top-0 z-20 bg-slate-50/95 dark:bg-[#07171C]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
          <tr>
            {/* Row Selection Checkbox Header (§7) */}
            <th scope="col" className="py-2.5 px-3 w-10 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected;
                }}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-[#00D69A] focus:ring-[#00D69A] cursor-pointer"
                title="Select all visible records"
                aria-label="Select all visible records"
              />
            </th>

            {isColVisible("timestamp") && (
              <th scope="col" className="py-2.5 px-4">
                <button
                  type="button"
                  onClick={(e) => onSort("timestamp", e.shiftKey)}
                  title="Click to sort, Shift + Click for multi-column sort"
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span>Time</span>
                  {getSortBadge("timestamp")}
                </button>
              </th>
            )}

            {isColVisible("id") && (
              <th scope="col" className="py-2.5 px-4 sticky left-0 z-10 bg-slate-50/95 dark:bg-[#07171C]/95">
                <button
                  type="button"
                  onClick={(e) => onSort("id", e.shiftKey)}
                  title="Click to sort, Shift + Click for multi-column sort"
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span>Stream ID</span>
                  {getSortBadge("id")}
                </button>
              </th>
            )}

            {isColVisible("service") && (
              <th scope="col" className="py-2.5 px-4">
                <button
                  type="button"
                  onClick={(e) => onSort("service", e.shiftKey)}
                  title="Click to sort, Shift + Click for multi-column sort"
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span>Service / Method</span>
                  {getSortBadge("service")}
                </button>
              </th>
            )}

            {isColVisible("cluster") && (
              <th scope="col" className="py-2.5 px-4">
                <button
                  type="button"
                  onClick={(e) => onSort("cluster", e.shiftKey)}
                  title="Click to sort, Shift + Click for multi-column sort"
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span>Cluster</span>
                  {getSortBadge("cluster")}
                </button>
              </th>
            )}

            <th scope="col" className="py-2.5 px-4">Summary Payload</th>

            {isColVisible("latency") && (
              <th scope="col" className="py-2.5 px-4 text-right">
                <button
                  type="button"
                  onClick={(e) => onSort("latency", e.shiftKey)}
                  title="Click to sort, Shift + Click for multi-column sort"
                  className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors ml-auto"
                >
                  <span>Latency</span>
                  {getSortBadge("latency")}
                </button>
              </th>
            )}

            {isColVisible("status") && (
              <th scope="col" className="py-2.5 px-4 text-center">
                <button
                  type="button"
                  onClick={(e) => onSort("status", e.shiftKey)}
                  title="Click to sort, Shift + Click for multi-column sort"
                  className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors mx-auto"
                >
                  <span>Status</span>
                  {getSortBadge("status")}
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
              <td colSpan={9} className="py-16 text-center text-slate-500 dark:text-slate-400">
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
              const isChecked = selectedIds.has(rec.id);
              const isNew = newlyIngestedIds?.has(rec.id);
              return (
                <tr
                  key={rec.id}
                  onClick={() => onSelectRecord(rec)}
                  className={`group cursor-pointer transition-colors ${
                    isChecked
                      ? "bg-[#00D69A]/10 dark:bg-[#00D69A]/15"
                      : isNew
                      ? "bg-[#00D69A]/30 dark:bg-[#00D69A]/35 transition-all duration-700 animate-in fade-in"
                      : isSelected
                      ? "bg-[#00D69A]/15 dark:bg-[#00D69A]/20"
                      : "hover:bg-[#00D69A]/[0.05] dark:hover:bg-[#00D69A]/[0.06]"
                  }`}
                >
                  {/* Row Checkbox (§7) */}
                  <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => handleToggleRow(rec.id, e as unknown as React.MouseEvent)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-[#00D69A] focus:ring-[#00D69A] cursor-pointer"
                      aria-label={`Select record ${rec.id}`}
                    />
                  </td>

                  {isColVisible("timestamp") && (
                    <td className={`${rowPadding} text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs`}>
                      {rec.timestamp}
                    </td>
                  )}

                  {isColVisible("id") && (
                    <td className={`${rowPadding} font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap sticky left-0 z-10 bg-white dark:bg-[#061418] group-hover:bg-[#f2faf7] dark:group-hover:bg-[#091e23]`}>
                      <span className="group-hover:text-[#00B884] dark:group-hover:text-[#00D69A] transition-colors">
                        {highlightMatch(rec.id, searchQuery)}
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
                          {highlightMatch(rec.service, searchQuery)}
                        </span>
                      </div>
                    </td>
                  )}

                  {isColVisible("cluster") && (
                    <td className={`${rowPadding} text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs`}>
                      {highlightMatch(rec.cluster, searchQuery)}
                    </td>
                  )}

                  <td className={`${rowPadding} text-slate-600 dark:text-slate-300 font-sans text-xs max-w-sm truncate`}>
                    {highlightMatch(rec.summary, searchQuery)}
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

      {/* Floating Batch Action Bar (§3.B, §7) */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-[#07171C]/95 text-white shadow-2xl border border-[#00D69A]/40 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200 font-mono text-xs">
          <div className="flex items-center gap-2 pr-2 border-r border-slate-700">
            <span className="w-2 h-2 rounded-full bg-[#00D69A] animate-ping" />
            <span className="font-bold text-white">
              {selectedIds.size} {selectedIds.size === 1 ? "record" : "records"} selected
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopySelectedIds}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {copiedBatch ? "✓ Copied" : "Copy IDs"}
          </button>

          {isViewer ? (
            <span
              className="px-3 py-1.5 rounded-xl bg-slate-800/60 text-slate-500 cursor-not-allowed text-[11px]"
              title="Exporting records requires Data Analyst or Administrator role."
            >
              🔒 Export CSV (Viewer Locked)
            </span>
          ) : (
            <button
              type="button"
              onClick={handleExportSelected}
              className="px-3 py-1.5 rounded-xl bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 font-bold transition-all shadow-md shadow-[#00D69A]/20"
            >
              Export Selected (CSV)
            </button>
          )}

          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            className="text-slate-400 hover:text-white px-2 py-1 transition-colors"
            title="Deselect all rows"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
