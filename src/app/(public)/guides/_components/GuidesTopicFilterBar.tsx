"use client";

import React, { useMemo } from "react";
import { Compass, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFindAllCategoriesPublicQuery } from "@/store/Api/Guides/guides.api";
import { getCategoryIcon } from "@/components/admin/guides/CategoryIcons";

export interface GuidesTopicFilterItem {
  id: string;
  label: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  lightBg: string;
  darkBg: string;
  color: string;
  borderColor: string;
}

const CATEGORY_COLOR_SCHEMES: Record<
  string,
  { lightBg: string; darkBg: string; color: string; borderColor: string }
> = {
  "behavior-shows": {
    lightBg: "bg-[#ecfdf5]",
    darkBg: "dark:bg-[#132d24]",
    color: "text-[#059669] dark:text-[#6ee7b7]",
    borderColor: "border-[#a7f3d0] dark:border-[#059669]/40",
  },
  "emergency-first-aid": {
    lightBg: "bg-[#fff1f2]",
    darkBg: "dark:bg-[#381a1f]",
    color: "text-[#e11d48] dark:text-[#fda4af]",
    borderColor: "border-[#fecdd3] dark:border-[#e11d48]/40",
  },
  "grooming-hygiene": {
    lightBg: "bg-[#e0f2fe]",
    darkBg: "dark:bg-[#132c3f]",
    color: "text-[#0284c7] dark:text-[#38bdf8]",
    borderColor: "border-[#bae6fd] dark:border-[#0284c7]/40",
  },
  "health-wellness": {
    lightBg: "bg-[#fff0f0]",
    darkBg: "dark:bg-[#381a1f]",
    color: "text-[#e85c5c] dark:text-[#fca5a5]",
    borderColor: "border-[#fecdd3] dark:border-[#e85c5c]/40",
  },
  medicine: {
    lightBg: "bg-[#f5f3ff]",
    darkBg: "dark:bg-[#281d3d]",
    color: "text-[#6366f1] dark:text-[#a5b4fc]",
    borderColor: "border-[#ddd6fe] dark:border-[#6366f1]/40",
  },
  "nutrition-diet": {
    lightBg: "bg-[#fff8d9]",
    darkBg: "dark:bg-[#332b14]",
    color: "text-[#b45309] dark:text-[#fde68a]",
    borderColor: "border-[#fde68a] dark:border-[#b45309]/40",
  },
  "training-skills": {
    lightBg: "bg-[#f4eeff]",
    darkBg: "dark:bg-[#2b1b3d]",
    color: "text-[#7e22ce] dark:text-[#d8b4fe]",
    borderColor: "border-[#e9d5ff] dark:border-[#7e22ce]/40",
  },
};

const PALETTE_FALLBACKS = [
  {
    lightBg: "bg-[#eafbf1]",
    darkBg: "dark:bg-[#152e22]",
    color: "text-[#15803d] dark:text-[#86efac]",
    borderColor: "border-[#bbf7d0] dark:border-[#15803d]/40",
  },
  {
    lightBg: "bg-[#eef7ff]",
    darkBg: "dark:bg-[#14283b]",
    color: "text-[#0284c7] dark:text-[#7dd3fc]",
    borderColor: "border-[#bae6fd] dark:border-[#0284c7]/40",
  },
  {
    lightBg: "bg-[#fff8d9]",
    darkBg: "dark:bg-[#332b14]",
    color: "text-[#b45309] dark:text-[#fde68a]",
    borderColor: "border-[#fde68a] dark:border-[#b45309]/40",
  },
  {
    lightBg: "bg-[#f4eeff]",
    darkBg: "dark:bg-[#2b1b3d]",
    color: "text-[#7e22ce] dark:text-[#d8b4fe]",
    borderColor: "border-[#e9d5ff] dark:border-[#7e22ce]/40",
  },
];

export const ALL_TOPICS_ITEM: GuidesTopicFilterItem = {
  id: "all",
  label: "All Topics",
  icon: Compass,
  lightBg: "bg-surface-muted",
  darkBg: "dark:bg-slate-800/80",
  color: "text-ink hover:text-coral",
  borderColor: "border-border-peach dark:border-slate-700/60",
};

export const GUIDE_TOPIC_FILTERS: GuidesTopicFilterItem[] = [
  ALL_TOPICS_ITEM,
  {
    id: "behavior-shows",
    label: "Behavior & Shows",
    icon: getCategoryIcon("Award"),
    ...CATEGORY_COLOR_SCHEMES["behavior-shows"],
  },
  {
    id: "emergency-first-aid",
    label: "Emergency & First Aid",
    icon: getCategoryIcon("ShieldAlert"),
    ...CATEGORY_COLOR_SCHEMES["emergency-first-aid"],
  },
  {
    id: "grooming-hygiene",
    label: "Grooming & Hygiene",
    icon: getCategoryIcon("Scissors"),
    ...CATEGORY_COLOR_SCHEMES["grooming-hygiene"],
  },
  {
    id: "health-wellness",
    label: "Health & Wellness",
    icon: getCategoryIcon("Heart"),
    ...CATEGORY_COLOR_SCHEMES["health-wellness"],
  },
  {
    id: "medicine",
    label: "Medicine",
    icon: getCategoryIcon("Stethoscope"),
    ...CATEGORY_COLOR_SCHEMES.medicine,
  },
  {
    id: "nutrition-diet",
    label: "Nutrition & Diet",
    icon: getCategoryIcon("UtensilsCrossed"),
    ...CATEGORY_COLOR_SCHEMES["nutrition-diet"],
  },
  {
    id: "training-skills",
    label: "Training & Skills",
    icon: getCategoryIcon("Sparkles"),
    ...CATEGORY_COLOR_SCHEMES["training-skills"],
  },
];

export interface GuidesTopicFilterBarProps {
  selectedTopic: string;
  onSelectTopic: (topicId: string) => void;
  className?: string;
  items?: GuidesTopicFilterItem[];
}

export default function GuidesTopicFilterBar({
  selectedTopic,
  onSelectTopic,
  className,
  items,
}: GuidesTopicFilterBarProps) {
  const { data: categoriesResponse } = useFindAllCategoriesPublicQuery({
    excludeBasic: true,
  });

  // Dynamically build filter list from database categories
  const dynamicItems = useMemo<GuidesTopicFilterItem[]>(() => {
    if (items && items.length > 0) {
      return items;
    }

    const dbCategories = categoriesResponse?.data;
    if (dbCategories && dbCategories.length > 0) {
      const activeCats = dbCategories.filter(
        (c) =>
          c.isActive &&
          c.slug.toLowerCase() !== "basic" &&
          c.name.toLowerCase() !== "basic"
      );

      const mapped: GuidesTopicFilterItem[] = activeCats.map((cat, idx) => {
        const scheme =
          CATEGORY_COLOR_SCHEMES[cat.slug] ||
          PALETTE_FALLBACKS[idx % PALETTE_FALLBACKS.length];

        return {
          id: cat.slug,
          label: cat.name,
          icon: getCategoryIcon(cat.icon),
          lightBg: scheme.lightBg,
          darkBg: scheme.darkBg,
          color: scheme.color,
          borderColor: scheme.borderColor,
        };
      });

      return [ALL_TOPICS_ITEM, ...mapped];
    }

    return GUIDE_TOPIC_FILTERS;
  }, [items, categoriesResponse]);

  return (
    <div
      role="tablist"
      aria-label="Care guide topic filters"
      className={cn(
        "flex items-center gap-2.5 sm:gap-3 overflow-x-auto py-2.5 px-1 scrollbar-none scroll-smooth",
        className
      )}
    >
      {dynamicItems.map((filter) => {
        const isSelected = selectedTopic === filter.id;
        const Icon = filter.icon;

        return (
          <button
            key={filter.id}
            role="tab"
            aria-selected={isSelected}
            type="button"
            onClick={() => onSelectTopic(filter.id)}
            className={cn(
              "group inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold font-quicksand transition-all shrink-0 cursor-pointer select-none border",
              isSelected
                ? "bg-coral text-white border-coral font-black shadow-md scale-[1.04] ring-2 ring-coral/25 ring-offset-2 ring-offset-background"
                : cn(
                    filter.lightBg,
                    filter.darkBg,
                    filter.color,
                    filter.borderColor,
                    "opacity-90 hover:opacity-100 hover:scale-[1.02] shadow-2xs hover:border-coral/40"
                  )
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                isSelected ? "text-white" : ""
              )}
            />
            <span
              className={cn(
                "whitespace-nowrap",
                isSelected ? "text-white font-black" : ""
              )}
            >
              {filter.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}