"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/features/auth/context/AuthContext";

interface NavActionsProps {
  className?: string;
  onItemClick?: () => void;
}

export function NavActions({ className = "", onItemClick }: NavActionsProps) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {/* Theme Toggle Button */}
      <ThemeToggle />

      {isAuthenticated && user ? (
        /* Authenticated User Menu */
        <UserMenu user={user} onLogout={logout} />
      ) : (
        /* Guest Actions */
        <>
          <Link
            href="/login"
            onClick={onItemClick}
            className="px-3.5 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl border border-transparent hover:border-slate-700/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Log In
          </Link>

          <Link
            href="/register"
            onClick={onItemClick}
            className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-slate-950 rounded-xl bg-gradient-to-r from-[#00F5A0] via-[#00D69A] to-[#00B884] hover:from-[#1AFFB0] hover:to-[#00C990] shadow-[0_2px_14px_rgba(0,214,154,0.35)] hover:shadow-[0_4px_22px_rgba(0,214,154,0.55)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F5A0] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <span>Get Started</span>
            <svg
              className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </>
      )}
    </div>
  );
}
