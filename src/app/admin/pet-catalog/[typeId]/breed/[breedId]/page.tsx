"use client";

import React, { use, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import DynamicTable, { Column, TableBadge } from "@/components/common/DynamicTable";
import { cn } from "@/lib/utils";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useFindOneSpeciesQuery,
  useFindOneBreedQuery,
} from "@/store/Api/Pets/pets.api";
import {
  useFindGuidesByBreedQuery,
  useUpdateGuideMutation,
} from "@/store/Api/Guides/guides.api";
import type { GuideSummary } from "@/store/Api/Guides/guides.types";
import { BreedDeleteModal } from "@/components/admin/pet-catalog/BreedModals";
import { COUNTRIES } from "@/lib/data/countries";
import type { PetBreed } from "@/store/Api/Pets/pets.types";
import { toast } from "sonner";
import {
  PawPrint,
  Heart,
  MapPin,
  Feather,
  ArrowLeft,
  Pencil,
  Trash2,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Tag,
  AlertCircle,
  ExternalLink,
  Layers,
  ShieldAlert,
  Plus,
  ArrowRight,
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

  // Fetch guides linked to this specific breed
  const {
    data: breedGuidesResponse,
    isLoading: isLoadingBreedGuides,
  } = useFindGuidesByBreedQuery(
    {
      breedIdOrSlug: breedId,
      query: { limit: 100, sortBy: "displayOrder", sortOrder: "asc" },
    },
    { skip: !breedId }
  );
  const breedGuidesPayload = (breedGuidesResponse?.data as any)?.items
    ? (breedGuidesResponse?.data as any)
    : (breedGuidesResponse?.data as any)?.data;
  const connectedGuides: GuideSummary[] = breedGuidesPayload?.items || [];
  const totalGuides =
    breedGuidesPayload?.meta?.total ?? connectedGuides.length;

  const [localGuides, setLocalGuides] = useState<GuideSummary[]>([]);
  const [updateGuide] = useUpdateGuideMutation();

  useEffect(() => {
    if (connectedGuides.length > 0) {
      setLocalGuides(connectedGuides);
    }
  }, [connectedGuides]);

  const handleRowReorder = async (
    reordered: GuideSummary[],
    _fromIndex: number,
    _toIndex: number
  ) => {
    setLocalGuides(reordered);

    try {
      const updates = reordered
        .map((guide, idx) => ({ guide, newOrder: idx + 1 }))
        .filter(({ guide, newOrder }) => (guide.displayOrder ?? 0) !== newOrder);

      if (updates.length === 0) return;

      await Promise.all(
        updates.map(({ guide, newOrder }) =>
          updateGuide({
            id: guide.id,
            payload: { displayOrder: newOrder },
          }).unwrap()
        )
      );

      toast.success("Guide display order updated");
    } catch {
      setLocalGuides(connectedGuides);
      toast.error("Failed to update guide order");
    }
  };

  const speciesName = petSpecies?.name || breed?.species?.name || "Breeds";
  const formattedCareBadgeText = formatCareBadge(breed?.careLevel);
  const formattedCareText = formatCareLevel(breed?.careLevel);
  const formattedSizeBadgeText = formatSizeBadge(breed?.size);
  const formattedSizeText = formatSize(breed?.size);
  const flag = getCountryFlag(breed?.originCountry);

  const guideColumns: Column<GuideSummary>[] = useMemo(
    () => [
      {
        key: "title",
        label: "Guide",
        align: "left",
        sortable: true,
        render: (guide) => (
          <div className="flex items-center gap-2.5 sm:gap-3 py-1 min-w-[200px] max-w-[260px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[500px]">
            {guide.coverImage ? (
              <div className="relative size-10 sm:size-12 rounded-lg bg-surface-muted overflow-hidden shrink-0 border border-border-peach">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={guide.coverImage}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="size-10 sm:size-12 rounded-lg bg-coral/10 text-coral flex items-center justify-center shrink-0 border border-coral/20">
                <BookOpen className="size-4 sm:size-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link
                href={`/admin/guides/${guide.id}`}
                className="font-bold text-xs sm:text-sm text-ink hover:text-coral transition-colors line-clamp-2 sm:line-clamp-1 font-quicksand leading-snug"
                title={guide.title}
              >
                {guide.title}
              </Link>
              {guide.excerpt && (
                <p className="text-[11px] sm:text-xs text-ink-muted line-clamp-1 mt-0.5 leading-snug">
                  {guide.excerpt}
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        key: "category",
        label: "Category",
        align: "center",
        sortable: true,
        width: "180px",
        render: (guide) =>
          guide.category?.name ? (
            <TableBadge variant="coral" width="w-40">
              {guide.category.name}
            </TableBadge>
          ) : (
            <span className="text-xs text-ink-muted">—</span>
          ),
      },
      {
        key: "author",
        label: "Author",
        align: "center",
        render: (guide) => (
          <span className="text-xs font-semibold text-ink">
            {guide.author?.name || "PetNest Team"}
          </span>
        ),
      },
      {
        key: "readTimeMinutes",
        label: "Read Time",
        align: "center",
        sortable: true,
        render: (guide) => (
          <span className="text-xs font-medium text-ink-muted flex items-center justify-center gap-1">
            <Clock className="size-3.5 text-coral/70" />
            {guide.readTimeMinutes || 5} min read
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",
        align: "center",
        sortable: true,
        width: "150px",
        render: (guide) => {
          const status = guide.status || "PUBLISHED";
          const isPub = status === "PUBLISHED";
          return (
            <TableBadge
              variant={isPub ? "success" : "warning"}
              dot
              width="w-32"
            >
              {status}
            </TableBadge>
          );
        },
      },
      {
        key: "actions",
        label: "Action",
        align: "center",
        render: (guide) => (
          <Link
            href={`/admin/guides/${guide.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-coral hover:bg-coral/10 border border-coral/20 transition-all font-quicksand"
          >
            Read
            <ExternalLink className="size-3" />
          </Link>
        ),
      },
    ],
    []
  );

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
        <div className="h-72 w-full bg-card border border-border-peach rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-card border border-border-peach rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isBreedError || !breed) {
    return (
      <div className="p-12 text-center rounded-lg bg-card border border-border-peach space-y-4">
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
      {/* Hero Profile Banner Card */}
      <AnimatedContainer delay={0.05}>
        <div className="bg-card border border-border-peach rounded-lg overflow-hidden shadow-xs relative">
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
                  <Award className="size-4 text-coral" />
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

      {/* Connected Care Guides Section */}
      <AnimatedContainer delay={0.2}>
        <DynamicTable
          title="Connected Care Guides"
          countBadge={totalGuides}
          data={localGuides.length > 0 ? localGuides : connectedGuides}
          columns={guideColumns}
          loading={isLoadingBreedGuides}
          enableViewToggle
          defaultViewMode="table"
          reorderable
          rowNumberHeader="No."
          onRowReorder={handleRowReorder}
          searchable
          searchPlaceholder="Search connected care guides..."
          pagination
          showFilterButton={false}
          gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          renderGridCard={(guide) => (
            <div
              key={guide.id}
              className="group bg-card rounded-lg border border-border-peach overflow-hidden shadow-2xs hover:shadow-md hover:border-coral/50 transition-all duration-200 flex flex-col justify-between h-full"
            >
              {guide.coverImage && (
                <div className="relative h-44 w-full bg-surface-muted overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={guide.coverImage}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {guide.category?.name ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold font-quicksand bg-coral/10 text-coral border border-coral/20">
                        {guide.category.name}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-[11px] font-semibold text-ink-muted">
                      {guide.readTimeMinutes || 5} min read
                    </span>
                  </div>
                  <Link
                    href={`/admin/guides/${guide.id}`}
                    className="font-bold text-sm sm:text-base text-ink group-hover:text-coral transition-colors line-clamp-2 font-quicksand leading-snug"
                  >
                    {guide.title}
                  </Link>
                  {guide.excerpt && (
                    <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                      {guide.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-border-peach/60 flex items-center justify-between text-xs text-ink-muted">
                  <span className="truncate max-w-[140px] font-medium">
                    By {guide.author?.name || "PetNest Team"}
                  </span>
                  <Link
                    href={`/admin/guides/${guide.id}`}
                    className="text-coral hover:text-coral-dark font-bold text-xs inline-flex items-center gap-1 group-hover:underline"
                  >
                    Read
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}
          emptyMessage={`No guides linked to ${breed.name} yet.`}
        />
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
