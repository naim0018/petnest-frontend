"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ChevronDown, Check, Loader2, PawPrint, Globe, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdateGuideMutation } from "@/store/Api/Guides/guides.api";
import { useAllSpeciesDropdown } from "@/hooks/usePetQueries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GuideSpeciesDropdownProps {
  guideId: string;
  currentSpeciesId?: string | null;
  currentSpeciesName?: string | null;
  guideTitle?: string;
  className?: string;
  disabled?: boolean;
}

export default function GuideSpeciesDropdown({
  guideId,
  currentSpeciesId,
  currentSpeciesName,
  guideTitle,
  className,
  disabled = false,
}: GuideSpeciesDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [optimisticSpecies, setOptimisticSpecies] = useState<{
    id: string | null;
    name: string;
  } | null>(null);

  const { data: speciesList = [], isLoading: isLoadingSpecies } =
    useAllSpeciesDropdown();

  const [updateGuide, { isLoading: isUpdating }] = useUpdateGuideMutation();

  useEffect(() => {
    setOptimisticSpecies(null);
  }, [currentSpeciesId, currentSpeciesName]);

  const activeId =
    optimisticSpecies !== null ? optimisticSpecies.id : currentSpeciesId || null;

  const activeSpecies =
    optimisticSpecies !== null
      ? optimisticSpecies
      : currentSpeciesId
        ? speciesList.find((s) => s.id === currentSpeciesId) || {
            id: currentSpeciesId,
            name: currentSpeciesName || "Assigned Species",
          }
        : null;

  const filteredSpecies = useMemo(() => {
    if (!search.trim()) return speciesList;
    const q = search.toLowerCase();
    return speciesList.filter((s) => s.name.toLowerCase().includes(q));
  }, [speciesList, search]);

  const handleSelectSpecies = async (species: {
    id: string | null;
    name: string;
  }) => {
    if (species.id === activeId) {
      setOpen(false);
      return;
    }

    setOpen(false);
    setOptimisticSpecies(species);

    try {
      await updateGuide({
        id: guideId,
        payload: {
          speciesId: species.id,
          breedIds: [], // Clear breeds when species is modified
        },
      }).unwrap();

      toast.success(
        species.id
          ? `Species updated to "${species.name}"`
          : "Guide set to All Species (General)"
      );
    } catch (err: unknown) {
      setOptimisticSpecies(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errObj = err as any;
      const message =
        errObj?.data?.message ||
        errObj?.message ||
        "Failed to update guide species. Please try again.";
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
              activeSpecies?.id
                ? "bg-tint-mint/60 text-success border-success/30 hover:border-success/60 hover:bg-tint-mint"
                : "bg-surface-muted/60 text-ink-muted border-border-peach hover:border-coral/40 hover:bg-coral-light/20",
              isUpdating && "opacity-80 cursor-wait",
              disabled && "opacity-50 cursor-not-allowed",
              open && "ring-2 ring-coral/20 border-coral/40",
              className
            )}
            title="Click to update target species"
          >
            <span className="flex items-center gap-1.5 min-w-0 flex-1 text-left">
              {isUpdating ? (
                <Loader2 className="size-3 animate-spin shrink-0 text-coral" />
              ) : activeSpecies?.id ? (
                <PawPrint className="size-3.5 text-success shrink-0" />
              ) : (
                <Globe className="size-3 text-ink-faint shrink-0" />
              )}
              <span className="truncate">
                {activeSpecies?.name || "All Species"}
              </span>
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
            Target Species
          </span>
          {guideTitle && (
            <span
              className="text-[10px] text-ink-muted truncate max-w-[105px]"
              title={guideTitle}
            >
              {guideTitle}
            </span>
          )}
        </div>

        {speciesList.length > 5 && (
          <div className="p-1.5 border-b border-border-peach/50">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-muted text-xs text-ink-muted">
              <Search className="size-3.5 shrink-0 opacity-60" />
              <input
                type="text"
                placeholder="Search species..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-ink outline-hidden"
              />
            </div>
          </div>
        )}

        <div className="py-1 space-y-0.5 max-h-56 overflow-y-auto">
          {/* Option: All Species / General */}
          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              handleSelectSpecies({ id: null, name: "All Species" })
            }
            className={cn(
              "w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 transition-colors duration-150 cursor-pointer",
              activeId === null
                ? "bg-coral-light/60 text-ink font-bold"
                : "text-ink hover:bg-surface-soft hover:text-coral"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="size-3.5 text-ink-faint shrink-0" />
              <span className="text-xs truncate italic text-ink-muted">
                All Species (General)
              </span>
            </div>
            {activeId === null && (
              <Check className="size-3.5 text-coral shrink-0 ml-1" />
            )}
          </button>

          {isLoadingSpecies && speciesList.length === 0 ? (
            <div className="p-3 text-center text-xs text-ink-muted">
              Loading species...
            </div>
          ) : (
            filteredSpecies.map((sp) => {
              const isCurrent = sp.id === activeId;
              return (
                <button
                  key={sp.id}
                  type="button"
                  disabled={isUpdating}
                  onClick={() =>
                    handleSelectSpecies({ id: sp.id, name: sp.name })
                  }
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 transition-colors duration-150 cursor-pointer",
                    isCurrent
                      ? "bg-coral-light/60 text-ink font-bold"
                      : "text-ink hover:bg-surface-soft hover:text-coral"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {sp.image ? (
                      <span className="relative size-4 rounded-full overflow-hidden border border-border-peach bg-surface-muted shrink-0 inline-block">
                        <Image
                          src={sp.image}
                          alt={sp.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </span>
                    ) : (
                      <PawPrint className="size-3.5 text-success shrink-0" />
                    )}
                    <span className="text-xs truncate">{sp.name}</span>
                  </div>
                  {isCurrent && (
                    <Check className="size-3.5 text-coral shrink-0 ml-1" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
