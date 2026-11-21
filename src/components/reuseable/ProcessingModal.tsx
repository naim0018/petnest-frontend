"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProcessingStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done" | "error";
  detail?: string;
}

export interface ProcessingModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  progress?: number;
  steps?: ProcessingStep[];
  badgeText?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function ProcessingModal({
  isOpen,
  title,
  description,
  progress,
  steps,
  badgeText = "Processing",
  icon,
  className,
}: ProcessingModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const clampedProgress =
    typeof progress === "number"
      ? Math.max(0, Math.min(100, Math.round(progress)))
      : undefined;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-busy="true"
    >
      <div
        className={cn(
          "w-full max-w-md bg-card border border-border-peach rounded-2xl p-6 sm:p-8 shadow-2xl relative text-center select-none animate-in zoom-in-95 duration-200 overflow-hidden",
          className
        )}
      >
        {/* Organic Pastel Corner Blobs (Theme Tokens Only) */}
        <svg
          className="absolute top-0 left-0 size-40 pointer-events-none select-none z-0 text-tint-rose opacity-80 dark:opacity-20"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 0 0 L 175 0 C 160 45 130 80 95 105 C 60 130 25 150 0 190 Z"
            fill="currentColor"
          />
        </svg>

        <svg
          className="absolute bottom-0 right-0 size-40 pointer-events-none select-none z-0 text-tint-rose opacity-80 dark:opacity-20"
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 220 220 L 45 220 C 80 190 115 160 138 120 C 160 80 185 45 220 20 Z"
            fill="currentColor"
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center space-y-5">
          {/* Status Badge */}
          {badgeText && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tint-rose border border-coral/20 text-xs font-bold text-coral">
              <span className="size-1.5 rounded-full bg-coral animate-pulse" />
              {badgeText}
            </span>
          )}

          {/* Branded Animated Ring Icon */}
          <div className="relative flex items-center justify-center">
            <div className="size-16 rounded-full bg-tint-rose border-2 border-coral/25 flex items-center justify-center text-coral relative">
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-coral animate-spin" />
              {icon ?? <Loader2 className="size-7 text-coral animate-spin" />}
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5 px-2">
            <h2 className="text-xl sm:text-2xl font-extrabold font-quicksand text-ink leading-tight">
              {title}
            </h2>
            {description && (
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Live Progress Bar */}
          {clampedProgress !== undefined && (
            <div className="w-full space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-ink-muted">Progress</span>
                <span className="text-coral font-mono">{clampedProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-muted overflow-hidden border border-border-peach">
                <div
                  className="h-full bg-coral rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${clampedProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Live Processing Step List */}
          {steps && steps.length > 0 && (
            <div className="w-full rounded-xl bg-surface-soft border border-border-peach p-3.5 space-y-2.5 text-left">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between gap-2.5 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {step.status === "done" ? (
                      <CheckCircle2 className="size-4 text-success shrink-0" />
                    ) : step.status === "active" ? (
                      <Loader2 className="size-4 text-coral animate-spin shrink-0" />
                    ) : step.status === "error" ? (
                      <AlertCircle className="size-4 text-destructive shrink-0" />
                    ) : (
                      <span className="size-4 rounded-full border-2 border-border-peach inline-block shrink-0" />
                    )}
                    <span
                      className={cn(
                        "truncate",
                        step.status === "active"
                          ? "font-bold text-ink"
                          : step.status === "done"
                          ? "font-semibold text-success"
                          : step.status === "error"
                          ? "font-semibold text-destructive"
                          : "text-ink-muted"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {step.detail && (
                    <span
                      className={cn(
                        "text-xs font-mono shrink-0",
                        step.status === "active"
                          ? "text-coral font-bold"
                          : step.status === "done"
                          ? "text-success font-semibold"
                          : "text-ink-faint"
                      )}
                    >
                      {step.detail}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-ink-faint">
            Please keep this window open until processing completes.
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
