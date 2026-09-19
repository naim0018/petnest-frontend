"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Clock, ShieldCheck, Bookmark, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type GuideCategoryPill =
  | "Nutrition"
  | "Health & Vet Care"
  | "Training"
  | "Grooming"
  | "Behavior"
  | "Life Stage"
  | "General Care";

export interface CareArticleCardData {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: GuideCategoryPill;
  image: string;
  imageAlt?: string;
  expertReviewed?: boolean;
  slug?: string;
}

export interface CareArticleCardProps {
  article: CareArticleCardData;
  className?: string;
  onBookmarkToggle?: (id: string, isBookmarked: boolean) => void;
}

const CATEGORY_COLOR_STYLES: Record<
  GuideCategoryPill,
  { bg: string; text: string; border: string }
> = {
  Nutrition: {
    bg: "bg-[#fff2d6]",
    text: "text-[#8a5300]",
    border: "border-[#fed7aa]/60",
  },
  "Health & Vet Care": {
    bg: "bg-[#ffe4e6]",
    text: "text-[#be123c]",
    border: "border-[#fecdd3]/60",
  },
  Training: {
    bg: "bg-[#f3e8ff]",
    text: "text-[#7e22ce]",
    border: "border-[#e9d5ff]/60",
  },
  Grooming: {
    bg: "bg-[#e0f2fe]",
    text: "text-[#0369a1]",
    border: "border-[#bae6fd]/60",
  },
  Behavior: {
    bg: "bg-[#dcfce7]",
    text: "text-[#15803d]",
    border: "border-[#bbf7d0]/60",
  },
  "Life Stage": {
    bg: "bg-[#fef3c7]",
    text: "text-[#b45309]",
    border: "border-[#fde68a]/60",
  },
  "General Care": {
    bg: "bg-[#f1f5f9]",
    text: "text-[#334155]",
    border: "border-[#cbd5e1]/60",
  },
};

export default function CareArticleCard({
  article,
  className,
  onBookmarkToggle,
}: CareArticleCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const {
    id,
    title,
    excerpt,
    readTime,
    category,
    image,
    imageAlt,
    expertReviewed = true,
    slug = id,
  } = article;

  const categoryStyle =
    CATEGORY_COLOR_STYLES[category] || CATEGORY_COLOR_STYLES["General Care"];

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isSaved;
    setIsSaved(nextState);
    onBookmarkToggle?.(id, nextState);
  };

  return (
    <article
      className={cn(
        "group bg-white rounded-2xl border border-[#e8ebe9] overflow-hidden shadow-xs hover:shadow-md hover:border-coral/40 transition-all duration-300 flex flex-col justify-between",
        className
      )}
    >
      <div>
        {/* Card Media Header */}
        <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden">
          <Link href={`/guides/${slug}`} className="block w-full h-full">
            <Image
              src={image}
              alt={imageAlt || title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </Link>

          {/* Overlapping Category pill visible directly over image */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span
              className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wide shadow-xs border font-quicksand select-none",
                categoryStyle.bg,
                categoryStyle.text,
                categoryStyle.border
              )}
            >
              {category}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <h3 className="text-base sm:text-[17px] font-bold text-[#1a2e26] leading-snug line-clamp-2 font-quicksand group-hover:text-coral transition-colors">
            <Link href={`/guides/${slug}`}>{title}</Link>
          </h3>
          <p className="text-xs sm:text-[13px] text-[#556960] leading-relaxed line-clamp-2 font-normal">
            {excerpt}
          </p>

          {/* Read More Link */}
          <div className="pt-1">
            <Link
              href={`/guides/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-coral hover:text-[#e85c5c] group/btn transition-colors"
            >
              <span>Read More</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Card Footer: Metadata & Bookmark Action */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-100/90 flex items-center justify-between mt-auto bg-slate-50/40">
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold text-[#576b61]">
          {/* Read time */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#73887d]" />
            <span>{readTime}</span>
          </div>

          {/* Expert Reviewed */}
          {expertReviewed && (
            <div className="flex items-center gap-1 text-[#107044]">
              <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#107044] text-white">
                <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
              <span className="text-[11px] sm:text-xs font-medium">Expert Reviewed</span>
            </div>
          )}
        </div>

        {/* Bookmark Icon Button */}
        <button
          type="button"
          onClick={handleBookmarkClick}
          aria-label={isSaved ? "Remove from bookmarks" : "Save guide"}
          className="p-1 text-[#788e83] hover:text-[#1a2e26] transition-colors cursor-pointer rounded-md focus:outline-none focus:ring-1 focus:ring-coral/40"
        >
          <Bookmark
            className={cn(
              "w-4 h-4 transition-transform active:scale-90",
              isSaved && "fill-[#1a2e26] text-[#1a2e26]"
            )}
          />
        </button>
      </div>
    </article>
  );
}
