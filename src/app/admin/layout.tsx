"use client";

import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { adminNavItems } from "@/lib/nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      navGroups={adminNavItems}
      logoText="BASEKIT ADMIN"
      title="Admin Overview"
      description="Welcome back to your administration control center."
    >
      {children}
    </DashboardShell>
  );
}
