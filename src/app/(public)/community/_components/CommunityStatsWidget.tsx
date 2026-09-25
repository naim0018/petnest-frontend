import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMMUNITY_STATS } from "./communityData";

export function CommunityStatsWidget() {
  return (
    <div className="bg-card border border-border-peach dark:border-slate-800/80 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="size-9 rounded-full bg-coral-light/70 dark:bg-coral/20 text-coral flex items-center justify-center shrink-0">
          <Users className="w-4 h-4 text-coral" />
        </div>
        <div>
          <h4 className="text-coral font-bold font-quicksand">
            Community Stats
          </h4>
          <small className="text-ink-muted leading-none">Pet lovers together</small>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        {COMMUNITY_STATS.map((stat) => {
          const valueColor = stat.isOnline
            ? "text-emerald-500"
            : stat.label === "Members"
            ? "text-blue-500"
            : "text-coral";

          return (
            <div
              key={stat.label}
              className="p-2.5 rounded-xl bg-surface-muted/60 dark:bg-card border border-border-peach/50 flex flex-col items-center justify-center"
            >
              <div className="flex items-center gap-1.5">
                {stat.isOnline && (
                  <span className="size-2 rounded-full bg-emerald-500" />
                )}
                <span className={cn("text-sm sm:text-base font-extrabold font-quicksand", valueColor)}>
                  {stat.value}
                </span>
              </div>
              <span className="text-[10px] text-ink-muted font-medium mt-0.5">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
