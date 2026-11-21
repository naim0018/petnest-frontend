import React from "react";
import { cn } from "@/lib/utils";

export type TableBadgeVariant =
  | "coral"
  | "success"
  | "emerald"
  | "warning"
  | "amber"
  | "danger"
  | "rose"
  | "info"
  | "sky"
  | "blue"
  | "neutral"
  | "gray"
  | "purple";

export interface TableBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  label?: React.ReactNode;
  variant?: TableBadgeVariant;
  /** Fixed width class for column-wide badge uniformity (e.g. "w-40", "w-36", "w-32", "w-28"). Defaults to "w-36". */
  width?: string;
  /** Whether to show a leading status dot indicator */
  dot?: boolean;
}

export const TableBadge: React.FC<TableBadgeProps> = ({
  children,
  label,
  variant = "coral",
  width = "w-36",
  dot = false,
  className,
  ...props
}) => {
  const content = children ?? label;

  const variantStyles: Record<TableBadgeVariant, string> = {
    coral: "bg-coral/10 text-coral border-coral/20",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    info: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    neutral: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    gray: "bg-surface-muted text-ink-muted border-border-peach",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  };

  const dotStyles: Record<TableBadgeVariant, string> = {
    coral: "bg-coral",
    success: "bg-emerald-500",
    emerald: "bg-emerald-500",
    warning: "bg-amber-500",
    amber: "bg-amber-500",
    danger: "bg-rose-500",
    rose: "bg-rose-500",
    info: "bg-sky-500",
    sky: "bg-sky-500",
    blue: "bg-blue-500",
    neutral: "bg-slate-500",
    gray: "bg-ink-muted",
    purple: "bg-purple-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-quicksand border text-center select-none shadow-2xs shrink-0 whitespace-nowrap",
        width,
        variantStyles[variant] || variantStyles.coral,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full shrink-0",
            dotStyles[variant] || "bg-current"
          )}
        />
      )}
      <span className="truncate">{content}</span>
    </span>
  );
};

export const StatusPill = TableBadge;
