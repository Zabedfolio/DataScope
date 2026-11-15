import React from "react";
import { PLATFORM_METRICS } from "../constants/metrics";

export function MetricsStrip() {
  return (
    <section
      id="metrics"
      aria-label="Platform Telemetry & Performance Metrics"
      className="relative w-full border-y border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#071317]/80 backdrop-blur-md transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Eyebrow Status Indicator */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-6 mb-6 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D69A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D69A]" />
            </span>
            <span className="font-mono text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
              Live Telemetry Stream
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>99.98% System Health</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Cluster: US-East-Primary</span>
          </div>
        </div>

        {/* 4-Column Responsive Metrics Grid */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200/70 dark:lg:divide-white/10">
          {PLATFORM_METRICS.map((metric, index) => (
            <div
              key={metric.id}
              className={`flex flex-col justify-between group rounded-xl p-4 sm:p-5 transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] ${
                index === 0 ? "lg:pl-0" : "lg:px-6 xl:px-8"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {metric.label}
                </dt>
                {metric.badge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#00D69A]/10 text-[#009E73] dark:text-[#00D69A] border border-[#00D69A]/20">
                    {metric.badge}
                  </span>
                )}
              </div>

              <dd className="mt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono group-hover:text-[#00D69A] transition-colors">
                    {metric.value}
                  </span>
                  {metric.unit && (
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                      {metric.unit}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {metric.description}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

