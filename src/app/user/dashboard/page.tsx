"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/useRedux";
import { useGetMeQuery } from "@/store/Api/User/user.api";
import {
  DashboardHeroBanner,
  QuickStatsCards,
  ActivityOverviewCard,
  QuickActionsCard,
  RecentGuidesSection,
  PromoBannerCard,
} from "./_components";

export default function UserDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: meResponse } = useGetMeQuery(undefined, { skip: !user });

  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({
    "guide-1": false,
    "guide-2": false,
    "guide-3": false,
  });

  const me = meResponse?.data;
  const displayName =
    me?.name || user?.name || user?.email?.split("@")[0] || "Naim";

  const handleToggleBookmark = (id: string, title: string) => {
    setBookmarkedMap((prev) => {
      const next = !prev[id];
      toast.success(
        next
          ? `Saved "${title}" to your bookmarks`
          : `Removed "${title}" from bookmarks`
      );
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="w-full space-y-5 font-quicksand">
      {/* ROW 1: Hero Banner (8 cols) + 3 Quick Stats (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <DashboardHeroBanner displayName={displayName} />
        <QuickStatsCards savedGuidesCount={12} favoritesCount={8} petsCount={3} />
      </div>

      {/* ROW 2: Activity Overview (8 cols) + Quick Actions (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <ActivityOverviewCard />
        <QuickActionsCard />
      </div>

      {/* ROW 3: Recent Guides (8 cols) + Promo Banner (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <RecentGuidesSection
          bookmarkedMap={bookmarkedMap}
          onToggleBookmark={handleToggleBookmark}
        />
        <PromoBannerCard />
      </div>
    </div>
  );
}
