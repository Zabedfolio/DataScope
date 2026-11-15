"use client";

import React, { useState, useMemo } from "react";
import {
  QueryNodeGroup,
  QueryPreviewPane,
  SearchResultsPreview,
  SaveViewModal,
} from "@/features/search/components";
import { QueryGroup } from "@/features/search/types";
import { compileToFullQuery, evaluateRecordMatch } from "@/features/search/utils/ast-compiler";
import { AVAILABLE_DATASETS } from "@/features/explorer/constants/datasets";
import { MOCK_STREAM_RECORDS } from "@/features/explorer/constants/mock-records";
import { StreamRecord } from "@/features/explorer/types";
import { useAuth } from "@/features/auth/context/AuthContext";

const INITIAL_QUERY_TREE: QueryGroup = {
  id: "root_group",
  combinator: "AND",
  rules: [
    {
      id: "rule_1",
      field: "latency",
      operator: ">",
      value: "1.0",
    },
    {
      id: "rule_2",
      field: "status",
      operator: "!=",
      value: "200",
    },
  ],
  subGroups: [],
};

export default function DashboardSearchPage() {
  const { user } = useAuth();
  const currentRole = user?.role || "Data Analyst";
  const isViewer = currentRole.toLowerCase().includes("viewer");

  const [selectedDataset, setSelectedDataset] = useState(AVAILABLE_DATASETS[0]);
  const [queryTree, setQueryTree] = useState<QueryGroup>(INITIAL_QUERY_TREE);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<StreamRecord[]>([]);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Live compiled query
  const compiled = useMemo(() => {
    return compileToFullQuery(queryTree, selectedDataset.slug);
  }, [queryTree, selectedDataset]);

  // Execute query handler
  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const matches = MOCK_STREAM_RECORDS.filter((rec) => evaluateRecordMatch(rec, queryTree));
      setResults(matches);
      setHasExecuted(true);
      setIsExecuting(false);
    }, 280);
  };

  // Reset to default
  const handleReset = () => {
    setQueryTree(INITIAL_QUERY_TREE);
    setHasExecuted(false);
  };

  return (
    <div className="flex-1 flex flex-col pb-16 transition-colors">
      {/* Viewer Role Notice Banner (§2.C) */}
      {isViewer && (
        <div className="w-full bg-emerald-500/10 border-b border-emerald-500/20 px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D69A] animate-pulse" />
              <span>
                <strong>Viewer Mode Active:</strong> You are evaluating queries in read-only preview mode. Creating and saving persistent filter presets requires Data Analyst clearance.
              </span>
            </div>
            <span className="hidden md:inline px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] uppercase font-bold tracking-wider">
              Preset Save Locked
            </span>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="w-full border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#00D69A]/10 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-pulse" />
              Visual AST Query Canvas
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Advanced Search &amp; Query Builder
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Compose complex Boolean predicates and sub-groups across multi-shard stream indexes.
            </p>
          </div>

          {/* Dataset Selector */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Target Stream:</span>
            <select
              value={selectedDataset.id}
              onChange={(e) => {
                const found = AVAILABLE_DATASETS.find((d) => d.id === e.target.value);
                if (found) setSelectedDataset(found);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#00D69A]"
            >
              {AVAILABLE_DATASETS.map((ds) => {
                const isRestrictedForViewer =
                  isViewer && (ds.accessLevel === "Enterprise" || ds.accessLevel === "Restricted");
                return (
                  <option key={ds.id} value={ds.id}>
                    {ds.name} {isRestrictedForViewer ? "(🔒 Restricted for Viewer)" : `(${ds.throughputRate})`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {/* Canvas Toolbar */}
        <div className="flex items-center justify-between gap-3 text-xs font-mono">
          <span className="text-slate-500 uppercase tracking-wider font-semibold">
            Visual Expression Tree
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline"
          >
            Reset to default template
          </button>
        </div>

        {/* 1. Visual AST Group Node Canvas */}
        <QueryNodeGroup
          group={queryTree}
          onChangeGroup={setQueryTree}
        />

        {/* 2. Live Compiled Output & Preview (Save View is disabled for Viewers) */}
        <QueryPreviewPane
          compiled={compiled}
          onExecute={handleExecute}
          isExecuting={isExecuting}
          onSaveView={isViewer ? undefined : () => setIsSaveModalOpen(true)}
        />

        {/* 3. Query Results Preview */}
        {hasExecuted && (
          <SearchResultsPreview
            results={results}
            executionTimeMs={0.34}
          />
        )}

        {/* 4. Save Query as View Modal (Analysts & Admins only) */}
        {!isViewer && (
          <SaveViewModal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            dataset={selectedDataset}
            queryTree={queryTree}
            matchCount={results.length || 42}
          />
        )}
      </div>
    </div>
  );
}
