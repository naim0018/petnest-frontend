"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronDown,
  RotateCcw,
  Check,
  SlidersHorizontal,
  PawPrint,
  Bird,
  Dog,
  Cat,
  Rabbit,
  Fish,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PET_CATEGORIES_WITH_BREEDS,
  BreedItem,
} from "@/lib/data/petCategoriesData";
import { Tooltip } from "@/components/common/Tooltip";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setPetFilter, resetPetFilter } from "@/store/features/PetFilterSlice/petFilterSlice";

export interface SelectedPetFilter {
  typeId: string; // 'all' or category id like 'dogs', 'birds'
  typeLabel: string;
  breedId?: string; // 'all' or specific breed id like 'budgie'
  breedLabel?: string;
  image?: string;
}

interface PetSelectorPopoverProps {
  onPetSelect?: (filter: SelectedPetFilter) => void;
  className?: string;
}

// Relevant SVG icon component for each pet category
function CategoryIcon({ catId, className }: { catId: string; className?: string }) {
  switch (catId) {
    case "birds":
      return <Bird className={className} />;
    case "dogs":
      return <Dog className={className} />;
    case "cats":
      return <Cat className={className} />;
    case "small-pets":
      return <Rabbit className={className} />;
    case "aquatic":
      return <Fish className={className} />;
    default:
      return <PawPrint className={className} />;
  }
}

export default function PetSelectorPopover({
  onPetSelect,
  className,
}: PetSelectorPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const reduxFilter = useAppSelector((state) => state.petFilter);

  // Selected filter state synced with Redux
  const selectedType = reduxFilter?.selectedType ?? "birds";
  const selectedBreed = reduxFilter?.selectedBreed ?? "all";


  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Current category based on selectedType
  const currentCategory = PET_CATEGORIES_WITH_BREEDS.find(
    (c) => c.id === selectedType
  );

  const selectedBreedItem =
    currentCategory && selectedBreed !== "all"
      ? currentCategory.breeds.find((b) => b.id === selectedBreed)
      : null;

  // Selected count calculation
  const getSelectedCount = () => {
    if (selectedType === "all") return 0;
    if (selectedBreed === "all") return 1;
    return 2;
  };

  const getSelectedSummaryText = () => {
    if (selectedType === "all") return "All Pets";
    const catLabel = currentCategory?.label || "Pet";
    if (selectedBreed === "all") return `${catLabel}`;
    const breedLabel =
      currentCategory?.breeds.find((b) => b.id === selectedBreed)?.label ||
      "All";
    return `${catLabel} • ${breedLabel}`;
  };

  const notifyChange = (typeId: string, breedId: string) => {
    const cat = PET_CATEGORIES_WITH_BREEDS.find((c) => c.id === typeId);
    const breed = cat?.breeds.find((b) => b.id === breedId);

    const typeLabel = typeId === "all" ? "All Pets" : cat?.label || typeId;
    const breedLabel = breedId === "all" ? `All ${cat?.label || ""}` : breed?.label || "";
    const image = breed?.image || cat?.image;

    dispatch(
      setPetFilter({
        typeId,
        typeLabel,
        breedId,
        breedLabel,
        image,
      })
    );

    onPetSelect?.({
      typeId,
      typeLabel,
      breedId,
      breedLabel,
      image,
    });
  };

  const handleSelectType = (typeId: string) => {
    notifyChange(typeId, "all");
  };

  const handleSelectBreed = (breedId: string) => {
    notifyChange(selectedType, breedId);
  };

  const handleReset = () => {
    dispatch(resetPetFilter());
    onPetSelect?.({
      typeId: "all",
      typeLabel: "All Pets",
      breedId: "all",
      breedLabel: "All",
    });
  };

  const handleApply = () => {
    notifyChange(selectedType, selectedBreed);
    setIsOpen(false);
  };


  const selectedCount = getSelectedCount();

  // Compute trigger label for accessibility and tooltip
  const triggerLabel =
    selectedType === "all"
      ? "All Pets"
      : selectedBreed !== "all" && selectedBreedItem
      ? selectedBreedItem.label
      : currentCategory
      ? currentCategory.label
      : "Select Pets";

  return (
    <div className={cn("static sm:relative flex items-center h-full", className)} ref={popoverRef}>
      {/* Trigger Button - Shows ONLY the selected item's avatar / icon + chevron. Tooltip only displays when popover is closed */}
      <Tooltip content={!isOpen ? triggerLabel : null} position="bottom">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "relative size-10 rounded-full cursor-pointer transition-all duration-200 select-none shrink-0 flex items-center justify-center",
            "focus:outline-none",
            isOpen && "ring-2 ring-coral/40 scale-105"
          )}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={triggerLabel}
        >
          {/* Avatar / Icon: Displays ONLY the currently selected item */}
          <div className="w-full h-full rounded-full flex items-center justify-center shrink-0">
            {selectedType === "all" ? (
              // Default "All Pets": solid coral circle with white paw icon
              <div className="size-10 rounded-full bg-coral flex items-center justify-center text-white shadow-xs">
                <PawPrint className="size-5 text-white" />
              </div>
            ) : selectedBreed !== "all" && selectedBreedItem ? (
              // Specific breed selected: breed photo in round circle
              <div className="relative size-10 rounded-full overflow-hidden border-2 border-coral/40 z-10 shadow-xs shrink-0">
                <Image
                  src={selectedBreedItem.image}
                  alt={selectedBreedItem.label}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            ) : (
              // Pet Type selected (or "All [Category]"): relevant category icon in solid coral circle
              <div className="size-10 rounded-full bg-coral flex items-center justify-center text-white shadow-xs">
                <CategoryIcon catId={selectedType} className="size-5.5 text-white stroke-[2.2]" />
              </div>
            )}
          </div>

          {/* Chevron badge placed at the bottom-right corner */}
          <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-card border border-border-peach dark:border-slate-800 shadow-xs flex items-center justify-center z-10">
            <ChevronDown
              className={cn(
                "size-2.5 text-coral transition-transform duration-200 stroke-[3]",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </button>

      </Tooltip>

      {/* Popover Card Content placed identically to UserProfile dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 sm:mt-5",
            "w-[calc(100vw-16px)] sm:w-[860px] lg:w-[940px] xl:w-[980px] max-w-[95vw]",
            "bg-popover border border-border-peach rounded-2xl shadow-2xl z-[100]",
            "p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-200 select-none",
            "max-h-[85vh] overflow-y-auto"
          )}
        >
          {/* Top Arrow pointer pointing up to the trigger button */}
          <div className="hidden sm:block absolute -top-2 right-8 size-4 bg-popover border-t border-l border-border-peach rotate-45 z-10 rounded-tl-xs" />

          {/* Top Header */}
          <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-border-peach">
            {/* Left: Icon + Title + Subtitle */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-coral flex items-center justify-center text-white shadow-sm shrink-0">
                <PawPrint className="size-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-quicksand text-ink leading-tight">
                  Select Pets
                </h3>
                <p className="text-xs text-ink-muted">
                  Choose the pets you want to see
                </p>
              </div>
            </div>

            {/* Right: Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-coral/30 hover:border-coral text-coral hover:bg-coral-light/40 text-xs font-bold font-quicksand transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Section 1: Pet Types */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PawPrint className="size-4 text-coral" />
              <h4 className="text-xs sm:text-sm font-bold text-ink font-quicksand">
                Pet Types
              </h4>
            </div>

            {/* 10 in a row grid with size-16 to size-18 avatars */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-10 gap-3 sm:gap-4 py-1 items-start">
              {/* Option 1: "All" with solid coral circle and paw icon */}
              <button
                type="button"
                onClick={() => handleSelectType("all")}
                className="group flex flex-col items-center gap-2 w-full shrink-0 cursor-pointer focus:outline-none"
              >
                <div
                  className={cn(
                    "relative size-16 sm:size-18 rounded-full transition-all duration-200 flex items-center justify-center p-0.5",
                    selectedType === "all"
                      ? "ring-2.5 ring-coral ring-offset-2 ring-offset-card shadow-md scale-105"
                      : "hover:scale-105"
                  )}
                >
                  <div className="w-full h-full rounded-full bg-coral flex items-center justify-center text-white shadow-xs">
                    <PawPrint className="size-8 text-white" />
                  </div>
                  {selectedType === "all" && (
                    <div className="absolute top-0 right-0 size-5 rounded-full bg-coral text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-900">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-bold text-center truncate max-w-[76px] font-quicksand transition-colors",
                    selectedType === "all"
                      ? "text-coral font-bold"
                      : "text-ink-muted group-hover:text-ink"
                  )}
                >
                  All
                </span>
              </button>

              {/* Specific Categories */}
              {PET_CATEGORIES_WITH_BREEDS.map((cat) => {
                const isSelected = selectedType === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectType(cat.id)}
                    className="group flex flex-col items-center gap-2 w-full shrink-0 cursor-pointer focus:outline-none"
                  >
                    <div
                      className={cn(
                        "relative size-16 sm:size-18 rounded-full transition-all duration-200 flex items-center justify-center p-0.5",
                        isSelected
                          ? "ring-2.5 ring-coral ring-offset-2 ring-offset-card shadow-md scale-105"
                          : "ring-1 ring-border-peach/60 hover:ring-2 hover:ring-coral/50 hover:scale-105"
                      )}
                    >
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-card">
                        <Image
                          src={cat.image}
                          alt={cat.label}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="72px"
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute top-0 right-0 size-5 rounded-full bg-coral text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-900">
                          <Check className="size-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-bold text-center truncate max-w-[76px] font-quicksand transition-colors",
                        isSelected
                          ? "text-coral font-bold"
                          : "text-ink-muted group-hover:text-ink"
                      )}
                      title={cat.label}
                    >
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Popular Breeds & Types (Row 2 - only shown if user selected a pet type) */}
          {currentCategory && currentCategory.breeds.length > 0 && (
            <div className="mt-6 pt-5 border-t border-border-peach space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                <div className="relative size-4 rounded-full overflow-hidden">
                  <Image
                    src={currentCategory.image}
                    alt={currentCategory.label}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-ink font-quicksand">
                  Popular {currentCategory.label} Breeds & Types
                </h4>
              </div>

              {/* 10 in a row grid with size-16 to size-18 avatars */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-10 gap-3 sm:gap-4 py-1 items-start">
                {currentCategory.breeds.map((breed) => {
                  const isBreedSelected = selectedBreed === breed.id;
                  const isAllBreed = breed.id === "all";

                  return (
                    <button
                      key={breed.id}
                      type="button"
                      onClick={() => handleSelectBreed(breed.id)}
                      className="group flex flex-col items-center gap-2 w-full shrink-0 cursor-pointer focus:outline-none"
                    >
                      <div
                        className={cn(
                          "relative size-16 sm:size-18 rounded-full transition-all duration-200 flex items-center justify-center p-0.5",
                          isBreedSelected
                            ? "ring-2.5 ring-coral ring-offset-2 ring-offset-card shadow-md scale-105"
                            : "ring-1 ring-border-peach/60 hover:ring-2 hover:ring-coral/50 hover:scale-105"
                        )}
                      >
                        {isAllBreed ? (
                          // Solid coral circle with matching white category icon (exact same design as All pet types)
                          <div className="w-full h-full rounded-full bg-coral flex items-center justify-center shadow-xs">
                            <CategoryIcon
                              catId={currentCategory.id}
                              className="size-8 text-white stroke-[2.2]"
                            />
                          </div>
                        ) : (
                          <div className="relative w-full h-full rounded-full overflow-hidden bg-card">
                            <Image
                              src={breed.image}
                              alt={breed.label}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              sizes="72px"
                            />
                          </div>
                        )}

                        {isBreedSelected && (
                          <div className="absolute top-0 right-0 size-5 rounded-full bg-coral text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-900">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[11px] font-bold text-center truncate max-w-[76px] font-quicksand transition-colors leading-tight",
                          isBreedSelected
                            ? "text-coral font-bold"
                            : "text-ink-muted group-hover:text-ink"
                        )}
                        title={breed.label}
                      >
                        {breed.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-5 mt-6 border-t border-border-peach">
            {/* Left: Filter summary status */}
            <div className="flex items-center gap-2 text-xs">
              <div className="size-7 rounded-lg bg-coral-light/70 text-coral flex items-center justify-center shrink-0">
                <SlidersHorizontal className="size-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-coral font-quicksand">
                  {selectedCount > 0 ? `${selectedCount} selected` : "No filter applied"}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {getSelectedSummaryText()}
                </span>
              </div>
            </div>

            {/* Right: Reset & Apply buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-full border border-border-peach text-ink-muted hover:text-ink hover:bg-surface-muted text-xs sm:text-sm font-bold font-quicksand transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-2 rounded-full bg-coral hover:bg-coral-hover text-white text-xs sm:text-sm font-bold font-quicksand shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
