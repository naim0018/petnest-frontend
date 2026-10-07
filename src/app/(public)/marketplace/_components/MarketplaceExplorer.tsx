"use client";

import React, { useState, useMemo } from "react";
import MarketplaceFilterBar, { MarketplaceFilterState } from "./MarketplaceFilterBar";
import MarketplaceSidebarFilter, {
  MarketplaceSidebarFilterState,
} from "./MarketplaceSidebarFilter";
import MarketplaceListingCard from "./MarketplaceListingCard";
import {
  MARKETPLACE_ITEMS,
  MARKETPLACE_PET_TYPES,
  MARKETPLACE_BREEDS_MAP,
  TOP_PRICE_RANGES,
} from "./marketplaceData";
import { ArrowUpDown, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketplaceExplorer() {
  // 1. TOP HORIZONTAL FILTER BAR STATE
  const [topFilters, setTopFilters] = useState<MarketplaceFilterState>({
    petType: "birds",
    breed: "budgie",
    category: "All Categories",
    location: "Dhaka, Bangladesh",
    condition: "All",
    priceIndex: 0,
  });

  // 2. LEFT VERTICAL SIDEBAR FILTER STATE
  const [sidebarFilters, setSidebarFilters] = useState<MarketplaceSidebarFilterState>({
    category: "all",
    condition: "all",
    minPrice: "",
    maxPrice: "",
    location: "Dhaka, Bangladesh",
    radius: "Within 50 km",
    listingTypes: ["for-sale", "free", "swap"],
  });

  // Mobile drawer state for sidebar
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sorting and view toggle
  const [sortOption, setSortOption] = useState<string>("newest-first");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Top Active filter chips
  const activePetType = MARKETPLACE_PET_TYPES.find((p) => p.id === topFilters.petType);
  const activeBreedsList = MARKETPLACE_BREEDS_MAP[topFilters.petType] || [];
  const activeBreed = activeBreedsList.find((b) => b.id === topFilters.breed);

  const activeFilterChips = useMemo(() => {
    const chips: { key: keyof MarketplaceFilterState; label: string; resetValue: any }[] = [];

    if (topFilters.petType !== "all" && activePetType) {
      chips.push({
        key: "petType",
        label: activePetType.name,
        resetValue: "all",
      });
    }

    if (topFilters.breed !== "all" && activeBreed) {
      chips.push({
        key: "breed",
        label: activeBreed.name,
        resetValue: "all",
      });
    }

    if (topFilters.category !== "All Categories") {
      chips.push({
        key: "category",
        label: `Category: ${topFilters.category}`,
        resetValue: "All Categories",
      });
    }

    if (topFilters.condition !== "All") {
      chips.push({
        key: "condition",
        label: `Condition: ${topFilters.condition}`,
        resetValue: "All",
      });
    }

    if (topFilters.priceIndex !== 0) {
      chips.push({
        key: "priceIndex",
        label: `Price: ${TOP_PRICE_RANGES[topFilters.priceIndex].label}`,
        resetValue: 0,
      });
    }

    return chips;
  }, [topFilters, activePetType, activeBreed]);

  const handleRemoveTopChip = (key: keyof MarketplaceFilterState, resetVal: any) => {
    setTopFilters((prev) => ({
      ...prev,
      [key]: resetVal,
    }));
  };

  const handleClearAllTop = () => {
    setTopFilters({
      petType: "all",
      breed: "all",
      category: "All Categories",
      location: "All Locations",
      condition: "All",
      priceIndex: 0,
    });
  };

  const handleClearAllSidebar = () => {
    setSidebarFilters({
      category: "all",
      condition: "all",
      minPrice: "",
      maxPrice: "",
      location: "Dhaka, Bangladesh",
      radius: "Within 50 km",
      listingTypes: ["for-sale", "free", "swap"],
    });
  };

  // Filtered and sorted listings combining both top and left filters
  const filteredItems = useMemo(() => {
    return (MARKETPLACE_ITEMS || []).filter((item) => {
      // 1. Top Pet Type & Breed filter
      if (topFilters.petType !== "all" && item.petType !== topFilters.petType) {
        return false;
      }
      if (topFilters.breed !== "all" && item.breed && item.breed !== topFilters.breed) {
        return false;
      }

      // 2. Top Category filter
      if (topFilters.category !== "All Categories") {
        const topCatNormalized = topFilters.category.toLowerCase();
        if (!item.title.toLowerCase().includes(topCatNormalized) && item.category !== topCatNormalized) {
          // Keep item if matches
        }
      }

      // 3. Left Sidebar Category filter
      if (sidebarFilters.category !== "all" && item.category !== sidebarFilters.category) {
        return false;
      }

      // 4. Condition filter (from either top or left)
      if (sidebarFilters.condition !== "all") {
        const itemCondId = item.condition.toLowerCase().replace(/\s+/g, "-");
        if (itemCondId !== sidebarFilters.condition) {
          return false;
        }
      } else if (topFilters.condition !== "All") {
        if (item.condition.toLowerCase() !== topFilters.condition.toLowerCase()) {
          return false;
        }
      }

      // 5. Price filter (Sidebar Min/Max inputs or Top Price Range)
      const min = sidebarFilters.minPrice ? parseFloat(sidebarFilters.minPrice) : 0;
      const max = sidebarFilters.maxPrice ? parseFloat(sidebarFilters.maxPrice) : Infinity;
      if (item.price < min || item.price > max) {
        return false;
      }

      if (topFilters.priceIndex !== 0) {
        const pr = TOP_PRICE_RANGES[topFilters.priceIndex];
        if (pr && (item.price < pr.min || item.price > pr.max)) {
          return false;
        }
      }

      // 6. Listing type filter (Sidebar)
      if (
        sidebarFilters.listingTypes.length > 0 &&
        !sidebarFilters.listingTypes.includes(item.listingType)
      ) {
        return false;
      }

      // 7. Seller type filter (Stores vs Individual Owners)
      if (sidebarFilters.sellerType === "store" && !item.store) {
        return false;
      }
      if (sidebarFilters.sellerType === "individual" && item.store) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === "price-low") return a.price - b.price;
      if (sortOption === "price-high") return b.price - a.price;
      if (sortOption === "rating") return b.seller.rating - a.seller.rating;
      return 0; // Default: Newest first
    });
  }, [topFilters, sidebarFilters, sortOption]);

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. SEPARATE TOP FILTER BAR (First Screenshot)           */}
      {/* ======================================================== */}
      <MarketplaceFilterBar
        filters={topFilters}
        onChange={setTopFilters}
        productCount={filteredItems.length}
      />

      {/* Active Filter Chips Bar (Under Top Bar) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
        <div className="flex items-center gap-2 flex-wrap min-h-[32px]">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-quicksand mr-1">
            Active Filters:
          </span>

          {activeFilterChips.length > 0 ? (
            <>
              {activeFilterChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 font-quicksand shadow-2xs hover:border-coral/50 transition-colors"
                >
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTopChip(chip.key, chip.resetValue)}
                    className="hover:text-coral cursor-pointer p-0.5 rounded-full"
                    aria-label={`Remove ${chip.label} filter`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={handleClearAllTop}
                className="text-xs font-bold text-coral hover:underline cursor-pointer ml-1 font-quicksand"
              >
                Clear all
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-400 font-quicksand italic">
              All categories selected
            </span>
          )}
        </div>

        {/* Total listings count and sort info */}
        <div className="text-xs font-bold text-slate-500 font-quicksand self-start sm:self-auto">
          {filteredItems.length} listings found
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN LAYOUT: LEFT SIDEBAR FILTER + RIGHT PRODUCTS GRID */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row gap-6 items-start pt-1">
        {/* LEFT SIDEBAR FILTER (Desktop Sticky) */}
        <div className="hidden lg:block shrink-0 sticky top-20">
          <MarketplaceSidebarFilter
            filters={sidebarFilters}
            onChange={setSidebarFilters}
            onClearAll={handleClearAllSidebar}
            onApply={() => {}}
          />
        </div>

        {/* MOBILE FILTER TOGGLE BUTTON */}
        <div className="lg:hidden w-full flex items-center justify-between pb-1">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 font-quicksand shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-coral" />
            <span>Sidebar Filters</span>
          </button>
          <span className="text-xs font-bold text-slate-500 font-quicksand">
            {filteredItems.length} listings
          </span>
        </div>

        {/* MOBILE FILTER MODAL DRAWER */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/50 backdrop-blur-xs">
            <div className="relative w-full max-w-xs bg-card h-full p-4 overflow-y-auto">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-muted cursor-pointer"
              >
                <X className="size-5 text-ink-muted" />
              </button>
              <MarketplaceSidebarFilter
                filters={sidebarFilters}
                onChange={setSidebarFilters}
                onClearAll={handleClearAllSidebar}
                onApply={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}

        {/* RIGHT PRODUCTS CONTENT AREA */}
        <div className="flex-1 w-full space-y-4">
          {/* Header Bar above products */}
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm sm:text-base font-bold text-ink font-quicksand">
              {filteredItems.length} listings
            </h2>

            {/* Right: Sort dropdown and Grid/List toggle */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink-muted font-quicksand hidden sm:inline">
                  Sort by:
                </span>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="h-9 px-3 pr-8 rounded-xl border border-border-peach bg-card text-xs font-bold font-quicksand text-ink outline-none cursor-pointer hover:border-coral transition-colors appearance-none shadow-2xs"
                  >
                    <option value="newest-first">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated Seller</option>
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted">
                    <ArrowUpDown className="size-3" />
                  </div>
                </div>
              </div>

              {/* Grid / List Layout Switcher */}
              <div className="flex items-center p-0.5 rounded-xl border border-border-peach bg-surface-muted">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-lg cursor-pointer transition-all",
                    viewMode === "grid"
                      ? "bg-coral text-white shadow-2xs"
                      : "text-ink-muted hover:text-ink"
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-lg cursor-pointer transition-all",
                    viewMode === "list"
                      ? "bg-coral text-white shadow-2xs"
                      : "text-ink-muted hover:text-ink"
                  )}
                  aria-label="List view"
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Cards Grid: 4 columns on desktop (12 items matching screenshot) */}
          {filteredItems.length > 0 ? (
            <div
              className={cn(
                "grid gap-4 sm:gap-5",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}
            >
              {filteredItems.map((item) => (
                <MarketplaceListingCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <p className="text-slate-700 dark:text-slate-300 font-quicksand font-bold text-base">
                No listings match your selected filters.
              </p>
              <p className="text-slate-400 text-xs sm:text-sm font-quicksand max-w-md mx-auto">
                Try adjusting your category, price range, or reset your filters to view more listings.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleClearAllTop();
                  handleClearAllSidebar();
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-coral text-white text-xs font-bold font-quicksand hover:bg-coral-dark transition-all cursor-pointer shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
