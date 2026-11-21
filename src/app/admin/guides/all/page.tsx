"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import FormSelect from "@/components/common/FormSelect";
import SearchField, {
  type SearchSuggestionItem,
} from "@/components/common/SearchField";
import Pagination from "@/components/common/Pagination";
import { StatsCard } from "@/components/common/StatsCard";
import ConfirmModal from "@/components/reuseable/ConfirmModal";
import { getCategoryIcon } from "@/components/admin/guides/CategoryIcons";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useFindAllEditorialQuery,
  useGetEditorialStatsQuery,
  useFindAllCategoriesPublicQuery,
  useDeleteGuideMutation,
} from "@/store/Api/Guides/guides.api";
import type {
  GuideStatus,
  GuideSummary,
} from "@/store/Api/Guides/guides.types";
import {
  useAllSpeciesDropdown,
  useBreedsBySpeciesDropdown,
} from "@/hooks/usePetQueries";
import {
  BookOpen,
  Plus,
  Filter,
  Eye,
  Pencil,
  ThumbsUp,
  HelpCircle,
  Trash2,
  RotateCcw,
  Bookmark,
  FileArchive,
} from "lucide-react";
import { toast } from "sonner";
import BulkGuideImportModal from "@/components/admin/guides/BulkGuideImportModal";
import GuideStatusDropdown from "@/components/admin/guides/GuideStatusDropdown";
import GuideCategoryDropdown from "@/components/admin/guides/GuideCategoryDropdown";
import GuideSpeciesDropdown from "@/components/admin/guides/GuideSpeciesDropdown";
import GuideBreedDropdown from "@/components/admin/guides/GuideBreedDropdown";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PUBLISHED", label: "Published" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "DRAFT", label: "Draft" },
  { value: "NEEDS_REVISION", label: "Needs Revision" },
  { value: "ARCHIVED", label: "Archived" },
];

const SORT_OPTIONS = [
  { value: "updatedAt:desc", label: "Recently Updated" },
  { value: "displayOrder:asc", label: "Display Order (1st First)" },
  { value: "createdAt:desc", label: "Newest Created" },
  { value: "viewCount:desc", label: "Most Viewed" },
  { value: "likeCount:desc", label: "Most Liked" },
  { value: "title:asc", label: "Title (A–Z)" },
];

const STATUS_BADGE_MAP: Record<
  GuideStatus,
  { label: string; className: string }
> = {
  PUBLISHED: {
    label: "Published",
    className: "bg-tint-mint text-success border border-success/30",
  },
  IN_REVIEW: {
    label: "In Review",
    className: "bg-tint-sky text-info border border-info/30",
  },
  DRAFT: {
    label: "Draft",
    className: "bg-surface-muted text-ink-muted border border-border-peach",
  },
  NEEDS_REVISION: {
    label: "Needs Revision",
    className: "bg-tint-cream text-warning border border-warning/30",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-surface-muted text-ink-faint border border-border-peach",
  },
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AllGuidesPage() {
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();

  // Filter & pagination state
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [breedFilter, setBreedFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortValue, setSortValue] = useState("updatedAt:desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(10);

  // Delete confirmation modal state
  const [guideToDelete, setGuideToDelete] = useState<GuideSummary | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const [sortBy, sortOrder] = useMemo(() => {
    const [field, order] = sortValue.split(":");
    return [field || "updatedAt", (order === "asc" ? "asc" : "desc") as "asc" | "desc"];
  }, [sortValue]);

  // Real API queries
  const {
    data: guidesResponse,
    isLoading: isLoadingGuides,
    isFetching: isFetchingGuides,
  } = useFindAllEditorialQuery({
    page,
    limit: pageSize === "all" ? 1000 : pageSize,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(categoryFilter ? { category: categoryFilter } : {}),
    ...(speciesFilter ? { species: speciesFilter } : {}),
    ...(breedFilter ? { breed: breedFilter } : {}),
    ...(statusFilter ? { status: statusFilter as GuideStatus } : {}),
    sortBy,
    sortOrder,
  });

  const { data: statsResponse, isLoading: isLoadingStats } =
    useGetEditorialStatsQuery();
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useFindAllCategoriesPublicQuery();
  const { data: speciesList = [], isLoading: isLoadingSpecies } =
    useAllSpeciesDropdown();
  const { data: breedList = [], isLoading: isLoadingBreeds } =
    useBreedsBySpeciesDropdown(speciesFilter);

  const [deleteGuide, { isLoading: isDeleting }] = useDeleteGuideMutation();

  const guides = useMemo(
    () => guidesResponse?.data?.items || [],
    [guidesResponse]
  );
  const meta = guidesResponse?.data?.meta;
  const stats = statsResponse?.data;
  const categories = useMemo(
    () => categoriesResponse?.data || [],
    [categoriesResponse]
  );

  // Dropdown options
  const categoryOptions = useMemo(
    () => [
      { value: "", label: "All Categories" },
      ...categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    ],
    [categories]
  );

  const speciesOptions = useMemo(
    () => [
      { value: "", label: "All Species" },
      ...speciesList.map((sp) => ({
        value: sp.id,
        label: sp.name,
        icon: sp.image ? (
          <span className="relative size-5 rounded-full overflow-hidden border border-border-peach bg-surface-muted shrink-0 inline-block">
            <Image
              src={sp.image}
              alt={sp.name}
              fill
              unoptimized
              className="object-cover"
            />
          </span>
        ) : (
          <span className="size-5 rounded-full bg-coral/10 text-coral font-bold text-xs flex items-center justify-center shrink-0">
            {sp.name.charAt(0)}
          </span>
        ),
      })),
    ],
    [speciesList]
  );

  const breedOptions = useMemo(
    () => [
      { value: "", label: "All Breeds" },
      ...breedList.map((b) => ({
        value: b.id,
        label: b.name,
        icon: b.image ? (
          <span className="relative size-5 rounded-full overflow-hidden border border-border-peach bg-surface-muted shrink-0 inline-block">
            <Image
              src={b.image}
              alt={b.name}
              fill
              unoptimized
              className="object-cover"
            />
          </span>
        ) : (
          <span className="size-5 rounded-full bg-coral/10 text-coral font-bold text-xs flex items-center justify-center shrink-0">
            {b.name.charAt(0)}
          </span>
        ),
      })),
    ],
    [breedList]
  );

  // Live search suggestions for SearchField popover
  const searchSuggestions: SearchSuggestionItem[] = useMemo(() => {
    if (!searchInput.trim()) return [];
    return guides.slice(0, 6).map((g) => ({
      id: g.id,
      title: g.title,
      subtitle: `${g.category?.name || "General"} • ${g.readTimeMinutes || 1} min read`,
      image: g.coverImage || undefined,
      badge: STATUS_BADGE_MAP[g.status]?.label || g.status,
      onClick: () => router.push(`/admin/guides/${g.id}`),
    }));
  }, [guides, searchInput, router]);

  const activeFilterCount = [
    categoryFilter,
    speciesFilter,
    breedFilter,
    statusFilter,
    debouncedSearch,
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setCategoryFilter("");
    setSpeciesFilter("");
    setBreedFilter("");
    setStatusFilter("");
    setSortValue("updatedAt:desc");
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!guideToDelete) return;
    try {
      await deleteGuide(guideToDelete.id).unwrap();
      toast.success(`Guide "${guideToDelete.title}" deleted successfully.`);
      setGuideToDelete(null);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to delete guide. Please try again.";
      toast.error(errorMsg);
    }
  };

  // Header actions
  useEffect(() => {
    setHeaderAction(
      <div className="flex items-center gap-2">
        <PrimaryButton
          variant="outline"
          size="sm"
          rounded="md"
          leftIcon={<FileArchive className="size-4 text-coral" />}
          onClick={() => setIsBulkImportOpen(true)}
          className="font-bold cursor-pointer"
        >
          Bulk Import (.zip)
        </PrimaryButton>
        <Link href="/admin/guides/create">
          <PrimaryButton
            variant="primary"
            size="sm"
            rounded="md"
            leftIcon={<Plus className="size-4" />}
            className="font-bold cursor-pointer"
          >
            Write New Guide
          </PrimaryButton>
        </Link>
      </div>
    );

    return () => setHeaderAction(null);
  }, [setHeaderAction]);

  // Derived real stats
  const totalGuidesCount = stats
    ? stats.publishedCount +
      stats.inReviewCount +
      stats.draftCount +
      stats.needsRevisionCount
    : meta?.total ?? 0;

  // Table columns
  const columns: Column<GuideSummary>[] = [
    {
      key: "title",
      label: "Title & Topic",
      sortable: true,
      render: (row) => {
        const CategoryIcon = getCategoryIcon(row.category?.icon);
        return (
          <div className="flex items-center gap-2.5 min-w-[220px]">
            {row.coverImage ? (
              <div className="relative size-10 rounded-lg overflow-hidden border border-border-peach bg-surface-muted shrink-0">
                <Image
                  src={row.coverImage}
                  alt={row.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="size-10 rounded-lg bg-tint-rose border border-coral/20 flex items-center justify-center text-coral shrink-0">
                <CategoryIcon className="size-5" />
              </div>
            )}
            <div className="min-w-0">
              <Link
                href={`/admin/guides/${row.id}`}
                className="font-bold text-ink hover:text-coral transition-colors leading-tight line-clamp-1"
              >
                {row.title}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs">
                <span className="text-ink-muted">
                  {row.readTimeMinutes || 1} min read
                </span>
                {row.displayOrder > 0 && (
                  <>
                    <span className="text-ink-faint">•</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-tint-mint text-success border border-success/30">
                      Order #{row.displayOrder}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      align: "center",
      width: "170px",
      render: (row) => (
        <GuideCategoryDropdown
          guideId={row.id}
          currentCategoryId={row.category?.id}
          currentCategoryName={row.category?.name}
          currentCategoryIcon={row.category?.icon}
          guideTitle={row.title}
        />
      ),
    },
    {
      key: "species",
      label: "Species",
      sortable: true,
      align: "center",
      width: "170px",
      render: (row) => (
        <GuideSpeciesDropdown
          guideId={row.id}
          currentSpeciesId={row.species?.id}
          currentSpeciesName={row.species?.name}
          guideTitle={row.title}
        />
      ),
    },
    {
      key: "breeds",
      label: "Breed",
      sortable: false,
      align: "center",
      width: "170px",
      render: (row) => (
        <GuideBreedDropdown
          guideId={row.id}
          speciesId={row.species?.id}
          speciesName={row.species?.name}
          currentBreedIds={row.breeds?.map((b) => b.id) || []}
          currentBreeds={row.breeds || []}
          guideTitle={row.title}
        />
      ),
    },
    {
      key: "author",
      label: "Author",
      render: (row) => {
        const isSuper = row.author?.role?.toUpperCase() === "SUPERADMIN";
        const displayName = isSuper
          ? "Super Admin"
          : row.author?.name || "Unknown";
        return (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-ink">
              {displayName}
            </span>
            <span className="text-xs text-ink-faint uppercase">
              {isSuper ? "Superadmin" : row.author?.role || "Author"}
            </span>
          </div>
        );
      },
    },
    {
      key: "viewCount",
      label: "Views",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="font-semibold text-xs text-ink">
          {(row.viewCount ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "likeCount",
      label: "Reactions",
      sortable: true,
      align: "center",
      render: (row) => (
        <div className="inline-flex items-center gap-2.5 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1" title="Likes">
            <ThumbsUp className="size-3.5 text-coral" />
            {(row.likeCount ?? 0).toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1" title="Bookmarks">
            <Bookmark className="size-3.5 text-ink-faint" />
            {(row.bookmarkCount ?? 0).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      align: "center",
      width: "170px",
      render: (row) => (
        <GuideStatusDropdown
          guideId={row.id}
          currentStatus={row.status}
          guideTitle={row.title}
        />
      ),
    },
    {
      key: "updatedAt",
      label: "Last Updated",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs text-ink-muted whitespace-nowrap">
          {formatDate(row.updatedAt || row.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Real Editorial Stats Cards */}
      <AnimatedContainer delay={0.05}>
        {isLoadingStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-card border border-border-peach p-5 animate-pulse space-y-3"
              >
                <div className="h-3.5 w-28 bg-surface-muted rounded" />
                <div className="h-7 w-36 bg-surface-muted rounded" />
                <div className="h-3 w-44 bg-surface-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Guides"
              value={`${totalGuidesCount.toLocaleString()} ${
                totalGuidesCount === 1 ? "Article" : "Articles"
              }`}
              trendText={`${stats?.publishedCount ?? 0} published • ${
                stats?.draftCount ?? 0
              } drafts`}
              trendType="positive"
              icon={<BookOpen className="size-5" />}
            />
            <StatsCard
              title="Lifetime Reader Views"
              value={(stats?.totalViews ?? 0).toLocaleString()}
              trendText={`${(
                stats?.totalBookmarks ?? 0
              ).toLocaleString()} reader bookmarks`}
              trendType="positive"
              icon={<Eye className="size-5" />}
            />
            <StatsCard
              title="Reader Reactions"
              value={(stats?.totalLikes ?? 0).toLocaleString()}
              trendText={`${stats?.inReviewCount ?? 0} awaiting review`}
              trendType="positive"
              icon={<ThumbsUp className="size-5" />}
            />
            <StatsCard
              title="Guide FAQs"
              value="0"
              trendText="Pending API integration"
              trendType="neutral"
              icon={<HelpCircle className="size-5" />}
            />
          </div>
        )}
      </AnimatedContainer>

      {/* Master Guides Directory: Reusable DynamicTable with unified Search & Filter By toolbar */}
      <AnimatedContainer delay={0.1}>
        <DynamicTable
          data={guides}
          columns={columns}
          loading={isLoadingGuides}
          showRowNumber
          rowNumberOffset={(page - 1) * (pageSize === "all" ? 0 : pageSize)}
          searchable
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchSuggestions={searchSuggestions}
          searchLoading={isFetchingGuides}
          searchPlaceholder="Search guides by title, excerpt, or tag..."
          manualFiltering
          getRowKey={(row) => row.id}
          title="Master Guides Directory"
          titleIcon={<BookOpen className="size-5" />}
          countBadge={
            meta
              ? `${meta.total} ${meta.total === 1 ? "guide" : "guides"}`
              : undefined
          }
          filterContent={
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  <FormSelect
                    label="Category"
                    placeholder={
                      isLoadingCategories ? "Loading..." : "All Categories"
                    }
                    options={categoryOptions}
                    value={categoryFilter}
                    onChange={(val) => {
                      setCategoryFilter(val);
                      setPage(1);
                    }}
                    searchable
                    disabled={isLoadingCategories}
                  />

                  <FormSelect
                    label="Species"
                    placeholder={isLoadingSpecies ? "Loading..." : "All Species"}
                    options={speciesOptions}
                    value={speciesFilter}
                    onChange={(val) => {
                      setSpeciesFilter(val);
                      setBreedFilter("");
                      setPage(1);
                    }}
                    searchable
                    disabled={isLoadingSpecies}
                  />

                  <FormSelect
                    label="Breed"
                    placeholder={
                      !speciesFilter
                        ? "Select species first"
                        : isLoadingBreeds
                        ? "Loading..."
                        : "All Breeds"
                    }
                    options={breedOptions}
                    value={breedFilter}
                    onChange={(val) => {
                      setBreedFilter(val);
                      setPage(1);
                    }}
                    searchable
                    disabled={!speciesFilter || isLoadingBreeds}
                  />

                  <FormSelect
                    label="Status"
                    placeholder="All Statuses"
                    options={STATUS_OPTIONS}
                    value={statusFilter}
                    onChange={(val) => {
                      setStatusFilter(val);
                      setPage(1);
                    }}
                  />

                  <FormSelect
                    label="Sort By"
                    placeholder="Recently Updated"
                    options={SORT_OPTIONS}
                    value={sortValue}
                    onChange={(val) => {
                      setSortValue(val || "updatedAt:desc");
                      setPage(1);
                    }}
                  />
                </div>

                {activeFilterCount > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-border-peach/70 text-xs">
                    <span className="text-ink-muted">
                      Showing filtered results ({meta?.total ?? guides.length}{" "}
                      matched)
                    </span>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1.5 font-bold text-coral hover:underline cursor-pointer"
                    >
                      <RotateCcw className="size-3.5" />
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
          }
          emptyMessage={
            activeFilterCount > 0
              ? "No guides match the selected filters. Try adjusting or resetting filters."
              : "No guides found yet. Click 'Write New Guide' to publish your first guide."
          }
          hoverable
          actions={[
            {
              label: "View",
              icon: <Eye className="size-3.5" />,
              variant: "info",
              onClick: (row) => router.push(`/admin/guides/${row.id}`),
            },
            {
              label: "Edit",
              icon: <Pencil className="size-3.5" />,
              variant: "primary",
              onClick: (row) => router.push(`/admin/guides/${row.id}/edit`),
            },
            {
              label: "FAQs",
              icon: <HelpCircle className="size-3.5" />,
              variant: "purple",
              onClick: (row) => router.push(`/admin/guides/${row.id}/faqs`),
            },
            {
              label: "Delete",
              icon: <Trash2 className="size-3.5" />,
              variant: "danger",
              onClick: (row) => setGuideToDelete(row),
            },
          ]}
          footer={
            meta && meta.total > 0 ? (
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                itemsPerPage={pageSize === "all" ? meta.total : meta.limit}
                totalItems={meta.total}
                onPageChange={(nextPage) => setPage(nextPage)}
                pageSize={pageSize}
                pageSizeOptions={[10, 20, 30, 40, 50, 100, "all"]}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPage(1);
                }}
                label="guides"
              />
            ) : undefined
          }
        />
      </AnimatedContainer>

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(guideToDelete)}
        onClose={() => !isDeleting && setGuideToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        variant="danger"
        title={
          guideToDelete
            ? `Delete "${guideToDelete.title}"?`
            : "Delete Guide?"
        }
        description="Are you sure you want to delete this guide? It will be removed from the editorial directory and public catalog."
        confirmText="Yes, Delete Guide"
        cancelText="Cancel"
      />

      <BulkGuideImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
      />
    </div>
  );
}
