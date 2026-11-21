"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ChevronDown, Check, Loader2, PawPrint, Tag, Search, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdateGuideMutation } from "@/store/Api/Guides/guides.api";
import { useBreedsBySpeciesDropdown } from "@/hooks/usePetQueries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GuideBreedDropdownProps {
  guideId: string;
  speciesId?: string | null;
  speciesName?: string | null;
  currentBreedIds?: string[];
  currentBreeds?: { id: string; name: string; image?: string | null }[];
  guideTitle?: string;
  className?: string;
  disabled?: boolean;
}

export default function GuideBreedDropdown({
  guideId,
  speciesId,
  speciesName,
  currentBreedIds = [],
  currentBreeds = [],
  guideTitle,
  className,
  disabled = false,
}: GuideBreedDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [optimisticBreeds, setOptimisticBreeds] = useState<{
    ids: string[];
    name: string;
  } | null>(null);

  const { data: breedList = [], isLoading: isLoadingBreeds } =
    useBreedsBySpeciesDropdown(speciesId || "");

  const [updateGuide, { isLoading: isUpdating }] = useUpdateGuideMutation();

  useEffect(() => {
    setOptimisticBreeds(null);
  }, [currentBreedIds, currentBreeds, speciesId]);

  const activeIds =
    optimisticBreeds !== null
      ? optimisticBreeds.ids
      : currentBreedIds.length > 0
        ? currentBreedIds
        : currentBreeds.map((b) => b.id);

  const activeLabel = useMemo(() => {
    if (optimisticBreeds !== null) return optimisticBreeds.name;
    if (currentBreeds.length === 1) return currentBreeds[0].name;
    if (currentBreeds.length > 1) {
      return `${currentBreeds[0].name} +${currentBreeds.length - 1}`;
    }
    return "All Breeds";
  }, [optimisticBreeds, currentBreeds]);

  const hasSpecificBreeds = activeIds.length > 0;

  const filteredBreeds = useMemo(() => {
    if (!search.trim()) return breedList;
    const q = search.toLowerCase();
    return breedList.filter((b) => b.name.toLowerCase().includes(q));
  }, [breedList, search]);

  const handleSelectBreed = async (breed: { id: string | null; name: string }) => {
    const isCurrentlySelected = breed.id ? activeIds.includes(breed.id) : activeIds.length === 0;
    if (isCurrentlySelected) {
      setOpen(false);
      return;
    }

    setOpen(false);
    const newBreedIds = breed.id ? [breed.id] : [];
    setOptimisticBreeds({ ids: newBreedIds, name: breed.name });

    try {
      await updateGuide({
        id: guideId,
        payload: {
          breedIds: newBreedIds,
        },
      }).unwrap();

      toast.success(
        breed.id
          ? `Breed updated to "${breed.name}"`
          : "Guide set to All Breeds (General)"
      );
    } catch (err: unknown) {
      setOptimisticBreeds(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errObj = err as any;
      const message =
        errObj?.data?.message ||
        errObj?.message ||
        "Failed to update guide breed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger
        render={(props) => (
          <button
            {...props}
            type="button"
            disabled={disabled || isUpdating}
            onClick={(e) => {
              e.stopPropagation();
              if (props.onClick) props.onClick(e);
            }}
            className={cn(
              "group inline-flex items-center justify-between w-[150px] h-7 px-2.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-150 cursor-pointer select-none",
              hasSpecificBreeds
                ? "bg-tint-sky/60 text-info border-info/30 hover:border-info/60 hover:bg-tint-sky"
                : "bg-surface-muted/60 text-ink-muted border-border-peach hover:border-coral/40 hover:bg-coral-light/20",
              isUpdating && "opacity-80 cursor-wait",
              disabled && "opacity-50 cursor-not-allowed",
              open && "ring-2 ring-coral/20 border-coral/40",
              className
            )}
            title="Click to update target breed"
          >
            <span className="flex items-center gap-1.5 min-w-0 flex-1 text-left">
              {isUpdating ? (
                <Loader2 className="size-3 animate-spin shrink-0 text-coral" />
              ) : hasSpecificBreeds ? (
                <Tag className="size-3 text-info shrink-0" />
              ) : (
                <PawPrint className="size-3 text-ink-faint shrink-0" />
              )}
              <span className="truncate">{activeLabel}</span>
            </span>
            <ChevronDown
              className={cn(
                "size-3 shrink-0 transition-transform duration-150 opacity-60 group-hover:opacity-100 ml-1.5",
                open && "rotate-180"
              )}
            />
          </button>
        )}
      />

      <PopoverContent
        align="center"
        sideOffset={6}
        initialFocus={false}
        finalFocus={false}
        className="w-56 p-1.5 bg-card border border-border-peach rounded-xl shadow-xl z-50 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-2.5 py-1.5 border-b border-border-peach/70 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">
            Target Breed
          </span>
          {speciesName && (
            <span
              className="text-[10px] text-ink-muted truncate max-w-[105px]"
              title={`For ${speciesName}`}
            >
              {speciesName}
            </span>
          )}
        </div>

        {!speciesId ? (
          <div className="p-3 text-center space-y-1">
            <Info className="size-4 text-warning mx-auto" />
            <p className="text-xs text-ink-muted">
              Select a target species first before assigning specific breeds.
            </p>
          </div>
        ) : (
          <>
            {breedList.length > 5 && (
              <div className="p-1.5 border-b border-border-peach/50">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-muted text-xs text-ink-muted">
                  <Search className="size-3.5 shrink-0 opacity-60" />
                  <input
                    type="text"
                    placeholder="Search breed..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-ink outline-hidden"
                  />
                </div>
              </div>
            )}

            <div className="py-1 space-y-0.5 max-h-56 overflow-y-auto">
              {/* Option: All Breeds / General */}
              <button
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  handleSelectBreed({ id: null, name: "All Breeds" })
                }
                className={cn(
                  "w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 transition-colors duration-150 cursor-pointer",
                  activeIds.length === 0
                    ? "bg-coral-light/60 text-ink font-bold"
                    : "text-ink hover:bg-surface-soft hover:text-coral"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <PawPrint className="size-3.5 text-ink-faint shrink-0" />
                  <span className="text-xs truncate italic text-ink-muted">
                    All Breeds ({speciesName || "General"})
                  </span>
                </div>
                {activeIds.length === 0 && (
                  <Check className="size-3.5 text-coral shrink-0 ml-1" />
                )}
              </button>

              {isLoadingBreeds && breedList.length === 0 ? (
                <div className="p-3 text-center text-xs text-ink-muted">
                  Loading breeds...
                </div>
              ) : breedList.length === 0 ? (
                <div className="p-3 text-center text-xs text-ink-muted">
                  No breeds registered for this species
                </div>
              ) : (
                filteredBreeds.map((breed) => {
                  const isCurrent = activeIds.includes(breed.id);
                  return (
                    <button
                      key={breed.id}
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        handleSelectBreed({ id: breed.id, name: breed.name })
                      }
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 transition-colors duration-150 cursor-pointer",
                        isCurrent
                          ? "bg-coral-light/60 text-ink font-bold"
                          : "text-ink hover:bg-surface-soft hover:text-coral"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {breed.image ? (
                          <span className="relative size-4 rounded-full overflow-hidden border border-border-peach bg-surface-muted shrink-0 inline-block">
                            <Image
                              src={breed.image}
                              alt={breed.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </span>
                        ) : (
                          <Tag className="size-3.5 text-info shrink-0" />
                        )}
                        <span className="text-xs truncate">{breed.name}</span>
                      </div>
                      {isCurrent && (
                        <Check className="size-3.5 text-coral shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
