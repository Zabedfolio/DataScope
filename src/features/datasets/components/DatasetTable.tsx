"use client";

import React from "react";
import Link from "next/link";
import { CatalogDataset } from "../types";

interface DatasetTableProps {
  datasets: CatalogDataset[];
  onInspectSchema: (dataset: CatalogDataset) => void;
}

export function DatasetTable({ datasets, onInspectSchema }: DatasetTableProps) {
  const getAccessBadge = (level: CatalogDataset["accessLevel"]) => {
    switch (level) {
      case "Public":
        return "bg-emerald-500/10 text-emerald-700 dark:text-[#00D69A] border-emerald-500/30";
      case "Enterprise":
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30";
      case "Restricted":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 shadow-md">
      <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
        <thead className="bg-slate-50/80 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
          <tr>
            <th scope="col" className="py-3 px-4">Dataset Name</th>
            <th scope="col" className="py-3 px-4">Category</th>
            <th scope="col" className="py-3 px-4 text-right">Records</th>
            <th scope="col" className="py-3 px-4 text-right">Size</th>
            <th scope="col" className="py-3 px-4 text-right">Throughput</th>
            <th scope="col" className="py-3 px-4 text-center">Access</th>
            <th scope="col" className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
          {datasets.map((ds) => (
            <tr
              key={ds.id}
              className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors"
            >
              <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                <div>{ds.name}</div>
                <div className="text-[10px] text-slate-400 font-sans font-normal line-clamp-1">{ds.description}</div>
              </td>
              <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                {ds.category}
              </td>
              <td className="py-3.5 px-4 text-right text-slate-900 dark:text-white font-bold">
                {(ds.recordCount / 1000000).toFixed(1)}M
              </td>
              <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-400">
                {ds.byteSizeFormatted}
              </td>
              <td className="py-3.5 px-4 text-right text-[#008A64] dark:text-[#00D69A] font-semibold">
                {ds.throughputRate}
              </td>
              <td className="py-3.5 px-4 text-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getAccessBadge(ds.accessLevel)}`}>
                  {ds.accessLevel}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onInspectSchema(ds)}
                    className="px-2.5 py-1 rounded text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
                  >
                    Schema
                  </button>
                  <Link
                    href="/explorer"
                    className="px-2.5 py-1 rounded text-xs bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 font-bold transition-all"
                  >
                    Open &rarr;
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

