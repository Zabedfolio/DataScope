"use client";

import React, { useState, useMemo } from "react";
import {
  ExplorerHeader,
  SavedViewTabs,
  ExplorerFilterBar,
  TableCommandBar,
  DataGrid,
  RecordDrawer,
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

const INITIAL_COLUMNS: ColumnConfig[] = [
  { key: "timestamp", label: "Time", visible: true },
  { key: "id", label: "Stream ID", visible: true },
  { key: "service", label: "Service / Method", visible: true },
  { key: "cluster", label: "Cluster", visible: true },
  { key: "latency", label: "Latency", visible: true },
  { key: "status", label: "Status", visible: true },
];

export default function ExplorerPage() {
  const [currentDataset, setCurrentDataset] = useState<DatasetMetadata>(AVAILABLE_DATASETS[0]);
  const [activeViewId, setActiveViewId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [density, setDensity] = useState<ViewDensity>("compact");
  const [columns, setColumns] = useState<ColumnConfig[]>(INITIAL_COLUMNS);
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedRecord, setSelectedRecord] = useState<StreamRecord | null>(null);

  // Live Stream Simulator
  const {
    records: streamedRecords,
    isStreaming,
    toggleStreaming,
    streamRate,
    setStreamRate,
    newlyIngestedIds,
    ingestedCount,
  } = useStreamSimulator(currentDataset, MOCK_STREAM_RECORDS);

  // Handle Saved View Preset Switch
  const handleSelectView = (viewId: string) => {
    setActiveViewId(viewId);
    setSearchQuery("");
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
    }
  };

  const handleRemoveChip = (chip: string) => {
    setActiveChips((prev) => prev.filter((c) => c !== chip));
  };

  // Toggle Column Visibility
  const handleToggleColumn = (key: ColumnConfig["key"]) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  // Column Sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Filter & Sort Pipeline
  const filteredRecords = useMemo(() => {
    return streamedRecords.filter((rec) => {
      // 1. Chips filter
      for (const chip of activeChips) {
        if (chip === "status:500" && rec.status < 500) return false;
        if (chip === "latency:>20ms" && rec.latency <= 20) return false;
        if (chip === "service:auth" && rec.service !== "auth-gateway") return false;
      }

      // 2. Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        rec.id.toLowerCase().includes(q) ||
        rec.service.toLowerCase().includes(q) ||
        rec.cluster.toLowerCase().includes(q) ||
        rec.summary.toLowerCase().includes(q) ||
        rec.status.toString().includes(q) ||
        rec.method.toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === "timestamp") comparison = a.timestamp.localeCompare(b.timestamp);
      else if (sortField === "id") comparison = a.id.localeCompare(b.id);
      else if (sortField === "service") comparison = a.service.localeCompare(b.service);
      else if (sortField === "cluster") comparison = a.cluster.localeCompare(b.cluster);
      else if (sortField === "latency") comparison = a.latency - b.latency;
      else if (sortField === "status") comparison = a.status - b.status;
      return sortDirection === "desc" ? -comparison : comparison;
    });
  }, [streamedRecords, searchQuery, activeChips, sortField, sortDirection]);

  // Export handlers
  const handleExport = (format: "csv" | "json") => {
    if (format === "json") {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredRecords, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `datascope_${currentDataset.slug}_export.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const headers = ["Timestamp", "Stream ID", "Service", "Method", "Cluster", "Latency (ms)", "Status", "Summary"];
      const rows = filteredRecords.map((r) => [
        r.timestamp,
        r.id,
        r.service,
        r.method,
        r.cluster,
        r.latency,
        r.status,
        `"${r.summary.replace(/"/g, '""')}"`,
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `datascope_${currentDataset.slug}_export.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen pt-20 sm:pt-24 bg-slate-50/50 dark:bg-[#040C0E] transition-colors">
      
      {/* 1. Header Toolbar */}
      <ExplorerHeader
        currentDataset={currentDataset}
        onSelectDataset={setCurrentDataset}
      />

      {/* 2. Saved View Tabs */}
      <SavedViewTabs
        activeViewId={activeViewId}
        onSelectView={handleSelectView}
      />

      {/* 3. Universal Query & Filter Bar */}
      <ExplorerFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeChips={activeChips}
        onRemoveChip={handleRemoveChip}
        onAddChip={handleAddChip}
        matchCount={filteredRecords.length}
        totalCount={streamedRecords.length}
      />

      {/* 4. Table Command Bar */}
      <TableCommandBar
        density={density}
        onChangeDensity={setDensity}
        columns={columns}
        onToggleColumn={handleToggleColumn}
        onExport={handleExport}
        recordCount={filteredRecords.length}
        isStreaming={isStreaming}
        onToggleStreaming={toggleStreaming}
        streamRate={streamRate}
        onChangeStreamRate={setStreamRate}
        ingestedCount={ingestedCount}
      />

      {/* 5. Virtualized Data Grid */}
      <DataGrid
        records={filteredRecords}
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
        }}
      />

      {/* 6. Slide-Out Record Details Drawer */}
      <RecordDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}

