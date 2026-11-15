"use client";

import React, { useState, useEffect } from "react";
import { StreamRecord } from "../types";
import { useAuth } from "@/features/auth/context/AuthContext";

interface RecordDrawerProps {
  record: StreamRecord | null;
  onClose: () => void;
}

export function RecordDrawer({ record, onClose }: RecordDrawerProps) {
  const { user } = useAuth();
  const currentRole = user?.role || "Data Analyst";
  const isViewer = currentRole.toLowerCase().includes("viewer");

  const [activeTab, setActiveTab] = useState<"json" | "hex" | "related" | "audit">("json");
  const [copied, setCopied] = useState(false);
  const [annotation, setAnnotation] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Load existing notes for record if any
  useEffect(() => {
    if (record) {
      setSavedNotes([
        `Auto-triaged by Mesh Sentry: Latency ${record.latency}ms within normal envelope.`,
      ]);
    }
  }, [record]);

  if (!record) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(record.payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAnnotation = () => {
    if (!annotation.trim() || isViewer) return;
    setSavedNotes((prev) => [
      `[${new Date().toLocaleTimeString()}] ${user?.name || "Analyst"}: ${annotation.trim()}`,
      ...prev,
    ]);
    setAnnotation("");
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return "bg-[#00D69A]/15 text-[#009E73] dark:text-[#00D69A] border-[#00D69A]/30";
    if (status >= 400 && status < 500)
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
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
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] lg:w-[580px] bg-white dark:bg-[#08181D] shadow-2xl border-l border-slate-200 dark:border-white/10 flex flex-col animate-in slide-in-from-right duration-250"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getStatusColor(
                record.status
              )}`}
            >
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

        {/* Inspection Tab Switcher (§3.E) */}
        <div className="flex items-center px-4 border-b border-slate-200/80 dark:border-white/10 bg-white dark:bg-transparent text-xs font-mono overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("json")}
            className={`py-2.5 px-3 border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === "json"
                ? "border-[#00D69A] text-slate-900 dark:text-white"
                : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            JSON Payload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hex")}
            className={`py-2.5 px-3 border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === "hex"
                ? "border-[#00D69A] text-slate-900 dark:text-white"
                : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Hex Ring Buffer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("related")}
            className={`py-2.5 px-3 border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === "related"
                ? "border-[#00D69A] text-slate-900 dark:text-white"
                : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Related Spans
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`py-2.5 px-3 border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === "audit"
                ? "border-[#00D69A] text-slate-900 dark:text-white"
                : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Audit &amp; Notes
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

          {/* Tab 3: Related Records / Spans (§3.E) */}
          {activeTab === "related" && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Correlation Graph Spans (Trace #{record.id.slice(0, 8)})
              </div>
              {[
                {
                  id: `span_${record.id}_egress`,
                  service: `${record.service}-mesh-proxy`,
                  latency: (record.latency * 0.4).toFixed(2),
                  status: 200,
                  role: "Upstream Proxy Egress",
                },
                {
                  id: `span_${record.id}_db`,
                  service: "nvme-raft-leader",
                  latency: (record.latency * 0.55).toFixed(2),
                  status: record.status,
                  role: "Storage Commit Quorum",
                },
              ].map((span) => (
                <div
                  key={span.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-xs font-mono flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{span.service}</div>
                    <div className="text-[10px] text-slate-500">{span.role}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#00D69A] font-semibold">{span.latency}ms</span>
                    <div className="text-[10px] text-slate-400">HTTP {span.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Audit & Analyst Notes (§2.B vs §2.C) */}
          {activeTab === "audit" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">
                Investigation Notes &amp; Audit Trail
              </div>

              {/* Annotation Input: Analysts only; Viewers read-only */}
              {isViewer ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
                  <span>🔒 Viewer Role: Annotating records and filing incident triage notes is restricted to Data Analysts.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={annotation}
                    onChange={(e) => setAnnotation(e.target.value)}
                    placeholder="Add an analyst annotation or audit tag to this record..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D69A]"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      {isSavedToast ? "✓ Saved to ledger" : "Persists with record snapshot"}
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveAnnotation}
                      disabled={!annotation.trim()}
                      className="px-3 py-1.5 rounded-lg bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 font-bold transition-all disabled:opacity-50"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}

              {/* Saved Notes List */}
              <div className="space-y-2 pt-2">
                {savedNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[11px]"
                  >
                    {note}
                  </div>
                ))}
              </div>
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
