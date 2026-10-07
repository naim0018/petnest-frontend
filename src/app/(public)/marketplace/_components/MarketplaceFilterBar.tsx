"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronDown,
  Search,
  Check,
  MapPin,
  Sparkles,
  Tag,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MARKETPLACE_PET_TYPES,
  MARKETPLACE_BREEDS_MAP,
  TOP_CATEGORIES,
  TOP_LOCATIONS,
  TOP_CONDITIONS,
  TOP_PRICE_RANGES,
  MarketplacePetType,
  MarketplaceBreed,
} from "./marketplaceData";

export interface MarketplaceFilterState {
  petType: string;
  breed: string;
  category: string;
  location: string;
  condition: string;
  priceIndex: number;
}

export interface MarketplaceFilterBarProps {
  filters: MarketplaceFilterState;
  onChange: (filters: MarketplaceFilterState) => void;
  onApply?: () => void;
  productCount?: number;
}

export default function MarketplaceFilterBar({
  filters,
  onChange,
  onApply,
  productCount,
}: MarketplaceFilterBarProps) {
  // Popover open states
  const [petTypeOpen, setPetTypeOpen] = useState(false);
  const [breedOpen, setBreedOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  // Search queries for dropdowns
  const [petTypeSearch, setPetTypeSearch] = useState("");
  const [breedSearch, setBreedSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  // Refs for click outside
  const filterBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
        setPetTypeOpen(false);
        setBreedOpen(false);
        setCategoryOpen(false);
        setLocationOpen(false);
        setConditionOpen(false);
        setPriceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Selected pet type & breeds
  const currentPetType =
    MARKETPLACE_PET_TYPES.find((p) => p.id === filters.petType) || MARKETPLACE_PET_TYPES[0];

  const availableBreeds = MARKETPLACE_BREEDS_MAP[filters.petType] || [
    { id: "all", name: `All ${currentPetType.name}`, image: currentPetType.image, petTypeId: currentPetType.id },
  ];

  const currentBreed =
    availableBreeds.find((b) => b.id === filters.breed) || availableBreeds[0];

  // Filtered pet types for search
  const filteredPetTypes = (MARKETPLACE_PET_TYPES || []).filter((p) =>
    p?.name?.toLowerCase().includes(petTypeSearch.toLowerCase())
  );

  // Filtered breeds for search
  const filteredBreeds = (availableBreeds || []).filter((b) =>
    b?.name?.toLowerCase().includes(breedSearch.toLowerCase())
  );

  // Filtered categories
  const filteredCategories = (TOP_CATEGORIES || []).filter((c: string) =>
    c?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Filtered locations
  const filteredLocations = (TOP_LOCATIONS || []).filter((l: string) =>
    l?.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handlePetTypeSelect = (pet: MarketplacePetType) => {
    const newBreedList = MARKETPLACE_BREEDS_MAP[pet.id];
    const defaultBreed = newBreedList && newBreedList.length > 1 ? newBreedList[1].id : "all";
    onChange({
      ...filters,
      petType: pet.id,
      breed: defaultBreed,
    });
    setPetTypeOpen(false);
    setPetTypeSearch("");
  };

  const handleBreedSelect = (breed: MarketplaceBreed) => {
    onChange({
      ...filters,
      breed: breed.id,
    });
    setBreedOpen(false);
    setBreedSearch("");
  };

  return (
    <div
      ref={filterBarRef}
      className="bg-card/90 backdrop-blur-md border border-border-peach/70 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm"
    >
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap lg:flex-nowrap">
        {/* 1. PET TYPE BUTTON & DROPDOWN */}
        <div className="relative flex-1 min-w-[130px] sm:min-w-[145px]">
          <span className="block text-[11px] font-bold text-ink-muted mb-1 font-quicksand">
            Pet Type
          </span>
          <button
            type="button"
            onClick={() => {
              setPetTypeOpen(!petTypeOpen);
              setBreedOpen(false);
              setCategoryOpen(false);
              setLocationOpen(false);
              setConditionOpen(false);
              setPriceOpen(false);
            }}
            className={cn(
              "w-full h-11 px-3 rounded-xl border flex items-center justify-between gap-2 bg-background font-quicksand font-bold text-xs sm:text-sm text-ink transition-all cursor-pointer shadow-2xs hover:border-coral/60",
              petTypeOpen
                ? "border-coral ring-2 ring-coral/20 bg-coral/5"
                : "border-border-peach dark:border-slate-700"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-border-peach bg-surface-muted">
                <Image
                  src={currentPetType.image}
                  alt={currentPetType.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="truncate">{currentPetType.name}</span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-ink-muted shrink-0 transition-transform duration-200",
                petTypeOpen && "rotate-180 text-coral"
              )}
            />
          </button>

          {/* Pet Type Dropdown Menu */}
          {petTypeOpen && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-56 bg-card border border-border-peach dark:border-slate-700 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="flex items-center gap-2 px-2.5 py-1.5 mb-1.5 rounded-lg bg-surface-muted border border-border-peach/50">
                <Search className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                <input
                  type="text"
                  placeholder="Search pet type..."
                  value={petTypeSearch}
                  onChange={(e) => setPetTypeSearch(e.target.value)}
                  className="w-full bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none font-quicksand"
                  autoFocus
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-0.5 scrollbar-thin">
                {filteredPetTypes.map((pet) => {
                  const isSelected = filters.petType === pet.id;
                  return (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => handlePetTypeSelect(pet)}
                      className={cn(
                        "w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs font-bold font-quicksand transition-all cursor-pointer text-left",
                        isSelected
                          ? "bg-coral/10 text-coral font-extrabold"
                          : "text-ink hover:bg-surface-muted hover:text-coral"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-border-peach bg-surface-muted">
                          <Image
                            src={pet.image}
                            alt={pet.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="truncate">{pet.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-coral shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. BREED / SUB-TYPE BUTTON & DROPDOWN */}
        <div className="relative flex-1 min-w-[130px] sm:min-w-[145px]">
          <span className="block text-[11px] font-bold text-ink-muted mb-1 font-quicksand">
            {currentPetType.name === "Birds"
              ? "Bird Type"
              : currentPetType.name === "Dogs"
              ? "Dog Breed"
              : currentPetType.name === "Cats"
              ? "Cat Breed"
              : "Breed / Sub-type"}
          </span>
          <button
            type="button"
            onClick={() => {
              setBreedOpen(!breedOpen);
              setPetTypeOpen(false);
              setCategoryOpen(false);
              setLocationOpen(false);
              setConditionOpen(false);
              setPriceOpen(false);
            }}
            className={cn(
              "w-full h-11 px-3 rounded-xl border flex items-center justify-between gap-2 bg-background font-quicksand font-bold text-xs sm:text-sm text-ink transition-all cursor-pointer shadow-2xs hover:border-coral/60",
              breedOpen
                ? "border-coral ring-2 ring-coral/20 bg-coral/5"
                : "border-border-peach dark:border-slate-700"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-border-peach bg-surface-muted">
                <Image
                  src={currentBreed.image}
                  alt={currentBreed.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="truncate">{currentBreed.name}</span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-ink-muted shrink-0 transition-transform duration-200",
                breedOpen && "rotate-180 text-coral"
              )}
            />
          </button>

          {breedOpen && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-60 bg-card border border-border-peach dark:border-slate-700 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="flex items-center gap-2 px-2.5 py-1.5 mb-1.5 rounded-lg bg-surface-muted border border-border-peach/50">
                <Search className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                <input
                  type="text"
                  placeholder={`Search ${currentPetType.name.toLowerCase()} type...`}
                  value={breedSearch}
                  onChange={(e) => setBreedSearch(e.target.value)}
                  className="w-full bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none font-quicksand"
                  autoFocus
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-0.5 scrollbar-thin">
                {filteredBreeds.map((breed) => {
                  const isSelected = filters.breed === breed.id;
                  return (
                    <button
                      key={breed.id}
                      type="button"
                      onClick={() => handleBreedSelect(breed)}
                      className={cn(
                        "w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs font-bold font-quicksand transition-all cursor-pointer text-left",
                        isSelected
                          ? "bg-coral/10 text-coral font-extrabold"
                          : "text-ink hover:bg-surface-muted hover:text-coral"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-border-peach bg-surface-muted">
                          <Image
                            src={breed.image}
                            alt={breed.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="truncate">{breed.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-coral shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="hidden lg:block h-9 w-[1px] bg-border-peach/80 dark:bg-slate-700 self-end mb-1" />

        {/* 3. CATEGORY SELECTOR */}
        <div className="relative flex-1 min-w-[130px] sm:min-w-[145px]">
          <span className="block text-[11px] font-bold text-ink-muted mb-1 font-quicksand">
            Category
          </span>
          <button
            type="button"
            onClick={() => {
              setCategoryOpen(!categoryOpen);
              setPetTypeOpen(false);
              setBreedOpen(false);
              setLocationOpen(false);
              setConditionOpen(false);
              setPriceOpen(false);
            }}
            className={cn(
              "w-full h-11 px-3 rounded-xl border flex items-center justify-between gap-2 bg-background font-quicksand font-bold text-xs sm:text-sm text-ink transition-all cursor-pointer shadow-2xs hover:border-coral/60",
              categoryOpen
                ? "border-coral ring-2 ring-coral/20 bg-coral/5"
                : "border-border-peach dark:border-slate-700"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Layers className="w-4 h-4 text-ink-muted shrink-0" />
              <span className="truncate">{filters.category}</span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-ink-muted shrink-0 transition-transform duration-200",
                categoryOpen && "rotate-180 text-coral"
              )}
            />
          </button>

          {categoryOpen && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-56 bg-card border border-border-peach dark:border-slate-700 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="flex items-center gap-2 px-2.5 py-1.5 mb-1.5 rounded-lg bg-surface-muted border border-border-peach/50">
                <Search className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                <input
                  type="text"
                  placeholder="Search category..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none font-quicksand"
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-0.5 scrollbar-thin">
                {filteredCategories.map((cat: string) => {
                  const isSelected = filters.category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        onChange({ ...filters, category: cat });
                        setCategoryOpen(false);
                      }}
                      className={cn(
                        "w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs font-bold font-quicksand transition-all cursor-pointer text-left",
                        isSelected
                          ? "bg-coral/10 text-coral font-extrabold"
                          : "text-ink hover:bg-surface-muted hover:text-coral"
                      )}
                    >
                      <span className="truncate">{cat}</span>
                      {isSelected && <Check className="w-4 h-4 text-coral shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. LOCATION SELECTOR */}
        <div className="relative flex-1 min-w-[130px] sm:min-w-[145px]">
          <span className="block text-[11px] font-bold text-ink-muted mb-1 font-quicksand">
            Location
          </span>
          <button
            type="button"
            onClick={() => {
              setLocationOpen(!locationOpen);
              setPetTypeOpen(false);
              setBreedOpen(false);
              setCategoryOpen(false);
              setConditionOpen(false);
              setPriceOpen(false);
            }}
            className={cn(
              "w-full h-11 px-3 rounded-xl border flex items-center justify-between gap-2 bg-background font-quicksand font-bold text-xs sm:text-sm text-ink transition-all cursor-pointer shadow-2xs hover:border-coral/60",
              locationOpen
                ? "border-coral ring-2 ring-coral/20 bg-coral/5"
                : "border-border-peach dark:border-slate-700"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-coral shrink-0" />
              <span className="truncate">{filters.location}</span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-ink-muted shrink-0 transition-transform duration-200",
                locationOpen && "rotate-180 text-coral"
              )}
            />
          </button>

          {locationOpen && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-56 bg-card border border-border-peach dark:border-slate-700 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="flex items-center gap-2 px-2.5 py-1.5 mb-1.5 rounded-lg bg-surface-muted border border-border-peach/50">
                <Search className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                <input
                  type="text"
                  placeholder="Search location..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none font-quicksand"
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-0.5 scrollbar-thin">
                {filteredLocations.map((loc: string) => {
                  const isSelected = filters.location === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        onChange({ ...filters, location: loc });
                        setLocationOpen(false);
                      }}
                      className={cn(
                        "w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs font-bold font-quicksand transition-all cursor-pointer text-left",
                        isSelected
                          ? "bg-coral/10 text-coral font-extrabold"
                          : "text-ink hover:bg-surface-muted hover:text-coral"
                      )}
                    >
                      <span className="truncate">{loc}</span>
                      {isSelected && <Check className="w-4 h-4 text-coral shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. CONDITION SELECTOR */}
        <div className="relative w-28 sm:w-32">
          <span className="block text-[11px] font-bold text-ink-muted mb-1 font-quicksand">
            Condition
          </span>
          <button
            type="button"
            onClick={() => {
              setConditionOpen(!conditionOpen);
              setPetTypeOpen(false);
              setBreedOpen(false);
              setCategoryOpen(false);
              setLocationOpen(false);
              setPriceOpen(false);
            }}
            className={cn(
              "w-full h-11 px-3 rounded-xl border flex items-center justify-between gap-1.5 bg-background font-quicksand font-bold text-xs sm:text-sm text-ink transition-all cursor-pointer shadow-2xs hover:border-coral/60",
              conditionOpen
                ? "border-coral ring-2 ring-coral/20 bg-coral/5"
                : "border-border-peach dark:border-slate-700"
            )}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-coral shrink-0" />
              <span className="truncate">{filters.condition}</span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-ink-muted shrink-0 transition-transform duration-200",
                conditionOpen && "rotate-180 text-coral"
              )}
            />
          </button>

          {conditionOpen && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-36 bg-card border border-border-peach dark:border-slate-700 rounded-2xl shadow-xl z-50 p-1.5 animate-in fade-in-50 zoom-in-95 duration-150">
              {TOP_CONDITIONS.map((cond: string) => {
                const isSelected = filters.condition === cond;
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => {
                      onChange({ ...filters, condition: cond });
                      setConditionOpen(false);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs font-bold font-quicksand transition-all cursor-pointer text-left",
                      isSelected
                        ? "bg-coral/10 text-coral font-extrabold"
                        : "text-ink hover:bg-surface-muted hover:text-coral"
                    )}
                  >
                    <span>{cond}</span>
                    {isSelected && <Check className="w-4 h-4 text-coral shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. PRICE SELECTOR */}
        <div className="relative w-28 sm:w-32">
          <span className="block text-[11px] font-bold text-ink-muted mb-1 font-quicksand">
            Price
          </span>
          <button
            type="button"
            onClick={() => {
              setPriceOpen(!priceOpen);
              setPetTypeOpen(false);
              setBreedOpen(false);
              setCategoryOpen(false);
              setLocationOpen(false);
              setConditionOpen(false);
            }}
            className={cn(
              "w-full h-11 px-3 rounded-xl border flex items-center justify-between gap-1.5 bg-background font-quicksand font-bold text-xs sm:text-sm text-ink transition-all cursor-pointer shadow-2xs hover:border-coral/60",
              priceOpen
                ? "border-coral ring-2 ring-coral/20 bg-coral/5"
                : "border-border-peach dark:border-slate-700"
            )}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Tag className="w-3.5 h-3.5 text-coral shrink-0" />
              <span className="truncate">
                {TOP_PRICE_RANGES[filters.priceIndex]?.label || "Any"}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-ink-muted shrink-0 transition-transform duration-200",
                priceOpen && "rotate-180 text-coral"
              )}
            />
          </button>

          {priceOpen && (
            <div className="absolute top-[calc(100%+6px)] right-0 w-44 bg-card border border-border-peach dark:border-slate-700 rounded-2xl shadow-xl z-50 p-1.5 animate-in fade-in-50 zoom-in-95 duration-150">
              {TOP_PRICE_RANGES.map((pr: { label: string; min: number; max: number }, idx: number) => {
                const isSelected = filters.priceIndex === idx;
                return (
                  <button
                    key={pr.label}
                    type="button"
                    onClick={() => {
                      onChange({ ...filters, priceIndex: idx });
                      setPriceOpen(false);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs font-bold font-quicksand transition-all cursor-pointer text-left",
                      isSelected
                        ? "bg-coral/10 text-coral font-extrabold"
                        : "text-ink hover:bg-surface-muted hover:text-coral"
                    )}
                  >
                    <span>{pr.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-coral shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 7. SHOW PRODUCTS ACTION BUTTON */}
        <div className="self-end mb-0.5 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={onApply}
            className="w-full sm:w-auto h-11 px-5 rounded-xl bg-coral hover:bg-coral-dark text-white font-quicksand font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-coral/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>Show Products</span>
            {productCount !== undefined && (
              <span className="bg-white/20 text-white text-[11px] px-1.5 py-0.5 rounded-full ml-0.5">
                {productCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
