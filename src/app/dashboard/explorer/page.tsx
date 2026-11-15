"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ExplorerHeader,
  SavedViewTabs,
  ExplorerFilterBar,
  TableCommandBar,
  DataGrid,
  RecordDrawer,
  TablePagination,
} from "@/features/explorer/components";
import { AVAILABLE_DATASETS } from "@/features/explorer/constants/datasets";
import { MOCK_STREAM_RECORDS } from "@/features/explorer/constants/mock-records";
import { useStreamSimulator } from "@/features/explorer/hooks/useStreamSimulator";
import {
  DatasetMetadata,
  StreamRecord,
  ViewDensity,
  ColumnConfig,
  SortField,
} from "@/features/explorer/types";
import { useGetRecordsQuery } from "@/services/datasetsApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  setSearchQuery as setReduxSearch,
  setDebouncedQuery,
  setPageSize as setReduxPageSize,
  toggleSortRule,
} from "@/store/slices/searchSlice";
import {
  setDensity as setReduxDensity,
  toggleColumnVisibility,
} from "@/store/slices/uiPreferenceSlice";
import { setRole as setReduxRole } from "@/store/slices/authSlice";

const INITIAL_COLUMNS: ColumnConfig[] = [
  { key: "timestamp", label: "Time", visible: true },
  { key: "id", label: "Stream ID", visible: true },
  { key: "service", label: "Service / Method", visible: true },
  { key: "cluster", label: "Cluster", visible: true },
  { key: "latency", label: "Latency", visible: true },
  { key: "status", label: "Status", visible: true },
];

export default function DashboardExplorerPage() {
  const dispatch = useAppDispatch();
  const searchState = useAppSelector((state) => state.search);
  const uiState = useAppSelector((state) => state.uiPreference);
  const { user, switchRole } = useAuth();
  const currentRole = user?.role || "Data Analyst";

  const [currentDataset, setCurrentDataset] = useState<DatasetMetadata>(AVAILABLE_DATASETS[0]);
  const [activeViewId, setActiveViewId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [density, setDensity] = useState<ViewDensity>(uiState.density);
  const [columns, setColumns] = useState<ColumnConfig[]>(INITIAL_COLUMNS);
  const [selectedRecord, setSelectedRecord] = useState<StreamRecord | null>(null);

  // RBAC Dataset Clearance Enforcement (§2, §13)
  const isUnauthorized = useMemo(() => {
    if (currentRole === "Administrator") return false;
    if (currentRole === "Data Analyst") {
      return currentDataset.accessLevel === "Restricted";
    }
    // Viewer: only allowed to browse Public datasets
    return currentDataset.accessLevel === "Enterprise" || currentDataset.accessLevel === "Restricted";
  }, [currentRole, currentDataset.accessLevel]);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // 300ms Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setDebouncedQuery(searchQuery));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  // Derive status filter from active chips
  const statusParam = useMemo(() => {
    if (activeChips.includes("status:500")) return "500,503";
    return undefined;
  }, [activeChips]);

  const serviceParam = useMemo(() => {
    if (activeChips.includes("service:auth")) return "auth-gateway";
    return undefined;
  }, [activeChips]);

  const minLatencyParam = useMemo(() => {
    if (activeChips.includes("latency:>20ms")) return 20;
    return undefined;
  }, [activeChips]);

  const sortRulesParam = useMemo(() => {
    if (searchState.sortRules && searchState.sortRules.length > 0) {
      return searchState.sortRules.map((r) => `${r.field}:${r.direction}`).join(",");
    }
    return undefined;
  }, [searchState.sortRules]);

  // Live Server Query (Supabase / Fastify)
  const { data: serverData } = useGetRecordsQuery(
    {
      datasetId: currentDataset.id,
      page,
      pageSize,
      search: searchState.debouncedQuery || undefined,
      status: statusParam,
      service: serviceParam,
      minLatency: minLatencyParam,
      sortField: searchState.sortField,
      sortDirection: searchState.sortDirection,
      sortRules: sortRulesParam,
    },
    {
      pollingInterval: 0, // On demand with pagination
    }
  );

  // Live Stream Simulator (Fallback / Realtime addition)
  const {
    records: streamedRecords,
    isStreaming,
    toggleStreaming,
    streamRate,
    setStreamRate,
    newlyIngestedIds,
    ingestedCount,
  } = useStreamSimulator(currentDataset, MOCK_STREAM_RECORDS);

  // Global Keyboard Shortcuts (§6): 'p' toggles stream pause/resume
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        toggleStreaming();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleStreaming]);

  // Choose server records if available; fallback to streamed mock
  const displayRecords = useMemo(() => {
    if (serverData && serverData.data && serverData.data.length > 0) {
      return serverData.data.map((r) => ({
        ...r,
        timestamp: typeof r.timestamp === "string" ? r.timestamp : new Date(r.timestamp).toISOString(),
      }));
    }
    return streamedRecords;
  }, [serverData, streamedRecords]);

  const totalRecordCount = serverData?.pagination?.totalRecords ?? currentDataset.recordCount;
  const totalPages = serverData?.pagination?.totalPages ?? Math.ceil(totalRecordCount / pageSize);
  const scanTimeMs = serverData?.metrics?.scanTimeMs ?? 0.34;

  // Handle Saved View Preset Switch
  const handleSelectView = (viewId: string) => {
    setActiveViewId(viewId);
    setSearchQuery("");
    setPage(1);
    if (viewId === "outages") {
      setActiveChips(["status:500"]);
    } else if (viewId === "slow-queries") {
      setActiveChips(["latency:>20ms"]);
    } else if (viewId === "security") {
      setActiveChips(["service:auth"]);
    } else {
      setActiveChips([]);
    }
  };

  // Add / Remove Chips
  const handleAddChip = (chip: string) => {
    if (!activeChips.includes(chip)) {
      setActiveChips((prev) => [...prev, chip]);
      setPage(1);
    }
  };

  const handleRemoveChip = (chip: string) => {
    setActiveChips((prev) => prev.filter((c) => c !== chip));
    setPage(1);
  };

  // Toggle Column Visibility
  const handleToggleColumn = (key: ColumnConfig["key"]) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
    dispatch(toggleColumnVisibility(key));
  };

  // Column Sort (Single & Multi-Column via Shift+Click)
  const handleSort = (field: SortField, isMulti: boolean = false) => {
    dispatch(toggleSortRule({ field, isMulti }));
    setPage(1);
  };

  // Density change
  const handleChangeDensity = (newDensity: ViewDensity) => {
    setDensity(newDensity);
    dispatch(setReduxDensity(newDensity));
  };

  // Export handlers
  const handleExport = (format: "csv" | "json") => {
    if (format === "csv") {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const params = new URLSearchParams({ datasetId: currentDataset.id });
      if (searchState.debouncedQuery) params.append("search", searchState.debouncedQuery);
      if (statusParam) params.append("status", statusParam);
      if (serviceParam) params.append("service", serviceParam);

      const downloadUrl = `${apiUrl}/api/v1/records/export?${params.toString()}`;
      window.open(downloadUrl, "_blank");
    } else {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(displayRecords, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `datascope_${currentDataset.slug}_export.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-16 transition-colors">
      {/* 1. Header Toolbar */}
      <ExplorerHeader
        currentDataset={currentDataset}
        onSelectDataset={(ds) => {
          setCurrentDataset(ds);
          setPage(1);
        }}
      />

      {/* 2. Saved View Tabs */}
      <SavedViewTabs
        activeViewId={activeViewId}
        onSelectView={handleSelectView}
        userRole={currentRole}
      />

      {/* 3. Universal Query & Filter Bar */}
      <ExplorerFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          dispatch(setReduxSearch(q));
        }}
        activeChips={activeChips}
        onRemoveChip={handleRemoveChip}
        onAddChip={handleAddChip}
        matchCount={displayRecords.length}
        totalCount={totalRecordCount}
      />

      {/* 4. Table Command Bar */}
      <TableCommandBar
        density={density}
        onChangeDensity={handleChangeDensity}
        columns={columns}
        onToggleColumn={handleToggleColumn}
        onExport={handleExport}
        recordCount={totalRecordCount}
        isStreaming={isStreaming}
        onToggleStreaming={toggleStreaming}
        streamRate={streamRate}
        onChangeStreamRate={setStreamRate}
        ingestedCount={ingestedCount}
        userRole={currentRole}
      />

      {/* RBAC Dataset Access Clearance Gate (§2, §13) */}
      {isUnauthorized ? (
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-md w-full rounded-2xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20 backdrop-blur-xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 mb-3">
              Clearance Required: {currentDataset.accessLevel}
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
              Dataset Access Restricted
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-2 leading-relaxed">
              <strong>{currentDataset.name}</strong> is categorized as <em>{currentDataset.accessLevel}</em>. Your active role is <strong className="text-rose-500">{currentRole}</strong>.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2">
              {currentRole === "Viewer"
                ? "Viewers are strictly authorized to explore Public telemetry streams. Switch to Data Analyst to inspect enterprise financial order books."
                : "Payment settlement ledgers require Administrator clearance."}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  const targetRole = currentDataset.accessLevel === "Restricted" ? "Administrator" : "Data Analyst";
                  switchRole(targetRole);
                  dispatch(setReduxRole(targetRole));
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 font-bold transition-all shadow-md shadow-[#00D69A]/20"
              >
                Switch to {currentDataset.accessLevel === "Restricted" ? "Admin" : "Analyst"} Role
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentDataset(AVAILABLE_DATASETS[0]);
                  setPage(1);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Return to Public Stream
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 5. Virtualized Data Grid */}
          <DataGrid
            records={displayRecords}
            density={density}
            columns={columns}
            sortField={searchState.sortField as SortField}
            sortDirection={searchState.sortDirection}
            sortRules={searchState.sortRules}
            onSort={handleSort}
            selectedRecord={selectedRecord}
            onSelectRecord={setSelectedRecord}
            newlyIngestedIds={newlyIngestedIds}
            searchQuery={searchQuery}
            userRole={currentRole}
            onResetFilters={() => {
              setSearchQuery("");
              setActiveChips([]);
              setActiveViewId("all");
              setPage(1);
            }}
          />

          {/* 6. Server-Side Table Pagination */}
          <TablePagination
            page={page}
            pageSize={pageSize}
            totalRecords={totalRecordCount}
            totalPages={totalPages}
            scanTimeMs={scanTimeMs}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(ps) => {
              setPageSize(ps);
              setPage(1);
              dispatch(setReduxPageSize(ps));
            }}
          />
        </>
      )}

      {/* 7. Slide-Out Record Details Drawer */}
      <RecordDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}
