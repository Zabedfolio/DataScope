"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { UserProfile, useAuth } from "@/features/auth/context/AuthContext";
import { useAppDispatch } from "@/store/hooks";
import { setRole, UserRole } from "@/store/slices/authSlice";

interface UserMenuProps {
  user: UserProfile;
  onLogout: () => void;
  className?: string;
}

export function UserMenu({ user, onLogout, className = "" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { switchRole } = useAuth();
  const dispatch = useAppDispatch();

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    dispatch(setRole(role));
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Compute initials (e.g. "Alex Mercer" -> "AM")
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "DS";

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-100 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D69A]"
      >
        {/* Avatar with Online Dot */}
        <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D69A] to-[#0E7C86] text-slate-950 font-bold text-xs tracking-wider shadow-sm">
          {initials}
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00D69A] ring-2 ring-white dark:ring-slate-900" />
        </div>

        {/* User Name & Role (Hidden on small mobile) */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-800 dark:text-white tracking-tight line-clamp-1 max-w-[120px]">
            {user.name}
          </span>
          <span className="text-[10px] font-mono text-[#008A64] dark:text-[#00D69A] leading-tight">
            {user.role}
          </span>
        </div>

        {/* Dropdown Chevron */}
        <svg
          className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#08181E] shadow-2xl p-2 z-50 text-xs font-mono animate-in fade-in zoom-in-95 duration-150"
        >
          {/* User Info Header */}
          <div className="px-3 py-2.5 border-b border-slate-100 dark:border-white/5 mb-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Connected Workspace
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-[#00D69A] border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-pulse" />
                Active
              </span>
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white font-sans">
              {user.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user.email}
            </div>
          </div>

          {/* Instant RBAC Role Switcher (§2, §13) */}
          <div className="px-2.5 py-2 border-b border-slate-100 dark:border-white/5 mb-1 bg-slate-50/50 dark:bg-white/[0.02] rounded-xl">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1.5 px-0.5">
              <span>Active RBAC Role</span>
              <span className="text-[#008A64] dark:text-[#00D69A]">Demo Selector</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(["Administrator", "Data Analyst", "Viewer"] as const).map((r) => {
                const isSelected = user.role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`py-1 px-1 rounded-lg text-[10px] font-mono transition-all text-center truncate ${
                      isSelected
                        ? "bg-[#00D69A] text-slate-950 font-bold shadow-sm"
                        : "bg-slate-200/60 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {r === "Administrator" ? "Admin" : r === "Data Analyst" ? "Analyst" : "Viewer"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="py-1 space-y-0.5">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-sans"
            >
              <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Cluster Dashboard</span>
            </Link>

            <Link
              href="/dashboard/explorer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-sans"
            >
              <svg className="w-4 h-4 text-[#00D69A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Data Explorer Workstation</span>
            </Link>

            <Link
              href="/dashboard/views"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-sans"
            >
              <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Saved Views Catalog</span>
            </Link>

            <Link
              href="/dashboard/search"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-sans"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Visual Query Builder</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="my-1 border-t border-slate-100 dark:border-white/5" />

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors font-sans text-xs font-semibold text-left"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

