"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PetCareGuideCard, {
  PetCareGuideCardData,
  DEFAULT_BUDGIE_GUIDE,
} from "./PetCareGuideCard";
import CareArticleCard, {
  CareArticleCardData,
  CareArticleCardSkeleton,
  GuideCategoryPill,
} from "./CareArticleCard";
import GuidesHelpBanner from "./GuidesHelpBanner";
import GuidesTopicFilterBar from "./GuidesTopicFilterBar";
import { PET_SPECIES_FEATURED_GUIDES } from "./petCareGuideData";
import { CATEGORY_ARTICLES_MAP, BUDGIE_CARE_ARTICLES } from "./careArticlesData";
import { useAppSelector } from "@/hooks/useRedux";
import {
  useFindAllPublicGuidesQuery,
  useGetSliderGuidesQuery,
} from "@/store/Api/Guides/guides.api";
import type { PublicGuideCardItem } from "@/store/Api/Guides/guides.types";
import { cn } from "@/lib/utils";

export interface BasicGuideSlide {
  id: string;
  breedKey: string;
  breedName: string;
  hero: PetCareGuideCardData;
  sides: CareArticleCardData[];
}

const LOVEBIRD_FALLBACK: PetCareGuideCardData = {
  badgeText: "Start Here",
  badgeIcon: "❤️",
  title: "The Complete Lovebird Care Guide",
  description:
    "Everything you need to raise happy, healthy lovebirds at home. From flight cages to balanced nutrition and gentle taming.",
  readTime: "7 min read",
  expertReviewed: true,
  ctaText: "Read Full Guide",
  href: "/guides",
  image: "/CareGuide/articles/budgie/behavior.jpg",
  imageAlt: "Colorful lovebirds perched close together",
  slogan: "Affectionate bonds lively spirits",
  heartIcon: true,
  bgGradient:
    "bg-linear-to-r from-[#f0fdf4] via-[#fef2f2] to-[#fff1f2] dark:from-[#132d24] dark:via-[#381a1f] dark:to-[#2b1216]",
  bubbleColor: "bg-[#bbf7d0]/50 dark:bg-[#14532d]/40",
  blendOverlayClass:
    "bg-linear-to-r from-[#f0fdf4] via-[#f0fdf4]/90 via-40% sm:via-[#f0fdf4]/75 sm:via-50% md:via-[#f0fdf4]/40 md:via-60% to-transparent dark:from-[#132d24] dark:via-[#132d24]/95 dark:via-40% sm:dark:via-[#132d24]/80 sm:dark:via-50% md:dark:via-[#132d24]/40 md:dark:via-60% dark:to-transparent",
};

function getBreedFallback(breedKey: string, category: string): PetCareGuideCardData {
  const normalizedKey = (breedKey || "").toLowerCase();
  if (normalizedKey.includes("cockatiel")) {
    return PET_SPECIES_FEATURED_GUIDES.cockatiel || DEFAULT_BUDGIE_GUIDE;
  }
  if (normalizedKey.includes("lovebird")) {
    return LOVEBIRD_FALLBACK;
  }
  if (normalizedKey.includes("budgie") || normalizedKey.includes("budgerigar")) {
    return PET_SPECIES_FEATURED_GUIDES.birds || DEFAULT_BUDGIE_GUIDE;
  }
  if (PET_SPECIES_FEATURED_GUIDES[normalizedKey]) {
    return PET_SPECIES_FEATURED_GUIDES[normalizedKey];
  }
  if (category && category !== "all" && PET_SPECIES_FEATURED_GUIDES[category]) {
    return PET_SPECIES_FEATURED_GUIDES[category];
  }
  return DEFAULT_BUDGIE_GUIDE;
}

function detectBreed(guide: PublicGuideCardItem): { key: string; name: string } {
  if (guide.breeds && guide.breeds.length > 0) {
    const b = guide.breeds[0];
    return { key: b.slug || b.id, name: b.name };
  }
  if (guide.species) {
    return { key: guide.species.slug || guide.species.id, name: guide.species.name };
  }
  const t = (guide.title || "").toLowerCase();
  const s = (guide.slug || "").toLowerCase();
  if (
    t.includes("budgie") ||
    t.includes("budgerigar") ||
    s.includes("budgie") ||
    s.includes("budgerigar")
  ) {
    return { key: "budgerigar", name: "Budgerigar" };
  }
  if (t.includes("cockatiel") || s.includes("cockatiel")) {
    return { key: "cockatiel", name: "Cockatiel" };
  }
  if (t.includes("lovebird") || s.includes("lovebird")) {
    return { key: "lovebird", name: "Lovebird" };
  }
  if (t.includes("canary") || s.includes("canary")) {
    return { key: "canary", name: "Canary" };
  }
  if (t.includes("finch") || s.includes("finch")) {
    return { key: "finch", name: "Finch" };
  }
  return { key: "general", name: "General Care" };
}

const categoryLabelMap: Record<string, string> = {
  all: "All Pets",
  birds: "Budgie & Bird",
  dogs: "Puppy & Dog",
  cats: "Cat & Kitten",
  "small-pets": "Small Pet",
  aquatic: "Aquatic & Fish",
  reptiles: "Reptile & Amphibian",
};

function mapToHeroGuide(
  guide: PublicGuideCardItem,
  fallback: PetCareGuideCardData
): PetCareGuideCardData {
  return {
    badgeText:
      guide.type === "PILLAR" ? "Start Here" : guide.category?.name || "Care Guide",
    badgeIcon: "👑",
    title: guide.title,
    description: guide.excerpt || fallback.description,
    readTime: `${guide.readTimeMinutes || 5} min read`,
    expertReviewed: Boolean(guide.expertReviewed ?? guide.lastReviewedAt),
    ctaText: "Read Full Guide",
    href: `/guides/${guide.slug || guide.id}`,
    image: guide.coverImage || fallback.image,
    imageAlt: guide.coverImageAlt || guide.title,
    slogan: fallback.slogan || "Happy pets brighter homes",
    heartIcon: true,
    bgGradient:
      fallback.bgGradient || "bg-linear-to-r from-[#eef9f2] via-[#e5f5ed] to-[#d8efe5]",
    bubbleColor: fallback.bubbleColor || "bg-[#c6ebd7]/60",
  };
}

function mapToCareArticle(guide: PublicGuideCardItem): CareArticleCardData {
  return {
    id: guide.id,
    title: guide.title,
    excerpt: guide.excerpt || "",
    readTime: `${guide.readTimeMinutes || 5} min read`,
    category: (guide.category?.name as GuideCategoryPill) || "General Care",
    categoryId: guide.category?.id,
    categorySlug: guide.category?.slug,
    image: guide.coverImage || "/CareGuideCard/dog-faq-mascot.png",
    imageAlt: guide.coverImageAlt || guide.title,
    expertReviewed: Boolean(guide.expertReviewed ?? guide.lastReviewedAt),
    slug: guide.slug || guide.id,
    displayOrder: guide.displayOrder,
    translations: guide.translations,
    locale: guide.locale,
    isNativeTranslation: guide.isNativeTranslation,
    availableLocales: guide.availableLocales,
    likeCount: guide.likeCount ?? 0,
    bookmarkCount: guide.bookmarkCount ?? 0,
    commentsCount: 0,
    isLiked: guide.isLiked,
    isBookmarked: guide.isBookmarked,
  };
}

export default function GuidesInteractiveExplorer() {
  const reduxFilter = useAppSelector((state) => state.petFilter);

  // Sync selectedCategory and selectedBreed with Redux
  const selectedCategory = reduxFilter?.selectedType || "all";
  const selectedBreed = reduxFilter?.selectedBreed || "all";
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  const searchLang =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("lang") || undefined
      : undefined;

  const searchQuery =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("search") || undefined
      : undefined;

  // 1. Top Slider: dedicated query for basic guides
  const { data: sliderResponse, isLoading: isLoadingSlider } =
    useGetSliderGuidesQuery({
      species: selectedCategory !== "all" ? selectedCategory : undefined,
      breed: selectedBreed !== "all" ? selectedBreed : undefined,
      lang: searchLang,
    });
  const basicGuides = sliderResponse?.data?.items || [];

  // Fallback defaults
  const fallbackGuide =
    (selectedBreed !== "all" && PET_SPECIES_FEATURED_GUIDES[selectedBreed]) ||
    PET_SPECIES_FEATURED_GUIDES[selectedCategory] ||
    PET_SPECIES_FEATURED_GUIDES.birds ||
    DEFAULT_BUDGIE_GUIDE;

  const fallbackArticles =
    CATEGORY_ARTICLES_MAP[selectedCategory] || BUDGIE_CARE_ARTICLES;

  const activeCategoryTitle = categoryLabelMap[selectedCategory] || "Pet";

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Reset slide index if breed or category filter changes
  useEffect(() => {
    setActiveSlideIndex(0);
  }, [selectedBreed, selectedCategory]);

  const slides = useMemo(() => {
    if (basicGuides.length > 0) {
      const generatedSlides: BasicGuideSlide[] = [];

      if (selectedBreed === "all") {
        const breedGroupsMap = new Map<
          string,
          { key: string; name: string; guides: PublicGuideCardItem[] }
        >();

        for (const guide of basicGuides) {
          const { key, name } = detectBreed(guide);
          if (!breedGroupsMap.has(key)) {
            breedGroupsMap.set(key, { key, name, guides: [] });
          }
          breedGroupsMap.get(key)!.guides.push(guide);
        }

        for (const group of breedGroupsMap.values()) {
          const breedFallback = getBreedFallback(group.key, selectedCategory);
          for (let i = 0; i < group.guides.length; i += 3) {
            const chunk = group.guides.slice(i, i + 3);
            const hero = mapToHeroGuide(chunk[0], breedFallback);
            const sides = chunk.slice(1).map(mapToCareArticle);
            const partNum = Math.floor(i / 3) + 1;
            const totalParts = Math.ceil(group.guides.length / 3);
            const partSuffix = totalParts > 1 ? ` (${partNum})` : "";

            generatedSlides.push({
              id: `${group.key}-slide-${partNum}`,
              breedKey: group.key,
              breedName: `${group.name}${partSuffix}`,
              hero,
              sides,
            });
          }
        }
      } else {
        const targetBreedKey = selectedBreed.toLowerCase();
        const breedGuides = basicGuides.filter((g) => {
          const { key } = detectBreed(g);
          const k = key.toLowerCase();
          return (
            k === targetBreedKey ||
            k.includes(targetBreedKey) ||
            targetBreedKey.includes(k)
          );
        });

        const activeGuides = breedGuides.length > 0 ? breedGuides : basicGuides;
        const breedFallback = getBreedFallback(selectedBreed, selectedCategory);

        if (activeGuides.length <= 3) {
          const hero = mapToHeroGuide(activeGuides[0], breedFallback);
          const sides = activeGuides.slice(1, 3).map(mapToCareArticle);
          generatedSlides.push({
            id: `${selectedBreed}-single-slide`,
            breedKey: selectedBreed,
            breedName: detectBreed(activeGuides[0]).name,
            hero,
            sides,
          });
        } else {
          for (let i = 0; i < activeGuides.length; i += 3) {
            const chunk = activeGuides.slice(i, i + 3);
            const hero = mapToHeroGuide(chunk[0], breedFallback);
            const sides = chunk.slice(1).map(mapToCareArticle);
            const partNum = Math.floor(i / 3) + 1;

            generatedSlides.push({
              id: `${selectedBreed}-slide-${partNum}`,
              breedKey: selectedBreed,
              breedName: `Page ${partNum}`,
              hero,
              sides,
            });
          }
        }
      }

      if (generatedSlides.length > 0) {
        return generatedSlides;
      }
    }

    return [
      {
        id: "fallback-slide",
        breedKey: selectedBreed,
        breedName: activeCategoryTitle,
        hero: fallbackGuide,
        sides: fallbackArticles.slice(0, 2),
      },
    ];
  }, [
    basicGuides,
    selectedBreed,
    selectedCategory,
    activeCategoryTitle,
    fallbackGuide,
    fallbackArticles,
  ]);

  const safeSlideIndex =
    activeSlideIndex < slides.length ? activeSlideIndex : 0;
  const currentSlide = slides[safeSlideIndex] || slides[0];

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  // 2. Bottom Grid: real server pagination with limit 8 (2 rows on lg:grid-cols-4)
  const BATCH_SIZE = 8;
  const [page, setPage] = useState<number>(1);
  const [accumulatedArticles, setAccumulatedArticles] = useState<CareArticleCardData[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Reset page & accumulated items whenever filter changes
  useEffect(() => {
    setPage(1);
    setAccumulatedArticles([]);
  }, [selectedCategory, selectedBreed, selectedTopic, searchQuery]);

  const {
    data: paginatedGuidesResponse,
    isLoading: isLoadingInitialGrid,
    isFetching: isFetchingGrid,
  } = useFindAllPublicGuidesQuery({
    species: searchQuery ? undefined : (selectedCategory !== "all" ? selectedCategory : undefined),
    breed: searchQuery ? undefined : (selectedBreed !== "all" ? selectedBreed : undefined),
    category: selectedTopic !== "all" ? selectedTopic : undefined,
    excludeBasic: true,
    page,
    limit: BATCH_SIZE,
    sortBy: "displayOrder",
    sortOrder: "asc",
    lang: searchLang,
    search: searchQuery,
  });

  // Append new articles as server pages arrive
  useEffect(() => {
    if (!paginatedGuidesResponse?.data?.items) return;
    const newCards = paginatedGuidesResponse.data.items.map(mapToCareArticle);

    if (page === 1) {
      setAccumulatedArticles(newCards);
    } else {
      setAccumulatedArticles((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const uniqueNew = newCards.filter((a) => !existingIds.has(a.id));
        return [...prev, ...uniqueNew];
      });
    }
  }, [paginatedGuidesResponse, page]);

  const meta = paginatedGuidesResponse?.data?.meta;
  const hasNextPage = Boolean(
    meta?.hasNextPage ?? (meta ? page < meta.totalPages : false)
  );

  const handleLoadMore = useCallback(() => {
    if (!isFetchingGrid && hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [isFetchingGrid, hasNextPage]);

  // Robust callback ref: auto-loads on scroll while keeping observer synced
  const sentinelCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!node || !hasNextPage || isFetchingGrid) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingGrid) {
            setPage((prev) => prev + 1);
          }
        },
        {
          root: null,
          rootMargin: "300px",
          threshold: 0.05,
        }
      );
      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingGrid]
  );

  return (
    <div className="space-y-8">
      {/* Active Search Filter Banner */}
      {searchQuery && (
        <div className="flex items-center justify-between p-3.5 bg-coral-light/60 border border-coral/30 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-coral font-quicksand">
            <Search className="size-4" />
            <span>Search results for &quot;{searchQuery}&quot;</span>
          </div>
          <Link
            href="/guides"
            className="text-xs font-semibold text-ink-muted hover:text-coral hover:underline"
          >
            Clear search
          </Link>
        </div>
      )}
      {/* Top Row: Care Guide Card takes 2-card width on the left + 2 individual cards on the right */}
      {isLoadingSlider ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch animate-pulse">
          <div className="md:col-span-2 lg:col-span-2 h-72 rounded-lg bg-surface-muted border border-border-peach/50" />
          <div className="h-72 rounded-lg bg-surface-muted border border-border-peach/50" />
          <div className="h-72 rounded-lg bg-surface-muted border border-border-peach/50" />
        </section>
      ) : currentSlide ? (
        <section className="space-y-3">
          {/* Slider Header: Rendered only when there are multiple slides */}
          {slides.length > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left: Section Label & Breed Pills */}
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-coral animate-pulse" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink font-quicksand">
                  {selectedCategory === "all"
                    ? "All Essential Care Guides"
                    : selectedBreed === "all"
                    ? "Essential Breed Guides"
                    : `${currentSlide.breedName} Guides`}
                </span>

                {/* Direct Breed Switcher Tabs (when all breeds are selected) */}
                {selectedBreed === "all" && slides.length > 1 && (
                  <div className="hidden sm:flex items-center gap-1.5 ml-2">
                    {slides.map((s, idx) => (
                      <button
                        key={s.id || idx}
                        type="button"
                        onClick={() => setActiveSlideIndex(idx)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold font-quicksand transition-all cursor-pointer",
                          safeSlideIndex === idx
                            ? "bg-coral text-white shadow-xs scale-105"
                            : "bg-surface-muted text-ink-muted hover:text-coral hover:bg-coral-light/60 border border-border-peach/60"
                        )}
                      >
                        {s.breedName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Dot Indicators & Previous / Next Buttons */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all cursor-pointer",
                        safeSlideIndex === idx
                          ? "w-5 bg-coral"
                          : "w-1.5 bg-ink-faint/30 hover:bg-ink-muted"
                      )}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 ml-1">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="Previous guide slide"
                    className="size-8 rounded-lg flex items-center justify-center bg-card border border-border-peach text-ink hover:text-coral hover:border-coral/50 hover:bg-coral-light/30 transition-all cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next guide slide"
                    className="size-8 rounded-lg flex items-center justify-center bg-card border border-border-peach text-ink hover:text-coral hover:border-coral/50 hover:bg-coral-light/30 transition-all cursor-pointer shadow-2xs"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Slide Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                {/* Left: Care Guide Card */}
                <div
                  className={cn(
                    "flex flex-col",
                    currentSlide.sides.length === 0
                      ? "col-span-full"
                      : currentSlide.sides.length === 1
                      ? "md:col-span-2 lg:col-span-3"
                      : "md:col-span-2 lg:col-span-2"
                  )}
                >
                  <PetCareGuideCard guide={currentSlide.hero} className="h-full" />
                </div>

                {/* Right: Side Basic Cards */}
                {currentSlide.sides.map((article) => (
                  <div
                    key={article.id}
                    className={cn(
                      "flex flex-col",
                      currentSlide.sides.length === 1
                        ? "md:col-span-2 lg:col-span-1"
                        : ""
                    )}
                  >
                    <CareArticleCard article={article} className="h-full" />
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      ) : null}

      {/* Reusable Care Article Cards Grid with Topic Filter */}
      <section id="topics" className="space-y-5 pt-2 scroll-mt-24 sm:scroll-mt-28">
        {/* Reusable Topic Filter Bar */}
        <GuidesTopicFilterBar
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
        />

        {/* 4 columns on large screens, 2 on tablet, 1 on mobile */}
        {isLoadingInitialGrid ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: BATCH_SIZE }).map((_, idx) => (
              <CareArticleCardSkeleton key={`initial-skeleton-${idx}`} />
            ))}
          </div>
        ) : accumulatedArticles.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {accumulatedArticles.map((article) => (
                <CareArticleCard key={article.id} article={article} />
              ))}
              {isFetchingGrid && page > 1 &&
                Array.from({ length: BATCH_SIZE }).map((_, idx) => (
                  <CareArticleCardSkeleton key={`more-skeleton-${idx}`} />
                ))}
            </div>

            {/* Load More Controls & Auto-scroll Sentinel */}
            {hasNextPage ? (
              <div
                ref={sentinelCallbackRef}
                className="flex flex-col items-center justify-center gap-3 pt-6 pb-2"
              >
                <p className="text-xs font-semibold text-ink-muted font-quicksand">
                  Showing {accumulatedArticles.length} of {meta?.total ?? accumulatedArticles.length} guides
                </p>
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isFetchingGrid}
                  className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-coral text-white hover:bg-coral-dark font-bold font-quicksand text-sm shadow-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {isFetchingGrid ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Loading next guides...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Guides</span>
                      <ChevronDown className="size-4" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center pt-6 pb-2">
                <p className="text-xs font-bold text-ink-muted/80 font-quicksand">
                  Showing all {meta?.total ?? accumulatedArticles.length} care guides
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-lg bg-surface-muted/50 border border-border-peach dark:border-slate-800">
            <p className="text-ink-muted font-quicksand font-bold text-sm sm:text-base">
              No guides found for this topic in {activeCategoryTitle}.
            </p>
            <button
              type="button"
              onClick={() => setSelectedTopic("all")}
              className="mt-3 text-xs font-bold text-coral hover:underline cursor-pointer"
            >
              Reset filter to All Topics
            </button>
          </div>
        )}
      </section>

      {/* Help / Ask Community & Expert Banner */}
      <GuidesHelpBanner />
    </div>
  );
}