"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { userNavItems } from "@/lib/nav";
import { useAppSelector } from "@/hooks/useRedux";
import { toast } from "sonner";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && sessionStorage.getItem("just_logged_out")) {
      return;
    }
    const isLoggedIn = Boolean(
      user && (user.userId || user.email)
    );
    if (!isLoggedIn) {
      toast.error("Please log in to view your dashboard");
      router.replace("/login");
    }
  }, [user, router]);

  if (typeof window !== "undefined" && sessionStorage.getItem("just_logged_out")) {
    return null;
  }

  if (!mounted) {
    return (
      <DashboardShell
        navGroups={userNavItems}
        logoText="PETNEST"
        title="User Dashboard"
        description="Manage your personal settings, profile, and activities."
      >
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl bg-card border border-border-peach/80 min-h-[125px] flex flex-col justify-between shadow-2xs"
              >
                <div className="h-3 w-28 bg-surface-muted rounded" />
                <div className="space-y-2 mt-2">
                  <div className="h-6 w-36 bg-surface-muted rounded" />
                  <div className="h-3 w-24 bg-surface-muted/70 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-card border border-border-peach shadow-2xs" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      navGroups={userNavItems}
      logoText="PETNEST"
      title="User Dashboard"
      description="Manage your personal settings, profile, and activities."
    >
      {children}
    </DashboardShell>
  );
}
