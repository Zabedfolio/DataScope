import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex min-h-screen w-full bg-slate-50/50 dark:bg-[#040C0E]">
      {/* Collapsible Workstation Sidebar */}
      <Sidebar />

      {/* Main View Port */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

