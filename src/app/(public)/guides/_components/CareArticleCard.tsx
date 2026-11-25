"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Clock,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import { useAppSelector } from "@/hooks/useRedux";
import {
  useToggleBookmarkMutation,
  useToggleLikeMutation,
} from "@/store/Api/Guides/guides.api";
import type { GuideTranslationsMap } from "@/store/Api/Guides/guides.types";

export type GuideCategoryPill =
  | "Nutrition"
  | "Health & Vet Care"
  | "Training"
  | "Grooming"
  | "Behavior"
  | "Life Stage"
  | "General Care"
  | "Basic"
  | string;

export interface CareArticleCardData {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: GuideCategoryPill;
  categoryId?: string;
  categorySlug?: string;
  image: string;
  imageAlt?: string;
  expertReviewed?: boolean;
  slug?: string;
  order?: number;
  displayOrder?: number;
  translations?: GuideTranslationsMap | null;
  locale?: string;
  isNativeTranslation?: boolean;
  availableLocales?: string[];
  likeCount?: number;
  commentsCount?: number;
  bookmarkCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface CareArticleCardProps {
  article: CareArticleCardData;
  className?: string;
  onBookmarkToggle?: (id: string, isBookmarked: boolean) => void;
}

const CATEGORY_COLOR_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  // Database Categories
  "Behavior & Shows": {
    bg: "bg-[#dcfce7] dark:bg-[#152b20]",
    text: "text-[#15803d] dark:text-[#86efac]",
    border: "border-[#bbf7d0]/60 dark:border-[#86efac]/30",
  },
  "Emergency & First Aid": {
    bg: "bg-[#fee2e2] dark:bg-[#3b1219]",
    text: "text-[#b91c1c] dark:text-[#fca5a5]",
    border: "border-[#fecaca]/60 dark:border-[#b91c1c]/30",
  },
  "Grooming & Hygiene": {
    bg: "bg-[#e0f2fe] dark:bg-[#172838]",
    text: "text-[#0369a1] dark:text-[#7dd3fc]",
    border: "border-[#bae6fd]/60 dark:border-[#7dd3fc]/30",
  },
  "Health & Wellness": {
    bg: "bg-[#ffe4e6] dark:bg-[#321d21]",
    text: "text-[#be123c] dark:text-[#ffaaaa]",
    border: "border-[#fecdd3]/60 dark:border-[#ffaaaa]/30",
  },
  Medicine: {
    bg: "bg-[#f5f3ff] dark:bg-[#281d3d]",
    text: "text-[#6366f1] dark:text-[#a5b4fc]",
    border: "border-[#ddd6fe]/60 dark:border-[#6366f1]/30",
  },
  "Nutrition & Diet": {
    bg: "bg-[#fff2d6] dark:bg-[#332e18]",
    text: "text-[#8a5300] dark:text-[#ffe08a]",
    border: "border-[#fed7aa]/60 dark:border-[#ffe08a]/30",
  },
  "Training & Skills": {
    bg: "bg-[#f3e8ff] dark:bg-[#281f38]",
    text: "text-[#7e22ce] dark:text-[#d8b4fe]",
    border: "border-[#e9d5ff]/60 dark:border-[#d8b4fe]/30",
  },
  Basic: {
    bg: "bg-[#eafbf1] dark:bg-[#152e22]",
    text: "text-[#15803d] dark:text-[#86efac]",
    border: "border-[#bbf7d0]/60 dark:border-[#15803d]/40",
  },

  // Fallbacks and aliases
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
  const [isSaved, setIsSaved] = useState(Boolean(article.isBookmarked));
  const [bookmarkCount, setBookmarkCount] = useState(article.bookmarkCount ?? 0);
  const [isLiked, setIsLiked] = useState(Boolean(article.isLiked));
  const [likeCount, setLikeCount] = useState(article.likeCount ?? 0);
  const commentsCount = article.commentsCount ?? 0;

  const [toggleBookmark, { isLoading: isBookmarking }] = useToggleBookmarkMutation();
  const [toggleLike, { isLoading: isLiking }] = useToggleLikeMutation();

  const authUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = Boolean(authUser?.userId);

  useEffect(() => {
    setIsSaved(Boolean(article.isBookmarked));
    setBookmarkCount(article.bookmarkCount ?? 0);
    setIsLiked(Boolean(article.isLiked));
    setLikeCount(article.likeCount ?? 0);
  }, [article.isBookmarked, article.bookmarkCount, article.isLiked, article.likeCount]);

  const {
    id,
    title,
    excerpt,
    readTime,
    category,
    image,
    imageAlt,
    slug = id,
  } = article;

  const currentLang = useCurrentLanguage();
  const isBangla = currentLang === "bn" || article.locale === "bn";
  const nativeBn = isBangla ? article.translations?.bn : null;
  const displayTitle = (isBangla && nativeBn?.title?.trim()) || title;
  const displayExcerpt = (isBangla && nativeBn?.excerpt?.trim()) || excerpt;
  const isNative = Boolean(
    article.isNativeTranslation ||
      (isBangla && (nativeBn?.title || nativeBn?.excerpt)),
  );

  const categoryStyle =
    CATEGORY_COLOR_STYLES[category] || CATEGORY_COLOR_STYLES["General Care"];

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please log in to save guides to your bookmarks");
      return;
    }

    if (isBookmarking) return;

    const nextSaved = !isSaved;
    const nextCount = Math.max(0, bookmarkCount + (nextSaved ? 1 : -1));
    setIsSaved(nextSaved);
    setBookmarkCount(nextCount);
    onBookmarkToggle?.(id, nextSaved);

    try {
      const res = await toggleBookmark(id).unwrap();
      if (res?.data) {
        setIsSaved(res.data.bookmarked);
        setBookmarkCount(res.data.bookmarkCount);
      }
    } catch {
      setIsSaved(!nextSaved);
      setBookmarkCount(bookmarkCount);
      toast.error("Failed to update bookmark");
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please log in to like guides");
      return;
    }

    if (isLiking) return;

    const nextLiked = !isLiked;
    const nextCount = Math.max(0, likeCount + (nextLiked ? 1 : -1));
    setIsLiked(nextLiked);
    setLikeCount(nextCount);

    try {
      const res = await toggleLike(id).unwrap();
      if (res?.data) {
        setIsLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      }
    } catch {
      setIsLiked(!nextLiked);
      setLikeCount(likeCount);
      toast.error("Failed to update like");
    }
  };

  return (
    <article
      className={cn(
        "group bg-card text-card-foreground rounded-lg border border-border overflow-hidden shadow-xs hover:shadow-md hover:border-coral/40 transition-all duration-300 flex flex-col justify-between h-full",
        className
      )}
    >
      <div className="flex flex-col flex-1">
        {/* Card Media Header */}
        <div className="relative h-56 sm:h-64 w-full bg-surface-muted overflow-hidden">
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
        <div
          className={cn(
            "p-4 sm:p-5 flex flex-col flex-1",
            isNative && "notranslate"
          )}
          translate={isNative ? "no" : undefined}
        >
          <h3 className="text-base sm:text-[17px] font-bold text-ink leading-snug line-clamp-2 min-h-[2.75rem] sm:min-h-[3rem] font-quicksand group-hover:text-coral transition-colors">
            <Link href={`/guides/${slug}`}>{displayTitle}</Link>
          </h3>
          <p className="mt-2 text-sm text-ink-muted leading-relaxed line-clamp-3 font-normal">
            {displayExcerpt}
          </p>

          {/* Read More Link pushed to the end */}
          <div className="mt-auto pt-3">
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

      {/* Card Footer: Metadata (Minutes, Likes, Comments, Bookmark count) */}
      <div className="px-4 sm:px-5 py-3 border-t border-border flex items-center justify-between mt-auto bg-surface-muted/50 select-none">
        {/* Read time */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
          <Clock className="w-3.5 h-3.5 text-ink-muted shrink-0" />
          <span>{readTime}</span>
        </div>

        {/* Engagement Stats: Likes, Comments, Bookmark count */}
        <div className="flex items-center gap-3 sm:gap-3.5 text-xs font-semibold text-ink-muted">
          {/* Likes */}
          <button
            type="button"
            onClick={handleLikeClick}
            aria-label={isLiked ? "Unlike guide" : "Like guide"}
            title="Likes"
            className={cn(
              "inline-flex items-center gap-1 transition-colors cursor-pointer rounded-sm focus:outline-none focus:ring-1 focus:ring-coral/40",
              isLiked ? "text-coral font-bold" : "hover:text-coral text-ink-muted"
            )}
          >
            <ThumbsUp
              className={cn(
                "w-3.5 h-3.5 transition-transform active:scale-90 shrink-0",
                isLiked && "fill-coral text-coral"
              )}
            />
            <span>{likeCount}</span>
          </button>

          {/* Comments */}
          <div
            className="inline-flex items-center gap-1 text-ink-muted"
            title="Comments"
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span>{commentsCount}</span>
          </div>

          {/* Bookmarks */}
          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={isSaved ? "Remove from bookmarks" : "Save guide"}
            title="Bookmarks"
            className={cn(
              "inline-flex items-center gap-1 transition-colors cursor-pointer rounded-sm focus:outline-none focus:ring-1 focus:ring-coral/40",
              isSaved ? "text-coral font-bold" : "hover:text-coral text-ink-muted"
            )}
          >
            <Bookmark
              className={cn(
                "w-3.5 h-3.5 transition-transform active:scale-90 shrink-0",
                isSaved && "fill-coral text-coral"
              )}
            />
            <span>{bookmarkCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export function CareArticleCardSkeleton({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "bg-card text-card-foreground rounded-lg border border-border overflow-hidden shadow-xs flex flex-col justify-between h-full select-none",
        className
      )}
    >
      <div className="flex flex-col flex-1">
        {/* Card Media Header Skeleton */}
        <div className="relative h-56 sm:h-64 w-full bg-surface-muted overflow-hidden animate-pulse">
          <div className="absolute top-3.5 left-3.5 z-10">
            <div className="h-6 w-20 rounded-full bg-card/70 border border-border/40" />
          </div>
        </div>

        {/* Card Body Skeleton */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 animate-pulse">
          <div className="h-5 bg-surface-muted rounded w-4/5" />
          <div className="h-5 bg-surface-muted rounded w-3/5 mt-2" />

          <div className="space-y-2 mt-3.5">
            <div className="h-3.5 bg-surface-muted/70 rounded w-full" />
            <div className="h-3.5 bg-surface-muted/70 rounded w-11/12" />
            <div className="h-3.5 bg-surface-muted/70 rounded w-3/4" />
          </div>

          <div className="mt-auto pt-4">
            <div className="h-3.5 w-20 rounded bg-coral/20" />
          </div>
        </div>
      </div>

      {/* Card Footer Skeleton */}
      <div className="px-4 sm:px-5 py-3 border-t border-border flex items-center justify-between mt-auto bg-surface-muted/50 animate-pulse">
        <div className="flex items-center gap-1.5">
          <div className="size-3.5 rounded-full bg-surface-muted" />
          <div className="h-3 w-14 rounded bg-surface-muted" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="size-3.5 rounded bg-surface-muted" />
            <div className="h-3 w-4 rounded bg-surface-muted" />
          </div>
          <div className="flex items-center gap-1">
            <div className="size-3.5 rounded bg-surface-muted" />
            <div className="h-3 w-4 rounded bg-surface-muted" />
          </div>
          <div className="flex items-center gap-1">
            <div className="size-3.5 rounded bg-surface-muted" />
            <div className="h-3 w-4 rounded bg-surface-muted" />
          </div>
        </div>
      </div>
    </article>
  );
}
