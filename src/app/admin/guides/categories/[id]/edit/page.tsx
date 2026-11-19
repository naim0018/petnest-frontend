"use client";

import React, { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useFindOneCategoryQuery,
  useFindAllCategoriesAdminQuery,
  useUpdateCategoryMutation,
} from "@/store/Api/Guides/guides.api";
import {
  CATEGORY_ICON_PRESETS,
  getCategoryIcon,
} from "@/components/admin/guides/CategoryIcons";
import {
  FolderTree,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Eye,
  BookOpen,
  Compass,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditGuideCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const categoryId = resolvedParams.id;

  const {
    data: categoryResponse,
    isLoading: isLoadingCategory,
    isError,
    refetch,
  } = useFindOneCategoryQuery(categoryId);
  const category = categoryResponse?.data;

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const { data: existingCategoriesRes } = useFindAllCategoriesAdminQuery();

  const existingCategories = useMemo(
    () => existingCategoriesRes?.data || [],
    [existingCategoriesRes]
  );

  const addedPresetNames = useMemo(() => {
    const addedSet = new Set<string>();
    for (const preset of CATEGORY_ICON_PRESETS) {
      const presetSlug = preset.slug.toLowerCase();
      const presetLabel = preset.label.toLowerCase();
      const presetIcon = preset.name.toLowerCase();
      const exists = existingCategories.some(
        (cat) =>
          cat.slug.toLowerCase() === presetSlug ||
          cat.name.toLowerCase() === presetLabel ||
          cat.icon?.toLowerCase() === presetIcon
      );
      if (exists) addedSet.add(preset.name);
    }
    return addedSet;
  }, [existingCategories]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("FolderTree");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<{
    name?: string;
    slug?: string;
    description?: string;
  }>({});

  // Prepopulate form fields when category data loads
  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSlug(category.slug || "");
      setDescription(category.description || "");
      setSelectedIcon(category.icon || "FolderTree");
      setDisplayOrder(category.displayOrder ?? 0);
      setIsActive(category.isActive ?? true);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const finalSlug = (slug.trim() || generateSlug(trimmedName)).trim();

    const newErrors: typeof errors = {};
    if (!trimmedName || trimmedName.length < 2) {
      newErrors.name = "Category name must be at least 2 characters long.";
    } else if (trimmedName.length > 60) {
      newErrors.name = "Category name cannot exceed 60 characters.";
    }

    if (finalSlug && finalSlug.length > 80) {
      newErrors.slug = "Slug cannot exceed 80 characters.";
    }

    if (description.length > 300) {
      newErrors.description = "Description cannot exceed 300 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please resolve the validation issues before saving.");
      return;
    }

    setErrors({});

    try {
      await updateCategory({
        id: categoryId,
        payload: {
          name: trimmedName,
          slug: finalSlug || undefined,
          description: description.trim() || undefined,
          icon: selectedIcon,
          displayOrder: Number(displayOrder) || 0,
          isActive,
        },
      }).unwrap();

      toast.success(`Category "${trimmedName}" updated successfully!`);
      router.push("/admin/guides/categories");
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to update category. Please verify the name and slug are unique.";
      toast.error(errorMsg);
    }
  };

  const SelectedIconComponent = getCategoryIcon(selectedIcon);
  const displaySlug = slug.trim() || (name.trim() ? generateSlug(name) : "category-slug");
  const { setHeaderAction } = useHeaderAction();

  useEffect(() => {
    setHeaderAction(
      <div className="flex items-center gap-2">
        <PrimaryButton
          type="button"
          variant="outline"
          size="sm"
          rounded="md"
          onClick={() => router.push("/admin/guides/categories")}
          className="font-bold cursor-pointer"
        >
          Cancel
        </PrimaryButton>
        <PrimaryButton
          type="submit"
          form="edit-category-form"
          variant="primary"
          size="sm"
          rounded="md"
          isLoading={isUpdating}
          leftIcon={<CheckCircle2 className="size-4" />}
          className="font-bold cursor-pointer"
        >
          Save Changes
        </PrimaryButton>
      </div>
    );
    return () => setHeaderAction(null);
  }, [setHeaderAction, router, isUpdating]);

  if (isLoadingCategory) {
    return (
      <div className="w-full space-y-6">
        <div className="h-8 w-48 bg-surface-muted rounded animate-pulse" />
        <div className="h-64 bg-card border border-border-peach rounded-xl animate-pulse" />
        <div className="h-48 bg-card border border-border-peach rounded-xl animate-pulse" />
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="w-full p-12 text-center rounded-xl bg-card border border-border-peach space-y-4">
        <AlertCircle className="size-12 text-coral mx-auto" />
        <h3 className="text-lg font-bold font-quicksand text-ink">
          Guide Category Not Found
        </h3>
        <p className="text-xs text-ink-muted">
          The requested guide category could not be loaded or may have been deleted.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <PrimaryButton
            variant="outline"
            size="sm"
            rounded="md"
            onClick={() => router.push("/admin/guides/categories")}
          >
            Categories
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            size="sm"
            rounded="md"
            onClick={() => refetch()}
          >
            Retry
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Two Column Layout: Left Form + Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          <form id="edit-category-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Card 1: Core Identification */}
            <AnimatedContainer delay={0.1}>
              <div className="p-6 rounded-xl bg-card border border-border-peach shadow-xs space-y-5">
                <div className="flex items-center gap-2 border-b border-border-peach pb-3">
                  <FolderTree className="size-4.5 text-coral" />
                  <h3 className="font-bold text-ink text-sm font-quicksand">
                    Category Identification
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    label="Category Name"
                    required
                    placeholder="e.g. Clinical Nutrition & Diets"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    helperText="Primary public display name"
                  />

                  <div>
                    <FormInput
                      label="URL Slug"
                      placeholder="e.g. clinical-nutrition-diets"
                      value={slug}
                      onChange={(e) => setSlug(generateSlug(e.target.value))}
                      error={errors.slug}
                      disabled={category.slug === "basic"}
                      helperText={
                        category.slug === "basic"
                          ? 'Slug is locked for the default "Basic" category'
                          : "Route identifier used in SEO URLs"
                      }
                    />
                    {slug && (
                      <p className="text-[11px] text-ink-muted mt-1 font-mono">
                        Route: /guides?category=
                        <span className="text-coral font-bold">{slug}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <FormTextarea
                    label="Category Scope / Description"
                    rows={3}
                    placeholder="Briefly describe what articles and topics belong to this category..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={errors.description}
                    helperText={`${description.length}/300 characters`}
                  />
                </div>
              </div>
            </AnimatedContainer>

            {/* Card 2: Visual Icon & Display Order */}
            <AnimatedContainer delay={0.15}>
              <div className="p-6 rounded-xl bg-card border border-border-peach shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-peach pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4.5 text-coral" />
                    <h3 className="font-bold text-ink text-sm font-quicksand">
                      Visual Icon & Taxonomy Sorting
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-success" />
                      Added ({addedPresetNames.size})
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-coral" />
                      Selected
                    </span>
                  </div>
                </div>

                {/* Icon Presets Grid */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Choose Topic Icon
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {CATEGORY_ICON_PRESETS.map((preset) => {
                      const Icon = preset.icon;
                      const isSelected = selectedIcon === preset.name;
                      const isAdded = addedPresetNames.has(preset.name);
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setSelectedIcon(preset.name);
                            setName(preset.label);
                            setSlug(preset.slug);
                            setDescription(preset.description);
                          }}
                          className={`relative p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                            isSelected
                              ? "bg-tint-rose border-coral text-coral ring-2 ring-coral/20 font-bold"
                              : isAdded
                              ? "bg-tint-mint border-success/50 text-success hover:border-success font-semibold"
                              : "bg-surface-soft/60 border-border-peach hover:border-coral/50 text-ink-muted hover:text-ink"
                          }`}
                        >
                          {isAdded && (
                            <span
                              className="absolute top-1.5 right-1.5 inline-flex items-center justify-center text-success"
                              aria-label="Already added"
                            >
                              <CheckCircle2 className="size-3.5" />
                            </span>
                          )}
                          <Icon className="size-5 shrink-0" />
                          <span className="text-xs truncate max-w-full font-medium leading-tight">
                            {preset.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <FormInput
                    label="Display Priority Order"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    helperText="Lower numbers appear first in filter bars and navigation menus."
                  />

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                      Category Status
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={category.slug === "basic" ? true : isActive}
                          disabled={category.slug === "basic"}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-border-peach after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral"></div>
                        <span className="ml-3 text-xs font-bold font-quicksand text-ink">
                          {isActive ? "Active (Visible publicly)" : "Archived (Hidden from public)"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContainer>

            {/* Action Toolbar */}
            <AnimatedContainer delay={0.2}>
              <div className="flex items-center justify-end gap-3 pt-2">
                <PrimaryButton
                  type="button"
                  variant="outline"
                  size="sm"
                  rounded="md"
                  onClick={() => router.push("/admin/guides/categories")}
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  rounded="md"
                  isLoading={isUpdating}
                  leftIcon={<CheckCircle2 className="size-4" />}
                  className="font-bold cursor-pointer"
                >
                  Save Changes
                </PrimaryButton>
              </div>
            </AnimatedContainer>
          </form>
        </div>

        {/* Right Column: Live Interactive Preview */}
        <div className="lg:col-span-5 xl:col-span-5 sticky top-20 space-y-5">
          <AnimatedContainer delay={0.15}>
            <div className="rounded-xl bg-card border border-border-peach shadow-xs p-5 space-y-5">
              {/* Preview Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border-peach">
                <div className="flex items-center gap-2">
                  <Eye className="size-4 text-coral" />
                  <span className="text-xs font-bold font-quicksand uppercase tracking-wider text-ink">
                    Live Preview
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-tint-mint border border-success/30 text-xs font-bold text-success">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                  Realtime
                </div>
              </div>

              {/* Public Guide Card Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                  Public Topic Card
                </span>
                <div className="p-4 rounded-xl border border-border-peach bg-surface-soft/40 space-y-3 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="size-11 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center text-coral shadow-2xs shrink-0">
                      <SelectedIconComponent className="size-5.5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                          isActive
                            ? "bg-tint-mint text-success border-success/30"
                            : "bg-surface-muted text-ink-muted border-border-peach"
                        }`}
                      >
                        {isActive ? "Active" : "Archived"}
                      </span>
                      <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded bg-surface-muted text-ink-muted border border-border-peach">
                        #{displayOrder}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm font-quicksand text-ink leading-snug line-clamp-1">
                      {name.trim() || "Category Name"}
                    </h4>
                    <p className="text-xs text-ink-muted line-clamp-2 mt-1 leading-relaxed">
                      {description.trim() ||
                        "Articles and veterinary guides will be organized under this topic taxonomy."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border-peach/60 flex items-center justify-between text-xs text-ink-muted">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="size-3.5 text-coral" />
                      <span>{category._count?.guides || 0} Guides</span>
                    </div>
                    <span className="font-mono text-xs text-coral truncate max-w-40">
                      /{displaySlug}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Table Appearance Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                  Admin Table Row
                </span>
                <div className="p-3 rounded-lg border border-border-peach bg-card text-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-coral/10 border border-coral/20 flex items-center justify-center text-coral shrink-0">
                      <SelectedIconComponent className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-ink truncate leading-tight">
                        {name.trim() || "Category Name"}
                      </div>
                      <div className="text-xs font-mono text-ink-muted truncate">
                        /{displaySlug}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-ink-muted line-clamp-1 italic">
                    &ldquo;{description.trim() || "No description provided."}&rdquo;
                  </p>
                </div>
              </div>

              {/* Taxonomy Specs Breakdown */}
              <div className="p-3.5 rounded-lg bg-surface-muted/60 border border-border-peach/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <Compass className="size-3 text-coral" /> Route Identifier
                  </span>
                  <span className="font-mono font-bold text-coral text-xs truncate max-w-40">
                    /guides?category={displaySlug}
                  </span>
                </div>
                <div className="flex items-center justify-between text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <Hash className="size-3 text-coral" /> Priority Order
                  </span>
                  <span className="font-bold text-ink text-xs">
                    Weight {displayOrder}
                  </span>
                </div>
                <div className="flex items-center justify-between text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-3 text-coral" /> Icon Preset
                  </span>
                  <span className="font-mono text-ink text-xs">
                    {selectedIcon}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
}