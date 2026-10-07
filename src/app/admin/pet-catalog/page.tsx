"use client";

import React, { useEffect, useState } from "react";
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
  Sparkles,
  Layers,
  Award,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function PetCatalogPage() {
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();
  const [petTypes] = useState<PetType[]>(initialPetCatalogData);
  const [searchQuery, setSearchQuery] = useState("");

  // Place action button in the Header directly
  useEffect(() => {
    setHeaderAction(
      <PrimaryButton
        variant="primary"
        size="sm"
        onClick={() => router.push("/admin/pet-catalog/new")}
        leftIcon={<Plus className="size-4" />}
        className="font-bold cursor-pointer"
      >
        Add Pet Type
      </PrimaryButton>
    );

    return () => setHeaderAction(null);
  }, [router, setHeaderAction]);

  const totalPetTypes = petTypes.length;
  const totalBreeds = petTypes.reduce((acc, pt) => acc + pt.breeds.length, 0);

  const filteredPetTypes = petTypes.filter(
    (pt) =>
      pt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pt.scientificGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            icon={<Sparkles className="size-5" />}
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

      {/* Search Bar Row */}
      <div className="flex items-center justify-between gap-3 bg-card border border-border-peach rounded-xl p-3 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pet types, scientific names, or descriptions..."
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

      {/* Pet Types Cards Grid - 4 to 5 cards per row */}
      <AnimatedContainer delay={0.1}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink text-base font-quicksand flex items-center gap-2">
              <Layers className="size-4.5 text-coral" />
              All Pet Types
            </h3>
            <span className="text-xs text-ink-muted font-medium">
              Click a card to browse and manage its breeds
            </span>
          </div>

          {filteredPetTypes.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-card border border-border-peach">
              <AlertCircle className="size-10 text-ink-faint mx-auto mb-2 opacity-50" />
              <p className="font-bold text-ink font-quicksand">No Pet Types Found</p>
              <p className="text-xs text-ink-muted mt-1">Try adjusting your search criteria or add a new pet type.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredPetTypes.map((type) => (
                <Link
                  key={type.id}
                  href={`/admin/pet-catalog/${type.id}`}
                  className="group relative bg-card border border-border-peach hover:border-coral rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Clean Product/Mascot Card Image */}
                  <div className="relative h-44 w-full bg-gradient-to-b from-surface-soft to-surface-muted/60 p-3 flex items-center justify-center overflow-hidden border-b border-border-peach/60">
                    <div className="relative size-32 group-hover:scale-108 transition-transform duration-300">
                      <Image
                        src={type.image}
                        alt={type.name}
                        fill
                        className="object-contain drop-shadow-md"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      />
                    </div>

                    {/* Breed Count Badge */}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 dark:bg-card/95 text-ink border border-border-peach shadow-2xs">
                      {type.breeds.length} Breeds
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <h4 className="text-sm font-bold font-quicksand text-ink group-hover:text-coral transition-colors line-clamp-1">
                        {type.name}
                      </h4>
                      <p className="text-[11px] text-ink-muted italic line-clamp-1">
                        {type.scientificGroup}
                      </p>
                      <p className="text-[11px] text-ink-muted line-clamp-2 mt-1.5 leading-relaxed">
                        {type.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border-peach flex items-center justify-between text-xs">
                      <span className="text-coral font-bold text-[11px] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-quicksand">
                        View Breeds <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </AnimatedContainer>
    </div>
  );
}
