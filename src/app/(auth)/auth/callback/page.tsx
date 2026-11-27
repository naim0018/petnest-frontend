"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "true") {
      toast.success("Successfully signed in with Google!");
      // Full redirect to root to hydrate cookies & session
      window.location.href = "/";
    } else if (error) {
      toast.error(decodeURIComponent(error) || "Google authentication failed");
      router.replace("/login");
    } else {
      router.replace("/");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface-soft dark:bg-surface-dark font-quicksand">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm p-8 rounded-3xl bg-card border border-border-peach shadow-sm">
        <div className="size-12 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-ink">Signing You In</h2>
          <p className="text-xs text-ink-muted">
            Finalizing secure session with Google...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6 bg-surface-soft dark:bg-surface-dark">
          <Loader2 className="size-8 animate-spin text-coral" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
