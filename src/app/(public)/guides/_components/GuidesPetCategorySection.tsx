"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/common/Avatar";

export {
  PET_CATEGORIES_WITH_BREEDS,
  type PetCategoryItem,
  type BreedItem,
} from "@/lib/data/petCategoriesData";
import { PET_CATEGORIES_WITH_BREEDS } from "@/lib/data/petCategoriesData";


interface GuidesPetCategorySectionProps {
  onSelectCategory?: (categoryId: string, breedId: string) => void;
  selectedCategoryId?: string;
  selectedBreedId?: string;
  className?: string;
}

export default function GuidesPetCategorySection({
  onSelectCategory,
  selectedCategoryId: controlledCatId,
  selectedBreedId: controlledBreedId,
  className,
}: GuidesPetCategorySectionProps) {
  const [internalCatId, setInternalCatId] = useState<string>("dogs");
  const [internalBreedId, setInternalBreedId] = useState<string>("all");

  const activeCatId = controlledCatId !== undefined ? controlledCatId : internalCatId;
  const activeBreedId = controlledBreedId !== undefined ? controlledBreedId : internalBreedId;

  const currentCategory = useMemo(() => {
    return (
      PET_CATEGORIES_WITH_BREEDS.find((cat) => cat.id === activeCatId) ||
      PET_CATEGORIES_WITH_BREEDS[0]
    );
  }, [activeCatId]);

  const handleSelectCategory = (catId: string) => {
    setInternalCatId(catId);
    setInternalBreedId("all");
    onSelectCategory?.(catId, "all");
  };

  const handleSelectBreed = (breedId: string) => {
    setInternalBreedId(breedId);
    onSelectCategory?.(activeCatId, breedId);
  };

  return (
    <section className={cn("space-y-6 pt-1", className)}>
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-coral">
          What kind of pet are you caring for?
        </h3>
      </div>

      {/* Main Pet Category Round Cards */}
      <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-2 pt-1 px-1 scrollbar-none">
        {PET_CATEGORIES_WITH_BREEDS.map((cat) => {
          const isSelected = activeCatId === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className="group flex flex-col items-center gap-2 shrink-0 cursor-pointer focus:outline-none"
            >
              <Avatar
                src={cat.image}
                name={cat.label}
                size="2xl"
                ring={isSelected ? "gradient" : "none"}
                interactive
              />

              {/* Label */}
              <span
                className={cn(
                  "text-xs sm:text-sm font-bold lg:text-base transition-colors font-quicksand",
                  isSelected
                    ? "text-coral"
                    : "text-ink-muted  group-hover:text-ink"
                )}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Real Breed Photos Section */}
      {currentCategory && currentCategory.breeds.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-ink-muted uppercase tracking-wider font-quicksand">
              Popular {currentCategory.label} Breeds & Types
            </h3>
            {activeBreedId !== "all" && (
              <button
                type="button"
                onClick={() => handleSelectBreed("all")}
                className="text-xs font-bold text-coral hover:underline cursor-pointer"
              >
                Reset breed filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none">
            {currentCategory.breeds.map((breed) => {
              const isBreedSelected = activeBreedId === breed.id;

              return (
                <button
                  key={breed.id}
                  type="button"
                  onClick={() => handleSelectBreed(breed.id)}
                  className="group flex flex-col items-center gap-2 shrink-0 cursor-pointer focus:outline-none"
                >
                  <Avatar
                    src={breed.image}
                    name={breed.label}
                    size="xl"
                    ring={isBreedSelected ? "gradient" : "none"}
                    interactive
                  />

                  {/* Breed Name Label */}
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-bold max-w-[95px] sm:max-w-[110px] text-center truncate font-quicksand transition-colors",
                      isBreedSelected
                        ? "text-coral"
                        : "text-ink-muted group-hover:text-ink"
                    )}
                  >
                    {breed.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
