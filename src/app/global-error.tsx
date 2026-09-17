"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background flex items-center justify-center p-4 font-sans text-ink">
        <div className="max-w-md w-full p-8 bg-card rounded-xl border border-border-peach text-center space-y-6 shadow-xl">
          <div className="size-16 rounded-xl bg-coral-light text-coral flex items-center justify-center mx-auto shadow-xs">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-ink font-quicksand">
              Application Error
            </h1>
            <p className="text-xs text-ink-muted leading-relaxed">
              A critical error occurred in the layout boundary. Please refresh or try again.
            </p>
          </div>

          <PrimaryButton
            variant="danger"
            size="lg"
            fullWidth
            onClick={() => reset()}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Try Reloading App
          </PrimaryButton>
        </div>
      </body>
    </html>
  );
}
