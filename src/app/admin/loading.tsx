import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 4 Stats Cards Skeleton */}
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

      {/* Content Grid Skeleton */}
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
  );
}
