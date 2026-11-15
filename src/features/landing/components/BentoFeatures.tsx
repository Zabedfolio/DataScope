import React from "react";
import { PLATFORM_FEATURES } from "../constants/features";

export function BentoFeatures() {
  return (
    <section
      id="features"
      aria-label="Core Platform Capabilities"
      className="relative w-full py-12 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-[#F4F9F7] via-white to-[#FAFDFB] dark:from-[#040C0E] dark:via-[#061418] dark:to-[#040C0E] transition-colors duration-300"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[30rem] bg-[#00D69A]/5 dark:bg-[#00D69A]/6 rounded-full blur-[140px] pointer-events-none"
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#00D69A]/10 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/20 mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-pulse" />
            Platform Capabilities
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Engineered for <span className="text-[#00B884] dark:text-[#00D69A]">extreme telemetry scale</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            From raw network sockets to sub-millisecond memory-mapped queries. Explore the architectural
            innovations powering DataScope&rsquo;s high-throughput discovery engine.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {PLATFORM_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className={`group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#07171C]/80 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#00D69A]/40 hover:shadow-xl hover:shadow-[#00D69A]/5 ${feature.colSpanDesktop}`}
            >
              <div>
                {/* Badge Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-medium tracking-wider uppercase bg-[#00D69A]/10 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/20">
                    {feature.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#00B884] dark:group-hover:text-[#00D69A] transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Dynamic Feature Visual Widget */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5">
                {feature.visualType === "architecture" && (
                  <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-300 border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 border-b border-slate-800 pb-1.5">
                      <span>PIPELINE TOPOLOGY</span>
                      <span className="text-[#00D69A] font-bold">2.48 Gbps</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs">
                      <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60 text-slate-200">
                        Raw Stream
                        <span className="block text-[9px] text-[#00D69A] mt-0.5">Wire Ingest</span>
                      </div>
                      <div className="p-2 rounded bg-[#00D69A]/10 border border-[#00D69A]/30 text-[#00D69A] font-semibold">
                        NVMe Ring
                        <span className="block text-[9px] text-slate-400 mt-0.5">Zero-Copy</span>
                      </div>
                      <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60 text-slate-200">
                        Query Core
                        <span className="block text-[9px] text-[#00D69A] mt-0.5">&lt; 0.4ms</span>
                      </div>
                    </div>
                  </div>
                )}

                {feature.visualType === "code" && (
                  <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-300 border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 border-b border-slate-800 pb-1.5">
                      <span>AUTO-INFERRED SCHEMA</span>
                      <span className="text-cyan-400">0x004A</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">0x00: trace_id</span>
                        <span className="text-emerald-400">UUIDv7</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">0x10: bitmask</span>
                        <span className="text-amber-400">uint64_t</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">0x18: payload</span>
                        <span className="text-purple-400">Protobuf[Wire]</span>
                      </div>
                    </div>
                  </div>
                )}

                {feature.visualType === "stat" && (
                  <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-300 border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 border-b border-slate-800 pb-1.5">
                      <span>SIMD COMPILATION</span>
                      <span className="text-emerald-400 font-bold">AVX-512</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        WHERE latency &gt; 50ms
                      </span>
                      <span className="text-slate-500 font-bold">AND</span>
                      <span className="px-2 py-0.5 rounded bg-[#00D69A]/15 text-[#00D69A] border border-[#00D69A]/30">
                        cluster == &ldquo;us-east&rdquo;
                      </span>
                    </div>
                  </div>
                )}

                {feature.visualType === "security" && (
                  <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-300 border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 border-b border-slate-800 pb-1.5">
                      <span>INTEGRITY VERIFICATION</span>
                      <span className="text-[#00D69A] font-bold">Blake3 Validated</span>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00D69A] animate-pulse" />
                        <span className="text-slate-300">Digest: 0x7F4A8C01B39D...</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-[#00D69A] font-semibold text-[10px]">
                        100% Match
                      </span>
                    </div>
                  </div>
                )}

                {feature.highlightText && (
                  <p className="mt-3 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#00D69A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature.highlightText}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

