"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import ConfirmModal from "@/components/reuseable/ConfirmModal";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useFindAllCategoriesAdminQuery,
  useRemoveCategoryMutation,
} from "@/store/Api/Guides/guides.api";
import type { AdminCategory } from "@/store/Api/Guides/guides.types";
import {
  getCategoryIcon,
  CategoryIconDisplay,
} from "@/components/admin/guides/CategoryIcons";
import {
  Plus,
  CheckCircle2,
  BookOpen,
  Layers,
  Eye,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function GuideCategoriesPage() {
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();

  const {
    data: categoriesResponse,
    isLoading,
    isError,
    refetch,
  } = useFindAllCategoriesAdminQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [removeCategory, { isLoading: isDeleting }] =
    useRemoveCategoryMutation();

  const [deleteCategory, setDeleteCategory] = useState<AdminCategory | null>(
    null
  );

  const categories: AdminCategory[] = useMemo(
    () => categoriesResponse?.data || [],
    [categoriesResponse]
  );

  // Set header action button
  useEffect(() => {
    setHeaderAction(
      <PrimaryButton
        variant="primary"
        size="sm"
        rounded="md"
        onClick={() => router.push("/admin/guides/categories/new")}
        leftIcon={<Plus className="size-4" />}
        className="font-bold cursor-pointer"
      >
        Add Topic Category
      </PrimaryButton>
    );

    return () => setHeaderAction(null);
  }, [setHeaderAction, router]);

  // Derived statistics
  const totalCategories = categories.length;
  const totalGuides = categories.reduce(
    (sum, c) => sum + (c.guidesCount || 0),
    0
  );
  const activeCount = categories.filter((c) => c.isActive).length;

  const mostReadCategory = useMemo(() => {
    if (categories.length === 0) return null;
    return [...categories].sort(
      (a, b) => (b.totalViews || 0) - (a.totalViews || 0)
    )[0];
  }, [categories]);

  const handleDelete = async () => {
    if (!deleteCategory) return;
    try {
      await removeCategory(deleteCategory.id).unwrap();
      toast.success(
        `Category "${deleteCategory.name}" has been deleted successfully.`
      );
      setDeleteCategory(null);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to delete category. Make sure no published guides are attached to it.";
      toast.error(errorMsg);
    }
  };

  const columns: Column<AdminCategory>[] = [
    {
      key: "name",
      label: "Category Name",
      sortable: true,
      render: (row) => {
        return (
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-md bg-coral-light flex items-center justify-center text-coral shrink-0 border border-coral/15 overflow-hidden p-1">
              <CategoryIconDisplay icon={row.icon} className="size-5 object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p
                  onClick={() =>
                    router.push(`/admin/guides/categories/${row.slug || row.id}`)
                  }
                  className="font-bold text-ink leading-tight hover:text-coral transition-colors cursor-pointer truncate font-quicksand"
                >
                  {row.name}
                </p>
                {row.slug === "basic" && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-tint-rose text-coral border border-coral/20 shrink-0">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted truncate">/{row.slug}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "description",
      label: "Category Scope",
      render: (row) => (
        <span className="text-xs text-ink-muted line-clamp-1 max-w-md">
          {row.description || "No topic scope description provided."}
        </span>
      ),
    },
    {
      key: "guidesCount",
      label: "Published Articles",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="font-semibold text-xs px-2.5 py-1 rounded-md bg-surface-muted text-ink border border-border-peach">
          {row.guidesCount ?? 0} guides
        </span>
      ),
    },
    {
      key: "totalViews",
      label: "Total Readership",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-bold text-coral">
          {(row.totalViews ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      align: "center",
      render: (row) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.isActive
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-surface-muted text-ink-muted dark:bg-surface-soft"
          }`}
        >
          {row.isActive ? "Active" : "Archived"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "View Category",
      icon: <Eye className="size-4" />,
      variant: "info" as const,
      onClick: (row: AdminCategory) => {
        router.push(`/admin/guides/categories/${row.slug || row.id}`);
      },
    },
    {
      label: "Edit Category",
      icon: <Pencil className="size-4" />,
      variant: "primary" as const,
      onClick: (row: AdminCategory) => {
        router.push(`/admin/guides/categories/${row.id}/edit`);
      },
    },
    {
      label: "Delete Category",
      icon: <Trash2 className="size-4" />,
      variant: "danger" as const,
      onClick: (row: AdminCategory) => {
        if (row.slug === "basic") {
          toast.info('The default "Basic" category cannot be deleted.');
          return;
        }
        setDeleteCategory(row);
      },
    },
  ];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Metrics Row */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Article Clusters"
            value={`${totalCategories} Categories`}
            trendText={`${totalGuides} published guides in catalog`}
            trendType="positive"
            icon={<Layers className="size-5" />}
          />
          <StatsCard
            title="Most Read Topic"
            value={mostReadCategory?.name || "None yet"}
            trendText={
              mostReadCategory
                ? `${(mostReadCategory.totalViews || 0).toLocaleString()} lifetime views`
                : "No readership recorded"
            }
            trendType="positive"
            icon={<BookOpen className="size-5" />}
          />
          <StatsCard
            title="Curated Topics"
            value={
              totalCategories > 0
                ? `${Math.round((activeCount / totalCategories) * 100)}% Active`
                : "100% Active"
            }
            trendText={`${activeCount} active pillar topics`}
            trendType="positive"
            icon={<CheckCircle2 className="size-5" />}
          />
        </div>
      </AnimatedContainer>

      {/* Main Table Content */}
      <AnimatedContainer delay={0.15}>
        {isError ? (
          <div className="p-12 text-center rounded-lg bg-card border border-border-peach space-y-3">
            <AlertCircle className="size-10 text-coral mx-auto" />
            <p className="font-bold text-ink font-quicksand">
              Failed to load categories
            </p>
            <p className="text-xs text-ink-muted">
              There was an issue fetching category records from the guides API.
            </p>
            <PrimaryButton
              variant="outline"
              size="sm"
              rounded="md"
              leftIcon={<RefreshCw className="size-3.5" />}
              onClick={() => refetch()}
            >
              Retry
            </PrimaryButton>
          </div>
        ) : (
          <DynamicTable
            tableName="admin-guide-categories"
            data={categories}
            columns={columns}
            actions={actions}
            loading={isLoading}
            searchable
            searchPlaceholder="Search categories, slugs, or topics..."
            pagination
            pageSize={10}
            title="Guide Content Clusters"
            titleIcon={<Layers className="size-5" />}
            countBadge={`${categories.length} ${
              categories.length === 1 ? "category" : "categories"
            }`}
            emptyMessage="No guide categories found. Create the first topic cluster to organize content."
            hoverable
          />
        )}
      </AnimatedContainer>

      {/* Delete Confirmation Modal (Reusable Modal) */}
      <ConfirmModal
        isOpen={Boolean(deleteCategory)}
        onClose={() => setDeleteCategory(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleteCategory?.name}"?`}
        description="Are you sure you want to delete this guide category? This action cannot be undone. If articles belong to this category, they must be reassigned first."
        confirmText="Yes, Delete Category"
        loading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
