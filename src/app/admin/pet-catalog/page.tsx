"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { useHeaderAction } from "@/context/HeaderActionContext";
import { useFindAllSpeciesQuery } from "@/store/Api/Pets/pets.api";
import type { PetSpecies } from "@/store/Api/Pets/pets.types";
import {
  SpeciesDeleteModal,
} from "@/components/admin/pet-catalog/SpeciesModals";
import PetCatalogCard from "@/components/admin/pet-catalog/PetCatalogCard";
import { PetCatalogGridSkeleton } from "@/components/admin/pet-catalog/PetCatalogCardSkeleton";
import SearchField, { SearchSuggestionItem } from "@/components/common/SearchField";
import {
  PawPrint,
  Plus,
  BookOpen,
  Layers,
  Award,
  AlertCircle,
} from "lucide-react";

export default function PetCatalogPage() {
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteSpecies, setDeleteSpecies] = useState<PetSpecies | null>(null);

  const { data: speciesResponse, isLoading, isError, refetch } = useFindAllSpeciesQuery({
    limit: 10,
  });

  const speciesList = useMemo(() => speciesResponse?.data?.items || [], [speciesResponse]);

  // Place action button in the Header directly
  useEffect(() => {
    setHeaderAction(
      <PrimaryButton
        variant="primary"
        size="sm"
        rounded="md"
        onClick={() => router.push("/admin/pet-catalog/new")}
        leftIcon={<Plus className="size-4" />}
        className="font-bold cursor-pointer"
      >
        Add Pet Type
      </PrimaryButton>
    );

    return () => setHeaderAction(null);
  }, [router, setHeaderAction]);

  const totalPetTypes = speciesResponse?.data?.meta?.total ?? speciesList.length;
  const totalBreeds = speciesList.reduce(
    (acc, pt) => acc + (pt.breeds?.length ?? pt._count?.breeds ?? 0),
    0
  );

  const filteredPetTypes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return speciesList;

    return speciesList.filter(
      (pt) =>
        pt.name.toLowerCase().includes(query) ||
        (pt.shortDescription && pt.shortDescription.toLowerCase().includes(query)) ||
        (pt.scientificGroup && pt.scientificGroup.toLowerCase().includes(query))
    );
  }, [speciesList, searchQuery]);

  const suggestions: SearchSuggestionItem[] = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return filteredPetTypes.slice(0, 6).map((pt) => ({
      id: pt.id || pt.slug,
      title: pt.name,
      subtitle: pt.scientificGroup || (pt.breeds?.length ? `${pt.breeds.length} breeds` : undefined),
      image: pt.image || "/CareGuideCard/dog-faq-mascot.png",
      badge: pt.breeds?.length ? `${pt.breeds.length} Breeds` : undefined,
      onClick: () => {
        router.push(`/admin/pet-catalog/${pt.id || pt.slug}`);
      },
    }));
  }, [filteredPetTypes, searchQuery, router]);
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-lg bg-card border border-border-peach/80 min-h-[125px] flex flex-col justify-between shadow-2xs"
            >
              <div className="flex justify-between items-center">
                <div className="h-3 w-28 bg-surface-muted rounded" />
                <div className="size-5 rounded-full bg-surface-muted/70" />
              </div>
              <div className="space-y-1.5 mt-2">
                <div className="h-6 w-24 bg-surface-muted rounded" />
                <div className="h-3 w-36 bg-surface-muted/60 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Pet Types Header Skeleton (Title & Search Filter in same row) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
          <div className="h-6 w-36 bg-surface-muted rounded" />
          <div className="w-full sm:w-80 md:w-96 h-11 bg-card border border-border-peach rounded-md shadow-2xs" />
        </div>

        {/* Pet Types Cards Grid Skeleton */}
        <div className="space-y-4">
          <PetCatalogGridSkeleton
            count={10}
            hasTags={false}
            hasSubtitle={false}
            gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards - 4 columns with dynamic gradient design */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Pet Types"
            value={`${totalPetTypes} Classes`}
            trendText="Covering companion species"
            trendType="positive"
            icon={<PawPrint className="size-5" />}
          />
          <StatsCard
            title="Registered Breeds"
            value={`${totalBreeds} Breeds`}
            trendText="Standardized profiles in catalog"
            trendType="positive"
            icon={<Award className="size-5" />}
          />
          <StatsCard
            title="Care Guides Connected"
            value="100% Active"
            trendText="All classes linked to health guides"
            trendType="positive"
            icon={<BookOpen className="size-5" />}
          />
          <StatsCard
            title="Taxonomy Standards"
            value="Verified"
            trendText="Global scientific classification"
            trendType="positive"
            icon={<Layers className="size-5" />}
          />
        </div>
      </AnimatedContainer>

      {/* Pet Types Header (Title & Search Filter in same row) + Cards Grid */}
      <AnimatedContainer delay={0.1}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <h3 className="font-bold text-ink text-[18px] font-quicksand flex items-center gap-2 shrink-0">
              <Layers className="size-5 text-coral" />
              All Pet Types
            </h3>
            <div className="w-full sm:w-80 md:w-96">
              <SearchField
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search pet types, scientific names..."
                suggestions={suggestions}
                onSelectSuggestion={(item) => item.onClick?.()}
              />
            </div>
          </div>

          {isLoading ? (
            <PetCatalogGridSkeleton
              count={10}
              hasTags={false}
              hasSubtitle={false}
              gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            />
          ) : isError ? (
            <div className="p-12 text-center rounded-lg bg-card border border-border-peach space-y-3">
              <AlertCircle className="size-10 text-coral mx-auto" />
              <p className="font-bold text-ink font-quicksand">Failed to load pet catalog</p>
              <p className="text-xs text-ink-muted">There was an issue fetching taxonomy records.</p>
              <PrimaryButton variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </PrimaryButton>
            </div>
          ) : filteredPetTypes.length === 0 ? (
            <div className="p-12 text-center rounded-lg bg-card border border-border-peach">
              <AlertCircle className="size-10 text-ink-faint mx-auto mb-2 opacity-50" />
              <p className="font-bold text-ink font-quicksand">No Pet Types Found</p>
              <p className="text-xs text-ink-muted mt-1">
                {searchQuery
                  ? "Try adjusting your search criteria or clear filter."
                  : "Start by adding your first pet type to the catalog."}
              </p>
              <div className="mt-4">
                <PrimaryButton
                  variant="primary"
                  size="sm"
                  onClick={() => router.push("/admin/pet-catalog/new")}
                  leftIcon={<Plus className="size-4" />}
                >
                  Add Pet Type
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredPetTypes.map((type) => {
                const breedCount = type.breeds?.length ?? type._count?.breeds ?? 0;
                const breedsHref = `/admin/pet-catalog/${type.slug || type.id}`;
                const detailsHref = `/admin/pet-catalog/${type.slug || type.id}/details`;

                return (
                  <PetCatalogCard
                    key={type.id}
                    name={type.name}
                    image={type.image}
                    linkHref={detailsHref}
                    badgeText={`${breedCount} Breeds`}
                    description={type.shortDescription}
                    secondaryLink={{
                      href: breedsHref,
                      label: `View Breeds (${breedCount})`,
                    }}
                    statusLabel="Class"
                    statusValue="Verified"
                    metaText={`${breedCount} Breeds`}
                    onReadMore={() => router.push(detailsHref)}
                    onDetails={() => router.push(detailsHref)}
                    onEdit={() =>
                      router.push(`/admin/pet-catalog/${type.slug || type.id}/edit`)
                    }
                    onDelete={() => setDeleteSpecies(type)}
                    deleteTooltip="Delete Pet Type"
                  />
                );
              })}
            </div>
          )}
        </div>
      </AnimatedContainer>

      {/* Delete Confirmation Modal */}
      <SpeciesDeleteModal
        species={deleteSpecies}
        isOpen={Boolean(deleteSpecies)}
        onClose={() => setDeleteSpecies(null)}
      />
    </div>
  );
}
