"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  Heart,
  MessageSquare,
  Clock,
  ArrowRight,
} from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import StatsCard from "@/components/common/StatsCard";

const ACTIVITY_ITEMS = [
  {
    id: "act-1",
    action: "Bookmarked guide",
    target: "Budgerigar Care 101",
    href: "/guides/budgerigar-care-101",
    time: "2 hours ago",
    icon: Bookmark,
    badgeClass: "bg-[#FEE6E6] text-[#E11D48] dark:bg-rose-950/40 dark:text-rose-300",
  },
  {
    id: "act-2",
    action: "Liked guide",
    target: "Cat Nutrition Guide",
    href: "/guides/cat-nutrition-guide",
    time: "Yesterday",
    icon: Heart,
    badgeClass: "bg-[#FFEAE7] text-[#F43F5E] dark:bg-rose-950/40 dark:text-rose-300",
  },
  {
    id: "act-3",
    action: "Commented on community post",
    target: "Best winter bedding for hamsters",
    href: "/community",
    time: "3 days ago",
    icon: MessageSquare,
    badgeClass: "bg-[#E3EFFD] text-[#0284C7] dark:bg-sky-950/40 dark:text-sky-300",
  },
  {
    id: "act-4",
    action: "Completed reading",
    target: "Dog Health Tips",
    href: "/guides/dog-health-tips",
    time: "5 days ago",
    icon: BookOpen,
    badgeClass: "bg-[#E2F1EA] text-[#10B981] dark:bg-emerald-950/40 dark:text-emerald-300",
  },
];

export default function UserActivityPage() {
  return (
    <div className="w-full space-y-6 font-quicksand">
      {/* Activity Stats */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Guides Read"
            value={14}
            icon={<BookOpen className="size-4.5" />}
            trendText="+3 this week"
            trendType="positive"
          />
          <StatsCard
            title="Bookmarks"
            value={12}
            icon={<Bookmark className="size-4.5" />}
            trendText="Saved for quick access"
            trendType="neutral"
          />
          <StatsCard
            title="Likes Given"
            value={28}
            icon={<Heart className="size-4.5" />}
            trendText="+6 this week"
            trendType="positive"
          />
          <StatsCard
            title="Comments"
            value={5}
            icon={<MessageSquare className="size-4.5" />}
            trendText="Active contributor"
            trendType="neutral"
          />
        </div>
      </AnimatedContainer>

      {/* Recent Activity Timeline */}
      <AnimatedContainer
        delay={0.1}
        className="bg-card border border-border-peach/60 rounded-xl p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink tracking-tight">
            Recent Activity
          </h2>
          <span className="text-xs font-semibold text-ink-muted">
            Last 30 days
          </span>
        </div>

        <div className="space-y-3">
          {ACTIVITY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-border-peach/40 bg-[#FAF9F8] dark:bg-surface-muted/30 hover:border-coral/40 hover:bg-surface-muted/60 transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${item.badgeClass}`}
                  >
                    <Icon className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink truncate group-hover:text-coral transition-colors">
                      {item.target}
                    </p>
                    <p className="text-xs font-medium text-ink-muted truncate">
                      {item.action}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                    <Clock className="size-3.5" />
                    {item.time}
                  </span>
                  <ArrowRight className="size-4 text-ink-muted group-hover:text-coral group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </AnimatedContainer>
    </div>
  );
}
