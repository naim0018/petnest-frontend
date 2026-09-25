"use client";

import { useState } from "react";
import GuidesPetCategorySection from "./GuidesPetCategorySection";
import PetCareGuideCard from "./PetCareGuideCard";
import CareArticleCard from "./CareArticleCard";
import GuidesHelpBanner from "./GuidesHelpBanner";
import ReusableFAQ from "@/components/common/ReusableFAQ";
import { PET_SPECIES_FEATURED_GUIDES } from "./petCareGuideData";
import { CATEGORY_ARTICLES_MAP, BUDGIE_CARE_ARTICLES } from "./careArticlesData";
import { CATEGORY_FAQS_MAP, CATEGORY_FAQ_CONFIG } from "./guideFaqData";

export default function GuidesInteractiveExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("birds");
  const [selectedBreed, setSelectedBreed] = useState<string>("all");

  const currentGuide =
    (selectedBreed !== "all" && PET_SPECIES_FEATURED_GUIDES[selectedBreed]) ||
    PET_SPECIES_FEATURED_GUIDES[selectedCategory] ||
    PET_SPECIES_FEATURED_GUIDES.birds;

  const currentArticles =
    CATEGORY_ARTICLES_MAP[selectedCategory] || BUDGIE_CARE_ARTICLES;

  // The first two articles will be displayed beside the PetCareGuideCard on the right
  const sideArticles = currentArticles.slice(0, 2);
  // The rest of the articles display in the grid below
  const remainingArticles = currentArticles.slice(2);

  const categoryLabelMap: Record<string, string> = {
    birds: "Budgie & Bird",
    dogs: "Puppy & Dog",
    cats: "Cat & Kitten",
    "small-pets": "Small Pet",
    aquatic: "Aquatic & Fish",
    reptiles: "Reptile & Amphibian",
  };

  const activeCategoryTitle = categoryLabelMap[selectedCategory] || "Pet";

  const handleSelectCategory = (categoryId: string, breedId?: string) => {
    setSelectedCategory(categoryId);
    if (breedId) setSelectedBreed(breedId);
  };

  const currentFaqs =
    CATEGORY_FAQS_MAP[selectedCategory] || CATEGORY_FAQS_MAP.birds;

  const currentFaqConfig =
    CATEGORY_FAQ_CONFIG[selectedCategory] || CATEGORY_FAQ_CONFIG.birds;

  return (
    <div className="space-y-8">
      {/* 1. Category and Breed Selector */}
      <GuidesPetCategorySection
        selectedCategoryId={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* 2. Top Row: Care Guide Card takes 2-card width on the left + 2 individual cards on the right */}
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

      {/* 3. Reusable Care Article Cards Grid (Remaining Guides) */}
      <section className="space-y-5 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-ink font-quicksand">
              More Essential {activeCategoryTitle} Guides
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
              Vet-reviewed instructions for nutrition, behavior, training, and wellness.
            </p>
          </div>
        </div>

        {/* 4 columns on large screens, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {remainingArticles.map((article) => (
            <CareArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 4. Common Questions / Reusable FAQ Accordion */}
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

      {/* 5. Help / Ask Community & Expert Banner */}
      <GuidesHelpBanner />
    </div>
  );
}
