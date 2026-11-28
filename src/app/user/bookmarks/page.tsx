"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, ThumbsUp, BookOpen, Loader2 } from "lucide-react";
import {
  useGetMyBookmarksQuery,
  useGetMyLikesQuery,
} from "@/store/Api/Guides/guides.api";
import CareArticleCard, {
  CareArticleCardData,
  CareArticleCardSkeleton,
  GuideCategoryPill,
} from "@/app/(public)/guides/_components/CareArticleCard";
import type { BookmarkedGuideSummary } from "@/store/Api/Guides/guides.types";
import { cn } from "@/lib/utils";

function mapSummaryToCard(item: BookmarkedGuideSummary): CareArticleCardData {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.excerpt || "",
    readTime: `${item.readTimeMinutes || 5} min read`,
    category: (item.category?.name as GuideCategoryPill) || "General Care",
    categoryId: item.category?.id,
    categorySlug: item.category?.slug,
    image: item.coverImage || "/CareGuideCard/dog-faq-mascot.png",
    imageAlt: item.title,
    expertReviewed: Boolean(item.lastReviewedAt),
    slug: item.slug || item.id,
    translations: item.translations,
    locale: item.locale,
    isNativeTranslation: item.isNativeTranslation,
    availableLocales: item.availableLocales,
    likeCount: item.likeCount ?? 0,
    bookmarkCount: item.bookmarkCount ?? 0,
    commentsCount: 0,
    isLiked: Boolean(item.isLiked),
    isBookmarked: Boolean(item.isBookmarked),
  };
}

export default function UserBookmarksPage() {
  const [activeTab, setActiveTab] = useState<"bookmarks" | "likes">(
    "bookmarks"
  );
  const [page, setPage] = useState(1);

  const {
    data: bookmarksData,
    isLoading: isLoadingBookmarks,
    isFetching: isFetchingBookmarks,
  } = useGetMyBookmarksQuery(
    { page, limit: 12 },
    { skip: activeTab !== "bookmarks" }
  );

  const {
    data: likesData,
    isLoading: isLoadingLikes,
    isFetching: isFetchingLikes,
  } = useGetMyLikesQuery({ page, limit: 12 }, { skip: activeTab !== "likes" });

  const activeResponse =
    activeTab === "bookmarks" ? bookmarksData : likesData;
  const isLoading =
    activeTab === "bookmarks" ? isLoadingBookmarks : isLoadingLikes;
  const isFetching =
    activeTab === "bookmarks" ? isFetchingBookmarks : isFetchingLikes;

  const items = (activeResponse?.data?.items || []).map(mapSummaryToCard);
  const meta = activeResponse?.data?.meta;

  const handleTabChange = (tab: "bookmarks" | "likes") => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="w-full space-y-6 font-quicksand">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-peach dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">
            My Saved &amp; Liked Guides
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Quickly access the pet care guides you have bookmarked or liked.
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-xl bg-surface-muted border border-border-peach/60 self-start">
          <button
            type="button"
            onClick={() => handleTabChange("bookmarks")}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "bookmarks"
                ? "bg-coral text-white shadow-xs"
                : "text-ink-muted hover:text-ink"
            )}
          >
            <Bookmark className="size-3.5" />
            <span>Saved Guides</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("likes")}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "likes"
                ? "bg-coral text-white shadow-xs"
                : "text-ink-muted hover:text-ink"
            )}
          >
            <ThumbsUp className="size-3.5" />
            <span>Liked Guides</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <CareArticleCardSkeleton key={idx} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((article) => (
              <CareArticleCard key={article.id} article={article} />
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                disabled={!meta.hasPrevPage || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl border border-border-peach bg-card text-xs font-bold text-ink hover:border-coral disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-ink-muted">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                type="button"
                disabled={!meta.hasNextPage || isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl border border-border-peach bg-card text-xs font-bold text-ink hover:border-coral disabled:opacity-40 cursor-pointer inline-flex items-center gap-1.5"
              >
                {isFetching && <Loader2 className="size-3 animate-spin" />}
                <span>Next</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-14 px-6 rounded-2xl bg-surface-muted/50 border border-dashed border-border-peach space-y-3">
          <div className="size-12 rounded-2xl bg-coral/10 text-coral flex items-center justify-center mx-auto">
            <BookOpen className="size-6" />
          </div>
          <h3 className="text-base font-bold text-ink">
            {activeTab === "bookmarks"
              ? "No saved guides yet"
              : "No liked guides yet"}
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
            {activeTab === "bookmarks"
              ? "Bookmark any care guide while reading to save it here for quick reference."
              : "Like any care guide to keep track of your favorite articles."}
          </p>
          <div className="pt-2">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coral text-white text-xs font-bold hover:bg-coral-dark transition-colors"
            >
              Explore Pet Guides
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
