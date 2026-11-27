"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";

export default function PromoBannerCard() {
  return (
    <AnimatedContainer
      delay={0.3}
      className="lg:col-span-4 rounded-xl p-6 sm:p-7 border border-[#BCE3C5]/60 bg-gradient-to-r from-[#E5F3E4] via-[#DCF0DC] to-[#D5EDD5] dark:from-emerald-950/40 dark:to-slate-900 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[190px]"
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

      {/* Sleeping puppy & kitten illustration */}
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
  );
}
