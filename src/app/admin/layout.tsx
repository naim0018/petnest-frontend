"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { adminNavItems } from "@/lib/nav";
import { HeaderActionProvider } from "@/context/HeaderActionContext";
import { useAppSelector } from "@/hooks/useRedux";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("just_logged_out")) {
      return;
    }

    // 1. Verify if user is logged in
    const isLoggedIn = Boolean(
      user && (user.userId || user.email)
    );

    if (!isLoggedIn) {
      toast.error("Please login to access the administration dashboard.");
      router.replace("/login");
      setIsAuthorized(false);
      return;
    }

    // 2. Verify roles: Only ADMIN, SUPERADMIN, AUTHOR, and VET can access admin portal
    const allowedRoles = ["ADMIN", "SUPERADMIN", "AUTHOR", "VET"];
    const currentRole = user?.role ? user.role.toUpperCase() : "USER";

    if (!allowedRoles.includes(currentRole)) {
      toast.error(
        `Access denied: Your account role (${currentRole}) does not have administrator privileges.`
      );
      router.replace("/");
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
  }, [user, router]);

  // If logging out, do not render admin shell while redirecting to homepage
  if (typeof window !== "undefined" && sessionStorage.getItem("just_logged_out")) {
    return null;
  }

  // Loading state while verifying role: render exact dashboard shell with layout skeleton
  if (isAuthorized === null) {
    return (
      <HeaderActionProvider>
        <DashboardShell
          navGroups={adminNavItems}
          logoText="PETNEST ADMIN"
          title="Admin Overview"
          description="Welcome back to your administration control center."
        >
          <div className="space-y-6 animate-pulse">
            {/* Top 4 Stats Row Skeleton */}
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

            {/* Search Filter Bar Skeleton */}
            <div className="flex items-center justify-end">
              <div className="w-full max-w-md h-11 bg-card border border-border-peach rounded-xl shadow-2xs" />
            </div>

            {/* Grid Skeletons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-44 bg-surface-muted rounded" />
                <div className="h-4 w-32 bg-surface-muted/60 rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-card border border-border-peach overflow-hidden shadow-2xs flex flex-col min-h-[280px]"
                  >
                    <div className="w-full h-44 bg-surface-muted" />
                    <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="h-4 w-32 bg-surface-muted rounded" />
                        <div className="h-3 w-48 bg-surface-muted/60 rounded" />
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border-peach/50">
                        <div className="h-3 w-16 bg-surface-muted/70 rounded" />
                        <div className="h-6 w-16 bg-surface-muted/70 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardShell>
      </HeaderActionProvider>
    );
  }

  // Fallback while redirecting unauthorized users
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-soft p-4">
        <div className="text-center p-8 bg-card border border-border-peach rounded-2xl max-w-md shadow-sm">
          <ShieldAlert className="size-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-ink font-quicksand">Access Denied</h2>
          <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
            Your account ({user?.email || "User"}) has the role <strong>{user?.role || "USER"}</strong>, which cannot access the PetNest Admin Dashboard. Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

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
