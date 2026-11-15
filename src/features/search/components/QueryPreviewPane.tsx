"use client";

import React, { useState } from "react";
import { CompiledQuery } from "../types";

interface QueryPreviewPaneProps {
  compiled: CompiledQuery;
  onExecute: () => void;
  isExecuting: boolean;
  onSaveView?: () => void;
}

export function QueryPreviewPane({
  compiled,
  onExecute,
  isExecuting,
  onSaveView,
}: QueryPreviewPaneProps) {
  const [activeTab, setActiveTab] = useState<"sql" | "cli">("sql");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = activeTab === "sql" ? compiled.sql : compiled.cliCommand;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-900 shadow-xl overflow-hidden text-xs font-mono">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-2">
          {/* Tabs */}
          <button
            type="button"
            onClick={() => setActiveTab("sql")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === "sql"
                ? "bg-[#00D69A] text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            SQL Output
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cli")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === "cli"
                ? "bg-[#00D69A] text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            CLI Command
          </button>
        </div>

        {/* Latency & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#00D69A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-ping" />
            <span>AVX-512 SIMD: ~{compiled.estimatedLatencyMs}ms</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-4 sm:p-5 overflow-x-auto text-emerald-400 leading-relaxed max-h-48">
        <pre>
          <code>{activeTab === "sql" ? compiled.sql : `$ ${compiled.cliCommand}`}</code>
        </pre>
      </div>

      {/* Action Footer */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400">
          Compiled using DataScope AST Vector Engine v2.4
        </span>

        <div className="flex items-center gap-2">
          {onSaveView && (
            <button
              type="button"
              onClick={onSaveView}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white transition-all"
            >
              <svg className="w-3.5 h-3.5 text-[#00D69A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>Save as View</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExecute}
            disabled={isExecuting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 shadow-md shadow-[#00D69A]/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Scanning Shards...</span>
              </>
            ) : (
              <>
                <span>Execute Vectorized Query</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

