import React from "react";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  title: string;
  value: string | number;
  trendText?: string;
  trendType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  valueClassName?: string;
}

export const StatsCard = ({
  title,
  value,
  trendText,
  trendType = "positive",
  icon,
  align = "left",
  className,
  valueClassName,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-card via-card to-coral-light/20 border border-border-peach/80 flex flex-col justify-between min-h-[125px] shadow-2xs transition-all duration-300 hover:shadow-md hover:border-coral/50 hover:-translate-y-0.5 group",
        align === "center"
          ? "items-center text-center justify-center"
          : "items-start text-left",
        className
      )}
    >
      {/* Subtle decorative glow circle in corner */}
      <div className="absolute -right-6 -top-6 size-20 rounded-full bg-coral/5 blur-xl pointer-events-none group-hover:bg-coral/10 transition-colors" />

      <div
        className={cn(
          "flex w-full items-center",
          align === "center" ? "justify-center" : "justify-between"
        )}
      >
        <h3 className="text-ink-muted text-xs font-bold uppercase tracking-wider font-quicksand group-hover:text-ink transition-colors">
          {title}
        </h3>
        {icon && align === "left" && (
          <div className="size-9 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center text-coral shrink-0 shadow-2xs group-hover:scale-110 group-hover:bg-coral group-hover:text-white transition-all duration-200">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2">
        <p className={cn("text-2xl font-bold text-ink font-quicksand tracking-tight", valueClassName)}>
          {value}
        </p>

        {trendText && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={cn(
                "inline-block size-1.5 rounded-full shrink-0",
                trendType === "positive" && "bg-emerald-500",
                trendType === "negative" && "bg-rose-500",
                trendType === "neutral" && "bg-coral"
              )}
            />
            <p
              className={cn(
                "text-xs font-semibold",
                trendType === "positive" && "text-emerald-600 dark:text-emerald-400",
                trendType === "negative" && "text-rose-600 dark:text-rose-400",
                trendType === "neutral" && "text-ink-muted"
              )}
            >
              {trendText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
