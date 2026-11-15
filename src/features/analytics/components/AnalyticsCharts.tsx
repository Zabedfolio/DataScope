"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { AnalyticsData } from "@/services/datasetsApi";

const STATUS_COLOR_PALETTE: Record<string, string> = {
  "200": "#00D69A", // Emerald Green (OK)
  "400": "#FBBF24", // Amber Yellow (Bad Request)
  "401": "#F59E0B", // Amber Orange (Unauthorized)
  "403": "#FB923C", // Orange (Forbidden)
  "429": "#A855F7", // Purple (Rate Limit)
  "500": "#EF4444", // Rose Red (Internal Server Error)
  "503": "#DC2626", // Crimson Red (Service Unavailable)
};

const getStatusColor = (status: number | string | undefined, name?: string): string => {
  const code = String(status || "");
  if (STATUS_COLOR_PALETTE[code]) return STATUS_COLOR_PALETTE[code];

  if (name) {
    const match = name.match(/\d{3}/);
    if (match && STATUS_COLOR_PALETTE[match[0]]) {
      return STATUS_COLOR_PALETTE[match[0]];
    }
  }

  // Fallback semantic spectrum
  if (code.startsWith("2")) return "#00D69A";
  if (code.startsWith("3")) return "#38BDF8";
  if (code.startsWith("4")) return "#F59E0B";
  if (code.startsWith("5")) return "#EF4444";
  return "#64748B";
};

interface AnalyticsChartsProps {
  analytics: AnalyticsData;
}

export default function AnalyticsCharts({ analytics }: AnalyticsChartsProps) {
  return (
    <div className="space-y-8">
      {/* 1. Charts Grid Row 1: Throughput Area Chart & HTTP Status Distribution Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Throughput Velocity (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Data Growth & Ingestion Velocity
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                14-day record volume time-bucketed aggregation
              </p>
            </div>
            <span className="text-xs font-mono text-[#008A64] dark:text-[#00D69A] font-bold">
              Daily Buckets
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.throughputTrend}>
                <defs>
                  <linearGradient id="ingestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D69A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00D69A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#07171C",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#00D69A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#ingestGradient)"
                  name="Ingested Records"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown (1 Column) */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">
              HTTP Status Distribution
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Aggregated HTTP status code proportions
            </p>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.statusBreakdown}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {analytics.statusBreakdown.map((entry) => (
                    <Cell
                      key={`cell-${entry.status}`}
                      fill={getStatusColor(entry.status, entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#07171C",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Charts Grid Row 2: Microservice Volumes Bar Chart & Top Filter Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Microservices (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Record Distribution by Microservice
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Top 8 services ranked by ingested volume and average latency
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.serviceBreakdown}>
                <XAxis dataKey="service" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#07171C",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
                <Bar dataKey="count" fill="#00D69A" radius={[6, 6, 0, 0]} name="Record Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Filter Rules (1 Column) */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">
              Most Frequently Used Filters
            </h2>
            <p className="text-xs text-slate-500 font-mono mb-4">
              Top search query predicates executed by analysts
            </p>

            <div className="space-y-3 font-mono text-xs">
              {analytics.frequentlyUsedFilters.map((f, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {f.rule}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Category: {f.category}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#00D69A]/15 text-[#008A64] dark:text-[#00D69A] font-bold text-[11px]">
                    {f.count.toLocaleString()} queries
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

