"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { userNavItems } from "@/lib/nav";
import { useAppSelector } from "@/hooks/useRedux";
import { Loader2 } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-surface-soft">
        <Loader2 className="size-8 animate-spin text-coral" />
      </div>
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
