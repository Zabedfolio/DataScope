"use client";

import React, { useState, useEffect } from "react";
import { StreamRecord } from "../types";

interface RecordDrawerProps {
  record: StreamRecord | null;
  onClose: () => void;
}

export function RecordDrawer({ record, onClose }: RecordDrawerProps) {
  const [activeTab, setActiveTab] = useState<"json" | "hex">("json");
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!record) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(record.payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-[#00D69A]/15 text-[#009E73] dark:text-[#00D69A] border-[#00D69A]/30";
    if (status >= 400 && status < 500) return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
    return "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30";
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[540px] bg-white dark:bg-[#08181D] shadow-2xl border-l border-slate-200 dark:border-white/10 flex flex-col animate-in slide-in-from-right duration-250"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getStatusColor(record.status)}`}>
              {record.status}
            </span>
            <div>
              <h2 id="drawer-title" className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                {record.id}
              </h2>
              <div className="text-[11px] font-mono text-slate-500">
                {record.cluster} • {record.service}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {copied ? "✓ Copied" : "Copy JSON"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              aria-label="Close drawer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Inspection Tab Switcher */}
        <div className="flex items-center px-5 border-b border-slate-200/80 dark:border-white/10 bg-white dark:bg-transparent text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("json")}
            className={`py-2.5 px-3 border-b-2 font-semibold transition-all ${
              activeTab === "json"
                ? "border-[#00D69A] text-slate-900 dark:text-white"
                : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Decoded Payload (JSON)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hex")}
            className={`py-2.5 px-3 border-b-2 font-semibold transition-all ${
              activeTab === "hex"
                ? "border-[#00D69A] text-slate-900 dark:text-white"
                : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Raw Byte Inspector (Hex)
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Summary Box */}
          <div className="rounded-xl bg-slate-50 dark:bg-white/[0.02] p-3.5 border border-slate-200/80 dark:border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Packet Summary
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {record.summary}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                Latency: {record.latency}ms
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                Method: {record.method}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                Time: {record.timestamp}
              </span>
            </div>
          </div>

          {/* Tab 1: Decoded JSON */}
          {activeTab === "json" && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span>STRUCTURED ZERO-COPY PAYLOAD</span>
                <span className="text-[#00D69A]">Memory-Mapped</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                <code>{JSON.stringify(record.payload, null, 2)}</code>
              </pre>
            </div>
          )}

          {/* Tab 2: Raw Hex Viewer */}
          {activeTab === "hex" && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span>RAW BYTE BUFFER OFFSETS</span>
                <span className="text-cyan-400">PCIe Ring View</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                <code>{record.rawHex}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="px-5 py-3 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.01] flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Press &apos;Esc&apos; to dismiss</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-700 dark:text-slate-300 hover:text-[#00D69A] font-semibold"
          >
            Close &rarr;
          </button>
        </div>
      </div>
    </>
  );
}

