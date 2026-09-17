"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PET_TYPES_DATA, PetTypeCategoryData } from "@/lib/data/pet-types";
import { useFeedFilter } from "@/context/FeedFilterContext";
import PrimaryButton from "@/components/common/PrimaryButton";
import {
  PawPrint,
  Dog,
  Cat,
  Bird,
  Rabbit,
  Fish,
  Turtle,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  PawPrint,
  Dog,
  Cat,
  Bird,
  Rabbit,
  Fish,
  Turtle,
};

const TAB_STYLES: Record<string, { inactiveBg: string; textColor: string; borderColor: string }> = {
  all: { inactiveBg: "bg-surface-muted", textColor: "text-ink-muted", borderColor: "border-border-peach" },
  birds: { inactiveBg: "bg-tint-rose", textColor: "text-coral", borderColor: "border-border-peach" },
  dogs: { inactiveBg: "bg-tint-cream", textColor: "text-warning", borderColor: "border-border-peach" },
  cats: { inactiveBg: "bg-tint-mint", textColor: "text-success", borderColor: "border-border-peach" },
  "small-pets": { inactiveBg: "bg-tint-lav", textColor: "text-coral", borderColor: "border-border-peach" },
  aquatic: { inactiveBg: "bg-tint-sky", textColor: "text-info", borderColor: "border-border-peach" },
  reptiles: { inactiveBg: "bg-tint-rose", textColor: "text-coral", borderColor: "border-border-peach" },
};

interface FeedFilterTabsProps {
  className?: string;
}

export function FeedFilterTabs({ className }: FeedFilterTabsProps) {
  let feedFilter: ReturnType<typeof useFeedFilter> | null = null;
  try {
    feedFilter = useFeedFilter();
  } catch {
    feedFilter = null;
  }

  const [localPetType, setLocalPetType] = useState<string>("all");
  const [localPetSubtype, setLocalPetSubtype] = useState<string>("all");

  const selectedPetType = feedFilter ? feedFilter.selectedPetType : localPetType;
  const setPetType = feedFilter
    ? feedFilter.setSelectedPetType
    : (type: string) => {
      setLocalPetType(type);
      setLocalPetSubtype("all");
    };

  const selectedPetSubtype = feedFilter ? feedFilter.selectedPetSubtype : localPetSubtype;
  const setPetSubtype = feedFilter
    ? feedFilter.setSelectedPetSubtype
    : setLocalPetSubtype;

  const currentCategoryObj: PetTypeCategoryData | undefined = PET_TYPES_DATA.find(
    (cat) => cat.id === selectedPetType
  );

  const subtypes = currentCategoryObj?.subtypes || [];

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1">
        {PET_TYPES_DATA.map((pet) => {
          const isActive = selectedPetType === pet.id;
          const Icon = ICON_MAP[pet.iconName] || PawPrint;
          const style = TAB_STYLES[pet.id] || TAB_STYLES.all;

          if (isActive) {
            return (
              <PrimaryButton
                key={pet.id}
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setPetType(pet.id)}
                className="rounded-full px-6 py-2 h-auto text-sm font-quicksand font-bold shrink-0"
                leftIcon={<Icon className="size-5 shrink-0 text-white" />}
              >
                {pet.label}
              </PrimaryButton>
            );
          }

          return (
            <PrimaryButton
              key={pet.id}
              type="button"
              variant="sweep"
              animatedSweep
              size="sm"
              onClick={() => setPetType(pet.id)}
              className={cn(
                "rounded-full px-6 py-2 h-auto text-sm font-quicksand font-bold shrink-0 group",
                style.inactiveBg,
                style.borderColor
              )}
              leftIcon={<Icon className="size-5 shrink-0 group-hover:text-white" />}
            >
              {pet.label}
            </PrimaryButton>
          );
        })}
      </div>

      {selectedPetType !== "all" && subtypes.length > 0 && (
        <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1 animate-in fade-in-50 duration-200">
          {subtypes.map((sub) => {
            const isSubActive = selectedPetSubtype === sub.id;
            const parentStyle = TAB_STYLES[selectedPetType] || TAB_STYLES.all;

            if (isSubActive) {
              return (
                <PrimaryButton
                  key={sub.id}
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setPetSubtype(sub.id)}
                  className="rounded-full px-6 py-2 h-auto text-xs tracking-wide font-quicksand font-bold shrink-0"
                >
                  {sub.label}
                </PrimaryButton>
              );
            }

            return (
              <PrimaryButton
                key={sub.id}
                type="button"
                variant="sweep"
                animatedSweep
                size="sm"
                onClick={() => setPetSubtype(sub.id)}
                className={cn(
                  "rounded-full px-6 py-2 h-auto text-xs tracking-wide font-quicksand font-bold shrink-0",
                  parentStyle.inactiveBg || "bg-surface-muted",
                  parentStyle.borderColor || "border-border-peach"
                )}
              >
                {sub.label}
              </PrimaryButton>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FeedFilterTabsSkeleton() {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto py-1 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-7 w-20 bg-surface-muted rounded-full shrink-0" />
      ))}
    </div>
  );
}
