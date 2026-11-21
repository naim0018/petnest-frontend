"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useUpdateGuideMutation,
  useFindAllCategoriesPublicQuery,
} from "@/store/Api/Guides/guides.api";
import { getCategoryIcon } from "@/components/admin/guides/CategoryIcons";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GuideCategoryDropdownProps {
  guideId: string;
  currentCategoryId?: string;
  currentCategoryName?: string;
  currentCategoryIcon?: string | null;
  guideTitle?: string;
  className?: string;
  disabled?: boolean;
}

export default function GuideCategoryDropdown({
  guideId,
  currentCategoryId,
  currentCategoryName,
  currentCategoryIcon,
  guideTitle,
  className,
  disabled = false,
}: GuideCategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const [optimisticCategory, setOptimisticCategory] = useState<{
    id: string;
    name: string;
    icon?: string | null;
  } | null>(null);

  const { data: categoriesResponse, isLoading: isLoadingCats } =
    useFindAllCategoriesPublicQuery();
  const categories = categoriesResponse?.data || [];

  const [updateGuide, { isLoading: isUpdating }] = useUpdateGuideMutation();

  useEffect(() => {
    setOptimisticCategory(null);
  }, [currentCategoryId, currentCategoryName, currentCategoryIcon]);

  const activeId = optimisticCategory?.id || currentCategoryId;
  const activeCat =
    categories.find((c) => c.id === activeId) ||
    (optimisticCategory
      ? optimisticCategory
      : {
          id: currentCategoryId || "",
          name: currentCategoryName || "Uncategorized",
          icon: currentCategoryIcon || null,
        });

  const CategoryIcon = getCategoryIcon(activeCat.icon);

  const handleSelectCategory = async (cat: {
    id: string;
    name: string;
    icon?: string | null;
  }) => {
    if (cat.id === activeId) {
      setOpen(false);
      return;
    }

    setOpen(false);
    setOptimisticCategory(cat);

    try {
      await updateGuide({
        id: guideId,
        payload: { categoryId: cat.id },
      }).unwrap();

      toast.success(`Category updated to "${cat.name}"`);
    } catch (err: unknown) {
      setOptimisticCategory(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errObj = err as any;
      const message =
        errObj?.data?.message ||
        errObj?.message ||
        "Failed to update guide category. Please try again.";
      toast.error(message);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger
        render={(props) => (
          <button
            {...props}
            type="button"
            disabled={disabled || isUpdating}
            onClick={(e) => {
              e.stopPropagation();
              if (props.onClick) props.onClick(e);
            }}
            className={cn(
              "group inline-flex items-center justify-between w-[150px] h-7 px-2.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-150 cursor-pointer select-none bg-surface-muted/60 text-ink border-border-peach hover:border-coral/40 hover:bg-coral-light/20",
              isUpdating && "opacity-80 cursor-wait",
              disabled && "opacity-50 cursor-not-allowed",
              open && "ring-2 ring-coral/20 border-coral/40",
              className
            )}
            title="Click to change guide topic category"
          >
            <span className="flex items-center gap-1.5 min-w-0 flex-1 text-left">
              {isUpdating ? (
                <Loader2 className="size-3 animate-spin shrink-0 text-coral" />
              ) : (
                <CategoryIcon className="size-3.5 text-coral shrink-0" />
              )}
              <span className="truncate">{activeCat.name || "Uncategorized"}</span>
            </span>
            <ChevronDown
              className={cn(
                "size-3 shrink-0 transition-transform duration-150 opacity-60 group-hover:opacity-100 ml-1.5",
                open && "rotate-180"
              )}
            />
          </button>
        )}
      />

      <PopoverContent
        align="center"
        sideOffset={6}
        initialFocus={false}
        finalFocus={false}
        className="w-56 p-1.5 bg-card border border-border-peach rounded-xl shadow-xl z-50 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-2.5 py-1.5 border-b border-border-peach/70 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">
            Change Category
          </span>
          {guideTitle && (
            <span
              className="text-[10px] text-ink-muted truncate max-w-[110px]"
              title={guideTitle}
            >
              {guideTitle}
            </span>
          )}
        </div>

        <div className="py-1 space-y-0.5 max-h-56 overflow-y-auto">
          {isLoadingCats && categories.length === 0 ? (
            <div className="p-3 text-center text-xs text-ink-muted">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-3 text-center text-xs text-ink-muted">
              No categories available
            </div>
          ) : (
            categories.map((cat) => {
              const isCurrent = cat.id === activeId;
              const IconComp = getCategoryIcon(cat.icon);

              return (
                <button
                  key={cat.id}
                  type="button"
                  disabled={isUpdating}
                  onClick={() =>
                    handleSelectCategory({
                      id: cat.id,
                      name: cat.name,
                      icon: cat.icon,
                    })
                  }
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 transition-colors duration-150 cursor-pointer",
                    isCurrent
                      ? "bg-coral-light/60 text-ink font-bold"
                      : "text-ink hover:bg-surface-soft hover:text-coral"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <IconComp className="size-3.5 text-coral shrink-0" />
                    <span className="text-xs truncate">{cat.name}</span>
                  </div>
                  {isCurrent && (
                    <Check className="size-3.5 text-coral shrink-0 ml-1" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
