"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SavedViewEntity } from "../types";

interface ViewCardProps {
  view: SavedViewEntity;
  onDelete: (id: string) => void;
  onToggleShare: (id: string) => void;
  isViewer?: boolean;
  isDatasetUnauthorized?: boolean;
}

export function ViewCard({
  view,
  onDelete,
  onToggleShare,
  isViewer = false,
  isDatasetUnauthorized = false,
}: ViewCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/dashboard/views#${view.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const datasetParam =
    view.datasetId === "ds_fin_orderbook"
      ? "financial-l2"
      : view.datasetId === "ds_payment_ledger"
      ? "payment-ledger"
      : view.datasetId === "ds_iot_sensor_mesh"
      ? "iot-sensors"
      : "k8s-telemetry";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 p-5 sm:p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:border-[#00D69A]/40 hover:-translate-y-1">
      <div>
        {/* Card Header: Dataset Badge & Team Sharing */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00D69A]/10 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A]" />
              {view.datasetName}
            </span>

            {isDatasetUnauthorized && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                🔒 Enterprise
              </span>
            )}
          </div>

          {/* Sharing Tag: Static badge for Viewer; Interactive toggle button for Analyst/Admin */}
          {isViewer ? (
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                view.sharedWithTeam
                  ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30"
                  : "bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10"
              }`}
            >
              {view.sharedWithTeam ? "Shared with Team" : "Private View"}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onToggleShare(view.id)}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors ${
                view.sharedWithTeam
                  ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20"
                  : "bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-200/60"
              }`}
              title="Click to toggle sharing state"
            >
              {view.sharedWithTeam ? "Shared with Team" : "Private View"}
            </button>
          )}
        </div>

        {/* View Title & Description */}
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#00B884] dark:group-hover:text-[#00D69A] transition-colors">
          {view.title}
        </h2>
        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {view.description}
        </p>

        {/* Filter Predicates Pills */}
        <div className="mt-4">
          <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5">
            Active Query Predicates
          </div>
          <div className="flex flex-wrap gap-1.5 font-mono">
            {view.filterRules.map((rule) => (
              <span
                key={rule}
                className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
              >
                {rule}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics & Actions Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/5 space-y-3 font-mono text-xs">
        {/* Row 1: Telemetry Stats */}
        <div className="flex items-center justify-between text-slate-500 text-[11px] whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 dark:text-[#00D69A] font-bold">
              {view.lastRunLatencyMs}ms
            </span>
            <span>•</span>
            <span className="whitespace-nowrap">{view.recordsMatched} matches</span>
          </div>
          <span className="text-slate-400 text-[10px] whitespace-nowrap">{view.updatedAt}</span>
        </div>

        {/* Row 2: Action Buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors whitespace-nowrap text-xs"
              title="Copy shareable explorer URL"
            >
              {copied ? "✓ Copied" : "Share"}
            </button>

            {/* Delete button: Only visible for Data Analysts and Admins; Hidden for Viewers */}
            {!isViewer && (
              <button
                type="button"
                onClick={() => onDelete(view.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                title="Delete saved view"
                aria-label="Delete saved view"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>

          <Link
            href={`/dashboard/explorer?dataset=${datasetParam}&view=${view.id}`}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap text-xs shrink-0 ${
              isDatasetUnauthorized
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                : "bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 shadow-sm"
            }`}
          >
            <span>{isDatasetUnauthorized ? "🔒 Requires Clearance" : "Open →"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
