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
  SortDirection,
} from "@/features/explorer/types";
import { useGetRecordsQuery } from "@/services/datasetsApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSearchQuery as setReduxSearch,
  setDebouncedQuery,
  setPageSize as setReduxPageSize,
  setSort as setReduxSort,
} from "@/store/slices/searchSlice";
import {
  setDensity as setReduxDensity,
  toggleColumnVisibility,
} from "@/store/slices/uiPreferenceSlice";

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

  const [currentDataset, setCurrentDataset] = useState<DatasetMetadata>(AVAILABLE_DATASETS[0]);
  const [activeViewId, setActiveViewId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [density, setDensity] = useState<ViewDensity>(uiState.density);
  const [columns, setColumns] = useState<ColumnConfig[]>(INITIAL_COLUMNS);
  const [sortField, setSortField] = useState<SortField>(searchState.sortField as SortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(searchState.sortDirection);
  const [selectedRecord, setSelectedRecord] = useState<StreamRecord | null>(null);

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
      sortField,
      sortDirection,
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

  // Column Sort
  const handleSort = (field: SortField) => {
    const newDir = sortField === field && sortDirection === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortDirection(newDir);
    setPage(1);
    dispatch(setReduxSort({ field, direction: newDir }));
  };

  // Density change
  const handleChangeDensity = (newDensity: ViewDensity) => {
    setDensity(newDensity);
    dispatch(setReduxDensity(newDensity));
  };

  // Export handlers
  const handleExport = (format: "csv" | "json") => {
    if (format === "csv") {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
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
      />

      {/* 5. Virtualized Data Grid */}
      <DataGrid
        records={displayRecords}
        density={density}
        columns={columns}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        selectedRecord={selectedRecord}
        onSelectRecord={setSelectedRecord}
        newlyIngestedIds={newlyIngestedIds}
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

      {/* 7. Slide-Out Record Details Drawer */}
      <RecordDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}
