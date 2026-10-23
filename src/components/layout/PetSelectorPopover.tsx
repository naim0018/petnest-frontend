"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronDown,
  RotateCcw,
  Check,
  PawPrint,
  Bird,
  Dog,
  Cat,
  Rabbit,
  Fish,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PET_CATEGORIES_WITH_BREEDS,
} from "@/lib/data/petCategoriesData";
import { Tooltip } from "@/components/common/Tooltip";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setPetFilter, resetPetFilter } from "@/store/features/PetFilterSlice/petFilterSlice";

export interface SelectedPetFilter {
  typeId: string;
  typeLabel: string;
  breedId?: string;
  breedLabel?: string;
  image?: string;
}

interface PetSelectorPopoverProps {
  onPetSelect?: (filter: SelectedPetFilter) => void;
  className?: string;
}

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

  const selectedType = reduxFilter?.selectedType ?? "birds";
  const selectedBreed = reduxFilter?.selectedBreed ?? "all";

  const popoverRef = useRef<HTMLDivElement>(null);

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

  const currentCategory = PET_CATEGORIES_WITH_BREEDS.find(
    (c) => c.id === selectedType
  );

  const selectedBreedItem =
    currentCategory && selectedBreed !== "all"
      ? currentCategory.breeds.find((b) => b.id === selectedBreed)
      : null;

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
      {/* Trigger Button */}
      <Tooltip content={!isOpen ? triggerLabel : null} position="bottom">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "relative size-10 rounded-full cursor-pointer transition-all duration-200 select-none shrink-0 flex items-center justify-center",
            "focus:outline-none",
            isOpen && "scale-105"
          )}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={triggerLabel}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center shrink-0">
            {selectedType === "all" ? (
              <div className="size-10 rounded-full bg-coral flex items-center justify-center text-white shadow-xs">
                <PawPrint className="size-5 text-white" />
              </div>
            ) : selectedBreed !== "all" && selectedBreedItem ? (
              <div className="relative size-10 rounded-full p-[2px] bg-gradient-to-tr from-[#ff6b6b] to-[#ffe66d] shadow-xs shrink-0 flex items-center justify-center">
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-slate-900 bg-card">
                  <Image
                    src={selectedBreedItem.image}
                    alt={selectedBreedItem.label}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              </div>
            ) : (
              <div className="size-10 rounded-full bg-coral flex items-center justify-center text-white shadow-xs">
                <CategoryIcon catId={selectedType} className="size-5.5 text-white stroke-[2.2]" />
              </div>
            )}
          </div>

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

      {/* Popover Card */}
      {isOpen && (
        <div
          className={cn(
            "absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 sm:mt-6",
            "w-[calc(100vw-16px)] sm:w-[860px] lg:w-[940px] xl:w-[980px] max-w-[95vw]",
            "bg-popover border border-border-peach rounded-lg shadow-2xl z-[100]",
            "p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-200 select-none",
            "max-h-[85vh] overflow-y-auto"
          )}
        >
          <div className="hidden sm:block absolute -top-2 right-8 size-4 bg-popover border-t border-l border-border-peach rotate-45 z-10 rounded-tl-xs" />

          {/* Header Section */}
          <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-border-peach gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-coral flex items-center justify-center text-white shadow-sm shrink-0">
                <PawPrint className="size-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-quicksand text-ink leading-tight">
                Select Pets
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-coral/30 hover:border-coral text-coral hover:bg-coral-light/40 text-xs font-bold font-quicksand transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-1.5 rounded-full border border-border-peach text-ink-muted hover:text-ink hover:bg-surface-muted text-xs font-bold font-quicksand transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-1.5 rounded-full bg-coral hover:bg-coral-hover text-white text-xs font-bold font-quicksand shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Section 1: Pet Types */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PawPrint className="size-4 text-coral" />
              <h4 className="text-xs sm:text-sm font-bold text-ink font-quicksand">
                Pet Types
              </h4>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-10 gap-3 sm:gap-4 py-1 items-start">
              {/* Option: All */}
              <button
                type="button"
                onClick={() => handleSelectType("all")}
                className="group flex flex-col items-center gap-2 w-full shrink-0 cursor-pointer focus:outline-none"
              >
                <div
                  className={cn(
                    "relative size-16 sm:size-18 rounded-full transition-all duration-200 flex items-center justify-center",
                    selectedType === "all"
                      ? "p-[3px] bg-gradient-to-tr from-[#ff6b6b] to-[#ffe66d] scale-105"
                      : "p-[2px] bg-transparent hover:scale-105"
                  )}
                >
                  <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 bg-coral flex items-center justify-center text-white shadow-xs">
                    <PawPrint className="size-8 text-white" />
                  </div>
                  {selectedType === "all" && (
                    <div className="absolute top-0 right-0 size-5 rounded-full bg-coral text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-900 z-10">
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

              {/* Pet Categories */}
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
                        "relative size-16 sm:size-18 rounded-full transition-all duration-200 flex items-center justify-center",
                        isSelected
                          ? "p-[3px] bg-gradient-to-tr from-[#ff6b6b] to-[#ffe66d] scale-105"
                          : "p-[2px] border border-border-peach hover:border-coral/60 hover:scale-105"
                      )}
                    >
                      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-slate-900 bg-card">
                        <Image
                          src={cat.image}
                          alt={cat.label}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="72px"
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute top-0 right-0 size-5 rounded-full bg-coral text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-900 z-10">
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

          {/* Section 2: Popular Breeds & Types */}
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
                          "relative size-16 sm:size-18 rounded-full transition-all duration-200 flex items-center justify-center",
                          isBreedSelected
                            ? "p-[3px] bg-gradient-to-tr from-[#ff6b6b] to-[#ffe66d] scale-105"
                            : "p-[2px] border border-border-peach hover:border-coral/60 hover:scale-105"
                        )}
                      >
                        {isAllBreed ? (
                          <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 bg-coral flex items-center justify-center shadow-xs">
                            <CategoryIcon
                              catId={currentCategory.id}
                              className="size-8 text-white stroke-[2.2]"
                            />
                          </div>
                        ) : (
                          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-slate-900 bg-card">
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
                          <div className="absolute top-0 right-0 size-5 rounded-full bg-coral text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-900 z-10">
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
        </div>
      )}
    </div>
  );
}
