"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/common/Avatar";

export interface BreedItem {
  id: string;
  label: string;
  image: string;
}

export interface PetCategoryItem {
  id: string;
  label: string;
  image: string;
  breeds: BreedItem[];
}

export const PET_CATEGORIES_WITH_BREEDS: PetCategoryItem[] = [
  {
    id: "dogs",
    label: "Dogs",
    image: "/CareGuide/categories/dog.png",
    breeds: [
      { id: "all", label: "All Dogs", image: "/CareGuide/categories/dog.png" },
      { id: "golden-retriever", label: "Golden Retriever", image: "/CareGuide/breeds/dogs/golden-retriever.jpg" },
      { id: "french-bulldog", label: "French Bulldog", image: "/CareGuide/breeds/dogs/french-bulldog.jpg" },
      { id: "german-shepherd", label: "German Shepherd", image: "/CareGuide/breeds/dogs/german-shepherd.jpg" },
      { id: "labrador", label: "Labrador", image: "/CareGuide/breeds/dogs/labrador.jpg" },
      { id: "poodle", label: "Poodle", image: "/CareGuide/breeds/dogs/poodle.jpg" },
      { id: "husky", label: "Siberian Husky", image: "/CareGuide/breeds/dogs/husky.jpg" },
      { id: "beagle", label: "Beagle", image: "/CareGuide/breeds/dogs/beagle.jpg" },
      { id: "corgi", label: "Corgi", image: "/CareGuide/breeds/dogs/corgi.jpg" },
      { id: "pomeranian", label: "Pomeranian", image: "/CareGuide/breeds/dogs/pomeranian.jpg" },
      { id: "dachshund", label: "Dachshund", image: "/CareGuide/breeds/dogs/dachshund.jpg" },
      { id: "rottweiler", label: "Rottweiler", image: "/CareGuide/breeds/dogs/rottweiler.jpg" },
      { id: "shih-tzu", label: "Shih Tzu", image: "/CareGuide/breeds/dogs/shih-tzu.jpg" },
    ],
  },
  {
    id: "cats",
    label: "Cats",
    image: "/CareGuide/categories/cat.png",
    breeds: [
      { id: "all", label: "All Cats", image: "/CareGuide/categories/cat.png" },
      { id: "persian", label: "Persian", image: "/CareGuide/breeds/cats/persian.jpg" },
      { id: "maine-coon", label: "Maine Coon", image: "/CareGuide/breeds/cats/maine-coon.jpg" },
      { id: "siamese", label: "Siamese", image: "/CareGuide/breeds/cats/siamese.jpg" },
      { id: "british-shorthair", label: "British Shorthair", image: "/CareGuide/breeds/cats/british-shorthair.jpg" },
      { id: "bengal", label: "Bengal", image: "/CareGuide/breeds/cats/bengal.jpg" },
      { id: "ragdoll", label: "Ragdoll", image: "/CareGuide/breeds/cats/ragdoll.jpg" },
      { id: "scottish-fold", label: "Scottish Fold", image: "/CareGuide/breeds/cats/scottish-fold.jpg" },
      { id: "sphynx", label: "Sphynx", image: "/CareGuide/breeds/cats/sphynx.jpg" },
      { id: "calico", label: "Calico", image: "/CareGuide/breeds/cats/calico.jpg" },
      { id: "russian-blue", label: "Russian Blue", image: "/CareGuide/breeds/cats/russian-blue.jpg" },
    ],
  },
  {
    id: "birds",
    label: "Birds",
    image: "/CareGuide/categories/bird.png",
    breeds: [
      { id: "all", label: "All Birds", image: "/CareGuide/categories/bird.png" },
      { id: "budgie", label: "Budgerigar (Budgie)", image: "/CareGuide/breeds/birds/budgie.jpg" },
      { id: "cockatiel", label: "Cockatiel", image: "/CareGuide/breeds/birds/cockatiel.jpg" },
      { id: "macaw", label: "Scarlet Macaw", image: "/CareGuide/breeds/birds/macaw.jpg" },
      { id: "parrot", label: "Ringneck Parrot", image: "/CareGuide/breeds/birds/parrot.jpg" },
      { id: "conure", label: "Sun Conure", image: "/CareGuide/breeds/birds/conure.jpg" },
      { id: "green-cheeked-conure", label: "Green Cheek Conure", image: "/CareGuide/breeds/birds/green-cheeked-conure.jpg" },
      { id: "african-grey", label: "African Grey", image: "/CareGuide/breeds/birds/african-grey.jpg" },
      { id: "cockatoo", label: "Cockatoo", image: "/CareGuide/breeds/birds/cockatoo.jpg" },
      { id: "lovebird", label: "Lovebird", image: "/CareGuide/breeds/birds/lovebird.jpg" },
      { id: "canary", label: "Canary", image: "/CareGuide/breeds/birds/canary.jpg" },
      { id: "finch", label: "Gouldian Finch", image: "/CareGuide/breeds/birds/finch.jpg" },
      { id: "dove", label: "Diamond Dove", image: "/CareGuide/breeds/birds/dove.jpg" },
    ],
  },
  {
    id: "small-pets",
    label: "Small Pets",
    image: "/CareGuide/categories/rabbit.png",
    breeds: [
      { id: "all", label: "All Small Pets", image: "/CareGuide/categories/rabbit.png" },
      { id: "holland-lop", label: "Holland Lop Bunny", image: "/CareGuide/breeds/small-pets/holland-lop.jpg" },
      { id: "netherland-dwarf", label: "Netherland Dwarf", image: "/CareGuide/breeds/small-pets/netherland-dwarf.jpg" },
      { id: "syrian-hamster", label: "Syrian Hamster", image: "/CareGuide/breeds/small-pets/syrian-hamster.jpg" },
      { id: "guinea-pig", label: "Guinea Pig", image: "/CareGuide/breeds/small-pets/guinea-pig.jpg" },
      { id: "chinchilla", label: "Chinchilla", image: "/CareGuide/breeds/small-pets/chinchilla.jpg" },
      { id: "ferret", label: "Ferret", image: "/CareGuide/breeds/small-pets/ferret.jpg" },
      { id: "hedgehog", label: "Hedgehog", image: "/CareGuide/breeds/small-pets/hedgehog.jpg" },
    ],
  },
  {
    id: "aquatic",
    label: "Fish & Aquatic",
    image: "/CareGuide/categories/fish.png",
    breeds: [
      { id: "all", label: "All Aquatic", image: "/CareGuide/categories/fish.png" },
      { id: "betta", label: "Betta Fish", image: "/CareGuide/breeds/aquatic/betta.jpg" },
      { id: "goldfish", label: "Fancy Goldfish", image: "/CareGuide/breeds/aquatic/goldfish.jpg" },
      { id: "guppies", label: "Guppies", image: "/CareGuide/breeds/aquatic/guppies.jpg" },
      { id: "angelfish", label: "Angelfish", image: "/CareGuide/breeds/aquatic/angelfish.jpg" },
      { id: "clownfish", label: "Clownfish", image: "/CareGuide/breeds/aquatic/clownfish.jpg" },
    ],
  },
  {
    id: "reptiles",
    label: "Reptiles",
    image: "/CareGuide/categories/reptile.png",
    breeds: [
      { id: "all", label: "All Reptiles", image: "/CareGuide/categories/reptile.png" },
      { id: "bearded-dragon", label: "Bearded Dragon", image: "/CareGuide/breeds/reptiles/bearded-dragon.jpg" },
      { id: "leopard-gecko", label: "Leopard Gecko", image: "/CareGuide/breeds/reptiles/leopard-gecko.jpg" },
      { id: "chameleon", label: "Chameleon", image: "/CareGuide/breeds/reptiles/chameleon.jpg" },
      { id: "turtle", label: "Pet Turtle", image: "/CareGuide/breeds/reptiles/turtle.jpg" },
    ],
  },
];

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
