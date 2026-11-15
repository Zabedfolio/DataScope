"use client";

import React, { useState, useRef, useEffect } from "react";

export interface HistoryItem {
  id: string;
  queryText: string;
  resultCount: number;
  executionDurationMs: number;
  createdAt: string;
}

const DEFAULT_HISTORY: HistoryItem[] = [
  {
    id: "sh_1",
    queryText: "status:500 service:storage-node-03",
    resultCount: 42,
    executionDurationMs: 0.28,
    createdAt: "10 mins ago",
  },
  {
    id: "sh_2",
    queryText: "latency:>20ms method:BATCH",
    resultCount: 128,
    executionDurationMs: 0.35,
    createdAt: "25 mins ago",
  },
  {
    id: "sh_3",
    queryText: "country:Germany status:200",
    resultCount: 3210,
    executionDurationMs: 0.42,
    createdAt: "1 hour ago",
  },
  {
    id: "sh_4",
    queryText: "cluster:eu-central-1a NVMe",
    resultCount: 890,
    executionDurationMs: 0.31,
    createdAt: "3 hours ago",
  },
];

interface SearchHistoryDropdownProps {
  onSelectQuery: (query: string) => void;
  className?: string;
}

export function SearchHistoryDropdown({
  onSelectQuery,
  className = "",
}: SearchHistoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(DEFAULT_HISTORY);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Recent Search History"
        aria-label="Recent Search History"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-mono"
      >
        <svg className="w-3.5 h-3.5 text-[#00D69A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="hidden sm:inline">History</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#08181E] shadow-2xl p-2 z-50 text-xs font-mono animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Recent Query History
            </span>
            <span className="text-[10px] text-slate-500">
              {history.length} searches recorded
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto py-1 divide-y divide-slate-100 dark:divide-white/5">
            {history.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">
                No recent searches.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectQuery(item.queryText);
                    setIsOpen(false);
                  }}
                  className="p-2.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors group flex items-start justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#00B884] dark:group-hover:text-[#00D69A] truncate text-xs">
                      {item.queryText}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span>{item.createdAt}</span>
                      <span>•</span>
                      <span className="text-[#008A64] dark:text-[#00D69A] font-bold">
                        {item.resultCount.toLocaleString()} matches
                      </span>
                      <span>•</span>
                      <span>{item.executionDurationMs}ms</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from history"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

