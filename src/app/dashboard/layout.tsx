import React from "react";
import { Sidebar, WorkstationTopBar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#040C0E]">
      {/* 1. Collapsible Workstation Sidebar */}
      <Sidebar />

      {/* 2. Main Workstation Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Workstation Header Bar (Breadcrumb, Cluster Health, Theme, User) */}
        <WorkstationTopBar />

        {/* Scrollable Workstation Content Canvas */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
