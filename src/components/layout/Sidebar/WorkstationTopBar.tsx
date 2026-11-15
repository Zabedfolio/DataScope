"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../Navbar/ThemeToggle";
import { UserMenu } from "../Navbar/UserMenu";
import { useAuth } from "@/features/auth/context/AuthContext";

export function WorkstationTopBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getBreadcrumbTitle = () => {
    if (pathname.includes("/explorer")) return "Data Explorer";
    if (pathname.includes("/datasets")) return "Datasets Library";
    if (pathname.includes("/search")) return "Visual AST Query Builder";
    if (pathname.includes("/views")) return "Saved Views Catalog";
    if (pathname.includes("/analytics")) return "Cluster Analytics & Metrics";
    return "Cluster Overview";
  };

  return (
    <header className="w-full h-14 shrink-0 border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 z-20 font-mono text-xs select-none">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 min-w-0">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 hover:text-[#00D69A] transition-colors"
          title="Back to Public Website"
        >
          <span className="w-2 h-2 rounded-full bg-[#00D69A]" />
          <span>DataScope</span>
        </Link>
        <span>/</span>
        <span className="hidden sm:inline">Enterprise</span>
        <span className="hidden sm:inline">/</span>
        <span className="font-semibold text-slate-900 dark:text-white truncate">
          {getBreadcrumbTitle()}
        </span>
      </div>

      {/* Right: Telemetry Health, Theme Switcher & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Cluster Pill */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 dark:bg-[#00D69A]/10 border border-emerald-500/20 text-[#008A64] dark:text-[#00D69A] text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-ping" />
          <span>US-East-Primary</span>
          <span className="text-slate-400 dark:text-slate-500">•</span>
          <span>9.32 Gbps</span>
          <span className="text-slate-400 dark:text-slate-500">•</span>
          <span>0.34ms</span>
        </div>

        {/* Back to Website Link */}
        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors text-xs font-sans"
        >
          <span>Website</span>
          <svg width={14} height={14} className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Menu */}
        {user && <UserMenu user={user} onLogout={logout} />}
      </div>
    </header>
  );
}

