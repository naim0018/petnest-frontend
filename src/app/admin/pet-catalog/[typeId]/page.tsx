"use client";

import React, { use, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { useHeaderAction } from "@/context/HeaderActionContext";
import { useFindOneSpeciesQuery } from "@/store/Api/Pets/pets.api";
import {
  PawPrint,
  Plus,
  Search,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
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

  const { data: speciesResponse, isLoading, isError, refetch } = useFindOneSpeciesQuery(typeId);
  const petSpecies = speciesResponse?.data;
  const [searchQuery, setSearchQuery] = useState("");

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

  const breeds = useMemo(() => petSpecies?.breeds || [], [petSpecies]);

  const filteredBreeds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return breeds;

    return breeds.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        (b.originCountry && b.originCountry.toLowerCase().includes(query)) ||
        (b.temperament && b.temperament.toLowerCase().includes(query))
    );
  }, [breeds, searchQuery]);

  if (isLoading) {
    return (
      <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 text-coral animate-spin" />
        <p className="text-sm font-semibold text-ink-muted">Loading pet class and breed catalog...</p>
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
          <PrimaryButton variant="primary" size="sm" onClick={() => refetch()}>
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
          {/* 1st Card: Pet Type with Image / Mascot */}
          <div className="relative overflow-hidden p-4 sm:p-5 rounded-xl bg-gradient-to-br from-card via-card to-coral-light/20 border border-border-peach/80 flex flex-col justify-between min-h-[125px] shadow-2xs transition-all duration-300 hover:shadow-md hover:border-coral/50 hover:-translate-y-0.5 group">
            <div className="absolute -right-6 -top-6 size-20 rounded-full bg-coral/5 blur-xl pointer-events-none group-hover:bg-coral/10 transition-colors" />

            <div className="flex w-full items-center justify-between">
              <h3 className="text-ink-muted text-xs font-bold uppercase tracking-wider font-quicksand group-hover:text-ink transition-colors">
                Pet Classification
              </h3>
              <div className="relative size-9 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center p-1 shrink-0 shadow-2xs group-hover:scale-110 transition-all duration-200">
                <Image
                  src={petSpecies.image || "/CareGuideCard/dog-faq-mascot.png"}
                  alt={petSpecies.name}
                  fill
                  className="object-contain p-0.5"
                />
              </div>
            </div>

            <div className="mt-2">
              <p className="text-xl sm:text-2xl font-bold text-ink font-quicksand tracking-tight line-clamp-1">
                {petSpecies.name.split(" ")[0]}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 truncate italic">
                  {petSpecies.scientificGroup || "Taxonomy Class"}
                </span>
              </div>
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

      {/* Search Filter Bar (Aligned to right) */}
      <div className="flex items-center justify-end gap-3">
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-ink-muted hover:text-coral font-semibold px-2 py-1 rounded transition-colors cursor-pointer"
          >
            Clear filter
          </button>
        )}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-ink-faint pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${petSpecies.name.split(" ")[0]} breeds, traits, origin...`}
            className="w-full h-11 pl-10 pr-4 bg-card border border-border-peach rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all text-ink placeholder:text-ink-faint shadow-2xs"
          />
        </div>
      </div>

      {/* Breeds Grid */}
      <AnimatedContainer delay={0.15}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink text-base font-quicksand flex items-center gap-2">
              <PawPrint className="size-4.5 text-coral" />
              All Registered Breeds
            </h3>
            <span className="text-xs text-ink-muted font-medium">
              Showing {filteredBreeds.length} of {breeds.length} breeds
            </span>
          </div>

          {filteredBreeds.length === 0 ? (
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredBreeds.map((breed) => {
                const formattedCare = formatCareLevel(breed.careLevel);
                const formattedSizeText = formatSize(breed.size);

                return (
                  <div
                    key={breed.id}
                    className="bg-card border border-border-peach hover:border-coral rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col group transform hover:-translate-y-0.5"
                  >
                    {/* Real Breed Photo Banner */}
                    <div className="relative h-36 w-full bg-surface-muted overflow-hidden">
                      <Image
                        src={breed.image || petSpecies.image || "/CareGuideCard/dog-faq-mascot.png"}
                        alt={breed.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      />

                      {formattedCare && (
                        <span
                          className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-2xs ${
                            formattedCare === "High"
                              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-300"
                              : formattedCare === "Moderate"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300"
                              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300"
                          }`}
                        >
                          {formattedCare} Care
                        </span>
                      )}
                    </div>

                    {/* Breed Details */}
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-ink font-quicksand group-hover:text-coral transition-colors line-clamp-1">
                          {breed.name}
                        </h4>
                        {breed.originCountry && (
                          <p className="text-[10px] text-ink-muted truncate">
                            {breed.originCountry}
                          </p>
                        )}
                      </div>

                      {breed.temperament && (
                        <p className="text-[10px] text-ink-muted line-clamp-2 bg-surface-soft p-1.5 rounded-md border border-border-peach/50 italic leading-snug">
                          &ldquo;{breed.temperament}&rdquo;
                        </p>
                      )}

                      <div className="pt-2 border-t border-border-peach flex items-center justify-between text-[11px]">
                        {formattedSizeText && (
                          <span className="font-semibold text-ink-muted text-[10px]">
                            Size: {formattedSizeText}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                          <CheckCircle2 className="size-3" /> Active
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AnimatedContainer>
    </div>
  );
}
