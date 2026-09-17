"use client";

import { useState } from "react";
import {
  MessageCircle,
  Heart,
  Lightbulb,
  PawPrint,
  ShoppingCart,
  type LucideIcon,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeedFilter } from "@/context/FeedFilterContext";

export interface FeedNavigationItem {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

const NAV_ITEMS: FeedNavigationItem[] = [
  {
    id: "community",
    title: "Community Posts",
    subtitle: "connect & share",
    icon: MessageCircle,
  },
  {
    id: "updates",
    title: "Pet Updates",
    subtitle: "moments that melt",
    icon: Heart,
  },
  {
    id: "guides",
    title: "Recommended Guides",
    subtitle: "learn & care better",
    icon: Lightbulb,
  },
  {
    id: "adoption",
    title: "Adoption Updates",
    subtitle: "find a forever friend",
    icon: PawPrint,
  },
  {
    id: "marketplace",
    title: "Marketplace Updates",
    subtitle: "shop for pets & more",
    icon: ShoppingCart,
  },
];

interface FeedNavigationCardProps {
  className?: string;
  activeId?: string;
  onItemClick?: (item: FeedNavigationItem) => void;
}

export function FeedNavigationCard({
  className,
  activeId: controlledActiveId,
  onItemClick,
}: FeedNavigationCardProps) {
  let feedFilter: ReturnType<typeof useFeedFilter> | null = null;
  try {
    feedFilter = useFeedFilter();
  } catch {
    feedFilter = null;
  }

  const [localActiveTab, setLocalActiveTab] = useState<string>("community");

  const currentActiveId =
    controlledActiveId ??
    (feedFilter ? feedFilter.activeCategoryTab : localActiveTab);

  const handleItemClick = (item: FeedNavigationItem) => {
    const nextTab = currentActiveId === item.id ? "all" : item.id;

    if (feedFilter) {
      feedFilter.setActiveCategoryTab(nextTab);
    } else {
      setLocalActiveTab(nextTab);
    }

    onItemClick?.(item);
  };

  const handleShowAll = () => {
    if (feedFilter) {
      feedFilter.setActiveCategoryTab("all");
    } else {
      setLocalActiveTab("all");
    }
  };

  return (
    <nav
      aria-label="Feed Category Filter"
      className={cn(
        "bg-card border border-border-peach dark:border-slate-800/80 rounded-xl p-5 shadow-xs space-y-2",
        className
      )}
    >
      <div className="px-2.5 py-1 flex items-center justify-between">
        <small className="font-bold text-ink-muted uppercase tracking-wider">
          Feed Categories
        </small>
        {currentActiveId !== "all" && (
          <button
            type="button"
            onClick={handleShowAll}
            className="font-bold text-coral hover:underline cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="size-3 text-coral" />
            <small className="text-coral font-bold">Show All</small>
          </button>
        )}
      </div>

      <div className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = currentActiveId === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              className={cn(
                "flex items-center gap-3.5 p-2 rounded-xl transition-all duration-200 group text-left w-full outline-none cursor-pointer",
                isActive
                  ? "bg-tint-rose dark:bg-coral/15"
                  : "hover:bg-surface-muted/60 dark:hover:bg-slate-800/50"
              )}
            >
              <div
                className={cn(
                  "size-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
                  isActive
                    ? "bg-coral text-white shadow-xs shadow-coral/30"
                    : "bg-[#F7F5F2] dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-coral/10 group-hover:text-coral"
                )}
              >
                <IconComponent
                  className={cn(
                    "size-5 transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-white stroke-[2.2]" : "stroke-[2]"
                  )}
                />
              </div>

              <div className="flex flex-col min-w-0">
                <h6
                  className={cn(
                    "font-bold tracking-tight leading-snug transition-colors",
                    isActive
                      ? "text-coral"
                      : "text-ink group-hover:text-coral"
                  )}
                >
                  {item.title}
                </h6>
                <small
                  className={cn(
                    "leading-normal transition-colors truncate",
                    isActive
                      ? "text-coral/80"
                      : "text-ink-faint group-hover:text-ink-muted"
                  )}
                >
                  {item.subtitle}
                </small>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function FeedNavigationCardSkeleton() {
  return (
    <div className="bg-card border border-border-peach rounded-xl p-2 shadow-xs space-y-2 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3.5 p-2 rounded-xl">
          <div className="size-11 rounded-xl bg-surface-muted" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 w-28 bg-surface-muted rounded-sm" />
            <div className="h-3 w-20 bg-surface-muted rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
