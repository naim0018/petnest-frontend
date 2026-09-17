"use client";

import React, { createContext, useContext, useState } from "react";

interface FeedFilterContextType {
  activeCategoryTab: string;
  setActiveCategoryTab: (category: string) => void;
  selectedPetType: string;
  setSelectedPetType: (petType: string) => void;
  selectedPetSubtype: string;
  setSelectedPetSubtype: (subtype: string) => void;
  resetPetFilter: () => void;
}

const FeedFilterContext = createContext<FeedFilterContextType | undefined>(undefined);

export function FeedFilterProvider({ children }: { children: React.ReactNode }) {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");
  const [selectedPetType, setSelectedPetTypeState] = useState<string>("all");
  const [selectedPetSubtype, setSelectedPetSubtype] = useState<string>("all");

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
