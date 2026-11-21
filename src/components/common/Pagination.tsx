"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";
import CommonSelect from "@/components/common/CommonSelect";
import { getStorageKey } from "@/hooks/usePersistedPageSize";

export const DEFAULT_PAGE_SIZE_OPTIONS: (number | "all")[] = [
  10, 20, 30, 40, 50, 100, "all",
];

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  label?: string;
  pageSize?: number | "all";
  pageSizeOptions?: (number | "all")[];
  onPageSizeChange?: (pageSize: number | "all") => void;
  /** Optional key/name to automatically persist the page size to localStorage */
  storageKey?: string;
  /** Alias for storageKey */
  tableName?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  label = "Results",
  pageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageSizeChange,
  storageKey,
  tableName,
}: PaginationProps) => {
  const effectiveKey = storageKey || tableName;

  // Restore persisted page size on mount if provided
  useEffect(() => {
    if (!effectiveKey || !onPageSizeChange || typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(getStorageKey(effectiveKey));
      if (saved !== null) {
        const nextVal = saved === "all" ? "all" : Number(saved);
        if (nextVal === "all" || (!isNaN(nextVal) && nextVal > 0)) {
          if (nextVal !== pageSize) {
            onPageSizeChange(nextVal);
          }
        }
      }
    } catch {
      // Ignore
    }
  }, [effectiveKey]);
  const getPageButtons = () => {
    const buttons: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      // Show first 2, last, current ±1
      if (
        i === 1 ||
        i === 2 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        buttons.push("...");
      }
    }

    // Remove duplicate "..."
    return buttons.filter(
      (btn, idx, arr) => !(btn === "..." && arr[idx - 1] === "..."),
    );
  };

  const isAll = pageSize === "all" || itemsPerPage >= totalItems;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = isAll ? totalItems : Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border-peach bg-card">
      {/* Left side: Showing X-Y of Z + Page Size Dropdown */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm font-medium text-ink-muted">
        <div>
          Showing{" "}
          <span className="text-ink font-semibold">
            {startItem}-{endItem}
          </span>{" "}
          of <span className="text-ink font-semibold">{totalItems}</span>{" "}
          {label}
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted">Show:</span>
            <CommonSelect
              options={pageSizeOptions.map((opt) => ({
                label: opt === "all" ? "All" : `${opt} / page`,
                value: String(opt),
              }))}
              value={String(
                pageSize ??
                  (itemsPerPage >= totalItems && totalItems > 0
                    ? "all"
                    : itemsPerPage),
              )}
              onChange={(val) => {
                const nextVal = val === "all" ? "all" : Number(val);
                if (effectiveKey && typeof window !== "undefined") {
                  try {
                    localStorage.setItem(getStorageKey(effectiveKey), String(nextVal));
                  } catch {
                    // Ignore
                  }
                }
                onPageSizeChange(nextVal);
              }}
              size="sm"
              className="h-8 text-xs font-bold font-quicksand rounded-lg border-border-peach bg-surface-soft text-ink hover:border-coral/50 cursor-pointer min-w-[110px]"
              containerClassName="w-auto inline-flex"
              popoverClassName="min-w-[125px] rounded-lg shadow-lg"
              listClassName="overflow-hidden max-h-none"
            />
          </div>
        )}
      </div>

      {/* Pagination Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          {/* Prev Button */}
          <PrimaryButton
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            leftIcon={<ChevronLeft size={16} />}
          >
            Prev
          </PrimaryButton>

          {/* Page Buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
            {getPageButtons().map((btn, idx) =>
              btn === "..." ? (
                <span
                  key={idx}
                  className="w-9 text-center text-ink-muted/40 font-bold select-none"
                >
                  ...
                </span>
              ) : (
                <PrimaryButton
                  key={idx}
                  variant={currentPage === btn ? "primary" : "outline"}
                  size="sm"
                  className="w-9 h-9 p-0 font-bold"
                  onClick={() => onPageChange(btn as number)}
                >
                  {btn}
                </PrimaryButton>
              ),
            )}
          </div>

          {/* Next Button */}
          <PrimaryButton
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            rightIcon={<ChevronRight size={16} />}
          >
            Next
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default Pagination;
