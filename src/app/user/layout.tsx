"use client";

import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { userNavItems } from "@/lib/nav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      navGroups={userNavItems}
      logoText="BASEKIT USER"
      title="User Dashboard"
      description="Manage your personal settings, profile, and activities."
    >
      {children}
    </DashboardShell>
  );
}
