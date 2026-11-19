import { cn } from "@/lib/utils";
import Skeleton from "@/components/common/Skeleton";

interface DynamicTableSkeletonProps {
  /** Number of rows to display in the skeleton. Defaults to 5. */
  rows?: number;
  /** Number of columns to display in the skeleton. Defaults to 6. */
  columns?: number;
  /** Whether to show the toolbar (search/filter) skeleton. Defaults to true. */
  showToolbar?: boolean;
  /** Whether to show the pagination skeleton. Defaults to true. */
  showPagination?: boolean;
  /** Custom className for the container */
  className?: string;
}

/**
 * A skeleton loader designed to match the DynamicTable component's layout.
 * Supports both desktop table and mobile card view layouts.
 */
export const DynamicTableSkeleton = ({
  rows = 5,
  columns = 6,
  showToolbar = true,
  showPagination = true,
  className,
}: DynamicTableSkeletonProps) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-4 animate-in fade-in duration-500",
        className,
      )}
    >
      {/* Separated Title & Toolbar Skeleton */}
      {showToolbar && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Skeleton className="h-6 w-44" /> {/* Title Area */}
          <div className="flex items-center gap-2.5 sm:ml-auto w-full sm:w-auto justify-end">
            <Skeleton className="h-10 flex-1 sm:flex-initial sm:w-72 md:w-80 rounded-lg" /> {/* Search Input */}
            <Skeleton className="h-10 w-28 rounded-lg shrink-0" /> {/* Filter Button */}
          </div>
        </div>
      )}

      {/* Separated Table Card Skeleton */}
      <div className="w-full bg-card rounded-lg shadow-xs border border-border-peach overflow-hidden">
        {/* Desktop Table Layout (Skeleton) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-tint-rose/60 border-b border-border-peach">
              <th className="px-6 py-4 w-12">
                <Skeleton className="h-4 w-4 rounded" />
              </th>
              {Array.from({ length: columns }).map((_, i) => (
                <th
                  key={i}
                  className={cn("px-6 py-4", i === 0 ? "text-left" : "text-center")}
                >
                  <Skeleton
                    className={cn("h-4 w-20", i === 0 ? "" : "mx-auto")}
                  />
                </th>
              ))}
              <th className="px-6 py-4 w-24 text-center">
                <Skeleton className="h-4 w-16 mx-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "transition-colors",
                  rowIndex % 2 !== 0 ? "bg-gray-50/30" : "bg-white",
                )}
              >
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-4 rounded" />
                </td>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      "px-6 py-4",
                      colIndex === 0 ? "text-left" : "text-center"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3",
                        colIndex === 0 ? "" : "justify-center"
                      )}
                    >
                      {/* Simulate an avatar/icon for the first column */}
                      {colIndex === 0 && (
                        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                      )}
                      <Skeleton
                        className={cn(
                          "h-3.5",
                          colIndex === 0 ? "w-32" : "w-20"
                        )}
                      />
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout (Skeleton) */}
      <div className="lg:hidden divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "p-5 space-y-5",
              i % 2 !== 0 ? "bg-gray-50/30" : "bg-white",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24 opacity-60" />
                </div>
              </div>
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            {/* Inner field simulation for mobile cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-2.5 w-12 opacity-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-2.5 w-12 opacity-40" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      {showPagination && (
        <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-peach bg-card">
          <Skeleton className="h-5 w-48" /> {/* Showing X to Y of Z */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24 rounded-lg" /> {/* Prev Button */}
            <div className="hidden sm:flex gap-1.5 mx-1">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-24 rounded-lg" /> {/* Next Button */}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DynamicTableSkeleton;
