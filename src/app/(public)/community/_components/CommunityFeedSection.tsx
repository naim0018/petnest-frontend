"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  Layers,
  HelpCircle,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommunityPost } from "./communityData";

interface CommunityFeedSectionProps {
  posts: CommunityPost[];
}

const FEED_FILTER_TABS = [
  { id: "all", label: "All Posts", icon: Layers, activeBg: "bg-coral text-white", inactiveBg: "bg-coral-light/60 dark:bg-coral/15 text-coral border-coral/30" },
  { id: "questions", label: "Questions", icon: HelpCircle, activeBg: "bg-coral text-white", inactiveBg: "bg-rose-50/70 dark:bg-rose-950/20 text-rose-500 border-rose-200/50 dark:border-rose-900/30" },
  { id: "discussions", label: "Discussions", icon: MessageCircle, activeBg: "bg-coral text-white", inactiveBg: "bg-purple-50/70 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/30" },
  { id: "stories", label: "Stories", icon: Heart, activeBg: "bg-coral text-white", inactiveBg: "bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30" },
  { id: "recommendations", label: "Recommendations", icon: ThumbsUp, activeBg: "bg-coral text-white", inactiveBg: "bg-amber-50/70 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30" },
] as const;

export function CommunityFeedSection({ posts }: CommunityFeedSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortOption, setSortOption] = useState<"latest" | "popular">("latest");
  const [postItems, setPostItems] = useState<CommunityPost[]>(posts);

  const filteredPosts = postItems.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "questions") return p.badge === "Question";
    if (activeTab === "discussions") return p.badge === "Discussion";
    if (activeTab === "stories") return p.badge === "Stories";
    if (activeTab === "recommendations") return p.badge === "Recommendations";
    return true;
  });

  const handleToggleLike = (id: string) => {
    setPostItems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1,
        };
      })
    );
  };

  const handleToggleSave = (id: string) => {
    setPostItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  return (
    <div className="space-y-4">
      {/* FILTER TABS & SORT ROW */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto pb-1 sm:pb-0">
          {FEED_FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold font-quicksand flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border",
                  isActive
                    ? `${tab.activeBg} border-transparent shadow-xs`
                    : `${tab.inactiveBg} hover:opacity-90`
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort dropdown button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setSortOption(sortOption === "latest" ? "popular" : "latest")}
            className="px-3.5 py-1.5 rounded-xl bg-card border border-border-peach text-xs font-bold text-ink flex items-center gap-1.5 hover:border-coral/40 transition-all cursor-pointer font-quicksand shadow-2xs"
          >
            <span>{sortOption === "latest" ? "Latest" : "Popular"}</span>
            <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
          </button>
        </div>
      </div>

      {/* POST CARDS LIST */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-card border border-border-peach dark:border-slate-800/80 rounded-xl p-5 shadow-xs hover:border-coral/30 transition-all space-y-3.5"
          >
            {/* Author Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full overflow-hidden border border-border-peach relative shrink-0">
                  <Image
                    src={post.authorAvatar}
                    alt={post.authorName}
                    width={44}
                    height={44}
                    className="object-cover size-full"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-ink">{post.authorName}</h4>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full font-quicksand border",
                        post.badge === "Question" && "bg-blue-100/70 text-blue-600 border-blue-200/50 dark:bg-blue-950/40 dark:border-blue-900/40",
                        post.badge === "Discussion" && "bg-amber-100/70 text-amber-600 border-amber-200/50 dark:bg-amber-950/40 dark:border-amber-900/40",
                        post.badge === "Recommendations" && "bg-teal-100/70 text-teal-600 border-teal-200/50 dark:bg-teal-950/40 dark:border-teal-900/40",
                        post.badge === "Stories" && "bg-rose-100/70 text-rose-600 border-rose-200/50 dark:bg-rose-950/40 dark:border-rose-900/40"
                      )}
                    >
                      {post.badge}
                    </span>
                  </div>
                  <small className="flex items-center gap-1.5 mt-0.5 text-ink-muted">
                    <time>{post.timeAgo}</time>
                    <span>•</span>
                    <span>{post.location}</span>
                  </small>
                </div>
              </div>

              <button
                type="button"
                className="size-8 rounded-full hover:bg-surface-muted flex items-center justify-center text-ink-faint hover:text-ink transition-colors cursor-pointer"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Post Body: Title & Content with Thumbnail */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              <div className={cn("space-y-2.5", post.image ? "sm:col-span-8" : "sm:col-span-12")}>
                <h4 className="text-base font-bold text-ink font-quicksand leading-snug flex items-center gap-1.5">
                  <span>{post.title}</span>
                  {post.petEmoji && <span>{post.petEmoji}</span>}
                </h4>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-normal">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-surface-muted text-ink-muted hover:text-coral transition-colors cursor-pointer font-quicksand"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Thumbnail Image */}
              {post.image && (
                <div className="sm:col-span-4 relative w-full h-40 sm:h-36 rounded-xl overflow-hidden border border-border-peach shrink-0 group">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 250px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {post.imageCount && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white flex items-center gap-1">
                      <span>🖼️</span>
                      <span>{post.imageCount} images</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions Bar: Like, Comments, Share, Bookmark */}
            <div className="flex items-center justify-between pt-2 border-t border-border-peach/60 text-ink-muted">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => handleToggleLike(post.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold hover:text-coral transition-colors cursor-pointer"
                >
                  <Heart
                    className={cn(
                      "w-4 h-4 transition-colors",
                      post.isLiked ? "fill-coral text-coral" : "text-ink-muted"
                    )}
                  />
                  <span>{post.likes}</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-semibold hover:text-coral transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-ink-muted" />
                  <span>{post.comments}</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-semibold hover:text-coral transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-ink-muted" />
                  <span>Share</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleToggleSave(post.id)}
                className="hover:text-coral transition-colors cursor-pointer p-1"
                aria-label="Save post"
              >
                <Bookmark
                  className={cn(
                    "w-4 h-4",
                    post.isSaved ? "fill-coral text-coral" : "text-ink-muted"
                  )}
                />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
