"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUpdateGuideMutation } from "@/store/Api/Guides/guides.api";
import { useAppSelector } from "@/hooks/useRedux";
import type { GuideStatus } from "@/store/Api/Guides/guides.types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StatusOption {
  value: GuideStatus;
  label: string;
  description: string;
  badgeClass: string;
  dotClass: string;
  requiresReviewer?: boolean;
}

export const STATUS_CONFIG: Record<GuideStatus, StatusOption> = {
  PUBLISHED: {
    value: "PUBLISHED",
    label: "Published",
    description: "Publicly visible to all readers",
    badgeClass: "bg-tint-mint text-success border-success/30 hover:border-success/60",
    dotClass: "bg-success",
    requiresReviewer: true,
  },
  IN_REVIEW: {
    value: "IN_REVIEW",
    label: "In Review",
    description: "Awaiting editorial / vet approval",
    badgeClass: "bg-tint-sky text-info border-info/30 hover:border-info/60",
    dotClass: "bg-info",
    requiresReviewer: false,
  },
  DRAFT: {
    value: "DRAFT",
    label: "Draft",
    description: "Unpublished author work in progress",
    badgeClass: "bg-surface-muted text-ink-muted border-border-peach hover:border-border-peach/80",
    dotClass: "bg-ink-muted/50",
    requiresReviewer: false,
  },
  NEEDS_REVISION: {
    value: "NEEDS_REVISION",
    label: "Needs Revision",
    description: "Returned to author with revisions",
    badgeClass: "bg-tint-cream text-warning border-warning/30 hover:border-warning/60",
    dotClass: "bg-warning",
    requiresReviewer: true,
  },
  ARCHIVED: {
    value: "ARCHIVED",
    label: "Archived",
    description: "Hidden from public catalog",
    badgeClass: "bg-surface-muted text-ink-faint border-border-peach hover:border-border-peach/80",
    dotClass: "bg-ink-faint",
    requiresReviewer: true,
  },
};

interface GuideStatusDropdownProps {
  guideId: string;
  currentStatus: GuideStatus | string;
  guideTitle?: string;
  className?: string;
  disabled?: boolean;
}

export default function GuideStatusDropdown({
  guideId,
  currentStatus,
  guideTitle,
  className,
  disabled = false,
}: GuideStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState<GuideStatus | null>(null);
  const [updateGuide, { isLoading: isUpdating }] = useUpdateGuideMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAppSelector((state) => (state.auth as any)?.user);
  const canDirectPublish = ["SUPERADMIN", "ADMIN", "VET"].includes(
    user?.role?.toUpperCase() || ""
  );

  // Sync optimistic status with incoming props when they change
  useEffect(() => {
    setOptimisticStatus(null);
  }, [currentStatus]);

  const activeStatus = optimisticStatus || currentStatus;
  const normalizedStatus = (activeStatus?.toUpperCase() || "DRAFT") as GuideStatus;

  const currentConfig = STATUS_CONFIG[normalizedStatus] || {
    value: normalizedStatus,
    label: activeStatus || "Draft",
    description: "",
    badgeClass: "bg-surface-muted text-ink-muted border-border-peach",
    dotClass: "bg-ink-muted/60",
    requiresReviewer: false,
  };

  const handleSelectStatus = async (nextStatus: GuideStatus) => {
    if (nextStatus === normalizedStatus) {
      setOpen(false);
      return;
    }

    setOpen(false);
    // Instant optimistic update on this specific badge
    setOptimisticStatus(nextStatus);

    try {
      await updateGuide({
        id: guideId,
        payload: { status: nextStatus },
      }).unwrap();

      const nextLabel = STATUS_CONFIG[nextStatus]?.label || nextStatus;
      toast.success(`Status updated to "${nextLabel}"`);
    } catch (err: unknown) {
      // Rollback optimistic state if mutation fails
      setOptimisticStatus(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errObj = err as any;
      const message =
        errObj?.data?.message ||
        errObj?.message ||
        "Failed to update guide status. Please check permissions.";
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
              "group inline-flex items-center justify-between w-[150px] h-7 px-2.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-150 cursor-pointer select-none",
              currentConfig.badgeClass,
              isUpdating && "opacity-80 cursor-wait",
              disabled && "opacity-50 cursor-not-allowed",
              open && "ring-2 ring-coral/20",
              className
            )}
            title="Click to change guide status"
          >
            <span className="flex items-center gap-1.5 min-w-0 flex-1 text-left">
              {isUpdating ? (
                <Loader2 className="size-3 animate-spin shrink-0 text-coral" />
              ) : (
                <span className={cn("size-1.5 rounded-full shrink-0", currentConfig.dotClass)} />
              )}
              <span className="truncate">{currentConfig.label}</span>
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
            Change Status
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

        <div className="py-1 space-y-0.5">
          {Object.values(STATUS_CONFIG).map((opt) => {
            const isCurrent = opt.value === normalizedStatus;
            const isRestricted = opt.requiresReviewer && !canDirectPublish;

            return (
              <button
                key={opt.value}
                type="button"
                disabled={isRestricted || isUpdating}
                onClick={() => handleSelectStatus(opt.value)}
                className={cn(
                  "w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 transition-colors duration-150 cursor-pointer",
                  isCurrent
                    ? "bg-coral-light/60 text-ink font-bold"
                    : "text-ink hover:bg-surface-soft hover:text-coral",
                  isRestricted &&
                    "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-ink"
                )}
                title={
                  isRestricted
                    ? "Requires Vet or Admin permissions"
                    : opt.description
                }
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn("size-2 rounded-full shrink-0", opt.dotClass)} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs leading-snug">{opt.label}</span>
                    <span className="text-[10px] text-ink-muted font-normal truncate leading-tight">
                      {opt.description}
                    </span>
                  </div>
                </div>
                {isCurrent && <Check className="size-3.5 text-coral shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
