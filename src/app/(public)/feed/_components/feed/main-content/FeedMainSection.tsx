"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { StorySection } from "./StorySection";
import { CreatePostCard } from "./CreatePostCard";
import { FeedFilterTabs } from "./FeedFilterTabs";
import { CommunityHeroPostCard } from "./CommunityHeroPostCard";
import { PetUpdatesGalleryCard } from "./PetUpdatesGalleryCard";
import { FeedPostCard, FeedPostCardSkeleton } from "./FeedPostCard";
import { FeedPost } from "@/lib/data/petnest-data";
import { useFeedFilter } from "@/context/FeedFilterContext";
import { PET_TYPES_DATA } from "@/lib/data/pet-types";
import { X, Sparkles } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";

interface FeedMainSectionProps {
  posts: FeedPost[];
}

export function FeedMainSection({ posts }: FeedMainSectionProps) {
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  let feedFilter: ReturnType<typeof useFeedFilter> | null = null;
  try {
    feedFilter = useFeedFilter();
  } catch {
    feedFilter = null;
  }

  const activeCategory = feedFilter?.activeCategoryTab || "all";
  const selectedPetType = feedFilter?.selectedPetType || "all";
  const selectedPetSubtype = feedFilter?.selectedPetSubtype || "all";

  // Trigger skeleton loading animation when filter changes
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [selectedPetType, selectedPetSubtype, activeCategory]);

  const handleToggleCreateStory = () => {
    setShowCreateStory(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const petTypeCategoryObj = useMemo(() => {
    return PET_TYPES_DATA.find((cat) => cat.id === selectedPetType);
  }, [selectedPetType]);

  const petSubtypeLabel = useMemo(() => {
    if (selectedPetSubtype === "all" || !petTypeCategoryObj) return null;
    return petTypeCategoryObj.subtypes.find((s) => s.id === selectedPetSubtype)?.label || selectedPetSubtype;
  }, [selectedPetSubtype, petTypeCategoryObj]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (activeCategory !== "all" && p.category && p.category !== activeCategory) {
        return false;
      }
      if (selectedPetType !== "all" && p.petType && p.petType !== selectedPetType) {
        return false;
      }
      if (
        selectedPetSubtype !== "all" &&
        p.petBreed &&
        p.petBreed !== selectedPetSubtype &&
        p.petBreed !== "all"
      ) {
        return false;
      }
      return true;
    });
  }, [posts, activeCategory, selectedPetType, selectedPetSubtype]);

  const isFiltered = activeCategory !== "all" || selectedPetType !== "all" || selectedPetSubtype !== "all";

  return (
    <section className="col-span-1 lg:col-span-10 space-y-6">
      <header className="sr-only">
        <h1>PetNest Community Social Feed</h1>
      </header>

      <StorySection onAddStoryClick={handleToggleCreateStory} />

      {showCreateStory && (
        <CreatePostCard
          textareaRef={textareaRef}
          onClose={() => setShowCreateStory(false)}
          onPostSubmit={() => setShowCreateStory(false)}
        />
      )}

      <FeedFilterTabs />

      {isFiltering ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in-50 duration-200">
          <FeedPostCardSkeleton />
          <FeedPostCardSkeleton />
        </div>
      ) : isFiltered ? (
        <section className="space-y-4 animate-in fade-in-50 duration-300">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <article key={post.id}>
                  <FeedPostCard post={post} />
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-card border border-border-peach rounded-2xl space-y-3">
              <div className="size-12 rounded-full bg-coral-light flex items-center justify-center mx-auto text-coral">
                <Sparkles className="size-6" />
              </div>
              <h3 className="font-bold text-base text-ink font-quicksand">
                No posts found for {petSubtypeLabel || petTypeCategoryObj?.label || "selected filter"}
              </h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto font-medium">
                Be the first to share an update about your {petSubtypeLabel || petTypeCategoryObj?.label || "pet"} with the PetNest community!
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <PrimaryButton
                  variant="outline"
                  size="sm"
                  onClick={() => feedFilter?.setSelectedPetSubtype("all")}
                >
                  View All {petTypeCategoryObj?.label || "Pets"}
                </PrimaryButton>
                <PrimaryButton
                  variant="primary"
                  size="sm"
                  onClick={handleToggleCreateStory}
                >
                  Create Post
                </PrimaryButton>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-coral font-quicksand">Community Posts</h2>
              <button
                type="button"
                onClick={() => feedFilter?.setActiveCategoryTab("community")}
                className="text-xs font-semibold text-ink-faint hover:text-coral transition-colors cursor-pointer"
              >
                View all
              </button>
            </div>
            <CommunityHeroPostCard />
          </section>

          <section id="pet-updates" className="space-y-3 scroll-mt-28">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-coral font-quicksand">Pet Updates</h2>
              <button
                type="button"
                onClick={() => feedFilter?.setActiveCategoryTab("updates")}
                className="text-xs font-semibold text-ink-faint hover:text-coral transition-colors cursor-pointer"
              >
                View all
              </button>
            </div>
            <PetUpdatesGalleryCard />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-coral font-quicksand">More Community Posts</h2>
              <span className="text-xs font-semibold text-ink-faint">
                {posts.length} posts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <article key={post.id}>
                  <FeedPostCard post={post} />
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
