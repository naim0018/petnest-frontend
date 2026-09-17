"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public Route Error:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto my-16 p-8 bg-card border border-border-peach rounded-xl text-center space-y-6 shadow-xs animate-in fade-in">
      <div className="size-16 rounded-xl bg-coral-light flex items-center justify-center mx-auto text-coral">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-ink font-quicksand">Something went wrong</h2>
        <p className="text-xs text-ink-muted leading-relaxed max-w-sm mx-auto">
          We encountered an unexpected issue loading this page section. You can try refreshing the component.
        </p>
      </div>
      <PrimaryButton
        variant="primary"
        size="md"
        onClick={() => reset()}
        leftIcon={<RotateCcw className="w-4 h-4" />}
      >
        Try Again
      </PrimaryButton>
    </div>
  );
}
