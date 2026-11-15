"use client";

import React, { useState, useMemo } from "react";
import {
  DatasetHeader,
  DatasetFilterBar,
  DatasetCard,
  DatasetTable,
  DatasetSchemaModal,
} from "@/features/datasets/components";
import { CATALOG_DATASETS } from "@/features/datasets/constants/catalog";
import { DatasetCategory, CatalogDataset } from "@/features/datasets/types";

export default function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<DatasetCategory>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [inspectedDataset, setInspectedDataset] = useState<CatalogDataset | null>(null);

  // Filter datasets
  const filteredDatasets = useMemo(() => {
    return CATALOG_DATASETS.filter((ds) => {
      // 1. Category check
      if (activeCategory !== "All" && ds.category !== activeCategory) {
        return false;
      }

      // 2. Search query check
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        ds.name.toLowerCase().includes(q) ||
        ds.description.toLowerCase().includes(q) ||
        ds.cluster.toLowerCase().includes(q) ||
        ds.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex-1 flex flex-col min-h-screen pt-20 sm:pt-24 bg-slate-50/50 dark:bg-[#040C0E] transition-colors">
      
      {/* 1. Header Overview Banner */}
      <DatasetHeader
        totalDatasets={CATALOG_DATASETS.length}
        totalRecordsFormatted="252.8M"
        totalStorageFormatted="409.6 GB"
        totalBandwidth="13.63 Gbps"
      />

      {/* 2. Filter Bar (Search + Categories + View Mode) */}
      <DatasetFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        matchCount={filteredDatasets.length}
      />

      {/* 3. Catalog Display (Grid vs Table) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {filteredDatasets.length === 0 ? (
          <div className="py-20 text-center text-slate-500 dark:text-slate-400 font-mono text-sm">
            <p>No datasets found matching &ldquo;{searchQuery}&rdquo; in category &ldquo;{activeCategory}&rdquo;.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-3 text-xs text-[#008A64] dark:text-[#00D69A] underline underline-offset-4 hover:opacity-80"
            >
              Reset filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatasets.map((ds) => (
              <DatasetCard
                key={ds.id}
                dataset={ds}
                onInspectSchema={setInspectedDataset}
              />
            ))}
          </div>
        ) : (
          <DatasetTable
            datasets={filteredDatasets}
            onInspectSchema={setInspectedDataset}
          />
        )}
      </div>

      {/* 4. Schema Inspector Modal */}
      <DatasetSchemaModal
        dataset={inspectedDataset}
        onClose={() => setInspectedDataset(null)}
      />
    </div>
  );
}

