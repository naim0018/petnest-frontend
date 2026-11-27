"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Heart, PawPrint } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";

interface QuickStatsCardsProps {
  savedGuidesCount?: number;
  favoritesCount?: number;
  petsCount?: number;
}

export default function QuickStatsCards({
  savedGuidesCount = 12,
  favoritesCount = 8,
  petsCount = 3,
}: QuickStatsCardsProps) {
  return (
    <AnimatedContainer delay={0.1} className="lg:col-span-4 h-full">
      <div className="grid grid-cols-3 gap-3.5 h-full">
        {/* Stat 1: Saved Guides */}
        <Link
          href="/user/profile"
          className="bg-white dark:bg-card border border-border-peach/60 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col items-center justify-center text-center hover:border-coral/40 hover:shadow-sm transition-all group"
        >
          <div className="size-11 sm:size-12 rounded-xl bg-[#E2F1EA] text-[#10B981] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <BookOpen className="size-5 sm:size-6" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-quicksand text-ink leading-tight">
            {savedGuidesCount}
          </span>
          <span className="text-xs font-semibold text-ink-muted mt-1">
            Saved Guides
          </span>
        </Link>

        {/* Stat 2: Favorites */}
        <Link
          href="/user/profile"
          className="bg-white dark:bg-card border border-border-peach/60 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col items-center justify-center text-center hover:border-coral/40 hover:shadow-sm transition-all group"
        >
          <div className="size-11 sm:size-12 rounded-xl bg-[#FFEAE7] text-[#F43F5E] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <Heart className="size-5 sm:size-6 fill-[#F43F5E]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-quicksand text-ink leading-tight">
            {favoritesCount}
          </span>
          <span className="text-xs font-semibold text-ink-muted mt-1">
            Favorites
          </span>
        </Link>

        {/* Stat 3: Pets You Care */}
        <Link
          href="/user/profile"
          className="bg-white dark:bg-card border border-border-peach/60 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col items-center justify-center text-center hover:border-coral/40 hover:shadow-sm transition-all group"
        >
          <div className="size-11 sm:size-12 rounded-xl bg-[#E3EFFD] text-[#0284C7] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <PawPrint className="size-5 sm:size-6" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-quicksand text-ink leading-tight">
            {petsCount}
          </span>
          <span className="text-xs font-semibold text-ink-muted mt-1">
            Pets You Care
          </span>
        </Link>
      </div>
    </AnimatedContainer>
  );
}
