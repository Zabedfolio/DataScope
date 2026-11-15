"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/features/auth/context/AuthContext";

export function MobileMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle body scroll locking and Escape key dismiss
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button on open
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    triggerButtonRef.current?.focus();
  };

  return (
    <div className="md:hidden flex items-center">
      {/* Hamburger Trigger Button */}
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        aria-label="Toggle navigation menu"
        className="p-2 rounded-xl text-slate-200 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D69A]"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Backdrop & Mobile Drawer Overlay portaled directly to document.body */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-200"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="relative z-10 w-full max-w-xs h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between p-6 transform transition-transform duration-200 ease-out text-white"
          >
            {/* Header: Brand & Close Button */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      src="/datascope.png"
                      alt="DataScope Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                    />
                  </div>
                  <span className="font-extrabold text-lg tracking-tight text-white">
                    DataScope
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={handleClose}
                    aria-label="Close navigation menu"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D69A]"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6" aria-label="Mobile Primary Navigation">
                <ul className="flex flex-col gap-1.5">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={handleClose}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-slate-800 text-white font-bold border-l-4 border-[#00D69A]"
                              : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                          }`}
                        >
                          <span>{item.label}</span>
                          {isActive && (
                            <span
                              className="w-2 h-2 rounded-full bg-[#00D69A] shadow-[0_0_6px_rgba(0,214,154,0.8)]"
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-slate-800 flex flex-col gap-2.5">
              {isAuthenticated && user ? (
                <>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00D69A]/10 text-[#00D69A] border border-[#00D69A]/20">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={handleClose}
                    className="w-full py-2.5 text-center text-xs font-bold rounded-xl text-slate-950 bg-gradient-to-r from-[#00F5A0] via-[#00D69A] to-[#00B884] shadow-sm transition-all"
                  >
                    Open Workstation Dashboard &rarr;
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      logout();
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold rounded-xl text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={handleClose}
                    className="w-full py-2.5 text-center text-sm font-semibold rounded-xl text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white transition-all border border-slate-700/50"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={handleClose}
                    className="w-full py-2.5 text-center text-sm font-bold rounded-xl text-slate-950 bg-gradient-to-r from-[#00F5A0] via-[#00D69A] to-[#00B884] hover:from-[#1AFFB0] hover:to-[#00C990] shadow-[0_2px_14px_rgba(0,214,154,0.35)] transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
              <p className="text-[11px] text-center text-slate-400 font-medium mt-1">
                Enterprise Data Discovery Platform
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
