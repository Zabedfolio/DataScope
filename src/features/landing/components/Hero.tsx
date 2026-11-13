import React from "react";
import { CenteredHeroHeader } from "./CenteredHeroHeader";
import { IsometricDataStage } from "./IsometricDataStage";

export function Hero() {
  return (
    <section
      aria-label="Hero Section"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#F8FAF9] via-[#F3F9F7] to-[#EAF5F1] dark:from-[#061114] dark:via-[#08181D] dark:to-[#040C0E] py-8 sm:py-12 lg:py-0 lg:h-[calc(100dvh-5rem)] lg:min-h-[640px] flex items-center justify-center transition-colors duration-300"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D69A]/8 dark:bg-[#00D69A]/6 rounded-full blur-[100px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-[#0E7C86]/10 dark:bg-[#00F5A0]/8 rounded-full blur-[110px] pointer-events-none"
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-8 z-10">
        {/* Left Column: Typography & CTAs (Left-aligned on desktop, Centered on mobile) */}
        <div className="w-full lg:w-[48%] xl:w-[46%] shrink-0 flex flex-col justify-center">
          <CenteredHeroHeader />
        </div>

        {/* Right Column: Isometric Illustration Stage */}
        <div className="w-full lg:w-[52%] xl:w-[54%] flex items-center justify-center">
          <IsometricDataStage />
        </div>
      </div>
    </section>
  );
}
