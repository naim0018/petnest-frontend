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
      className="lg:col-span-8 rounded-2xl bg-gradient-to-r from-[#FFF1E8] via-[#FEEFE6] to-[#FCE6D8] dark:from-[#251A17] dark:via-[#201513] dark:to-[#1B110F] border border-[#FCD8C6]/60 dark:border-peach/20 p-6 sm:p-7 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-xs min-h-[190px] sm:min-h-[210px]"
    >
      {/* Decorative Floating Hearts */}
      <div className="absolute top-4 right-16 sm:right-24 md:right-28 pointer-events-none select-none text-[#FF6B6B] opacity-80 animate-pulse">
        <Heart className="size-5 stroke-[2.2] fill-none -rotate-12" />
      </div>

      <div className="absolute top-12 right-48 sm:right-60 md:right-72 pointer-events-none select-none text-[#FF8E72] opacity-75">
        <Heart className="size-3.5 stroke-[1.8] fill-[#FF8E72] rotate-12" />
      </div>

      <div className="absolute bottom-6 right-3 sm:right-6 pointer-events-none select-none text-[#FFA280] opacity-70">
        <Heart className="size-2.5 stroke-[1.5] fill-[#FFA280]" />
      </div>

      {/* Left Content */}
      <div className="relative z-10 max-w-sm sm:max-w-md lg:max-w-lg space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-ink tracking-tight flex items-center gap-2.5 font-quicksand leading-tight">
          <span>Welcome back, {displayName}!</span>
          <PawPrint className="size-6 sm:size-7 text-[#FF6B6B] fill-[#FF6B6B] inline-block -rotate-12 shrink-0 drop-shadow-2xs" />
        </h1>

        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-medium flex items-center gap-1.5 pt-0.5">
          <span>Let&apos;s keep your pets happy and healthy.</span>
          <Heart className="size-3.5 text-[#FF6B6B] fill-none stroke-[2.2] inline-block" />
        </p>

        <div className="pt-4">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] hover:from-[#FA5252] hover:to-[#E03131] text-white text-xs sm:text-sm font-bold font-quicksand rounded-full shadow-xs shadow-[#FF6B6B]/25 transition-all active:scale-95 group"
          >
            <span>Explore Pet Guides</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Right Pets Companion Artwork */}
      <div className="absolute right-0 bottom-0 top-0 w-64 sm:w-80 md:w-96 flex items-end justify-end pointer-events-none select-none">
        <Image
          src="/dashboard/hero-pets.png"
          alt="Happy pet companions: budgie, golden retriever, and cat"
          width={309}
          height={160}
          priority
          className="h-full w-auto object-contain object-bottom-right drop-shadow-xs"
        />
      </div>
    </AnimatedContainer>
  );
}
