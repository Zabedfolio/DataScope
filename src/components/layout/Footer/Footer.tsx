import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      aria-label="Site Footer"
      className="relative w-full border-t border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#040C0E] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand & Mission Column (Col span 2 on lg) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link href="/" className="flex items-center gap-2.5 group w-fit">
                <div className="relative w-7 h-7 flex-shrink-0">
                  <Image
                    src="/datascope.png"
                    alt="DataScope Logo"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-[#00B884] dark:group-hover:text-[#00D69A] transition-colors">
                  DataScope
                </span>
              </Link>

              <p className="mt-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
                Enterprise data discovery and stream intelligence platform. Search, filter, and inspect complex
                distributed datasets with sub-millisecond precision.
              </p>
            </div>

            {/* Live System Health Pill */}
            <div className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit text-[11px] font-mono bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D69A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D69A]" />
              </span>
              <span>All Systems Operational</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-slate-500">99.98%</span>
            </div>
          </div>

          {/* Navigation Column 1: Platform */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/datasets" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors">
                  Dataset Library
                </Link>
              </li>
              <li>
                <Link href="/explorer" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors">
                  Data Explorer
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors">
                  Advanced Search
                </Link>
              </li>
              <li>
                <Link href="/views" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors">
                  Saved Views
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Architecture */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Architecture
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors cursor-pointer">
                  Zero-Copy Ingestion
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors cursor-pointer">
                  NVMe Direct Rings
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors cursor-pointer">
                  AVX-512 SIMD Engine
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors cursor-pointer">
                  Blake3 Integrity
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors cursor-pointer">
                  Security &amp; RBAC
                </span>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Legal & Resources */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors">
                  About DataScope
                </Link>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors cursor-pointer">
                  Documentation
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#00D69A] transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <Link href="/login" className="text-[#008A64] dark:text-[#00D69A] font-semibold hover:underline">
                  Sign In &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terminal Microcopy */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} DataScope Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Status: Operational
            </span>
            <span>•</span>
            <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Latency: 0.38ms
            </span>
            <span>•</span>
            <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              TLS 1.3
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

