import React from "react";
import { Hero } from "@/features/landing/components/Hero";
import { MetricsStrip } from "@/features/landing/components/MetricsStrip";
import { InteractiveExplorerDemo } from "@/features/landing/components/InteractiveExplorerDemo";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <Hero />
      <MetricsStrip />
      <InteractiveExplorerDemo />
    </main>
  );
}
