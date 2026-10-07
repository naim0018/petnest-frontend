"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { NavGroup } from "@/lib/nav";

interface DashboardShellProps {
  children: React.ReactNode;
  navGroups: NavGroup[];
  logoText?: string;
  title?: string;
  description?: string;
}

export default function DashboardShell({
  children,
  navGroups,
}: DashboardShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        navGroups={navGroups}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Backdrop overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-xs z-40 sm:hidden transition-opacity duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Header with relocated Breadcrumbs and clean navigation */}
        <Header onMenuClick={() => setIsMobileOpen(true)} />

        {/* Content View */}
        <main className="flex-1 px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
