import React from "react";
import { PIPELINE_STEPS } from "../constants/how-it-works";

export function HowItWorks() {
  return (
    <section
      aria-label="Pipeline Architecture & How It Works"
      className="relative w-full py-12 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-[#FAFDFB] via-white to-[#F4F9F7] dark:from-[#040C0E] dark:via-[#071317] dark:to-[#040C0E] transition-colors duration-300"
    >
      {/* Background Ambience */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[42rem] h-[22rem] bg-[#00D69A]/5 dark:bg-[#00D69A]/7 rounded-full blur-[130px] pointer-events-none"
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#00D69A]/10 text-[#008A64] dark:text-[#00D69A] border border-[#00D69A]/20 mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-pulse" />
            Pipeline Architecture
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            From raw socket to insight in{" "}
            <span className="text-[#00B884] dark:text-[#00D69A]">3 deterministic steps</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Eliminate days of ETL pipeline engineering. DataScope transforms raw byte streams into
            queryable intelligence with hardware-accelerated precision.
          </p>
        </div>

        {/* 3-Step Pipeline Grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {/* Desktop Connecting Decorative Line */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-12 left-1/6 right-1/6 h-[2px] border-t-2 border-dashed border-[#00D69A]/25 z-0"
          />

          {PIPELINE_STEPS.map((step, index) => (
            <div
              key={step.step}
              className="relative z-10 flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 p-6 sm:p-7 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-[#00D69A]/40 hover:-translate-y-1"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#00D69A]/10 dark:bg-[#00D69A]/15 border border-[#00D69A]/30 text-[#008A64] dark:text-[#00D69A] font-mono font-extrabold text-base flex items-center justify-center shadow-sm">
                    {step.step}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wider uppercase bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                    {step.badge}
                  </span>
                </div>

                {/* Step Title & Subtitle */}
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs font-mono font-medium text-[#009E73] dark:text-[#00D69A] mt-0.5 mb-2.5">
                  {step.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Terminal Snippet Box */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="rounded-xl bg-slate-950 p-3.5 font-mono text-[11px] border border-slate-800 shadow-inner">
                  <div className="flex items-center gap-1.5 mb-2 text-slate-500 text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                    <span>terminal</span>
                  </div>
                  <div className="text-slate-300 overflow-x-auto whitespace-nowrap">
                    <span className="text-[#00D69A] mr-1.5">$</span>
                    {step.terminalSnippet.command}
                  </div>
                  <div className={`mt-1.5 text-[10px] ${step.terminalSnippet.accent}`}>
                    {step.terminalSnippet.output}
                  </div>
                </div>

                {/* Bottom Metric Pill */}
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>{step.metrics}</span>
                  <span className="text-slate-400 dark:text-slate-600">Phase 0{index + 1}/03</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

