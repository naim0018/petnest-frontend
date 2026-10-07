"use client";

import { useState } from "react";
import GuidesPetCategorySection from "./GuidesPetCategorySection";
import PetCareGuideCard from "./PetCareGuideCard";
import CareArticleCard from "./CareArticleCard";
import GuidesHelpBanner from "./GuidesHelpBanner";
import ReusableFAQ from "@/components/common/ReusableFAQ";
import GuidesTopicFilterBar, { GUIDE_TOPIC_FILTERS } from "./GuidesTopicFilterBar";
import { PET_SPECIES_FEATURED_GUIDES } from "./petCareGuideData";
import { CATEGORY_ARTICLES_MAP, BUDGIE_CARE_ARTICLES } from "./careArticlesData";
import { CATEGORY_FAQS_MAP, CATEGORY_FAQ_CONFIG } from "./guideFaqData";

export default function GuidesInteractiveExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("birds");
  const [selectedBreed, setSelectedBreed] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  const currentGuide =
    (selectedBreed !== "all" && PET_SPECIES_FEATURED_GUIDES[selectedBreed]) ||
    PET_SPECIES_FEATURED_GUIDES[selectedCategory] ||
    PET_SPECIES_FEATURED_GUIDES.birds;

  const currentArticles =
    CATEGORY_ARTICLES_MAP[selectedCategory] || BUDGIE_CARE_ARTICLES;

  // The first two articles will be displayed beside the PetCareGuideCard on the right
  const sideArticles = currentArticles.slice(0, 2);

  // Filter remaining articles based on selected topic
  const topicCategoryMap: Record<string, string[]> = {
    "getting-started": ["General Care", "Life Stage"],
    "daily-care": ["General Care", "Grooming"],
    nutrition: ["Nutrition"],
    training: ["Training"],
    "health-vet-care": ["Health & Vet Care"],
    grooming: ["Grooming"],
    behavior: ["Behavior"],
    "senior-pets": ["Life Stage", "Health & Vet Care"],
    emergency: ["Health & Vet Care"],
  };

  const remainingArticles = currentArticles.slice(2).filter((article) => {
    if (selectedTopic === "all") return true;
    const allowedCategories = topicCategoryMap[selectedTopic];
    if (allowedCategories) {
      return allowedCategories.includes(article.category);
    }
    return true;
  });

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

      {/* 3. Reusable Care Article Cards Grid with Topic Filter */}
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
