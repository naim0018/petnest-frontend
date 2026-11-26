"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Heart,
  PawPrint,
  BarChart3,
  Eye,
  Trophy,
  Zap,
  ShoppingCart,
  Home,
  Calendar,
  Bookmark,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import ReusableChart from "@/components/common/ReusableChart";
import { useAppSelector } from "@/hooks/useRedux";
import { useGetMeQuery } from "@/store/Api/User/user.api";

const ACTIVITY_CHART_DATA = [
  { label: "Oct 25", value: 30 },
  { label: "Oct 31", value: 38 },
  { label: "Nov 06", value: 48 },
  { label: "Nov 12", value: 78 },
  { label: "Nov 18", value: 65 },
];

const RECENT_GUIDES = [
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
      {/* ========================================================= */}
      {/* ROW 1: Hero Banner (8 cols) + 3 Quick Stats (4 cols)      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Welcome Hero Banner */}
        <AnimatedContainer
          delay={0.05}
          className="lg:col-span-8 rounded-2xl bg-[#FEEDE5] dark:bg-[#251A17] border border-peach/30 p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-xs min-h-[180px]"
        >
          <div className="relative z-10 max-w-sm sm:max-w-md lg:max-w-lg space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2">
              <span>Welcome back, {displayName}!</span>
              <span className="text-[#FF6B6B] select-none">🐾</span>
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-medium">
              Let&apos;s keep your pets happy and healthy.
            </p>
            <div className="pt-3">
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6B6B] hover:bg-[#FA5252] text-white text-xs font-bold rounded-full shadow-xs transition-transform active:scale-95"
              >
                <span>Explore Pet Guides</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Right animals artwork from reference mockup */}
          <div className="absolute right-0 bottom-0 top-0 w-64 sm:w-80 lg:w-96 flex items-end justify-end pointer-events-none select-none">
            <Image
              src="/dashboard/hero-pets.png"
              alt="Happy pet companions"
              width={270}
              height={134}
              priority
              className="h-full w-auto object-contain object-bottom-right"
            />
          </div>
        </AnimatedContainer>

        {/* 3 Quick Stat Cards */}
        <AnimatedContainer delay={0.1} className="lg:col-span-4 h-full">
          <div className="grid grid-cols-3 gap-3.5 h-full">
            {/* Stat 1: Saved Guides */}
            <Link
              href="/user/profile"
              className="bg-white dark:bg-card border border-border-peach/60 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col items-center justify-center text-center hover:border-coral/40 hover:shadow-sm transition-all group"
            >
              <div className="size-11 sm:size-12 rounded-xl bg-[#E2F1EA] text-[#10B981] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <BookOpen className="size-5 sm:size-6" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold font-quicksand text-ink leading-tight">
                12
              </span>
              <span className="text-xs font-semibold text-ink-muted mt-1">
                Saved Guides
              </span>
            </Link>

            {/* Stat 2: Favorites */}
            <Link
              href="/user/profile"
              className="bg-white dark:bg-card border border-border-peach/60 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col items-center justify-center text-center hover:border-coral/40 hover:shadow-sm transition-all group"
            >
              <div className="size-11 sm:size-12 rounded-xl bg-[#FFEAE7] text-[#F43F5E] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Heart className="size-5 sm:size-6 fill-[#F43F5E]" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold font-quicksand text-ink leading-tight">
                8
              </span>
              <span className="text-xs font-semibold text-ink-muted mt-1">
                Favorites
              </span>
            </Link>

            {/* Stat 3: Pets You Care */}
            <Link
              href="/user/profile"
              className="bg-white dark:bg-card border border-border-peach/60 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col items-center justify-center text-center hover:border-coral/40 hover:shadow-sm transition-all group"
            >
              <div className="size-11 sm:size-12 rounded-xl bg-[#E3EFFD] text-[#0284C7] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <PawPrint className="size-5 sm:size-6" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold font-quicksand text-ink leading-tight">
                3
              </span>
              <span className="text-xs font-semibold text-ink-muted mt-1">
                Pets You Care
              </span>
            </Link>
          </div>
        </AnimatedContainer>
      </div>

      {/* ========================================================= */}
      {/* ROW 2: Activity Overview (8 cols) + Quick Actions (4 cols) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Activity Overview Card */}
        <AnimatedContainer
          delay={0.15}
          className="lg:col-span-8 bg-white dark:bg-card border border-border-peach/60 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="size-5 text-[#0284C7]" />
              <h2 className="text-base sm:text-lg font-bold font-quicksand text-ink">
                Your Activity Overview
              </h2>
            </div>

            <div className="rounded-full border border-border-peach bg-surface-muted/50 px-3.5 py-1 text-xs font-bold text-ink-muted inline-flex items-center gap-1.5 shadow-2xs">
              <span>Last 30 Days</span>
              <ChevronDown className="size-3 text-ink-muted" />
            </div>
          </div>

          {/* 4 Vertical Metric Columns */}
          <div className="grid grid-cols-4 gap-2 pt-1 border-b border-border-peach/30 pb-4">
            <div className="flex flex-col items-center text-center">
              <div className="size-8 rounded-lg bg-[#E3EFFD] text-[#0284C7] flex items-center justify-center mb-1.5">
                <BookOpen className="size-4" />
              </div>
              <span className="text-lg sm:text-xl font-bold font-quicksand text-ink">
                6
              </span>
              <span className="text-[11px] font-medium text-ink-muted">
                Guides Read
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="size-8 rounded-lg bg-[#E2F1EA] text-[#10B981] flex items-center justify-center mb-1.5">
                <Eye className="size-4" />
              </div>
              <span className="text-lg sm:text-xl font-bold font-quicksand text-ink">
                1.2K
              </span>
              <span className="text-[11px] font-medium text-ink-muted">
                Total Views
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="size-8 rounded-lg bg-[#FFEAE7] text-[#F43F5E] flex items-center justify-center mb-1.5">
                <Heart className="size-4 fill-[#F43F5E]" />
              </div>
              <span className="text-lg sm:text-xl font-bold font-quicksand text-ink">
                3
              </span>
              <span className="text-[11px] font-medium text-ink-muted">
                Likes
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="size-8 rounded-lg bg-[#FEF3DF] text-[#D97706] flex items-center justify-center mb-1.5">
                <Trophy className="size-4" />
              </div>
              <span className="text-lg sm:text-xl font-bold font-quicksand text-ink">
                1
              </span>
              <span className="text-[11px] font-medium text-ink-muted">
                Achievements
              </span>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-52 sm:h-56 w-full pt-1">
            <ReusableChart
              chartType="Area"
              data={ACTIVITY_CHART_DATA}
              lineValueKey="value"
              strokeColor="#FF6B6B"
              fillColor="#FF8E72"
              showDots={true}
              yDomain={[0, 100]}
              yTicks={[0, 25, 50, 75, 100]}
              margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
              yAxisFormatter={(val) => String(val)}
              tooltipFormatter={(val) => [`${val} Activities`, "Interactions"]}
            />
          </div>
        </AnimatedContainer>

        {/* Quick Actions Card */}
        <AnimatedContainer
          delay={0.2}
          className="lg:col-span-4 bg-white dark:bg-card border border-border-peach/60 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center gap-2">
            <Zap className="size-5 text-[#F59E0B] fill-[#F59E0B]" />
            <h2 className="text-base sm:text-lg font-bold font-quicksand text-ink">
              Quick Actions
            </h2>
          </div>

          {/* 2x2 Tactile Action Tiles */}
          <div className="grid grid-cols-2 gap-3.5 my-auto pt-4">
            {/* Tile 1: Browse Pet Guides */}
            <Link
              href="/guides"
              className="bg-[#FEE6E6] dark:bg-rose-950/30 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:opacity-90 transition-all min-h-[110px] group"
            >
              <BookOpen className="size-6 text-[#E11D48] mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-[#E11D48] dark:text-rose-300">
                Browse Pet Guides →
              </span>
            </Link>

            {/* Tile 2: Shop Pet Care Products */}
            <Link
              href="/marketplace"
              className="bg-[#E7F6F1] dark:bg-emerald-950/30 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:opacity-90 transition-all min-h-[110px] group"
            >
              <ShoppingCart className="size-6 text-[#059669] mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-[#059669] dark:text-emerald-300">
                Shop Pet Care Products →
              </span>
            </Link>

            {/* Tile 3: Find a Vet */}
            <Link
              href="/community"
              className="bg-[#FEF3DF] dark:bg-amber-950/30 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:opacity-90 transition-all min-h-[110px] group"
            >
              <PawPrint className="size-6 text-[#D97706] mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-[#D97706] dark:text-amber-300">
                Find a Vet →
              </span>
            </Link>

            {/* Tile 4: Adopt a Pet */}
            <Link
              href="/adoption"
              className="bg-[#EAE8FD] dark:bg-purple-950/30 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:opacity-90 transition-all min-h-[110px] group"
            >
              <Home className="size-6 text-[#7C3AED] mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-[#7C3AED] dark:text-purple-300">
                Adopt a Pet →
              </span>
            </Link>
          </div>
        </AnimatedContainer>
      </div>

      {/* ========================================================= */}
      {/* ROW 3: Recent Guides (8 cols) + Promo Banner (4 cols)     */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Recent Guides List */}
        <AnimatedContainer
          delay={0.25}
          className="lg:col-span-8 bg-white dark:bg-card border border-border-peach/60 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
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
            {RECENT_GUIDES.map((guide) => {
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
                      onClick={() => handleToggleBookmark(guide.id, guide.title)}
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

        {/* Promo Card: Keep Your Pets Healthy! */}
        <AnimatedContainer
          delay={0.3}
          className="lg:col-span-4 rounded-2xl p-6 sm:p-7 border border-[#BCE3C5]/60 bg-gradient-to-r from-[#E5F3E4] via-[#DCF0DC] to-[#D5EDD5] dark:from-emerald-950/40 dark:to-slate-900 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[190px]"
        >
          <div className="space-y-1.5 z-10 max-w-[210px] sm:max-w-[220px]">
            <h3 className="text-lg sm:text-xl font-extrabold font-quicksand text-ink leading-snug flex items-center gap-1.5">
              <span>Keep Your Pets Healthy!</span>
              <span className="text-[#FF6B6B] select-none">❤️</span>
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
              Get expert advice, care tips, and more.
            </p>
            <div className="pt-3">
              <Link
                href="/guides"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FF6B6B] hover:bg-[#FA5252] text-white text-xs font-bold rounded-full shadow-xs transition-transform active:scale-95 w-fit"
              >
                <span>Read More</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Sleeping puppy & kitten illustration from reference mockup */}
          <div className="absolute right-0 bottom-0 top-0 w-44 sm:w-56 flex items-end justify-end pointer-events-none select-none">
            <Image
              src="/dashboard/promo-pets.png"
              alt="Healthy happy sleeping pets"
              width={240}
              height={135}
              className="h-full w-auto object-contain object-bottom-right"
            />
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}
