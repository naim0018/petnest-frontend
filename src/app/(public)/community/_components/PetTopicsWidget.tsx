"use client";

import React, { useState } from "react";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PET_TOPICS, PetTopicItem } from "./communityData";

interface PetTopicsWidgetProps {
  onSelectTopic?: (topicId: string) => void;
  className?: string;
}

export function PetTopicsWidget({ onSelectTopic, className }: PetTopicsWidgetProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleTopicClick = (id: string) => {
    const next = selectedTopic === id ? null : id;
    setSelectedTopic(next);
    if (next) onSelectTopic?.(next);
  };

  return (
    <div className={cn("bg-card border border-border-peach dark:border-slate-800/80 rounded-xl p-5 shadow-xs space-y-3", className)}>
      <div className="px-2.5 py-1 flex items-center justify-between">
        <small className="font-bold text-ink-muted uppercase tracking-wider">
          Pet Topics
        </small>
        <button
          type="button"
          className="font-bold text-coral hover:underline inline-flex items-center gap-0.5 cursor-pointer text-xs"
        >
          <span>Show All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-1">
        {PET_TOPICS.map((topic) => {
          const isSelected = selectedTopic === topic.id;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleTopicClick(topic.id)}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer group text-left",
                isSelected
                  ? "bg-coral-light/70 dark:bg-coral/15 border border-coral/20"
                  : "hover:bg-surface-muted/60"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    "size-7 rounded-lg flex items-center justify-center text-sm shrink-0",
                    topic.bgColor
                  )}
                >
                  {topic.icon}
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold font-quicksand truncate transition-colors",
                    isSelected ? "text-coral" : "text-ink group-hover:text-coral"
                  )}
                >
                  {topic.name}
                </span>
              </div>
              <ChevronRight
                className={cn(
                  "w-4 h-4 transition-colors shrink-0",
                  isSelected ? "text-coral" : "text-ink-faint group-hover:text-ink-muted"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
