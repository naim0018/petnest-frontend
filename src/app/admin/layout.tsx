"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { adminNavItems } from "@/lib/nav";
import { HeaderActionProvider } from "@/context/HeaderActionContext";
import { useAppSelector } from "@/hooks/useRedux";
import { toast } from "sonner";
import { ShieldAlert, Loader2 } from "lucide-react";

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

  // Loading state while verifying role
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-soft">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-coral" />
          <p className="text-sm font-semibold text-ink-muted font-quicksand">
            Verifying permissions...
          </p>
        </div>
      </div>
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
