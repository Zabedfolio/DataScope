import React from "react";
import { Hero } from "@/features/landing/components/Hero";
import { MetricsStrip } from "@/features/landing/components/MetricsStrip";
import { InteractiveExplorerDemo } from "@/features/landing/components/InteractiveExplorerDemo";
import { BentoFeatures } from "@/features/landing/components/BentoFeatures";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { LandingCta } from "@/features/landing/components/LandingCta";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <Hero />
      <MetricsStrip />
      <InteractiveExplorerDemo />
      <BentoFeatures />
      <HowItWorks />
      <LandingCta />
      <Footer />
    </main>
  );
}
