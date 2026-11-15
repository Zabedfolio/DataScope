import React from "react";
import Link from "next/link";

export function LandingCta() {
  return (
    <section
      aria-label="Call to Action"
      className="relative w-full py-12 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-[#F4F9F7] via-white to-[#EBF5F1] dark:from-[#040C0E] dark:via-[#07171C] dark:to-[#040C0E] transition-colors duration-300"
    >
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Obsidian Glass Banner Card */}
        <div className="relative rounded-3xl border border-[#00D69A]/30 bg-gradient-to-br from-[#061418] via-[#092229] to-[#040E11] p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden text-center">
          
          {/* Ambient Inner Glows */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-24 w-96 h-96 bg-[#00D69A]/15 rounded-full blur-[100px] pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#00D69A]/10 text-[#00D69A] border border-[#00D69A]/30 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-ping" />
              Instant Enterprise Deployment
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Start discovering enterprise data with{" "}
              <span className="text-[#00D69A]">sub-millisecond precision</span>
            </h2>

            {/* Subtext */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-300 leading-relaxed">
              Eliminate brittle ETL jobs and slow data warehouses. Index your first streaming cluster in minutes
              with zero configuration overhead.
            </p>

            {/* CTA Button Cluster */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 shadow-lg shadow-[#00D69A]/20 transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D69A]"
              >
                <span>Get Started Free</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Launch Demo Explorer</span>
              </Link>
            </div>

            {/* Trust Highlights Checklist */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#00D69A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#00D69A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free tier up to 10M records
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#00D69A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                SOC2 Type II certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

