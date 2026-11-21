"use client";

import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import ConfirmModal from "@/components/reuseable/ConfirmModal";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useFindOneCategoryQuery,
  useFindAllEditorialQuery,
  useRemoveCategoryMutation,
} from "@/store/Api/Guides/guides.api";
import {
  getCategoryIcon,
  CategoryIconDisplay,
} from "@/components/admin/guides/CategoryIcons";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  BookOpen,
  Layers,
  CheckCircle2,
  Clock,
  Plus,
  AlertCircle,
  ExternalLink,
  Eye,
  Tag,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function GuideCategoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();
  const categoryId = resolvedParams.id;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch category info
  const {
    data: categoryResponse,
    isLoading: isLoadingCategory,
    isError,
    refetch: refetchCategory,
  } = useFindOneCategoryQuery(categoryId);
  const category = categoryResponse?.data;

  // Fetch guides belonging to this category
  const {
    data: guidesResponse,
    isLoading: isLoadingGuides,
  } = useFindAllEditorialQuery(
    { category: category?.slug, limit: 8 },
    { skip: !category?.slug }
  );
  const guides = guidesResponse?.data?.items || [];
  const totalGuidesCount =
    category?._count?.guides ??
    guidesResponse?.data?.meta?.total ??
    guides.length;

  const [removeCategory, { isLoading: isDeleting }] =
    useRemoveCategoryMutation();

  const IconComponent = getCategoryIcon(category?.icon);

  // Dynamic header action buttons
  useEffect(() => {
    if (!category) return;
    setHeaderAction(
      <div className="flex items-center gap-2">
        <PrimaryButton
          variant="outline"
          size="sm"
          rounded="md"
          onClick={() =>
            router.push(`/admin/guides/categories/${category.id}/edit`)
          }
          leftIcon={<Pencil className="size-3.5 text-coral" />}
          className="font-bold cursor-pointer"
        >
          Edit Category
        </PrimaryButton>
        {category.slug !== "basic" && (
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            title="Delete Category"
            aria-label="Delete Category"
            className="size-9 rounded-md border border-red-200 hover:border-destructive bg-card hover:bg-rose-50 dark:hover:bg-rose-950/30 text-destructive flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    );
    return () => setHeaderAction(null);
  }, [setHeaderAction, category, router]);

  const handleDelete = async () => {
    if (!category) return;
    try {
      await removeCategory(category.id).unwrap();
      toast.success(`Category "${category.name}" deleted successfully.`);
      setIsDeleteModalOpen(false);
      router.push("/admin/guides/categories");
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to delete category. Make sure all attached guides are reassigned or removed first.";
      toast.error(errorMsg);
    }
  };

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

  if (isLoadingCategory) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-44 bg-surface-muted rounded animate-pulse" />
        <div className="h-72 bg-card border border-border-peach rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-card border border-border-peach rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="w-full p-12 text-center rounded-lg bg-card border border-border-peach space-y-4">
        <AlertCircle className="size-12 text-coral mx-auto" />
        <h3 className="text-lg font-bold font-quicksand text-ink">
          Category Not Found
        </h3>
        <p className="text-xs text-ink-muted">
          The requested guide category could not be found or has been removed.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <PrimaryButton
            variant="outline"
            size="sm"
            rounded="md"
            onClick={() => router.push("/admin/guides/categories")}
          >
            Categories Hub
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            size="sm"
            rounded="md"
            onClick={() => refetchCategory()}
          >
            Retry
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Hero Category Banner Card */}
      <AnimatedContainer delay={0.05}>
        <div className="bg-card border border-border-peach rounded-lg overflow-hidden shadow-xs relative">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Icon Badge Banner */}
            <div className="lg:col-span-4 relative h-64 lg:h-auto min-h-60 bg-gradient-to-br from-rose-50/80 via-orange-50/40 to-tint-rose/50 dark:from-tint-rose/20 dark:via-surface-soft dark:to-surface-muted overflow-hidden flex flex-col items-center justify-center p-6 text-center">
              <div className="size-24 rounded-lg bg-white/95 dark:bg-card/95 border border-coral/25 text-coral flex items-center justify-center shadow-md mb-3 p-3 overflow-hidden">
                <CategoryIconDisplay icon={category.icon} className="size-14 object-contain" />
              </div>
              <span className="text-xs font-bold font-mono text-ink-muted bg-white/80 dark:bg-card/80 px-2.5 py-0.5 rounded-full border border-border-peach">
                /{category.slug}
              </span>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-xs text-xs font-bold text-coral border border-coral/20">
                  <BookOpen className="size-3.5 fill-coral text-coral" />
                  {totalGuidesCount} Articles
                </span>
              </div>
            </div>

            {/* Category Details */}
            <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tint-rose text-coral font-bold text-xs border border-coral/15">
                      <Layers className="size-3" />
                      Topic Cluster
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        category.isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-surface-muted text-ink-muted border border-border-peach"
                      }`}
                    >
                      <CheckCircle2 className="size-3" />
                      {category.isActive ? "Active (Publicly Visible)" : "Archived"}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold font-quicksand text-ink tracking-tight">
                    {category.name}
                  </h1>
                </div>

                {/* Scope Description */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-quicksand">
                    Scope & Topic Description
                  </h4>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {category.description ||
                      "No detailed scope description has been provided for this topic category."}
                  </p>
                </div>

                {/* Technical Meta Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-surface-soft/60 border border-border-peach/60 space-y-0.5">
                    <span className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">
                      Display Priority
                    </span>
                    <p className="font-semibold text-xs text-ink font-mono">
                      Order: {category.displayOrder ?? 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-soft/60 border border-border-peach/60 space-y-0.5">
                    <span className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">
                      Created Date
                    </span>
                    <p className="font-semibold text-xs text-ink">
                      {formattedDate(category.createdAt)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-soft/60 border border-border-peach/60 space-y-0.5 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">
                      Category ID
                    </span>
                    <p className="font-mono text-xs text-ink truncate">
                      {category.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="p-3.5 rounded-lg bg-gradient-to-r from-coral/10 via-surface-soft to-tint-rose/40 border border-coral/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-coral shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-ink">
                      Write an article in {category.name}
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      Assign veterinary knowledge guides directly to this category cluster.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <PrimaryButton
                    variant="primary"
                    size="sm"
                    rounded="md"
                    onClick={() => router.push(`/admin/guides/create`)}
                    leftIcon={<Plus className="size-3.5" />}
                    className="text-xs font-bold"
                  >
                    Create Guide
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Metrics Row */}
      <AnimatedContainer delay={0.15}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Attached Guides"
            value={`${totalGuidesCount} Articles`}
            trendText="Content assigned to cluster"
            trendType="positive"
            icon={<BookOpen className="size-5 text-coral" />}
          />
          <StatsCard
            title="Sorting Priority"
            value={`Rank #${category.displayOrder ?? 0}`}
            trendText="Position in topic menus"
            trendType="positive"
            icon={<Layers className="size-5 text-coral" />}
          />
          <StatsCard
            title="Cluster Status"
            value={category.isActive ? "Active" : "Archived"}
            trendText={category.isActive ? "Live in navigation" : "Hidden from filters"}
            trendType="positive"
            icon={<CheckCircle2 className="size-5 text-emerald-500" />}
          />
          <StatsCard
            title="Last Modified"
            value={formattedDate(category.updatedAt)}
            trendText="Synchronized with database"
            trendType="positive"
            icon={<Clock className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      {/* Attached Articles Preview Section */}
      <AnimatedContainer delay={0.2}>
        <div className="p-6 rounded-lg bg-card border border-border-peach space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-ink text-base font-quicksand flex items-center gap-2">
                <BookOpen className="size-4.5 text-coral" />
                Articles in this Category ({totalGuidesCount})
              </h3>
              <p className="text-xs text-ink-muted">
                Guides and editorial content grouped under the &ldquo;{category.name}&rdquo; taxonomy.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <PrimaryButton
                variant="outline"
                size="sm"
                rounded="md"
                onClick={() => router.push(`/admin/guides/all?category=${category.slug}`)}
                leftIcon={<Eye className="size-3.5" />}
                className="text-xs font-bold"
              >
                View in Editorial Table
              </PrimaryButton>
              <PrimaryButton
                variant="primary"
                size="sm"
                rounded="md"
                onClick={() => router.push(`/admin/guides/create`)}
                leftIcon={<Plus className="size-3.5" />}
                className="text-xs font-bold"
              >
                New Article
              </PrimaryButton>
            </div>
          </div>

          {isLoadingGuides ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-surface-muted rounded-lg" />
              ))}
            </div>
          ) : guides.length === 0 ? (
            <div className="p-8 text-center rounded-lg bg-surface-soft/60 border border-dashed border-border-peach space-y-3">
              <BookOpen className="size-10 text-ink-faint mx-auto opacity-50" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-ink font-quicksand">
                  No Guides Attached Yet
                </p>
                <p className="text-xs text-ink-muted">
                  There are currently no published articles assigned to &ldquo;{category.name}&rdquo;.
                </p>
              </div>
              <div className="pt-2">
                <PrimaryButton
                  variant="primary"
                  size="sm"
                  rounded="md"
                  onClick={() => router.push(`/admin/guides/create`)}
                  leftIcon={<Plus className="size-4" />}
                >
                  Create First Guide
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {guides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  target="_blank"
                  className="p-3.5 rounded-lg bg-surface-soft/60 hover:bg-tint-rose/40 border border-border-peach/70 hover:border-coral/50 flex flex-col justify-between transition-all duration-200 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-coral/10 text-coral border border-coral/15 uppercase tracking-wider">
                        {guide.type}
                      </span>
                      <ExternalLink className="size-3.5 text-ink-faint group-hover:text-coral transition-colors" />
                    </div>

                    <h5 className="font-bold text-sm text-ink group-hover:text-coral transition-colors line-clamp-2 font-quicksand leading-snug">
                      {guide.title}
                    </h5>

                    <p className="text-xs text-ink-muted line-clamp-2">
                      {guide.excerpt}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border-peach/60 flex items-center justify-between text-[11px] text-ink-muted">
                    <span className="flex items-center gap-1 truncate font-medium">
                      <User className="size-3 text-coral shrink-0" />
                      {guide.author?.name || "PetNest Author"}
                    </span>
                    <span className="font-mono text-ink-faint shrink-0">
                      {guide.readTimeMinutes} min
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </AnimatedContainer>

      {/* Delete Confirmation Modal (Reusable Modal) */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={`Delete Category "${category.name}"?`}
        description="Are you sure you want to delete this guide category? This action is permanent. If articles are currently assigned to this category, you must reassign them first."
        confirmText="Yes, Delete Category"
        loading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
