"use client";

import { useState, useMemo } from "react";
import PetCareGuideCard, {
  PetCareGuideCardData,
  DEFAULT_BUDGIE_GUIDE,
} from "./PetCareGuideCard";
import CareArticleCard, {
  CareArticleCardData,
  GuideCategoryPill,
} from "./CareArticleCard";
import GuidesHelpBanner from "./GuidesHelpBanner";
import GuidesTopicFilterBar from "./GuidesTopicFilterBar";
import { PET_SPECIES_FEATURED_GUIDES } from "./petCareGuideData";
import { CATEGORY_ARTICLES_MAP, BUDGIE_CARE_ARTICLES } from "./careArticlesData";
import { useAppSelector } from "@/hooks/useRedux";
import { useFindAllPublicGuidesQuery } from "@/store/Api/Guides/guides.api";
import type { PublicGuideCardItem } from "@/store/Api/Guides/guides.types";
import { cn } from "@/lib/utils";

const categoryLabelMap: Record<string, string> = {
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

  // Sync selectedCategory and selectedBreed with Redux (fallback to birds / all if 'all')
  const reduxType =
    reduxFilter?.selectedType && reduxFilter.selectedType !== "all"
      ? reduxFilter.selectedType
      : "birds";
  const reduxBreed = reduxFilter?.selectedBreed || "all";

  const selectedCategory = reduxType;
  const selectedBreed = reduxBreed;
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  const searchLang =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("lang") || undefined
      : undefined;

  // Fetch live guides:
  // - If only species is selected (breed === 'all'), fetches all guides on that species
  // - If a specific breed is selected, fetches guides targeting that breed
  const { data: guidesResponse, isLoading: isLoadingGuides } =
    useFindAllPublicGuidesQuery({
      species: selectedCategory !== "all" ? selectedCategory : undefined,
      breed: selectedBreed !== "all" ? selectedBreed : undefined,
      limit: 50,
      sortBy: "displayOrder",
      sortOrder: "asc",
      lang: searchLang,
    });

  const apiGuides: PublicGuideCardItem[] = guidesResponse?.data?.items || [];

  // Fallback defaults
  const fallbackGuide =
    (selectedBreed !== "all" && PET_SPECIES_FEATURED_GUIDES[selectedBreed]) ||
    PET_SPECIES_FEATURED_GUIDES[selectedCategory] ||
    PET_SPECIES_FEATURED_GUIDES.birds ||
    DEFAULT_BUDGIE_GUIDE;

  const fallbackArticles =
    CATEGORY_ARTICLES_MAP[selectedCategory] || BUDGIE_CARE_ARTICLES;

  // Partition guides:
  // 1. All Basic guides are displayed on the top before the category slider (hero + side cards + extra basic cards)
  // 2. All topic-specific guides are displayed below the category slider and filtered by topic
  const { currentGuide, sideArticles, extraBasicArticles, remainingArticles } = useMemo(() => {
    const isBasicItem = (catSlug?: string | null, catName?: string | null) => {
      const s = (catSlug || "").toLowerCase();
      const n = (catName || "").toLowerCase();
      return s === "basic" || n === "basic";
    };

    if (apiGuides.length > 0) {
      // Sort helper: lower positive displayOrder first, then unranked (0 / undefined) sorted by published date
      const sortByDisplayOrder = (
        a: PublicGuideCardItem,
        b: PublicGuideCardItem
      ) => {
        const aOrder =
          typeof a.displayOrder === "number" && a.displayOrder > 0
            ? a.displayOrder
            : 9999;
        const bOrder =
          typeof b.displayOrder === "number" && b.displayOrder > 0
            ? b.displayOrder
            : 9999;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return (
          new Date(b.publishedAt || 0).getTime() -
          new Date(a.publishedAt || 0).getTime()
        );
      };

      const sortedGuides = [...apiGuides].sort(sortByDisplayOrder);

      // Separate all Basic guides from Topic-categorized guides
      const basicGuides = sortedGuides.filter((g) =>
        isBasicItem(g.category?.slug, g.category?.name)
      );
      const topicGuides = sortedGuides.filter(
        (g) => !isBasicItem(g.category?.slug, g.category?.name)
      );

      // 1. Hero Guide (Top Basic Guide, or fallback to first sorted guide)
      const heroRecord = basicGuides[0] || sortedGuides[0];
      const hero = mapToHeroGuide(heroRecord, fallbackGuide);

      // 2. Side Basic Articles (up to 2 basic guides beside hero)
      const sides: CareArticleCardData[] =
        basicGuides.length > 1
          ? basicGuides.slice(1, 3).map(mapToCareArticle)
          : basicGuides.length === 0
          ? topicGuides.slice(0, 2).map(mapToCareArticle)
          : [];

      // 3. Extra Basic Articles (any additional basic guides beyond the top 3)
      const extraBasic: CareArticleCardData[] =
        basicGuides.length > 3
          ? basicGuides.slice(3).map(mapToCareArticle)
          : [];

      // 4. Topic Guides Grid: only topic guides (excluding all basic guides)
      const gridGuides =
        basicGuides.length === 0 ? topicGuides.slice(2) : topicGuides;

      const gridArticles: CareArticleCardData[] =
        gridGuides.length > 0
          ? gridGuides.map(mapToCareArticle)
          : fallbackArticles.filter(
              (a) => !isBasicItem(a.categorySlug, a.category)
            );

      // Filter grid articles based on selected topic (DB slug, categoryId, or category name)
      const filteredGrid = gridArticles.filter((article) => {
        if (selectedTopic === "all") return true;
        const target = selectedTopic.toLowerCase();
        const catSlug = article.categorySlug?.toLowerCase();
        const catId = article.categoryId?.toLowerCase();
        const catName = article.category?.toLowerCase();
        const normName = catName?.replace(/[^a-z0-9]+/g, "-");

        return (
          catSlug === target ||
          catId === target ||
          catName === target ||
          normName === target ||
          (catName && catName.includes(target)) ||
          target.includes(catName || "")
        );
      });

      return {
        currentGuide: hero,
        sideArticles: sides,
        extraBasicArticles: extraBasic,
        remainingArticles: filteredGrid,
      };
    }

    // Fallback when no live guides are loaded yet for the category
    const sortFallback = (a: CareArticleCardData, b: CareArticleCardData) => {
      const aOrder =
        typeof a.displayOrder === "number" && a.displayOrder > 0
          ? a.displayOrder
          : 9999;
      const bOrder =
        typeof b.displayOrder === "number" && b.displayOrder > 0
          ? b.displayOrder
          : 9999;
      return aOrder - bOrder;
    };
    const sortedFallback = [...fallbackArticles].sort(sortFallback);
    const basicFallback = sortedFallback.filter((a) =>
      isBasicItem(a.categorySlug, a.category)
    );
    const topicFallback = sortedFallback.filter(
      (a) => !isBasicItem(a.categorySlug, a.category)
    );

    const hero = fallbackGuide;
    const sides =
      basicFallback.length > 1
        ? basicFallback.slice(1, 3)
        : basicFallback.length === 0
        ? sortedFallback.slice(0, 2)
        : [];
    const extraBasic =
      basicFallback.length > 3 ? basicFallback.slice(3) : [];
    const gridArticles =
      basicFallback.length === 0
        ? sortedFallback.slice(2)
        : topicFallback.length > 0
        ? topicFallback
        : sortedFallback;

    const filteredGrid = gridArticles.filter((article) => {
      if (selectedTopic === "all") return true;
      const target = selectedTopic.toLowerCase();
      const catName = article.category?.toLowerCase();
      const normName = catName?.replace(/[^a-z0-9]+/g, "-");
      return (
        catName === target ||
        normName === target ||
        (catName && catName.includes(target)) ||
        target.includes(catName || "")
      );
    });

    return {
      currentGuide: hero,
      sideArticles: sides,
      extraBasicArticles: extraBasic,
      remainingArticles: filteredGrid,
    };
  }, [apiGuides, fallbackGuide, fallbackArticles, selectedTopic]);

  const activeCategoryTitle = categoryLabelMap[selectedCategory] || "Pet";

  return (
    <div className="space-y-8">
      {/* Top Row: Care Guide Card takes 2-card width on the left + 2 individual cards on the right */}
      {isLoadingGuides ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch animate-pulse">
          <div className="md:col-span-2 lg:col-span-2 h-72 rounded-lg bg-surface-muted border border-border-peach/50" />
          <div className="h-72 rounded-lg bg-surface-muted border border-border-peach/50" />
          <div className="h-72 rounded-lg bg-surface-muted border border-border-peach/50" />
        </section>
      ) : (
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {/* Left: Care Guide Card */}
            <div
              className={cn(
                "flex flex-col",
                sideArticles.length === 0
                  ? "col-span-full"
                  : sideArticles.length === 1
                  ? "md:col-span-2 lg:col-span-3"
                  : "md:col-span-2 lg:col-span-2"
              )}
            >
              <PetCareGuideCard guide={currentGuide} className="h-full" />
            </div>

            {/* Right: Side Basic Cards */}
            {sideArticles.map((article) => (
              <div
                key={article.id}
                className={cn(
                  "flex flex-col",
                  sideArticles.length === 1 ? "md:col-span-2 lg:col-span-1" : ""
                )}
              >
                <CareArticleCard article={article} className="h-full" />
              </div>
            ))}
          </div>

          {/* Any additional Basic Guides beyond the top 3 */}
          {extraBasicArticles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {extraBasicArticles.map((article) => (
                <CareArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Reusable Care Article Cards Grid with Topic Filter */}
      <section className="space-y-5 pt-2">
        {/* Reusable Topic Filter Bar */}
        <GuidesTopicFilterBar
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
        />

        {/* 4 columns on large screens, 2 on tablet, 1 on mobile */}
        {remainingArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {remainingArticles.map((article) => (
              <CareArticleCard key={article.id} article={article} />
            ))}
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