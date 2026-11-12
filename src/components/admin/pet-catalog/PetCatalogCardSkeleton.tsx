"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PetCatalogCardSkeletonProps {
  /** Whether to render subtitle placeholder bar */
  hasSubtitle?: boolean;
  /** Whether to render keyword tags placeholder row */
  hasTags?: boolean;
  /** Optional class override for the card container */
  className?: string;
}

/**
 * PetCatalogCardSkeleton
 *
 * Exact layout-parity skeleton for `PetCatalogCard`.
 * Matches slot heights, wave cut SVG, frosted badge, and action bar
 * to guarantee 0 cumulative layout shift (CLS) during catalog fetches.
 */
export default function PetCatalogCardSkeleton({
  hasSubtitle = false,
  hasTags = false,
  className,
}: PetCatalogCardSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border-peach/90 rounded-lg overflow-hidden shadow-xs flex flex-col relative animate-pulse",
        className
      )}
    >
      {/* 🖼️ BANNER SKELETON: Top Image/Mascot placeholder with signature wave */}
      <div className="relative h-48 sm:h-52 w-full shrink-0">
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-rose-50/70 via-orange-50/30 to-tint-rose/40 dark:from-tint-rose/20 dark:via-surface-soft dark:to-surface-muted flex items-center justify-center">
          {/* Subtle mascot silhouette placeholder */}
          <div className="size-20 sm:size-24 rounded-full bg-surface-muted/60 dark:bg-surface-muted/40" />

          {/* Frosted Badge Placeholder on top left */}
          <div className="absolute top-3 left-3 z-20">
            <div className="h-6 w-20 rounded-full bg-white/90 dark:bg-card/90 border border-coral/15" />
          </div>
        </div>

        {/* PetNest Signature Double Wave Cut Transition */}
        <div className="absolute -bottom-2.5 left-0 right-0 w-full pointer-events-none z-10 leading-none">
          <svg
            viewBox="0 0 500 90"
            preserveAspectRatio="none"
            className="w-full h-14 block"
          >
            <path
              d="M0,20 C130,2 270,42 500,14 L500,90 L0,90 Z"
              fill="#FFE2DD"
              className="dark:fill-coral/25"
            />
            <path
              d="M0,20 C130,2 270,42 500,14"
              fill="none"
              stroke="#FB7185"
              strokeWidth="2.5"
              strokeOpacity="0.6"
            />
            <path
              d="M0,30 C140,10 290,50 500,24 L500,90 L0,90 Z"
              className="fill-card"
            />
          </svg>
        </div>
      </div>

      {/* 📋 BODY SKELETON: Exact 5-Slot Fixed Alignment */}
      <div className="p-4 pt-1 -mt-2 relative z-20 flex-1 flex flex-col">
        {/* SLOT 1: Header (Title, Subtitle, Pill Badge) */}
        <div
          className={cn(
            "flex items-start justify-between gap-2 shrink-0",
            hasSubtitle ? "min-h-[2.75rem]" : "min-h-0"
          )}
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-5 w-3/4 bg-surface-muted rounded-md" />
            {hasSubtitle && (
              <div className="h-3.5 w-1/2 bg-surface-muted/70 rounded-md" />
            )}
          </div>
          <div className="h-6 w-16 bg-tint-rose/70 rounded-full border border-coral/15 shrink-0" />
        </div>

        {/* SLOT 2: Description + Read More */}
        <div
          className={cn(
            "h-16 flex flex-col justify-between shrink-0",
            hasSubtitle ? "mt-2" : "mt-1.5"
          )}
        >
          <div className="space-y-1.5">
            <div className="h-3.5 w-full bg-surface-muted/80 rounded" />
            <div className="h-3.5 w-4/5 bg-surface-muted/65 rounded" />
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <div className="h-3 w-16 bg-surface-muted/50 rounded" />
            <div className="h-3 w-20 bg-surface-muted/50 rounded ml-auto" />
          </div>
        </div>

        {/* SLOT 3: Tags (Rendered when hasTags is true) */}
        {hasTags && (
          <div className="h-7 mt-2 flex items-center gap-1.5 shrink-0 overflow-hidden">
            <div className="h-5 w-16 rounded-full bg-tint-rose/50 border border-coral/15" />
            <div className="h-5 w-14 rounded-full bg-tint-rose/50 border border-coral/15" />
            <div className="h-5 w-12 rounded-full bg-tint-rose/50 border border-coral/15" />
          </div>
        )}

        {/* SLOT 4: Status & Metadata Bar */}
        <div className="h-9 mt-2.5 px-3 rounded-md bg-tint-rose/30 border border-border-peach/80 flex items-center justify-between shrink-0">
          <div className="h-3.5 w-20 bg-surface-muted/80 rounded" />
          <span className="text-border-peach mx-1">|</span>
          <div className="h-3.5 w-24 bg-surface-muted/70 rounded" />
        </div>

        {/* SLOT 5: Bottom Action Toolbar */}
        <div className="mt-auto pt-3 border-t border-border-peach/50 flex items-center gap-2 shrink-0">
          <div className="h-9 flex-1 rounded-full bg-surface-muted/80 border border-border-peach/70" />
          <div className="h-9 flex-1 rounded-full bg-coral/25 border border-coral/30" />
          <div className="size-9 rounded-full bg-surface-muted/60 border border-red-100 shrink-0" />
        </div>
      </div>
    </div>
  );
}

export interface PetCatalogGridSkeletonProps {
  /** Number of skeleton cards to render. Defaults to 10. */
  count?: number;
  /** Whether each skeleton card renders tags row */
  hasTags?: boolean;
  /** Whether each skeleton card renders subtitle bar */
  hasSubtitle?: boolean;
  /** Grid class overrides */
  gridClassName?: string;
}

/**
 * PetCatalogGridSkeleton
 *
 * Configurable multi-card responsive grid skeleton for pet catalog pages.
 */
export function PetCatalogGridSkeleton({
  count = 10,
  hasTags = false,
  hasSubtitle = false,
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
}: PetCatalogGridSkeletonProps) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }).map((_, index) => (
        <PetCatalogCardSkeleton
          key={index}
          hasTags={hasTags}
          hasSubtitle={hasSubtitle}
        />
      ))}
    </div>
  );
}

