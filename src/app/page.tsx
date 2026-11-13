import React from "react";
import { Hero } from "@/features/landing/components/Hero";
import { MetricsStrip } from "@/features/landing/components/MetricsStrip";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <Hero />
      <MetricsStrip />
    </main>
  );
}
