import React from "react";
import { Flame, ArrowRight } from "lucide-react";
import { COMMUNITY_TRENDING_TOPICS } from "./communityData";

export function CommunityTrendingWidget() {
  return (
    <div className="bg-card border border-border-peach dark:border-slate-800/80 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-coral shrink-0" />
        <h4 className="text-coral font-bold font-quicksand">Trending Topics</h4>
      </div>

      <div className="space-y-3.5">
        {COMMUNITY_TRENDING_TOPICS.map((item) => (
          <div
            key={item.tag}
            className="flex justify-between items-center group cursor-pointer"
          >
            <p className="font-bold text-sm text-ink group-hover:text-coral transition-colors font-quicksand">
              {item.tag}
            </p>
            <small className="text-ink-muted group-hover:text-coral transition-colors">
              {item.count}
            </small>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button
          type="button"
          className="hover:underline cursor-pointer flex items-center gap-1 transition-colors"
        >
          <small className="font-bold text-coral flex items-center gap-1">
            View all trending <ArrowRight className="w-3.5 h-3.5 text-coral" />
          </small>
        </button>
      </div>
    </div>
  );
}
