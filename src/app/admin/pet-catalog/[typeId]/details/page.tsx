"use client";

import React, { use, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import { cn } from "@/lib/utils";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useFindOneSpeciesQuery,
  useFindBreedsBySpeciesQuery,
} from "@/store/Api/Pets/pets.api";
import {
  useFindGuidesBySpeciesQuery,
  useUpdateGuideMutation,
} from "@/store/Api/Guides/guides.api";
import type { GuideSummary } from "@/store/Api/Guides/guides.types";
import { SpeciesDeleteModal } from "@/components/admin/pet-catalog/SpeciesModals";
import type { PetSpecies } from "@/store/Api/Pets/pets.types";
import { toast } from "sonner";
import {
  PawPrint,
  Heart,
  Layers,
  ArrowLeft,
  ArrowRight,
  Pencil,
  Trash2,
  BookOpen,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Plus,
  AlertCircle,
  ExternalLink,
  MapPin,
  Feather,
} from "lucide-react";

export default function SpeciesDetailsPage({
  params,
}: {
  params: Promise<{ typeId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();
  const { typeId } = resolvedParams;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch species info
  const {
    data: speciesResponse,
    isLoading: isLoadingSpecies,
    isError: isSpeciesError,
    refetch: refetchSpecies,
  } = useFindOneSpeciesQuery(typeId, { skip: !typeId });
  const petSpecies = speciesResponse?.data;

  // Fetch breeds for this species
  const {
    data: breedsResponse,
    isLoading: isLoadingBreeds,
  } = useFindBreedsBySpeciesQuery(
    { speciesIdOrSlug: typeId, query: { limit: 8 } },
    { skip: !typeId }
  );
  const breeds = breedsResponse?.data?.items || [];
  const totalBreedsCount =
    breedsResponse?.data?.meta?.total ??
    petSpecies?.breeds?.length ??
    petSpecies?._count?.breeds ??
    breeds.length;

  // Fetch connected care guides for this species
  const {
    data: guidesResponse,
    isLoading: isLoadingGuides,
  } = useFindGuidesBySpeciesQuery(
    {
      speciesIdOrSlug: typeId,
      query: { limit: 100, sortBy: "displayOrder", sortOrder: "asc" },
    },
    { skip: !typeId }
  );
  const guidesPayload = (guidesResponse?.data as any)?.items
    ? (guidesResponse?.data as any)
    : (guidesResponse?.data as any)?.data;
  const connectedGuides: GuideSummary[] = guidesPayload?.items || [];
  const totalGuides =
    guidesPayload?.meta?.total ?? connectedGuides.length;

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

  const speciesDisplayName = petSpecies?.name || "Pet Classification";

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
        render: (guide) =>
          guide.category?.name ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-quicksand bg-coral/10 text-coral border border-coral/20">
              {guide.category.name}
            </span>
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
        render: (guide) => {
          const status = guide.status || "PUBLISHED";
          const isPub = status === "PUBLISHED";
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-quicksand border",
                isPub
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isPub ? "bg-emerald-500" : "bg-amber-500"
                )}
              />
              {status}
            </span>
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

  // Dynamic header action buttons
  useEffect(() => {
    setHeaderAction(
      <div className="flex items-center gap-2">
        <PrimaryButton
          variant="outline"
          size="sm"
          onClick={() => router.push(`/admin/pet-catalog/${typeId}`)}
          leftIcon={<Layers className="size-4 text-coral" />}
          className="font-bold cursor-pointer"
        >
          View Registered Breeds
        </PrimaryButton>
        <PrimaryButton
          variant="primary"
          size="sm"
          onClick={() => router.push(`/admin/pet-catalog/${typeId}/edit`)}
          leftIcon={<Pencil className="size-4" />}
          className="font-bold cursor-pointer"
        >
          Edit Classification
        </PrimaryButton>
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          title="Delete Classification"
          aria-label="Delete Classification"
          className="size-9 rounded-full border border-red-200 hover:border-destructive bg-card hover:bg-rose-50 dark:hover:bg-rose-950/30 text-destructive flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    );

    return () => setHeaderAction(null);
  }, [router, setHeaderAction, typeId]);

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

  if (isLoadingSpecies) {
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

  if (isSpeciesError || !petSpecies) {
    return (
      <div className="p-12 text-center rounded-xl bg-card border border-border-peach space-y-4">
        <AlertCircle className="size-12 text-coral mx-auto" />
        <h3 className="text-lg font-bold font-quicksand text-ink">
          Pet Classification Not Found
        </h3>
        <p className="text-xs text-ink-muted max-w-md mx-auto">
          The requested species record could not be loaded. It may have been removed or the ID is invalid.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <PrimaryButton
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/pet-catalog")}
            leftIcon={<ArrowLeft className="size-4" />}
          >
            Back to Pet Catalog
          </PrimaryButton>
          <PrimaryButton variant="primary" size="sm" onClick={() => refetchSpecies()}>
            Retry
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Classification Banner Card */}
      <AnimatedContainer delay={0.05}>
        <div className="bg-card border border-border-peach rounded-2xl overflow-hidden shadow-xs relative">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Mascot Area */}
            <div className="lg:col-span-5 relative h-72 sm:h-80 lg:h-auto min-h-[280px] bg-gradient-to-br from-rose-50/80 via-orange-50/40 to-tint-rose/50 dark:from-tint-rose/20 dark:via-surface-soft dark:to-surface-muted overflow-hidden flex items-center justify-center">
              <Image
                src={petSpecies.image || "/CareGuideCard/dog-faq-mascot.png"}
                alt={petSpecies.name}
                fill
                className="object-contain p-6 drop-shadow-md"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />

              {/* Decorative Paw Print Overlay */}
              <PawPrint className="absolute right-4 top-4 text-white/30 dark:text-card/30 size-20 pointer-events-none rotate-12" />

              {/* Badges on Banner */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-xs text-xs font-bold text-coral border border-coral/20">
                  <Award className="size-3.5 fill-coral text-coral" />
                  {totalBreedsCount} Registered Breeds
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-xs text-xs font-bold text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  Verified Standard
                </span>
              </div>
            </div>

            {/* Content Details Area */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Title & Taxonomy Header */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tint-rose text-coral font-bold text-xs border border-coral/15">
                      <Layers className="size-3" />
                      Taxonomy Class
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-soft text-ink-muted font-mono text-[11px] border border-border-peach">
                      /{petSpecies.slug}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold font-quicksand text-ink tracking-tight">
                    {petSpecies.name}
                  </h1>

                  {petSpecies.scientificGroup && (
                    <p className="text-sm text-ink-muted italic font-medium mt-1">
                      Scientific Name: {petSpecies.scientificGroup}
                    </p>
                  )}
                </div>

                {/* Description Narrative */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-quicksand">
                    Overview & Classification Summary
                  </h4>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {petSpecies.shortDescription ||
                      "Standard companion species profile registered in the PetNest admin catalog. Manages breed registries, taxonomy standards, and associated pet care knowledge."}
                  </p>
                </div>

                {/* Classification Metadata */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-surface-soft/60 border border-border-peach/60 space-y-0.5">
                    <span className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">
                      Database ID
                    </span>
                    <p className="font-mono text-xs text-ink truncate">
                      {petSpecies.id}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-soft/60 border border-border-peach/60 space-y-0.5">
                    <span className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">
                      Catalog Registry Date
                    </span>
                    <p className="font-semibold text-xs text-ink">
                      {formattedDate(petSpecies.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Call-to-action bar */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-coral/10 via-surface-soft to-tint-rose/40 border border-coral/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <PawPrint className="size-5 text-coral shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-ink">
                      Manage {speciesDisplayName} Breeds
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      {totalBreedsCount} standardized breeds registered in catalog
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <PrimaryButton
                    variant="primary"
                    size="sm"
                    onClick={() => router.push(`/admin/pet-catalog/${typeId}`)}
                    rightIcon={<ArrowRight className="size-3.5" />}
                    className="text-xs font-bold"
                  >
                    View All Breeds
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Stats Cards Row */}
      <AnimatedContainer delay={0.15}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Registered Breeds"
            value={`${totalBreedsCount} Breeds`}
            trendText="Standardized profiles in catalog"
            trendType="positive"
            icon={<Award className="size-5" />}
          />
          <StatsCard
            title="Scientific Group"
            value={petSpecies.scientificGroup ? "Documented" : "General"}
            trendText={petSpecies.scientificGroup || "Standard Classification"}
            trendType="positive"
            icon={<Layers className="size-5" />}
          />
          <StatsCard
            title="Catalog Status"
            value="Active & Verified"
            trendText="Visible in search & filters"
            trendType="positive"
            icon={<CheckCircle2 className="size-5 text-emerald-500" />}
          />
          <StatsCard
            title="Registry Standards"
            value="100% Up to Date"
            trendText={`Last updated ${formattedDate(petSpecies.updatedAt)}`}
            trendType="positive"
            icon={<Clock className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      {/* Registered Breeds Section with Quick Preview Grid */}
      <AnimatedContainer delay={0.2}>
        <div className="p-6 rounded-2xl bg-card border border-border-peach space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-ink text-base font-quicksand flex items-center gap-2">
                <PawPrint className="size-4.5 text-coral" />
                Registered Breeds ({totalBreedsCount})
              </h3>
              <p className="text-xs text-ink-muted">
                Companion profiles and breeds under the {speciesDisplayName} classification.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <PrimaryButton
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/pet-catalog/${typeId}/new-breed`)}
                leftIcon={<Plus className="size-3.5 text-coral" />}
                className="text-xs font-bold"
              >
                Add Breed
              </PrimaryButton>
              <PrimaryButton
                variant="primary"
                size="sm"
                onClick={() => router.push(`/admin/pet-catalog/${typeId}`)}
                rightIcon={<ArrowRight className="size-3.5" />}
                className="text-xs font-bold"
              >
                View Catalog Grid
              </PrimaryButton>
            </div>
          </div>

          {isLoadingBreeds ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-surface-muted rounded-xl" />
              ))}
            </div>
          ) : breeds.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-surface-soft/60 border border-dashed border-border-peach space-y-3">
              <PawPrint className="size-10 text-ink-faint mx-auto opacity-50" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-ink font-quicksand">
                  No Breeds Registered Yet
                </p>
                <p className="text-xs text-ink-muted max-w-md mx-auto">
                  Add the first breed profile for {speciesDisplayName} to make it available in the pet catalog.
                </p>
              </div>
              <div className="pt-2">
                <PrimaryButton
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(`/admin/pet-catalog/${typeId}/new-breed`)}
                  leftIcon={<Plus className="size-4" />}
                >
                  Add First Breed
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {breeds.slice(0, 8).map((breed) => (
                <Link
                  key={breed.id}
                  href={`/admin/pet-catalog/${typeId}/breed/${breed.id}`}
                  className="p-3 rounded-xl bg-surface-soft/60 hover:bg-tint-rose/40 border border-border-peach/70 hover:border-coral/50 flex items-center gap-3 transition-all duration-200 group"
                >
                  <div className="relative size-12 rounded-lg bg-surface-muted overflow-hidden shrink-0 border border-border-peach/50">
                    <Image
                      src={breed.image || petSpecies.image || "/CareGuideCard/dog-faq-mascot.png"}
                      alt={breed.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-sm text-ink group-hover:text-coral transition-colors truncate font-quicksand">
                      {breed.name}
                    </h5>
                    <p className="text-[11px] text-ink-muted flex items-center gap-1 truncate">
                      <MapPin className="size-3 text-coral shrink-0" />
                      {breed.originCountry || "Worldwide"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </AnimatedContainer>

      {/* Connected Care Guides Section */}
      <AnimatedContainer delay={0.25}>
        <DynamicTable
          title="Connected Care Guides"
          countBadge={totalGuides}
          data={localGuides.length > 0 ? localGuides : connectedGuides}
          columns={guideColumns}
          loading={isLoadingGuides}
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
              className="group bg-card rounded-2xl border border-border-peach overflow-hidden shadow-2xs hover:shadow-md hover:border-coral/50 transition-all duration-200 flex flex-col justify-between h-full"
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
                    className="font-bold text-sm sm:text-base text-ink line-clamp-2 hover:text-coral transition-colors font-quicksand leading-snug"
                  >
                    {guide.title}
                  </Link>
                  {guide.excerpt && (
                    <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                      {guide.excerpt}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border-peach text-xs">
                  <span className="text-ink-muted truncate font-medium">
                    By {guide.author?.name || "PetNest Team"}
                  </span>
                  <Link
                    href={`/admin/guides/${guide.id}`}
                    className="text-coral hover:underline font-bold text-xs inline-flex items-center gap-1 group-hover:underline"
                  >
                    View Guide <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}
          emptyMessage={`No guides linked to ${speciesDisplayName} yet.`}
        />
      </AnimatedContainer>

      {/* Delete Confirmation Modal */}
      <SpeciesDeleteModal
        species={isDeleteModalOpen ? (petSpecies as PetSpecies) : null}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => {
          setIsDeleteModalOpen(false);
          router.push("/admin/pet-catalog");
        }}
      />
    </div>
  );
}
