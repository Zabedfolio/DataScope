"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ViewHeader, ViewCard } from "@/features/views/components";
import { INITIAL_SAVED_VIEWS } from "@/features/views/constants/saved-views";
import { SavedViewEntity } from "@/features/views/types";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  useGetSavedViewsQuery,
  useCreateSavedViewMutation,
  useToggleShareSavedViewMutation,
  useDeleteSavedViewMutation,
} from "@/services/viewsApi";

export default function DashboardSavedViewsPage() {
  const { user } = useAuth();
  const currentRole = user?.role || "Data Analyst";
  const isViewer = currentRole.toLowerCase().includes("viewer");

  const { data: apiViews } = useGetSavedViewsQuery();
  const [createViewMutation] = useCreateSavedViewMutation();
  const [toggleShareMutation] = useToggleShareSavedViewMutation();
  const [deleteViewMutation] = useDeleteSavedViewMutation();

  const [views, setViews] = useState<SavedViewEntity[]>(INITIAL_SAVED_VIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "shared" | "private">("all");

  // Sync API data if available
  useEffect(() => {
    if (apiViews && apiViews.length > 0) {
      setViews(apiViews);
    }
  }, [apiViews]);

  // RBAC Gating (§2.C): Viewers can ONLY access shared views, never private views of analysts
  const authorizedViews = useMemo(() => {
    if (isViewer) {
      return views.filter((v) => v.sharedWithTeam);
    }
    return views;
  }, [views, isViewer]);

  // Filter logic
  const filteredViews = useMemo(() => {
    return authorizedViews.filter((v) => {
      if (!isViewer) {
        if (filterTab === "shared" && !v.sharedWithTeam) return false;
        if (filterTab === "private" && v.sharedWithTeam) return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        v.title.toLowerCase().includes(q) ||
        v.datasetName.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.filterRules.some((r) => r.toLowerCase().includes(q))
      );
    });
  }, [authorizedViews, isViewer, filterTab, searchQuery]);

  // Actions
  const handleDelete = async (id: string) => {
    if (isViewer) return; // Blocked for Viewer
    setViews((prev) => prev.filter((v) => v.id !== id));
    try {
      await deleteViewMutation(id).unwrap();
    } catch {
      // Offline fallback: already updated local state
    }
  };

  const handleToggleShare = async (id: string) => {
    if (isViewer) return; // Blocked for Viewer
    setViews((prev) =>
      prev.map((v) => (v.id === id ? { ...v, sharedWithTeam: !v.sharedWithTeam } : v))
    );
    try {
      await toggleShareMutation(id).unwrap();
    } catch {
      // Offline fallback: already updated local state
    }
  };

  const handleCreateNew = async () => {
    if (isViewer) return; // Blocked for Viewer
    const newView: SavedViewEntity = {
      id: `view_${Date.now()}`,
      title: "New Custom Ingest Filter",
      slug: `custom-filter-${Date.now()}`,
      datasetName: "K8s Microservice Telemetry",
      datasetId: "ds_k8s_telemetry",
      description: "Custom workspace view created from live workstation filters.",
      filterRules: ["latency < 1.0ms", "status == 200"],
      lastRunLatencyMs: 0.34,
      recordsMatched: 48200,
      sharedWithTeam: true,
      updatedAt: "Just now",
    };

    setViews((prev) => [newView, ...prev]);

    try {
      await createViewMutation(newView).unwrap();
    } catch {
      // Offline fallback: already added to local state
    }
  };

  const sharedCount = useMemo(() => views.filter((v) => v.sharedWithTeam).length, [views]);

  // Dataset clearance check for Viewer
  const isDatasetUnauthorized = (datasetId: string) => {
    if (!isViewer) return false;
    return datasetId === "ds_fin_orderbook" || datasetId === "ds_payment_ledger";
  };

  return (
    <div className="flex-1 flex flex-col pb-16 transition-colors">
      {/* Viewer Role Notice Banner (§2.C, §13) */}
      {isViewer && (
        <div className="w-full bg-emerald-500/10 border-b border-emerald-500/20 px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D69A] animate-pulse" />
              <span>
                <strong>Viewer Mode Active:</strong> You have read-only access to team-shared query bookmarks. Private presets, creation, and deletions are restricted to Data Analysts.
              </span>
            </div>
            <span className="hidden md:inline px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] uppercase font-bold tracking-wider">
              Shared Only
            </span>
          </div>
        </div>
      )}

      {/* 1. Header Banner */}
      <ViewHeader
        totalViews={authorizedViews.length}
        sharedCount={sharedCount}
        onCreateNew={handleCreateNew}
        isViewer={isViewer}
      />

      {/* 2. Filter & Search Controls */}
      <div className="w-full border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.01] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <label htmlFor="views-search" className="sr-only">
              Search saved views
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="views-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter views by title, dataset, or predicate rule..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm font-sans rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D69A] transition-all"
            />
          </div>

          {/* Tab Filter */}
          <div className="flex items-center gap-1 text-xs font-mono">
            {isViewer ? (
              <>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-[#00D69A] text-slate-950 font-bold shadow-sm"
                >
                  Authorized Shared Views ({sharedCount})
                </button>
                <span
                  className="px-3 py-1.5 rounded-lg text-slate-400 bg-slate-100 dark:bg-white/5 cursor-not-allowed opacity-60 text-xs"
                  title="Private query views belong to individual analysts and require Data Analyst role."
                >
                  🔒 Private Views (Analyst Only)
                </span>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setFilterTab("all")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterTab === "all"
                      ? "bg-[#00D69A] text-slate-950 font-bold shadow-sm"
                      : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10"
                  }`}
                >
                  All Views ({views.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("shared")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterTab === "shared"
                      ? "bg-[#00D69A] text-slate-950 font-bold shadow-sm"
                      : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10"
                  }`}
                >
                  Shared ({sharedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("private")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterTab === "private"
                      ? "bg-[#00D69A] text-slate-950 font-bold shadow-sm"
                      : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10"
                  }`}
                >
                  Private ({views.length - sharedCount})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Views Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {filteredViews.length === 0 ? (
          <div className="py-20 text-center text-slate-500 dark:text-slate-400 font-mono text-sm">
            <p>No saved views match &ldquo;{searchQuery}&rdquo;.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setFilterTab("all");
              }}
              className="mt-3 text-xs text-[#008A64] dark:text-[#00D69A] underline underline-offset-4 hover:opacity-80"
            >
              Reset view filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredViews.map((v) => (
              <ViewCard
                key={v.id}
                view={v}
                onDelete={handleDelete}
                onToggleShare={handleToggleShare}
                isViewer={isViewer}
                isDatasetUnauthorized={isDatasetUnauthorized(v.datasetId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
