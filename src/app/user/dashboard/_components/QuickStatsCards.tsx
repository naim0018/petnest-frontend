"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Heart, PawPrint, MessageSquare } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import StatsCard from "@/components/common/StatsCard";

interface QuickStatsCardsProps {
  savedGuidesCount?: number;
  favoritesCount?: number;
  petsCount?: number;
  communityPostsCount?: number;
}

export default function QuickStatsCards({
  savedGuidesCount = 12,
  favoritesCount = 8,
  petsCount = 3,
  communityPostsCount = 5,
}: QuickStatsCardsProps) {
  const stats = [
    {
      title: "Saved Guides",
      value: savedGuidesCount,
      icon: <BookOpen className="size-4.5" />,
      href: "/user/profile",
    },
    {
      title: "Favorites",
      value: favoritesCount,
      icon: <Heart className="size-4.5" />,
      href: "/user/profile",
    },
    {
      title: "Pets You Care",
      value: petsCount,
      icon: <PawPrint className="size-4.5" />,
      href: "/user/profile",
    },
    {
      title: "Community Posts",
      value: communityPostsCount,
      icon: <MessageSquare className="size-4.5" />,
      href: "/community",
    },
  ];

  return (
    <AnimatedContainer delay={0.1} className="lg:col-span-4 h-full">
      <div className="grid grid-cols-2 gap-3 h-full">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="block h-full">
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              className="h-full min-h-0 py-3.5 px-4"
              valueClassName="text-xl sm:text-2xl font-extrabold"
            />
          </Link>
        ))}
      </div>
    </AnimatedContainer>
  );
}
