"use client";

import React from "react";
import {
  Sparkles,
  Calendar,
  UtensilsCrossed,
  GraduationCap,
  HeartPulse,
  Scissors,
  PawPrint,
  Heart,
  AlertTriangle,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface GuidesTopicFilterItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  lightBg: string;
  darkBg: string;
  color: string;
  borderColor: string;
}

export const GUIDE_TOPIC_FILTERS: GuidesTopicFilterItem[] = [
  {
    id: "all",
    label: "All Topics",
    icon: Compass,
    lightBg: "bg-surface-muted",
    darkBg: "dark:bg-slate-800/80",
    color: "text-ink hover:text-coral",
    borderColor: "border-border-peach dark:border-slate-700/60",
  },
  {
    id: "getting-started",
    label: "Getting Started",
    icon: Sparkles,
    lightBg: "bg-[#eafbf1]",
    darkBg: "dark:bg-[#152e22]",
    color: "text-[#15803d] dark:text-[#86efac]",
    borderColor: "border-[#bbf7d0] dark:border-[#15803d]/40",
  },
  {
    id: "daily-care",
    label: "Daily Care",
    icon: Calendar,
    lightBg: "bg-[#eef7ff]",
    darkBg: "dark:bg-[#14283b]",
    color: "text-[#0284c7] dark:text-[#7dd3fc]",
    borderColor: "border-[#bae6fd] dark:border-[#0284c7]/40",
  },
  {
    id: "nutrition",
    label: "Nutrition",
    icon: UtensilsCrossed,
    lightBg: "bg-[#fff8d9]",
    darkBg: "dark:bg-[#332b14]",
    color: "text-[#b45309] dark:text-[#fde68a]",
    borderColor: "border-[#fde68a] dark:border-[#b45309]/40",
  },
  {
    id: "training",
    label: "Training",
    icon: GraduationCap,
    lightBg: "bg-[#f4eeff]",
    darkBg: "dark:bg-[#2b1b3d]",
    color: "text-[#7e22ce] dark:text-[#d8b4fe]",
    borderColor: "border-[#e9d5ff] dark:border-[#7e22ce]/40",
  },
  {
    id: "health-vet-care",
    label: "Health & Vet Care",
    icon: HeartPulse,
    lightBg: "bg-[#fff0f0]",
    darkBg: "dark:bg-[#381a1f]",
    color: "text-[#e85c5c] dark:text-[#fca5a5]",
    borderColor: "border-[#fecdd3] dark:border-[#e85c5c]/40",
  },
  {
    id: "grooming",
    label: "Grooming",
    icon: Scissors,
    lightBg: "bg-[#e0f2fe]",
    darkBg: "dark:bg-[#132c3f]",
    color: "text-[#0369a1] dark:text-[#38bdf8]",
    borderColor: "border-[#bae6fd] dark:border-[#0369a1]/40",
  },
  {
    id: "behavior",
    label: "Behavior",
    icon: PawPrint,
    lightBg: "bg-[#ecfdf5]",
    darkBg: "dark:bg-[#132d24]",
    color: "text-[#059669] dark:text-[#6ee7b7]",
    borderColor: "border-[#a7f3d0] dark:border-[#059669]/40",
  },
  {
    id: "senior-pets",
    label: "Senior Pets",
    icon: Heart,
    lightBg: "bg-[#fffbeb]",
    darkBg: "dark:bg-[#352814]",
    color: "text-[#d97706] dark:text-[#fcd34d]",
    borderColor: "border-[#fde68a] dark:border-[#d97706]/40",
  },
  {
    id: "emergency",
    label: "Emergency",
    icon: AlertTriangle,
    lightBg: "bg-[#f5f3ff]",
    darkBg: "dark:bg-[#281d3d]",
    color: "text-[#6366f1] dark:text-[#a5b4fc]",
    borderColor: "border-[#ddd6fe] dark:border-[#6366f1]/40",
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
  items = GUIDE_TOPIC_FILTERS,
}: GuidesTopicFilterBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Care guide topic filters"
      className={cn(
        "flex items-center gap-2.5 sm:gap-3 overflow-x-auto py-2.5 px-1 scrollbar-none scroll-smooth",
        className
      )}
    >
      {items.map((filter) => {
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
              "inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold font-quicksand transition-all shrink-0 cursor-pointer select-none",
              filter.lightBg,
              filter.darkBg,
              filter.color,
              "border",
              filter.borderColor,
              isSelected
                ? "ring-2 ring-coral ring-offset-2 ring-offset-background shadow-xs font-extrabold scale-[1.03]"
                : "opacity-85 hover:opacity-100 hover:scale-[1.02] shadow-2xs"
            )}
          >
            <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
            <span className="whitespace-nowrap">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
