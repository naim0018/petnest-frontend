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
    bg: "bg-[#fff2d6] dark:bg-[#332e18]",
    text: "text-[#8a5300] dark:text-[#ffe08a]",
    border: "border-[#fed7aa]/60 dark:border-[#ffe08a]/30",
  },
  "Health & Vet Care": {
    bg: "bg-[#ffe4e6] dark:bg-[#321d21]",
    text: "text-[#be123c] dark:text-[#ffaaaa]",
    border: "border-[#fecdd3]/60 dark:border-[#ffaaaa]/30",
  },
  Training: {
    bg: "bg-[#f3e8ff] dark:bg-[#281f38]",
    text: "text-[#7e22ce] dark:text-[#d8b4fe]",
    border: "border-[#e9d5ff]/60 dark:border-[#d8b4fe]/30",
  },
  Grooming: {
    bg: "bg-[#e0f2fe] dark:bg-[#172838]",
    text: "text-[#0369a1] dark:text-[#7dd3fc]",
    border: "border-[#bae6fd]/60 dark:border-[#7dd3fc]/30",
  },
  Behavior: {
    bg: "bg-[#dcfce7] dark:bg-[#152b20]",
    text: "text-[#15803d] dark:text-[#86efac]",
    border: "border-[#bbf7d0]/60 dark:border-[#86efac]/30",
  },
  "Life Stage": {
    bg: "bg-[#fef3c7] dark:bg-[#332a15]",
    text: "text-[#b45309] dark:text-[#fde68a]",
    border: "border-[#fde68a]/60 dark:border-[#fde68a]/30",
  },
  "General Care": {
    bg: "bg-[#f1f5f9] dark:bg-[#1f2937]",
    text: "text-[#334155] dark:text-[#cbd5e1]",
    border: "border-[#cbd5e1]/60 dark:border-[#475569]/50",
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
        "group bg-card text-card-foreground rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-md hover:border-coral/40 transition-all duration-300 flex flex-col justify-between",
        className
      )}
    >
      <div>
        {/* Card Media Header */}
        <div className="relative h-48 sm:h-52 w-full bg-surface-muted overflow-hidden">
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
          <h3 className="text-base sm:text-[17px] font-bold text-ink leading-snug line-clamp-2 font-quicksand group-hover:text-coral transition-colors">
            <Link href={`/guides/${slug}`}>{title}</Link>
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed line-clamp-3 font-normal">
            {excerpt}
          </p>

          {/* Read More Link */}
          <div className="pt-1">
            <Link
              href={`/guides/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-coral hover:text-coral-dark group/btn transition-colors font-quicksand"
            >
              <span>Read More</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Card Footer: Metadata & Bookmark Action */}
      <div className="px-4 sm:px-5 py-3 border-t border-border flex items-center justify-between mt-auto bg-surface-muted/50">
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold text-ink-muted">
          {/* Read time */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-ink-muted" />
            <span>{readTime}</span>
          </div>

          {/* Expert Reviewed */}
          {expertReviewed && (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white">
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
          className="p-1 text-ink-muted hover:text-ink transition-colors cursor-pointer rounded-md focus:outline-none focus:ring-1 focus:ring-coral/40"
        >
          <Bookmark
            className={cn(
              "w-4 h-4 transition-transform active:scale-90",
              isSaved && "fill-ink text-ink"
            )}
          />
        </button>
      </div>
    </article>
  );
}
