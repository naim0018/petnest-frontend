"use client";

import React, { use, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useFindOneSpeciesQuery,
  useFindBreedsBySpeciesQuery,
} from "@/store/Api/Pets/pets.api";
import type { PetBreed, PetSpecies } from "@/store/Api/Pets/pets.types";
import {
  BreedDeleteModal,
} from "@/components/admin/pet-catalog/BreedModals";
import {
  SpeciesDeleteModal,
} from "@/components/admin/pet-catalog/SpeciesModals";
import PetCatalogCard from "@/components/admin/pet-catalog/PetCatalogCard";
import { PetCatalogGridSkeleton } from "@/components/admin/pet-catalog/PetCatalogCardSkeleton";
import {
  PawPrint,
  Plus,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Award,
} from "lucide-react";

function formatCareLevel(level?: string | null) {
  if (!level) return null;
  const upper = level.toUpperCase();
  if (upper === "LOW") return "Low";
  if (upper === "HIGH") return "High";
  return "Moderate";
}

function formatSize(size?: string | null) {
  if (!size) return null;
  const upper = size.toUpperCase();
  if (upper === "SMALL") return "Small";
  if (upper === "MEDIUM") return "Medium";
  if (upper === "LARGE") return "Large";
  if (upper === "GIANT") return "Giant";
  return size;
}

export default function PetTypeBreedsPage({
  params,
}: {
  params: Promise<{ typeId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();
  const typeId = resolvedParams.typeId;

  const {
    data: speciesResponse,
    isLoading: isLoadingSpecies,
    isError,
    refetch: refetchSpecies,
  } = useFindOneSpeciesQuery(typeId, {
    refetchOnMountOrArgChange: true,
  });
  const petSpecies = speciesResponse?.data;

  const {
    data: breedsResponse,
    isLoading: isLoadingBreeds,
    refetch: refetchBreeds,
  } = useFindBreedsBySpeciesQuery(
    { speciesIdOrSlug: typeId, query: { limit: 10 } },
    { skip: !typeId, refetchOnMountOrArgChange: true },
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [deleteBreed, setDeleteBreed] = useState<PetBreed | null>(null);
  const [isSpeciesDeleteOpen, setIsSpeciesDeleteOpen] = useState(false);

  // Place "Add Breed" button on the Header dynamically
  useEffect(() => {
    setHeaderAction(
      <div className="flex items-center gap-2">
        <PrimaryButton
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/pet-catalog")}
          leftIcon={<ArrowLeft className="size-4" />}
          className="font-bold cursor-pointer"
        >
          All Types
        </PrimaryButton>
        <PrimaryButton
          variant="primary"
          size="sm"
          onClick={() => router.push(`/admin/pet-catalog/${typeId}/new-breed`)}
          leftIcon={<Plus className="size-4" />}
          className="font-bold cursor-pointer"
        >
          Add Breed
        </PrimaryButton>
      </div>
    );

    return () => setHeaderAction(null);
  }, [router, setHeaderAction, typeId]);

  const breeds = useMemo(() => breedsResponse?.data?.items || [], [breedsResponse]);

  const filteredBreeds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return breeds;

    return breeds.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        (b.originCountry && b.originCountry.toLowerCase().includes(query)) ||
        (b.temperament && b.temperament.toLowerCase().includes(query)) ||
        (b.shortDescription && b.shortDescription.toLowerCase().includes(query)) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(query)))
    );
  }, [breeds, searchQuery]);

  const handleRetry = () => {
    refetchSpecies();
    refetchBreeds();
  };

  if (isLoadingSpecies) {
    return (
      <div className="space-y-6">
        {/* Dynamic 4 Stats Row Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {/* 1st Card: Pet Classification skeleton */}
          <div className="p-4 sm:p-5 rounded-xl bg-card border border-border-peach/80 min-h-[125px] flex flex-col justify-between shadow-2xs">
            <div className="h-3 w-28 bg-surface-muted rounded" />
            <div className="space-y-2 mt-2">
              <div className="h-6 w-36 bg-surface-muted rounded" />
              <div className="h-3 w-24 bg-surface-muted/70 rounded" />
            </div>
          </div>
          {/* 2nd, 3rd, 4th StatsCard skeletons */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-xl bg-card border border-border-peach/80 min-h-[125px] flex flex-col justify-between shadow-2xs"
            >
              <div className="flex justify-between items-center">
                <div className="h-3 w-24 bg-surface-muted rounded" />
                <div className="size-5 rounded-full bg-surface-muted/70" />
              </div>
              <div className="space-y-1.5 mt-2">
                <div className="h-6 w-24 bg-surface-muted rounded" />
                <div className="h-3 w-32 bg-surface-muted/60 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Search Filter Bar Skeleton */}
        <div className="flex items-center justify-end">
          <div className="w-full max-w-md h-11 bg-card border border-border-peach rounded-xl animate-pulse shadow-2xs" />
        </div>

        {/* Breeds Grid Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between animate-pulse">
            <div className="h-5 w-44 bg-surface-muted rounded" />
            <div className="h-4 w-32 bg-surface-muted/60 rounded" />
          </div>

          <PetCatalogGridSkeleton
            count={8}
            hasTags={true}
            hasSubtitle={true}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          />
        </div>
      </div>
    );
  }

  if (isError || !petSpecies) {
    return (
      <div className="p-8 text-center rounded-xl bg-card border border-border-peach space-y-3">
        <AlertCircle className="size-10 text-coral mx-auto" />
        <p className="font-bold text-ink text-base">Pet Classification Not Found</p>
        <p className="text-xs text-ink-muted">
          The requested pet type could not be loaded or does not exist.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <PrimaryButton variant="outline" size="sm" onClick={() => router.push("/admin/pet-catalog")}>
            Return to Pet Catalog
          </PrimaryButton>
          <PrimaryButton variant="primary" size="sm" onClick={handleRetry}>
            Retry
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic 4 Stats Row with Pet Type on 1st Card */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1st Card: Pet Type with Image / Mascot (links to Species Details) */}
          <div
            onClick={() => router.push(`/admin/pet-catalog/${typeId}/details`)}
            className="relative overflow-hidden p-4 sm:p-5 rounded-xl bg-gradient-to-br from-card via-card to-coral-light/20 border border-border-peach/80 flex flex-col justify-between min-h-[125px] shadow-2xs transition-all duration-300 hover:shadow-md hover:border-coral/50 hover:-translate-y-0.5 group cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                router.push(`/admin/pet-catalog/${typeId}/details`);
              }
            }}
          >
            <div className="absolute -right-6 -top-6 size-24 rounded-full bg-coral/5 blur-xl pointer-events-none group-hover:bg-coral/10 transition-colors" />

            <div className="flex w-full items-center justify-between">
              <h3 className="text-ink-muted text-xs font-bold uppercase tracking-wider font-quicksand group-hover:text-coral transition-colors flex items-center gap-1.5">
                Pet Classification
                <span className="text-[10px] lowercase text-coral opacity-0 group-hover:opacity-100 transition-opacity font-normal">
                  (details →)
                </span>
              </h3>
            </div>

            <div className="mt-2 pr-20 sm:pr-24 z-10">
              <p className="text-xl sm:text-2xl font-bold text-ink font-quicksand tracking-tight line-clamp-1">
                {petSpecies.name}
              </p>
              {petSpecies.scientificGroup && (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 truncate italic">
                    {petSpecies.scientificGroup}
                  </span>
                </div>
              )}
            </div>

            {/* Mascot Image - large on bottom right corner */}
            <div className="absolute right-2 bottom-0 size-20 sm:size-34 pointer-events-none transition-transform duration-300 group-hover:scale-105">
              <Image
                src={petSpecies.image || "/CareGuideCard/dog-faq-mascot.png"}
                alt={petSpecies.name}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* 2nd Card: Registered Breeds */}
          <StatsCard
            title="Registered Breeds"
            value={`${breeds.length} Breeds`}
            trendText="Standardized profiles in catalog"
            trendType="positive"
            icon={<Award className="size-5" />}
          />

          {/* 3rd Card: Care Guides Connected */}
          <StatsCard
            title="Care Guides Connected"
            value="100% Verified"
            trendText="Includes temperament & size scales"
            trendType="positive"
            icon={<Sparkles className="size-5" />}
          />

          {/* 4th Card: Breed Catalog Status */}
          <StatsCard
            title="Catalog Status"
            value="Active"
            trendText="Profiles ready & up to date"
            trendType="positive"
            icon={<CheckCircle2 className="size-5 text-emerald-500" />}
          />
        </div>
      </AnimatedContainer>

      {/* Breeds Header (Title & Search Filter in same row) + Grid */}
      <AnimatedContainer delay={0.1}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-ink text-base font-quicksand flex items-center gap-2">
              <PawPrint className="size-4.5 text-coral" />
              All Registered Breeds
            </h3>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-ink-muted hover:text-coral font-semibold px-2 py-1 rounded transition-colors cursor-pointer shrink-0"
                >
                  Clear filter
                </button>
              )}
              <div className="relative w-full sm:w-72 md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-ink-faint pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${petSpecies.name.split(" ")[0]} breeds, traits, origin...`}
                  className="w-full h-10 pl-10 pr-4 bg-card border border-border-peach rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all text-ink placeholder:text-ink-faint shadow-2xs"
                />
              </div>
            </div>
          </div>

          {isLoadingBreeds ? (
            <PetCatalogGridSkeleton
              count={8}
              hasTags={true}
              hasSubtitle={true}
              gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
            />
          ) : filteredBreeds.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-card border border-border-peach">
              <AlertCircle className="size-10 text-ink-faint mx-auto mb-2 opacity-50" />
              <p className="font-bold text-ink font-quicksand">No Breeds Found</p>
              <p className="text-xs text-ink-muted mt-1">
                {searchQuery
                  ? "Try another search keyword or clear filter."
                  : `No breeds registered for ${petSpecies.name} yet.`}
              </p>
              <div className="mt-4">
                <PrimaryButton
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(`/admin/pet-catalog/${typeId}/new-breed`)}
                  leftIcon={<Plus className="size-4" />}
                >
                  Add Breed
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredBreeds.map((breed) => {
                const formattedCare = formatCareLevel(breed.careLevel);
                const formattedSizeText = formatSize(breed.size);
                const breedDetailsHref = `/admin/pet-catalog/${typeId}/breed/${breed.id}`;

                return (
                  <PetCatalogCard
                    key={breed.id}
                    name={breed.name}
                    image={breed.image || petSpecies.image}
                    linkHref={breedDetailsHref}
                    badgeText={formattedCare ? `${formattedCare} Care` : "Standard Care"}
                    subtitle={breed.originCountry || "Worldwide"}
                    pillText={formattedSizeText || undefined}
                    description={breed.shortDescription || breed.temperament}
                    tags={breed.tags}
                    statusLabel="Status"
                    statusValue="Active"
                    metaText="Loved by Pet Lovers"
                    onReadMore={() => router.push(breedDetailsHref)}
                    onDetails={() => router.push(breedDetailsHref)}
                    onEdit={() =>
                      router.push(`/admin/pet-catalog/${typeId}/edit-breed/${breed.id}`)
                    }
                    onDelete={() => setDeleteBreed(breed)}
                    deleteTooltip="Delete Breed"
                  />
                );
              })}
            </div>
          )}
        </div>
      </AnimatedContainer>

      {/* Breed Delete Modal */}
      <BreedDeleteModal
        breed={deleteBreed}
        speciesName={petSpecies.name}
        isOpen={Boolean(deleteBreed)}
        onClose={() => setDeleteBreed(null)}
      />

      {/* Species Delete Modal for Active Classification */}
      <SpeciesDeleteModal
        species={petSpecies}
        isOpen={isSpeciesDeleteOpen}
        onClose={() => setIsSpeciesDeleteOpen(false)}
        onSuccess={() => router.push("/admin/pet-catalog")}
      />
    </div>
  );
}
