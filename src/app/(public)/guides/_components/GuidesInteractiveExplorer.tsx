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
import ReusableFAQ from "@/components/common/ReusableFAQ";
import GuidesTopicFilterBar from "./GuidesTopicFilterBar";
import { PET_SPECIES_FEATURED_GUIDES } from "./petCareGuideData";
import { CATEGORY_ARTICLES_MAP, BUDGIE_CARE_ARTICLES } from "./careArticlesData";
import { CATEGORY_FAQS_MAP, CATEGORY_FAQ_CONFIG } from "./guideFaqData";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setPetFilter } from "@/store/features/PetFilterSlice/petFilterSlice";
import {
  useFindAllPublicGuidesQuery,
  useFindAllFaqsPublicQuery,
} from "@/store/Api/Guides/guides.api";
import type { GuideSummary } from "@/store/Api/Guides/guides.types";

const topicCategoryMap: Record<string, string[]> = {
  "getting-started": ["General Care", "Life Stage", "Basic", "Getting Started"],
  "daily-care": ["General Care", "Grooming", "Daily Care"],
  nutrition: ["Nutrition", "Diet", "Food"],
  training: ["Training"],
  "health-vet-care": ["Health & Vet Care", "Medicine", "Health"],
  grooming: ["Grooming"],
  behavior: ["Behavior"],
  "senior-pets": ["Life Stage", "Health & Vet Care", "Senior"],
  emergency: ["Health & Vet Care", "Emergency", "Medicine"],
};

const categoryLabelMap: Record<string, string> = {
  birds: "Budgie & Bird",
  dogs: "Puppy & Dog",
  cats: "Cat & Kitten",
  "small-pets": "Small Pet",
  aquatic: "Aquatic & Fish",
  reptiles: "Reptile & Amphibian",
};

function mapToHeroGuide(
  guide: GuideSummary,
  fallback: PetCareGuideCardData
): PetCareGuideCardData {
  return {
    badgeText:
      guide.type === "PILLAR" ? "Start Here" : guide.category?.name || "Care Guide",
    badgeIcon: "👑",
    title: guide.title,
    description: guide.excerpt || fallback.description,
    readTime: `${guide.readTimeMinutes || 5} min read`,
    expertReviewed: Boolean(guide.lastReviewedAt || guide.reviewer),
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

function mapToCareArticle(guide: GuideSummary): CareArticleCardData {
  return {
    id: guide.id,
    title: guide.title,
    excerpt: guide.excerpt || "",
    readTime: `${guide.readTimeMinutes || 5} min read`,
    category: (guide.category?.name as GuideCategoryPill) || "General Care",
    image: guide.coverImage || "/CareGuideCard/dog-faq-mascot.png",
    imageAlt: guide.coverImageAlt || guide.title,
    expertReviewed: Boolean(guide.lastReviewedAt || guide.reviewer),
    slug: guide.slug || guide.id,
    displayOrder: guide.displayOrder,
  };
}

export default function GuidesInteractiveExplorer() {
  const dispatch = useAppDispatch();
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

  // Fetch live guides:
  // - If only species is selected (breed === 'all'), fetches all guides on that species
  // - If a specific breed is selected, fetches guides targeting that breed
  const { data: guidesResponse, isLoading: isLoadingGuides } =
    useFindAllPublicGuidesQuery({
      species: selectedCategory !== "all" ? selectedCategory : undefined,
      breed: selectedBreed !== "all" ? selectedBreed : undefined,
      limit: 30,
      sortBy: "publishedAt",
      sortOrder: "desc",
    });

  const apiGuides: GuideSummary[] = guidesResponse?.data?.items || [];

  // Fetch live FAQs for the selected species
  const { data: faqsResponse } = useFindAllFaqsPublicQuery(
    selectedCategory !== "all" ? { species: selectedCategory } : undefined
  );
  const liveFaqs = faqsResponse?.data;

  // Fallback defaults
  const fallbackGuide =
    (selectedBreed !== "all" && PET_SPECIES_FEATURED_GUIDES[selectedBreed]) ||
    PET_SPECIES_FEATURED_GUIDES[selectedCategory] ||
    PET_SPECIES_FEATURED_GUIDES.birds ||
    DEFAULT_BUDGIE_GUIDE;

  const fallbackArticles =
    CATEGORY_ARTICLES_MAP[selectedCategory] || BUDGIE_CARE_ARTICLES;

  // Partition guides:
  // 1. Hero guide (prefer featured / pillar)
  // 2. 2 Side articles next to hero
  // 3. Remaining articles for topic-filtered grid
  const { currentGuide, sideArticles, remainingArticles } = useMemo(() => {
    if (apiGuides.length > 0) {
      const heroRecord =
        apiGuides.find((g) => g.isFeatured || g.type === "PILLAR") || apiGuides[0];
      const hero = mapToHeroGuide(heroRecord, fallbackGuide);

      const otherGuides = apiGuides.filter((g) => g.id !== heroRecord.id);
      const otherArticles = otherGuides.map(mapToCareArticle);

      // If other live articles exist, use them. If fewer than 2, fill with fallback
      let sides: CareArticleCardData[] = [];
      let gridArticles: CareArticleCardData[] = [];

      if (otherArticles.length >= 2) {
        sides = otherArticles.slice(0, 2);
        gridArticles = otherArticles.slice(2);
      } else if (otherArticles.length === 1) {
        sides = [otherArticles[0], fallbackArticles[0]];
        gridArticles = fallbackArticles.slice(1);
      } else {
        sides = fallbackArticles.slice(0, 2);
        gridArticles = fallbackArticles.slice(2);
      }

      // Filter remaining articles based on selected topic
      const filteredGrid = gridArticles.filter((article) => {
        if (selectedTopic === "all") return true;
        const allowed = topicCategoryMap[selectedTopic];
        if (allowed) {
          return (
            allowed.some(
              (cat) => cat.toLowerCase() === article.category.toLowerCase()
            ) ||
            article.category.toLowerCase().includes(selectedTopic.toLowerCase())
          );
        }
        return article.category.toLowerCase().includes(selectedTopic.toLowerCase());
      });

      return {
        currentGuide: hero,
        sideArticles: sides,
        remainingArticles: filteredGrid,
      };
    }

    // Fallback when no live guides are loaded yet for the category
    const hero = fallbackGuide;
    const sides = fallbackArticles.slice(0, 2);
    const filteredGrid = fallbackArticles.slice(2).filter((article) => {
      if (selectedTopic === "all") return true;
      const allowed = topicCategoryMap[selectedTopic];
      if (allowed) {
        return allowed.includes(article.category);
      }
      return true;
    });

    return {
      currentGuide: hero,
      sideArticles: sides,
      remainingArticles: filteredGrid,
    };
  }, [apiGuides, fallbackGuide, fallbackArticles, selectedTopic]);

  const activeCategoryTitle = categoryLabelMap[selectedCategory] || "Pet";

  // Dynamic FAQs with fallback to configured defaults
  const currentFaqs = useMemo(() => {
    if (liveFaqs && liveFaqs.length > 0) {
      return liveFaqs.map((faq, idx) => ({
        id: faq.id || `faq-${idx}`,
        question: faq.question,
        answer: faq.answer,
      }));
    }
    return CATEGORY_FAQS_MAP[selectedCategory] || CATEGORY_FAQS_MAP.birds;
  }, [liveFaqs, selectedCategory]);

  const currentFaqConfig =
    CATEGORY_FAQ_CONFIG[selectedCategory] || CATEGORY_FAQ_CONFIG.birds;

  return (
    <div className="space-y-8">
      {/* Top Row: Care Guide Card takes 2-card width on the left + 2 individual cards on the right */}
      {isLoadingGuides ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch animate-pulse">
          <div className="md:col-span-2 lg:col-span-2 h-72 rounded-3xl bg-surface-muted border border-border-peach/50" />
          <div className="h-72 rounded-3xl bg-surface-muted border border-border-peach/50" />
          <div className="h-72 rounded-3xl bg-surface-muted border border-border-peach/50" />
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
          {/* Left: Care Guide Card spanning 2 card spaces */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col">
            <PetCareGuideCard guide={currentGuide} className="h-full" />
          </div>

          {/* Right: 2 individual Care Article Cards */}
          {sideArticles.map((article) => (
            <div key={article.id} className="flex flex-col">
              <CareArticleCard article={article} className="h-full" />
            </div>
          ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {remainingArticles.map((article) => (
              <CareArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-surface-muted/50 border border-border-peach dark:border-slate-800">
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

      {/* Common Questions / Reusable FAQ Accordion */}
      <ReusableFAQ
        title={currentFaqConfig.title}
        subtitle={currentFaqConfig.subtitle}
        items={currentFaqs}
        mascotImage={currentFaqConfig.mascotImage}
        mascotAlt={currentFaqConfig.mascotAlt}
        cardImage={currentFaqConfig.cardImage}
        cardImageAlt={currentFaqConfig.cardImageAlt}
        bgGradient={currentFaqConfig.bgGradient}
        bubbleColor={currentFaqConfig.bubbleColor}
        blendOverlayClass={currentFaqConfig.blendOverlayClass}
        viewAllHref="/community"
        viewAllText="View all questions"
      />

      {/* Help / Ask Community & Expert Banner */}
      <GuidesHelpBanner />
    </div>
  );
}
