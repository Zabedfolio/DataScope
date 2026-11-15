"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

export type ClusterId = "all" | "us-east" | "us-west" | "eu";

interface ClusterProfile {
  name: string;
  baseline: number;
  min: number;
  peak: number;
  jitter: number;
}

const CLUSTER_PROFILES: Record<ClusterId, ClusterProfile> = {
  all: {
    name: "All Clusters (4)",
    baseline: 9.32,
    min: 7.2,
    peak: 12.8,
    jitter: 0.65,
  },
  "us-east": {
    name: "US-East-Primary",
    baseline: 4.45,
    min: 3.1,
    peak: 6.2,
    jitter: 0.45,
  },
  "us-west": {
    name: "US-West-02",
    baseline: 2.85,
    min: 1.9,
    peak: 4.1,
    jitter: 0.35,
  },
  eu: {
    name: "EU-Vault-Central",
    baseline: 2.02,
    min: 1.3,
    peak: 3.4,
    jitter: 0.25,
  },
};

const POINT_COUNT = 24;

// Generate smooth cubic bezier SVG path from points
function generateSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

interface RealtimeThroughputChartProps {
  activeCluster: ClusterId;
  onSelectCluster: (cluster: ClusterId) => void;
}

export function RealtimeThroughputChart({
  activeCluster,
  onSelectCluster,
}: RealtimeThroughputChartProps) {
  const profile = CLUSTER_PROFILES[activeCluster];

  // Initialize buffer with pseudo-organic stream history
  const [dataPoints, setDataPoints] = useState<number[]>(() => {
    const init: number[] = [];
    let cur = profile.baseline;
    for (let i = 0; i < POINT_COUNT; i++) {
      cur += (Math.sin(i * 0.7) * 0.4 + (Math.random() - 0.48) * 0.3) * profile.jitter;
      cur = Math.max(profile.min, Math.min(profile.peak, cur));
      init.push(parseFloat(cur.toFixed(2)));
    }
    return init;
  });

  const [currentValue, setCurrentValue] = useState<number>(profile.baseline);
  const [peakValue, setPeakValue] = useState<number>(profile.peak);

  // Transition buffer when cluster changes
  useEffect(() => {
    setDataPoints(() => {
      const init: number[] = [];
      let cur = profile.baseline;
      for (let i = 0; i < POINT_COUNT; i++) {
        cur += (Math.sin(i * 0.7) * 0.4 + (Math.random() - 0.48) * 0.3) * profile.jitter;
        cur = Math.max(profile.min, Math.min(profile.peak, cur));
        init.push(parseFloat(cur.toFixed(2)));
      }
      return init;
    });
    setCurrentValue(profile.baseline);
    setPeakValue(profile.peak);
  }, [activeCluster, profile.baseline, profile.jitter, profile.min, profile.peak]);

  // Real-time dynamic stream ticker (every 750ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const lastVal = prev[prev.length - 1] ?? profile.baseline;
        // Organic random walk drift
        const delta = (Math.random() - 0.47) * profile.jitter;
        let nextVal = lastVal + delta;

        // Pull toward baseline if drifting too far
        const dist = nextVal - profile.baseline;
        nextVal -= dist * 0.15;
        nextVal = Math.max(profile.min, Math.min(profile.peak, nextVal));
        const rounded = parseFloat(nextVal.toFixed(2));

        setCurrentValue(rounded);
        setPeakValue((currentPeak) => Math.max(currentPeak, rounded));

        return [...prev.slice(1), rounded];
      });
    }, 750);

    return () => clearInterval(interval);
  }, [profile]);

  // Map data points into SVG coordinates (width: 1000, height: 200)
  const { linePath, areaPath, lastPoint } = useMemo(() => {
    const minVal = profile.min * 0.85;
    const maxVal = profile.peak * 1.08;
    const range = maxVal - minVal || 1;

    const coords = dataPoints.map((val, idx) => {
      const x = (idx / (POINT_COUNT - 1)) * 1000;
      // Y range: 35 (highest) to 175 (lowest)
      const normalized = (val - minVal) / range;
      const y = 175 - normalized * 140;
      return { x, y };
    });

    const lPath = generateSmoothPath(coords);
    const aPath = `${lPath} L 1000,200 L 0,200 Z`;
    const last = coords[coords.length - 1] || { x: 1000, y: 100 };

    return { linePath: lPath, areaPath: aPath, lastPoint: last };
  }, [dataPoints, profile.min, profile.peak]);

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#07171C]/90 p-5 sm:p-6 shadow-sm backdrop-blur-xl">
      {/* Header Row: Title & Cluster Selection Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">
              Real-Time Cluster Throughput Dynamics
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#00D69A] border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-ping" />
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Aggregate streaming packet velocity measured at 500ms sampling window
          </p>
        </div>

        {/* Cluster Tabs */}
        <div className="flex items-center gap-1 text-xs font-mono p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0">
          {(["all", "us-east", "us-west", "eu"] as ClusterId[]).map((tab) => {
            const labels: Record<ClusterId, string> = {
              all: "All (4)",
              "us-east": "US-East",
              "us-west": "US-West",
              eu: "EU-Vault",
            };
            const isActive = activeCluster === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onSelectCluster(tab)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#00D69A] text-slate-950 font-bold shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Waveform Canvas Container - Theme Adaptive */}
      <div className="relative w-full h-44 sm:h-56 bg-slate-50/90 dark:bg-[#03090B]/90 rounded-xl border border-slate-200/90 dark:border-white/10 p-4 overflow-hidden flex flex-col justify-between transition-colors shadow-inner">
        {/* Top Telemetry Overlay */}
        <div className="flex items-center justify-between text-[11px] font-mono z-10 select-none">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span>Peak:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {peakValue.toFixed(2)} Gbps
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-[#00D69A] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-pulse" />
            <span>Current: {currentValue.toFixed(2)} Gbps (Active)</span>
          </div>
        </div>

        {/* SVG Graphic with Dynamic Spline */}
        <div className="relative flex-1 w-full flex items-center">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40 dark:opacity-20 py-2">
            <div className="border-b border-dashed border-slate-300 dark:border-white/20 w-full" />
            <div className="border-b border-dashed border-slate-300 dark:border-white/20 w-full" />
            <div className="border-b border-dashed border-slate-300 dark:border-white/20 w-full" />
          </div>

          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="liveWaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00D69A" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#00D69A" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#00D69A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Shaded Area Under Curve */}
            <path
              d={areaPath}
              fill="url(#liveWaveGradient)"
              className="transition-all duration-300 ease-linear"
            />

            {/* Glowing Wave Line */}
            <path
              d={linePath}
              stroke="#00D69A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 ease-linear"
            />

            {/* Pinned Glowing Live Sample Point at Wavefront */}
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="7"
              fill="#00D69A"
              opacity="0.4"
              className="animate-ping"
            />
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="4.5"
              fill="#00D69A"
            />
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="2"
              fill="#FFFFFF"
            />
          </svg>
        </div>

        {/* X-Axis Sampling Timeline */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-500 pt-2 border-t border-slate-200/80 dark:border-white/5 select-none">
          <span>-60 mins</span>
          <span>-45 mins</span>
          <span>-30 mins</span>
          <span>-15 mins</span>
          <span className="text-emerald-600 dark:text-[#00D69A] font-bold">Live Now</span>
        </div>
      </div>
    </div>
  );
}

