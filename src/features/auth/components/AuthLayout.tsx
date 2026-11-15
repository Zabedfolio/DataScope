import React from "react";
import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#F8FAF9] via-[#F3F9F7] to-[#EAF5F1] dark:from-[#061114] dark:via-[#08181D] dark:to-[#040C0E] transition-colors duration-300">
      {/* Background Ambience */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[36rem] h-[36rem] bg-[#00D69A]/8 dark:bg-[#00D69A]/6 rounded-full blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 right-1/3 w-[30rem] h-[30rem] bg-cyan-500/8 dark:bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none"
      />

      <div className="relative w-full max-w-md z-10 my-auto">
        {/* Header (Clean title and subtitle with proper navbar clearance) */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 shadow-2xl backdrop-blur-xl p-6 sm:p-8 transition-all">
          {children}
        </div>

        {/* Security Footnote */}
        <div className="mt-6 text-center text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <svg className="w-3.5 h-3.5 text-[#00D69A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>TLS 1.3 • SOC2 Encrypted Session</span>
        </div>
      </div>
    </div>
  );
}

