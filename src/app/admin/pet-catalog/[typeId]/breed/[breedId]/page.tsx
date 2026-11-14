"use client";

import React, { use, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useFindOneSpeciesQuery,
  useFindOneBreedQuery,
} from "@/store/Api/Pets/pets.api";
import { BreedDeleteModal } from "@/components/admin/pet-catalog/BreedModals";
import { COUNTRIES } from "@/lib/data/countries";
import type { PetBreed } from "@/store/Api/Pets/pets.types";
import {
  PawPrint,
  Heart,
  MapPin,
  Feather,
  ArrowLeft,
  Pencil,
  Trash2,
  BookOpen,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Tag,
  AlertCircle,
  ExternalLink,
  Layers,
  ShieldAlert,
} from "lucide-react";

function formatCareLevel(level?: string | null) {
  if (!level) return "Standard Care";
  const upper = level.toUpperCase();
  if (upper === "LOW") return "Low Care (Self-sufficient)";
  if (upper === "HIGH") return "High Care (Intense grooming/exercise)";
  return "Moderate Care (Regular grooming/exercise)";
}

function formatCareBadge(level?: string | null) {
  if (!level) return "Standard Care";
  const upper = level.toUpperCase();
  if (upper === "LOW") return "Low Care";
  if (upper === "HIGH") return "High Care";
  return "Moderate Care";
}

function formatSize(size?: string | null) {
  if (!size) return "Medium";
  const upper = size.toUpperCase();
  if (upper === "SMALL") return "Small (under 10 kg)";
  if (upper === "MEDIUM") return "Medium (10 - 25 kg)";
  if (upper === "LARGE") return "Large (25 - 45 kg)";
  if (upper === "GIANT") return "Giant (45+ kg)";
  return size;
}

function formatSizeBadge(size?: string | null) {
  if (!size) return "Medium Size";
  const upper = size.toUpperCase();
  if (upper === "SMALL") return "Small Size";
  if (upper === "MEDIUM") return "Medium Size";
  if (upper === "LARGE") return "Large Size";
  if (upper === "GIANT") return "Giant Size";
  return `${size} Size`;
}

function getCountryFlag(countryName?: string | null) {
  if (!countryName) return "";
  const found = COUNTRIES.find(
    (c) =>
      c.name.toLowerCase() === countryName.toLowerCase() ||
      countryName.toLowerCase().includes(c.name.toLowerCase())
  );
  return found ? found.flag : "🌍";
}

export default function BreedDetailsPage({
  params,
}: {
  params: Promise<{ typeId: string; breedId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();
  const { typeId, breedId } = resolvedParams;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch species info
  const {
    data: speciesResponse,
    isLoading: isLoadingSpecies,
  } = useFindOneSpeciesQuery(typeId, { skip: !typeId });
  const petSpecies = speciesResponse?.data;

  // Fetch breed info
  const {
    data: breedResponse,
    isLoading: isLoadingBreed,
    isError: isBreedError,
    refetch: refetchBreed,
  } = useFindOneBreedQuery(breedId, { skip: !breedId });
  const breed = breedResponse?.data;

  const speciesName = petSpecies?.name || breed?.species?.name || "Breeds";
  const formattedCareBadgeText = formatCareBadge(breed?.careLevel);
  const formattedCareText = formatCareLevel(breed?.careLevel);
  const formattedSizeBadgeText = formatSizeBadge(breed?.size);
  const formattedSizeText = formatSize(breed?.size);
  const flag = getCountryFlag(breed?.originCountry);

  // Header action buttons
  useEffect(() => {
    setHeaderAction(
      <div className="flex items-center gap-2">
        <PrimaryButton
          variant="outline"
          size="sm"
          onClick={() => router.push(`/admin/pet-catalog/${typeId}`)}
          leftIcon={<ArrowLeft className="size-4" />}
          className="font-bold cursor-pointer"
        >
          All {speciesName.split(" ")[0]} Breeds
        </PrimaryButton>
        <PrimaryButton
          variant="primary"
          size="sm"
          onClick={() =>
            router.push(`/admin/pet-catalog/${typeId}/edit-breed/${breedId}`)
          }
          leftIcon={<Pencil className="size-4" />}
          className="font-bold cursor-pointer"
        >
          Edit Breed
        </PrimaryButton>
      </div>
    );

    return () => setHeaderAction(null);
  }, [router, setHeaderAction, typeId, breedId, speciesName]);

  const temperamentTraits = useMemo(() => {
    if (!breed?.temperament) return [];
    return breed.temperament
      .split(/[,;]+/)
      .map((t) => t.trim())
      .filter(Boolean);
  }, [breed?.temperament]);

  const formattedDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoadingBreed || isLoadingSpecies) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-surface-muted rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-surface-muted rounded animate-pulse" />
            <div className="h-4 w-32 bg-surface-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="h-72 w-full bg-card border border-border-peach rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-card border border-border-peach rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isBreedError || !breed) {
    return (
      <div className="p-12 text-center rounded-xl bg-card border border-border-peach space-y-4">
        <AlertCircle className="size-12 text-coral mx-auto" />
        <h3 className="text-lg font-bold font-quicksand text-ink">Breed Profile Not Found</h3>
        <p className="text-xs text-ink-muted max-w-md mx-auto">
          The requested breed profile could not be loaded. It may have been removed or the ID is invalid.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <PrimaryButton
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/pet-catalog/${typeId}`)}
            leftIcon={<ArrowLeft className="size-4" />}
          >
            Back to Breeds
          </PrimaryButton>
          <PrimaryButton variant="primary" size="sm" onClick={() => refetchBreed()}>
            Retry
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <AnimatedContainer delay={0.05}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.push(`/admin/pet-catalog/${typeId}`)}
            className="inline-flex items-center gap-2 text-xs font-bold text-ink-muted hover:text-coral transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Back to {speciesName} Catalog</span>
          </button>

          <div className="flex items-center gap-2.5">
            <PrimaryButton
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(`/admin/pet-catalog/${typeId}/edit-breed/${breed.id}`)
              }
              leftIcon={<Pencil className="size-3.5 text-coral" />}
              className="text-xs font-bold"
            >
              Edit Profile
            </PrimaryButton>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              title="Delete Breed"
              aria-label="Delete Breed"
              className="size-9 rounded-full border border-red-200 hover:border-destructive bg-card hover:bg-rose-50 dark:hover:bg-rose-950/30 text-destructive flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </AnimatedContainer>

      {/* Hero Profile Banner Card */}
      <AnimatedContainer delay={0.1}>
        <div className="bg-card border border-border-peach rounded-2xl overflow-hidden shadow-xs relative">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Photo Area */}
            <div className="lg:col-span-5 relative h-72 sm:h-80 lg:h-auto min-h-[280px] bg-gradient-to-br from-rose-50/80 via-orange-50/40 to-tint-rose/50 dark:from-tint-rose/20 dark:via-surface-soft dark:to-surface-muted overflow-hidden flex items-center justify-center">
              <Image
                src={breed.image || petSpecies?.image || "/CareGuideCard/dog-faq-mascot.png"}
                alt={breed.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />

              {/* Decorative Paw Print Overlay */}
              <PawPrint className="absolute right-4 top-4 text-white/30 dark:text-card/30 size-20 pointer-events-none rotate-12" />

              {/* Badges on Photo */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-xs text-xs font-bold text-coral border border-coral/20">
                  <Heart className="size-3.5 fill-coral text-coral" />
                  {formattedCareBadgeText}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-xs text-xs font-bold text-ink border border-border-peach">
                  <Feather className="size-3.5 text-coral" />
                  {formattedSizeBadgeText}
                </span>
              </div>
            </div>

            {/* Content Details Area */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Title & Classification */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Link
                      href={`/admin/pet-catalog/${typeId}`}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-coral/10 text-coral font-bold text-xs hover:bg-coral/20 transition-colors"
                    >
                      <Layers className="size-3" />
                      {speciesName}
                    </Link>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs border border-emerald-500/20">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Status: Active
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold font-quicksand text-ink tracking-tight">
                    {breed.name}
                  </h1>

                  <p className="text-sm text-ink-muted flex items-center gap-1.5 mt-1 font-medium">
                    <MapPin className="size-4 text-coral shrink-0" />
                    <span>
                      {flag} {breed.originCountry || "Worldwide Origin"}
                    </span>
                  </p>
                </div>

                {/* Description Narrative */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-quicksand">
                    Overview & Description
                  </h4>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {breed.shortDescription ||
                      "Standard companion breed registered with standardized profile traits, temperament, and care parameters across the PetNest admin catalog."}
                  </p>
                </div>

                {/* Temperament Traits */}
                {temperamentTraits.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-quicksand">
                      Temperament Traits
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {temperamentTraits.map((trait) => (
                        <span
                          key={trait}
                          className="px-3 py-1 rounded-full bg-tint-rose text-coral text-xs font-bold border border-coral/20"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search & Recommendation Tags */}
                {breed.tags && breed.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-quicksand">
                      Catalog Keywords & Tags
                    </h4>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {breed.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-md bg-surface-soft text-ink-muted text-xs font-semibold border border-border-peach/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Loved by Pet Lovers Strip */}
              <div className="p-3 rounded-xl bg-tint-rose/40 border border-border-peach/80 flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5 font-bold text-ink">
                  <Sparkles className="size-4 text-coral" />
                  Verified PetNest Companion Standard
                </span>
                <span className="flex items-center gap-1.5 text-coral font-bold">
                  <Heart className="size-3.5 fill-coral text-coral" />
                  Loved by Pet Lovers
                </span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Key Specifications & Metadata Grid */}
      <AnimatedContainer delay={0.15}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Size Category"
            value={formattedSizeBadgeText}
            trendText={formattedSizeText}
            trendType="positive"
            icon={<Feather className="size-5" />}
          />
          <StatsCard
            title="Care Requirement"
            value={formattedCareBadgeText}
            trendText={formattedCareText}
            trendType="positive"
            icon={<Heart className="size-5 text-coral" />}
          />
          <StatsCard
            title="Origin & Region"
            value={breed.originCountry || "Worldwide"}
            trendText={`${flag} Native companion heritage`}
            trendType="positive"
            icon={<MapPin className="size-5" />}
          />
          <StatsCard
            title="Profile Classification"
            value="Active Standard"
            trendText={`Created ${formattedDate(breed.createdAt)}`}
            trendType="positive"
            icon={<Award className="size-5" />}
          />
        </div>
      </AnimatedContainer>

      {/* Connected Care Guides Section (Future-Ready Slot) */}
      <AnimatedContainer delay={0.2}>
        <div className="p-6 rounded-2xl bg-card border border-border-peach space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
                <BookOpen className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base font-quicksand">
                  Connected Care Guides
                </h3>
                <p className="text-xs text-ink-muted">
                  Veterinary healthcare guides, nutrition regimens, and training modules.
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Guide Integration Coming Soon
            </span>
          </div>

          <div className="p-8 text-center rounded-xl bg-surface-soft/60 border border-dashed border-border-peach space-y-3">
            <BookOpen className="size-10 text-ink-faint mx-auto opacity-50" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-ink font-quicksand">
                No Guides Linked to {breed.name} Yet
              </p>
              <p className="text-xs text-ink-muted max-w-md mx-auto">
                Detailed care, feeding, grooming, and health guides will be linked to this breed profile here.
              </p>
            </div>
            <div className="pt-2">
              <PrimaryButton
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/guides")}
                leftIcon={<ExternalLink className="size-3.5" />}
              >
                Browse Care Guides
              </PrimaryButton>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Delete Confirmation Modal */}
      <BreedDeleteModal
        breed={isDeleteModalOpen ? (breed as PetBreed) : null}
        speciesName={speciesName}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => {
          setIsDeleteModalOpen(false);
          router.push(`/admin/pet-catalog/${typeId}`);
        }}
      />
    </div>
  );
}
