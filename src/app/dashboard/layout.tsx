import React from "react";
import "@/app/globals.css";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { WorkstationTopBar } from "@/components/layout/Sidebar/WorkstationTopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-10 flex w-screen h-screen overflow-hidden bg-slate-50 dark:bg-[#040C0E]">
      {/* 1. Collapsible Workstation Sidebar - Fixed on the left */}
      <Sidebar />

      {/* 2. Main Workstation Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Workstation Header Bar - Fixed on top */}
        <WorkstationTopBar />

        {/* Scrollable Workstation Content Canvas - Strictly scrolls internally */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
