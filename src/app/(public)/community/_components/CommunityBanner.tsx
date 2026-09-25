import React from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";

interface CommunityBannerProps {
  onCreatePostClick?: () => void;
}

export function CommunityBanner({ onCreatePostClick }: CommunityBannerProps) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border-peach dark:border-slate-800/80 bg-[#fff5f0] dark:bg-[#231a17] shadow-xs p-6 sm:p-8 md:p-10 flex flex-col justify-center min-h-[220px]">
      {/* Background Image & Gradient Mask */}
      <div className="absolute inset-0 z-0 h-full pointer-events-none">
        <Image
          src="/CareGuide/petnest-guides.png"
          alt="PetNest Community - Pets together"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right opacity-90 dark:opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#fff5f0] via-[#fff5f0]/90 sm:via-[#fff5f0]/75 to-transparent dark:from-[#231a17] dark:via-[#231a17]/90 sm:dark:via-[#231a17]/75 dark:to-transparent w-full md:w-3/4 lg:w-3/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-lg space-y-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink font-quicksand leading-tight">
          PetNest Community
        </h1>
        <h2 className="text-base sm:text-lg font-bold text-ink/90 font-quicksand">
          Ask, share, and connect with pet lovers.
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          Get advice, share experiences, find solutions, and make new friends.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onCreatePostClick}
            className="px-6 py-2.5 rounded-full bg-coral hover:bg-coral-dark text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Pencil className="w-4 h-4 stroke-[2.5]" />
            <span>Create Post</span>
          </button>
        </div>
      </div>
    </div>
  );
}
