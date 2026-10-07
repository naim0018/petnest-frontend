"use client";

import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { adminNavItems } from "@/lib/nav";
import { HeaderActionProvider } from "@/context/HeaderActionContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderActionProvider>
      <DashboardShell
        navGroups={adminNavItems}
        logoText="PETNEST ADMIN"
        title="Admin Overview"
        description="Welcome back to your administration control center."
      >
        {children}
      </DashboardShell>
    </HeaderActionProvider>
  );
}
