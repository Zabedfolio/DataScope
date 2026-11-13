"use client";

import React, { useState, useEffect } from "react";
import { IsometricDataEngine } from "./IsometricDataEngine";

export function IsometricDataStage() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Respect reduced motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!canHover) return;

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 3;
        const y = (e.clientY / innerHeight - 0.5) * 3;
        setTilt({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center z-10 py-4 sm:py-6 lg:py-0">
      {/* Background ambient radial gradient */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[28rem] h-72 sm:h-[28rem] bg-[#00D69A]/10 dark:bg-[#00D69A]/8 rounded-full blur-[80px] pointer-events-none"
      />

      {/* Interactive Isometric Canvas with Tilt */}
      <div
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y * -1}deg) rotateY(${tilt.x}deg)`,
          transition: "transform 0.4s cubic-bezier(0.2, 0, 0, 1)",
        }}
        className="relative w-full max-w-[560px] lg:max-w-none will-change-transform flex items-center justify-center"
      >
        <IsometricDataEngine className="w-full h-auto" />

        {/* Floating Contextual Badges with #00D69A accents */}
        {/* Badge 1: Cluster Nodes (near database tower top-left) */}
        <div className="hero-fade-in absolute top-[2%] left-[2%] sm:left-[6%] flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-[#00D69A]/30 shadow-[0_8px_20px_rgba(0,214,154,0.12)] backdrop-blur-md text-[11px] sm:text-xs font-mono select-none">
          <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#00D69A] animate-ping" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            Cluster
          </span>
          <span className="text-[#00D69A] font-bold">12 Active</span>
        </div>

        {/* Badge 2: Latency Benchmark (center-top) */}
        <div className="hero-fade-in absolute top-[0%] right-[2%] sm:right-[6%] flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-[#00D69A]/30 shadow-[0_8px_20px_rgba(0,214,154,0.12)] backdrop-blur-md text-[11px] sm:text-xs font-mono select-none [animation-delay:200ms]">
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            Latency
          </span>
          <span className="text-[#00D69A] font-bold">0.4ms</span>
        </div>

        {/* Badge 3: Telemetry Stream (bottom-left) */}
        <div className="hero-fade-in absolute bottom-[2%] left-[2%] sm:left-[6%] flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-[#00D69A]/30 shadow-[0_8px_20px_rgba(0,214,154,0.12)] backdrop-blur-md text-[11px] sm:text-xs font-mono select-none [animation-delay:350ms]">
          <span className="text-slate-800 dark:text-slate-200">
            Pipeline:
          </span>
          <span className="text-[#00D69A] font-bold">Zero Scripting</span>
        </div>
      </div>
    </div>
  );
}
