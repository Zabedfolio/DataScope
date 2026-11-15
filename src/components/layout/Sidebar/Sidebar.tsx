"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: (props: { className?: string }) => React.JSX.Element;
  badge?: string;
}

const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: ({ className = "w-4 h-4" }) => (
      <svg width={16} height={16} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: "Data Explorer",
    href: "/dashboard/explorer",
    icon: ({ className = "w-4 h-4" }) => (
      <svg width={16} height={16} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    badge: "Live",
  },
  {
    label: "Datasets",
    href: "/dashboard/datasets",
    icon: ({ className = "w-4 h-4" }) => (
      <svg width={16} height={16} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
  },
  {
    label: "Visual Search",
    href: "/dashboard/search",
    icon: ({ className = "w-4 h-4" }) => (
      <svg width={16} height={16} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    label: "Saved Views",
    href: "/dashboard/views",
    icon: ({ className = "w-4 h-4" }) => (
      <svg width={16} height={16} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: ({ className = "w-4 h-4" }) => (
      <svg width={16} height={16} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
];

export function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("datascope_sidebar_collapsed");
    if (stored === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("datascope_sidebar_collapsed", String(next));
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AM";

  return (
    <aside
      aria-label="Workstation Navigation Sidebar"
      className={`hidden md:flex flex-col justify-between shrink-0 h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out border-r border-slate-200/80 dark:border-white/10 bg-[#0B242C] dark:bg-[#06141A] text-slate-300 select-none z-30 py-4 ${
        isCollapsed ? "w-14" : "w-60"
      } ${className}`}
    >
      {/* Top Section: Brand Header, Collapse Toggle & Navigation Links */}
      <div className="flex flex-col px-2.5">
        {/* Brand Header + Collapse / Expand Toggle Row */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/10 px-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 relative shrink-0">
                <Image
                  src="/datascope.png"
                  alt="DataScope Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-[#00D69A] transition-colors font-sans">
                DataScope
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#00D69A]/15 text-[#00D69A] border border-[#00D69A]/30">
                v2.4
              </span>
            </Link>

            <button
              type="button"
              onClick={toggleCollapse}
              aria-label="Collapse sidebar"
              title="Collapse sidebar (56px)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg width={16} height={16} className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 pb-3.5 mb-3 border-b border-white/10">
            <Link href="/" title="DataScope Home" className="w-7 h-7 relative">
              <Image
                src="/datascope.png"
                alt="DataScope Logo"
                width={28}
                height={28}
                className="object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={toggleCollapse}
              aria-label="Expand sidebar"
              title="Expand sidebar (240px)"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg width={14} height={14} className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation Items List */}
        <nav aria-label="Workstation Navigation" className="space-y-1">
          {SIDEBAR_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  isActive
                    ? "bg-[#00D69A]/15 text-[#00D69A] font-bold shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#00D69A] shadow-[0_0_8px_rgba(0,214,154,0.8)]"
                    aria-hidden="true"
                  />
                )}

                <Icon className={`shrink-0 ${isActive ? "text-[#00D69A]" : "text-slate-400 group-hover:text-white"} ${isCollapsed ? "w-5 h-5" : "w-4 h-4"}`} />

                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#00D69A]/20 text-[#00D69A]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Cluster Health & User Info */}
      <div className="flex flex-col px-2.5 gap-3 border-t border-white/5 pt-3">
        {/* Cluster Telemetry Widget */}
        {!isCollapsed ? (
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] font-mono">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="uppercase text-[9px] tracking-wider">Active Cluster</span>
              <span className="inline-flex items-center gap-1 text-[9px] text-[#00D69A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-ping" />
                Live
              </span>
            </div>
            <div className="font-bold text-white text-xs truncate">
              US-East-Primary
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>9.32 Gbps</span>
              <span className="text-[#00D69A]">0.34ms</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="US-East-Primary • 9.32 Gbps • 0.34ms">
            <div className="relative w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#00D69A] animate-pulse" />
            </div>
          </div>
        )}

        {/* User Card */}
        {mounted && user && (
          <div
            className={`flex items-center gap-2 p-1.5 rounded-xl bg-white/[0.02] border border-white/5 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D69A] to-[#0E7C86] text-slate-950 font-bold text-xs tracking-wider shrink-0">
                {initials}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-semibold text-white truncate max-w-[100px]">
                    {user.name}
                  </span>
                  <span className="text-[9px] font-mono text-[#00D69A]">
                    {user.role}
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                type="button"
                onClick={logout}
                title="Sign out of DataScope"
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
              >
                <svg width={16} height={16} className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
