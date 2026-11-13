import React from "react";
import Link from "next/link";
import { HERO_CONTENT } from "../constants/hero";

export function CenteredHeroHeader() {
  const { eyebrow, headline, subtext, cta } = HERO_CONTENT;

  return (
    <div className="w-full max-w-xl xl:max-w-2xl flex flex-col items-center lg:items-start text-center lg:text-left z-20">
      {/* Eyebrow Badge */}
      <div className="hero-fade-in inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-slate-900/90 dark:bg-slate-950/90 border border-[#00D69A]/30 text-[10px] sm:text-[11px] font-mono font-medium text-slate-100 dark:text-[#EAF7F3] shadow-[0_2px_8px_rgba(0,214,154,0.1)] mb-4 sm:mb-5 backdrop-blur-md">
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#00D69A] animate-pulse shrink-0"
          aria-hidden="true"
        />
        <span className="tracking-wide sm:tracking-wider uppercase">{eyebrow}</span>
      </div>

      {/* Two-Tone Headline */}
      <h1 className="hero-fade-in text-slate-950 dark:text-white tracking-[-0.035em] leading-[1.08] mb-5 sm:mb-6 text-balance text-[clamp(2.3rem,4.5vw,3.75rem)] xl:text-[4rem] [animation-delay:100ms]">
        <span className="block font-bold">
          {headline.line1}
        </span>
        <span className="block mt-1 sm:mt-1.5">
          <span className="font-bold">{headline.line2Bold}</span>
          <span className="font-serif italic font-normal text-slate-400 dark:text-slate-400 transition-colors">
            {headline.line2Muted}
          </span>
        </span>
      </h1>

      {/* Subtext */}
      <p className="hero-fade-in text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6 sm:mb-8 [animation-delay:200ms]">
        {subtext}
      </p>

      {/* Action Buttons */}
      <div className="hero-fade-in flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-5 [animation-delay:300ms]">
        <Link
          href={cta.primary.href}
          className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold rounded-full text-[#06141A] bg-gradient-to-r from-[#00F5A0] via-[#00D69A] to-[#00B884] hover:from-[#1AFFB0] hover:to-[#00C990] shadow-[0_4px_22px_rgba(0,214,154,0.36)] hover:shadow-[0_6px_30px_rgba(0,214,154,0.56)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D69A] focus-visible:ring-offset-2 tracking-wide"
        >
          <span>{cta.primary.label}</span>
          <svg
            className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
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

        <Link
          href={cta.secondary.href}
          className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-full border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:border-[#00D69A]/60 dark:hover:border-[#00D69A]/50 shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D69A]"
        >
          {cta.secondary.label}
        </Link>
      </div>
    </div>
  );
}
