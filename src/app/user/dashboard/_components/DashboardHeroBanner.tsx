"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, PawPrint } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";

interface DashboardHeroBannerProps {
  displayName: string;
}

export default function DashboardHeroBanner({
  displayName,
}: DashboardHeroBannerProps) {
  return (
    <AnimatedContainer
      delay={0.05}
      className="lg:col-span-8 rounded-2xl border border-[#FCD8C6]/80 dark:border-peach/20 p-6 sm:p-7 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-xs min-h-[200px] sm:min-h-[230px] bg-[#FEF5EC] dark:bg-[#1E1412]"
    >
      {/* Background Banner Artwork */}
      <Image
        src="/dashboard/user-hero-banner.jpg"
        alt="PetNest companions banner"
        fill
        priority
        className="object-cover object-right pointer-events-none select-none"
      />

      {/* Soft gradient wash on left side for crisp text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FEF5EC]/95 via-[#FEF5EC]/50 via-15% to-transparent dark:from-[#1E1412]/95 dark:via-[#1E1412]/80 dark:via-50% dark:to-transparent pointer-events-none" />

      {/* Left Content */}
      <div className="relative z-10 max-w-sm sm:max-w-md lg:max-w-lg space-y-2.5 sm:space-y-3">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-ink tracking-tight flex items-center gap-2.5 font-quicksand leading-tight">
          <span className="text-2xl sm:text-3xl lg:text-[34px] font-black text-inherit">
            Welcome back, {displayName}!
          </span>
          <PawPrint className="size-7 sm:size-8 text-[#FF6B6B] fill-[#FF6B6B] inline-block -rotate-12 shrink-0 drop-shadow-2xs" />
        </h2>

        <p className="text-sm sm:text-base text-ink/80 dark:text-ink-muted leading-relaxed font-semibold flex items-center gap-2 pt-0.5">
          <span className="text-sm sm:text-base text-inherit">
            Let&apos;s keep your pets happy and healthy.
          </span>
          <Heart className="size-4 sm:size-4.5 text-[#FF6B6B] fill-none stroke-[2.2] inline-block shrink-0" />
        </p>

        <div className="pt-2 sm:pt-3">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] hover:from-[#FA5252] hover:to-[#E03131] text-white text-sm sm:text-base font-bold font-quicksand rounded-full shadow-xs shadow-[#FF6B6B]/25 transition-all active:scale-95 group"
          >
            <span className="text-inherit">Explore Pet Guides</span>
            <ArrowRight className="size-4 sm:size-4.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </AnimatedContainer>
  );
}
