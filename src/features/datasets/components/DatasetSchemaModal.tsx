"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { CatalogDataset } from "../types";

interface DatasetSchemaModalProps {
  dataset: CatalogDataset | null;
  onClose: () => void;
}

export function DatasetSchemaModal({ dataset, onClose }: DatasetSchemaModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!dataset) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="schema-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#091B21] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D69A] animate-pulse" />
              <h2 id="schema-modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {dataset.name}
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              Cluster: {dataset.cluster} • {dataset.syncFrequency}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body: Field Dictionary */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
            <span>AUTO-INFERRED STREAM SCHEMA DICTIONARY</span>
            <span className="text-[#00D69A] font-bold">{dataset.schemaFields.length} Fields Defined</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10 text-slate-400 text-[10px] uppercase">
                <tr>
                  <th scope="col" className="py-2.5 px-3.5">Field Name</th>
                  <th scope="col" className="py-2.5 px-3.5">Wire Type</th>
                  <th scope="col" className="py-2.5 px-3.5 text-center">Indexed</th>
                  <th scope="col" className="py-2.5 px-3.5 text-center">Nullable</th>
                  <th scope="col" className="py-2.5 px-3.5 font-sans">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {dataset.schemaFields.map((field) => (
                  <tr key={field.name} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">
                      {field.name}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-white/5 text-emerald-600 dark:text-[#00D69A] border border-slate-200 dark:border-white/10">
                        {field.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      {field.indexed ? (
                        <span className="text-emerald-500 font-bold" title="Indexed for sub-0.4ms search">✓ Yes</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-center text-slate-400">
                      {field.nullable ? "Yes" : "No"}
                    </td>
                    <td className="py-2.5 px-3.5 font-sans text-xs text-slate-600 dark:text-slate-300">
                      {field.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.01] flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Press &apos;Esc&apos; or click outside to dismiss</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Close
            </button>
            <Link
              href="/explorer"
              className="px-4 py-1.5 rounded-lg bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 font-bold transition-all"
            >
              Open in Explorer &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

