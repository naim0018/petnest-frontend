"use client";

import React, { createContext, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";

interface FeedFilterContextType {
  activeCategoryTab: string;
  setActiveCategoryTab: (category: string) => void;
  selectedPetType: string;
  setSelectedPetType: (petType: string) => void;
  selectedPetSubtype: string;
  setSelectedPetSubtype: (subtype: string) => void;
  resetPetFilter: () => void;
  activeStoryId: string | null;
  setActiveStoryId: (storyId: string | null) => void;
}

const FeedFilterContext = createContext<FeedFilterContextType | undefined>(undefined);

export function FeedFilterProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");
  const [selectedPetType, setSelectedPetTypeState] = useState<string>("all");
  const [selectedPetSubtype, setSelectedPetSubtype] = useState<string>("all");

  // Read initial story from URL query params (e.g. ?story=story-1) so page reload preserves stories
  const urlStoryId = searchParams.get("story");
  const [activeStoryId, setActiveStoryIdState] = useState<string | null>(urlStoryId);

  // Sync state if URL search param changes
  React.useEffect(() => {
    const param = searchParams.get("story");
    if (param !== activeStoryId) {
      setActiveStoryIdState(param);
    }
  }, [searchParams]);

  // Update both state and URL query parameter
  const setActiveStoryId = (storyId: string | null) => {
    setActiveStoryIdState(storyId);
    try {
      const url = new URL(window.location.href);
      if (storyId) {
        url.searchParams.set("story", storyId);
      } else {
        url.searchParams.delete("story");
      }
      window.history.replaceState(null, "", url.toString());
    } catch {
      // fallback
    }
  };

  const setSelectedPetType = (petType: string) => {
    setSelectedPetTypeState(petType);
    setSelectedPetSubtype("all"); // Reset 2nd sub-tab level when pet type changes
  };

  const resetPetFilter = () => {
    setSelectedPetTypeState("all");
    setSelectedPetSubtype("all");
  };

  return (
    <FeedFilterContext.Provider
      value={{
        activeCategoryTab,
        setActiveCategoryTab,
        selectedPetType,
        setSelectedPetType,
        selectedPetSubtype,
        setSelectedPetSubtype,
        resetPetFilter,
        activeStoryId,
        setActiveStoryId,
      }}
    >
      {children}
    </FeedFilterContext.Provider>
  );
}

export function useFeedFilter() {
  const context = useContext(FeedFilterContext);
  if (!context) {
    throw new Error("useFeedFilter must be used within a FeedFilterProvider");
  }
  return context;
}

