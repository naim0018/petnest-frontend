"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FeedPost } from "@/lib/data/petnest-data";
import { useFeedFilter } from "@/context/FeedFilterContext";
import { FeedNavigationCard } from "./left-content/FeedNavigationCard";
import { ShareLoveWidget } from "./left-content/ShareLoveWidget";
import { FeedMainSection } from "./main-content/FeedMainSection";
import { TrendingTopicsWidget } from "./right-content/TrendingTopicsWidget";
import StoriesFeedReplacementView from "./story/StoriesFeedReplacementView";

interface FeedContentSwitcherProps {
  posts: FeedPost[];
}

export function FeedContentSwitcher({ posts }: FeedContentSwitcherProps) {
  const { activeStoryId, setActiveStoryId } = useFeedFilter();
  const isViewingStory = Boolean(activeStoryId);

  return (
    <AnimatePresence mode="wait">
      {isViewingStory ? (
        <motion.div
          key="story-replacement-view"
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <StoriesFeedReplacementView
            initialStoryId={activeStoryId}
            onClose={() => setActiveStoryId(null)}
          />
        </motion.div>
      ) : (
        <motion.main
          key="normal-feed-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-16 gap-6"
        >
          {/* Left Column - Navigation & Share Love Cards */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-26 space-y-6">
              <FeedNavigationCard />
              <ShareLoveWidget />
            </div>
          </aside>

          {/* Main Feed Center Column */}
          <FeedMainSection posts={posts} />

          {/* Right Sidebar Column */}
          <aside className="col-span-1 lg:col-span-3">
            <div className="sticky top-26 space-y-6">
              <TrendingTopicsWidget />
            </div>
          </aside>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
