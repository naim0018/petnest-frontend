"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  BookOpen,
  ShoppingCart,
  PawPrint,
  Home,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";

const QUICK_ACTIONS = [
  {
    title: "Browse Pet Guides",
    subtitle: "Care tips & nutrition",
    href: "/guides",
    icon: BookOpen,
    badgeClass: "bg-[#FEE6E6] text-[#E11D48] dark:bg-rose-950/40 dark:text-rose-300",
  },
  {
    title: "Shop Pet Care",
    subtitle: "Food, toys & essentials",
    href: "/marketplace",
    icon: ShoppingCart,
    badgeClass: "bg-[#E7F6F1] text-[#059669] dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  {
    title: "Find a Vet",
    subtitle: "Ask community & clinics",
    href: "/community",
    icon: PawPrint,
    badgeClass: "bg-[#FEF3DF] text-[#D97706] dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    title: "Adopt a Pet",
    subtitle: "Find a new companion",
    href: "/adoption",
    icon: Home,
    badgeClass: "bg-[#EAE8FD] text-[#7C3AED] dark:bg-purple-950/40 dark:text-purple-300",
  },
];

export default function QuickActionsCard() {
  return (
    <AnimatedContainer
      delay={0.2}
      className="lg:col-span-4 bg-white dark:bg-card border border-border-peach/60 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="size-5 text-[#F59E0B] fill-[#F59E0B]" />
          <h2 className="text-lg font-extrabold font-quicksand text-ink tracking-tight">
            Quick Actions
          </h2>
        </div>

        <div className="space-y-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border-peach/40 bg-[#FAF9F8] dark:bg-surface-muted/30 hover:border-coral/40 hover:bg-surface-muted/60 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${action.badgeClass}`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold font-quicksand text-ink truncate group-hover:text-coral transition-colors">
                      {action.title}
                    </p>
                    <p className="text-xs font-medium text-ink-muted truncate">
                      {action.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-ink-muted shrink-0 group-hover:translate-x-0.5 group-hover:text-coral transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Daily Care Tip */}
      <div className="rounded-xl p-3.5 bg-gradient-to-r from-[#FFF5F0] to-[#FEF0E8] dark:from-coral/10 dark:to-amber-950/20 border border-coral/20 space-y-1.5">
        <div className="flex items-center gap-1.5 text-coral">
          <Sparkles className="size-3.5 shrink-0" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider">
            Daily Care Tip
          </span>
        </div>
        <p className="text-[13px] font-medium text-ink/85 dark:text-ink-muted leading-relaxed">
          Refresh your pet&apos;s water bowl twice daily and wash it with warm
          water to prevent bacteria buildup.
        </p>
      </div>
    </AnimatedContainer>
  );
}
