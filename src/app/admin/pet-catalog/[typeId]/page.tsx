"use client";

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { useHeaderAction } from "@/context/HeaderActionContext";
import { initialPetCatalogData, PetType } from "@/lib/data/petCatalog";
import {
  PawPrint,
  Plus,
  Search,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function PetTypeBreedsPage({
  params,
}: {
  params: Promise<{ typeId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();
  const typeId = resolvedParams.typeId;

  const [petType] = useState<PetType | undefined>(() =>
    initialPetCatalogData.find((pt) => pt.id === typeId) || initialPetCatalogData[0]
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Place "Add Breed" button on the Header dynamically
  useEffect(() => {
    setHeaderAction(
      <PrimaryButton
        variant="primary"
        size="sm"
        onClick={() => router.push(`/admin/pet-catalog/${typeId}/new-breed`)}
        leftIcon={<Plus className="size-4" />}
        className="font-bold cursor-pointer"
      >
        Add Breed
      </PrimaryButton>
    );

    return () => setHeaderAction(null);
  }, [router, setHeaderAction, typeId]);

  if (!petType) {
    return (
      <div className="p-8 text-center rounded-xl bg-card border border-border-peach">
        <p className="font-bold text-ink">Pet Type not found.</p>
        <Link href="/admin/pet-catalog" className="text-coral underline text-sm mt-2 block">
          Return to Pet Catalog
        </Link>
      </div>
    );
  }

  const breeds = petType.breeds;
  const filteredBreeds = breeds.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.temperament?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  src={petType.image}
                  alt={petType.name}
                  fill
                  className="object-contain p-0.5"
                />
              </div>
            </div>

            <div className="mt-2">
              <p className="text-xl sm:text-2xl font-bold text-ink font-quicksand tracking-tight line-clamp-1">
                {petType.name.split(" ")[0]}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 truncate italic">
                  {petType.scientificGroup}
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

      {/* Search Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-card border border-border-peach rounded-xl p-3 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${petType.name.split(" ")[0]} breeds, traits, origin...`}
            className="w-full pl-9 pr-4 py-2 bg-surface-soft border border-border-peach rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all text-ink placeholder:text-ink-faint"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-ink-muted hover:text-coral font-semibold px-2 py-1 rounded transition-colors cursor-pointer"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Breeds Grid - 4 to 5 cards per row with photos */}
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
              <p className="text-xs text-ink-muted mt-1">Try another search keyword or add a new breed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredBreeds.map((breed) => (
                <div
                  key={breed.id}
                  className="bg-card border border-border-peach hover:border-coral rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col group transform hover:-translate-y-0.5"
                >
                  {/* Real Breed Photo Banner */}
                  <div className="relative h-36 w-full bg-surface-muted overflow-hidden">
                    <Image
                      src={breed.image}
                      alt={breed.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />

                    {breed.careLevel && (
                      <span
                        className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-2xs ${
                          breed.careLevel === "High"
                            ? "bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-300"
                            : breed.careLevel === "Moderate"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300"
                        }`}
                      >
                        {breed.careLevel} Care
                      </span>
                    )}
                  </div>

                  {/* Breed Details */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-ink font-quicksand group-hover:text-coral transition-colors line-clamp-1">
                        {breed.name}
                      </h4>
                      {breed.origin && (
                        <p className="text-[10px] text-ink-muted truncate">
                          {breed.origin}
                        </p>
                      )}
                    </div>

                    {breed.temperament && (
                      <p className="text-[10px] text-ink-muted line-clamp-2 bg-surface-soft p-1.5 rounded-md border border-border-peach/50 italic leading-snug">
                        "{breed.temperament}"
                      </p>
                    )}

                    <div className="pt-2 border-t border-border-peach flex items-center justify-between text-[11px]">
                      {breed.size && (
                        <span className="font-semibold text-ink-muted text-[10px]">
                          Size: {breed.size}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                        <CheckCircle2 className="size-3" /> Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimatedContainer>
    </div>
  );
}
