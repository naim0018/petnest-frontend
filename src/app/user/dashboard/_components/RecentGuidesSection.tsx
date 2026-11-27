"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowRight, Calendar, Bookmark } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";

export interface RecentGuideItem {
  id: string;
  title: string;
  category: string;
  date: string;
  slug: string;
  image: string;
}

interface RecentGuidesSectionProps {
  guides?: RecentGuideItem[];
  bookmarkedMap: Record<string, boolean>;
  onToggleBookmark: (id: string, title: string) => void;
}

const DEFAULT_RECENT_GUIDES: RecentGuideItem[] = [
  {
    id: "guide-1",
    title: "Budgerigar Care 101",
    category: "Bird Care • Beginner",
    date: "Nov 15, 2026",
    slug: "budgerigar-care-101",
    image: "/dashboard/guide-budgie.png",
  },
  {
    id: "guide-2",
    title: "Cat Nutrition Guide",
    category: "Cat Care • Health",
    date: "Nov 12, 2026",
    slug: "cat-nutrition-guide",
    image: "/dashboard/guide-cat.png",
  },
  {
    id: "guide-3",
    title: "Dog Health Tips",
    category: "Dog Care • Health",
    date: "Nov 10, 2026",
    slug: "dog-health-tips",
    image: "/dashboard/guide-dog.png",
  },
];

export default function RecentGuidesSection({
  guides = DEFAULT_RECENT_GUIDES,
  bookmarkedMap,
  onToggleBookmark,
}: RecentGuidesSectionProps) {
  return (
    <AnimatedContainer
      delay={0.25}
      className="lg:col-span-8 bg-white dark:bg-card border border-border-peach/60 rounded-xl p-5 sm:p-6 shadow-xs space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-[#0284C7]" />
          <h2 className="text-base sm:text-lg font-bold font-quicksand text-ink">
            Recent Guides
          </h2>
        </div>
        <Link
          href="/guides"
          className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {guides.map((guide) => {
          const isSaved = Boolean(bookmarkedMap[guide.id]);
          return (
            <div
              key={guide.id}
              className="bg-[#FAF9F8] dark:bg-surface-muted/30 border border-border-peach/40 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-4 hover:bg-surface-muted/60 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-16 h-11 sm:h-12 rounded-lg overflow-hidden shrink-0 border border-border-peach/40 bg-surface-muted">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    width={64}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="text-xs sm:text-sm font-bold font-quicksand text-ink hover:text-coral transition-colors line-clamp-1"
                  >
                    {guide.title}
                  </Link>
                  <p className="text-[11px] font-medium text-ink-muted truncate mt-0.5">
                    {guide.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <Calendar className="size-3.5 text-ink-muted/70" />
                  <span>{guide.date}</span>
                </span>

                <button
                  type="button"
                  onClick={() => onToggleBookmark(guide.id, guide.title)}
                  className="p-1.5 rounded-md hover:bg-coral/10 text-ink-muted hover:text-coral transition-colors"
                  title={isSaved ? "Saved" : "Save guide"}
                >
                  <Bookmark
                    className="size-4"
                    fill={isSaved ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AnimatedContainer>
  );
}
