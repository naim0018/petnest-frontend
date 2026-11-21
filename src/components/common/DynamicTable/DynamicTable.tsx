"use client";

import { useState, useMemo, useEffect } from "react";
import { Tooltip } from "@/components/common/Tooltip";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
  LayoutList,
  LayoutGrid,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/common/Pagination";
import SearchField, {
  type SearchSuggestionItem,
} from "@/components/common/SearchField";

// ============================================
// 📦 Type Definitions
// ============================================

export type ColumnAlignment = "left" | "center" | "right";
export type TableViewMode = "table" | "grid";
export type GridCardVariant = "with-image" | "without-image";

export interface Column<T> {
  /** Unique key for the column */
  key: string;
  /** Display label for the column header */
  label: string;
  /** Accessor function or key path to get the value from data */
  accessor?: keyof T | ((row: T) => unknown);
  /** Custom render function for cell content */
  render?: (row: T, index: number) => React.ReactNode;
  /** Column alignment */
  align?: ColumnAlignment;
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Custom width (e.g., "200px", "20%", "auto") */
  width?: string;
  /** Hide column on mobile */
  hideOnMobile?: boolean;
  /** Disable automatic tooltip for this column */
  showTooltip?: boolean;
}

export type ActionVariant =
  | "primary"
  | "danger"
  | "secondary"
  | "info"
  | "warning"
  | "success"
  | "purple"
  | "amber";

export interface TableAction<T> {
  label: string;
  onClick: (row: T, index: number) => void;
  icon?: React.ReactNode;
  variant?: ActionVariant;
  className?: string;
}

export const getActionVariantClass = (
  variant?: ActionVariant | string,
  customClass?: string,
): string => {
  if (customClass) return customClass;
  switch (variant) {
    case "primary":
      // PetNest Coral brand
      return "text-coral bg-coral/10 border-coral/25 hover:bg-coral hover:text-white hover:border-coral";
    case "danger":
      // Destructive / Rose
      return "text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 dark:bg-rose-950/30 dark:border-rose-900/40";
    case "info":
      // Sky blue
      return "text-sky-600 bg-sky-50 border-sky-200 hover:bg-sky-500 hover:text-white hover:border-sky-500 dark:bg-sky-950/30 dark:border-sky-900/40 dark:text-sky-400";
    case "warning":
    case "amber":
      // Sunshine / Amber
      return "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-500 hover:text-white hover:border-amber-500 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-400";
    case "purple":
      // Lavender / Purple
      return "text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-600 hover:text-white hover:border-purple-600 dark:bg-purple-950/30 dark:border-purple-900/40 dark:text-purple-400";
    case "success":
      // Mint / Emerald
      return "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-400";
    case "secondary":
    default:
      // Neutral ink / surface
      return "text-ink-muted bg-surface-muted border-border-peach hover:bg-ink hover:text-white hover:border-ink";
  }
};

export interface DynamicTableProps<T> {
  /** Array of data to display */
  data: T[];
  /** Column configuration */
  columns: Column<T>[];
  /** Enable row selection with checkboxes */
  selectable?: boolean;
  /** Callback when row selection changes */
  onSelectionChange?: (selectedRows: T[]) => void;
  /** Enable pagination */
  pagination?: boolean;
  /** Items per page (default: 10) */
  pageSize?: number | "all";
  /** Available page size choices (default: [10, 20, 30, 40, 50, 100, "all"]) */
  pageSizeOptions?: (number | "all")[];
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number | "all") => void;
  /** Whether to show a sequential "No." column (default: true) */
  showRowNumber?: boolean;
  /** Optional base offset for row numbers (e.g. (page - 1) * pageSize) */
  rowNumberOffset?: number;
  /** Enable search/filter */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Controlled search value (if controlled externally) */
  searchValue?: string;
  /** Callback when search input changes */
  onSearchChange?: (query: string) => void;
  /** Disable client-side filtering (e.g. when server-side filtering is active) */
  manualFiltering?: boolean;
  /** Optional suggestions for SearchField popover */
  searchSuggestions?: SearchSuggestionItem[];
  /** Search loading indicator */
  searchLoading?: boolean;
  /** Custom search function */
  onSearch?: (query: string, data: T[]) => T[];
  /** Row actions (edit, delete, etc.) */
  actions?: TableAction<T>[];
  /** Bulk actions for selected rows */
  bulkActions?: {
    label: string;
    onClick: (selectedRows: T[]) => void;
    icon?: React.ReactNode;
    variant?: "primary" | "danger" | "secondary";
  }[];
  /** Empty state message */
  emptyMessage?: string;
  /** Loading state */
  loading?: boolean;
  /** Custom row key extractor */
  getRowKey?: (row: T, index: number) => string | number;
  /** Custom row className */
  rowClassName?: (row: T, index: number) => string;
  /** Enable hover effect on rows */
  hoverable?: boolean;
  /** Enable striped rows */
  striped?: boolean;
  /** Table title */
  title?: React.ReactNode;
  /** Optional icon displayed before the table title */
  titleIcon?: React.ReactNode;
  /** Optional count or badge displayed next to the title (e.g. 4 or "4 guides") */
  countBadge?: React.ReactNode | number;
  /** Optional custom node rendered on the right side of the title row */
  headerRight?: React.ReactNode;
  /** Optional separated filter bar card rendered between the title row and the table card */
  filterContent?: React.ReactNode;
  /** Optional custom footer (e.g. server-side Pagination) rendered inside the bottom of the table card */
  footer?: React.ReactNode;
  /** Show default built-in Filter By button in toolbar (default: true) */
  showFilterButton?: boolean;
  /** Optional click handler for the built-in Filter By button */
  onFilterClick?: () => void;
  /** Whether the filter panel is currently active / toggled open */
  isFilterActive?: boolean;
  /** Count of active filter parameters displayed as a pill */
  activeFilterCount?: number;
  /** Enable row drag & drop reordering */
  reorderable?: boolean;
  /** Custom label for the row number / order column (default: "No.") */
  rowNumberHeader?: string;
  /** Callback when rows are reordered via drag & drop */
  onRowReorder?: (newData: T[], fromIndex: number, toIndex: number) => void;
  /** Enable view mode switching between table and grid (default: true) */
  enableViewToggle?: boolean;
  /** Current view mode if controlled: "table" | "grid" */
  viewMode?: TableViewMode;
  /** Initial view mode if uncontrolled (default: "table") */
  defaultViewMode?: TableViewMode;
  /** Callback when view mode changes */
  onViewModeChange?: (mode: TableViewMode) => void;
  /** Optional function to extract image URL for card in grid view */
  getCardImage?: (row: T) => string | undefined | null;
  /** Optional key in data object representing the image URL */
  cardImageKey?: keyof T | string;
  /** Optional function to extract title for card in grid view */
  getCardTitle?: (row: T) => React.ReactNode;
  /** Optional function to extract subtitle/badge text for card in grid view */
  getCardSubtitle?: (row: T) => React.ReactNode;
  /** Optional custom grid card render function */
  renderGridCard?: (
    row: T,
    index: number,
    meta: {
      isSelected: boolean;
      onSelect: (checked: boolean) => void;
      hasImage: boolean;
    }
  ) => React.ReactNode;
  /** Custom className for the grid container */
  gridClassName?: string;
}

// ============================================
// 🏷️ TableTitle Component (Reusable)
// ============================================

export interface TableTitleProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  count?: React.ReactNode | number;
  badge?: React.ReactNode;
  className?: string;
}

export const TableTitle = ({
  title,
  icon,
  count,
  badge,
  className,
}: TableTitleProps) => {
  if (!title && !icon && count === undefined && !badge) return null;

  // If title is already a custom React element and no separate icon/count provided, render it directly
  if (
    typeof title === "object" &&
    title !== null &&
    !icon &&
    count === undefined &&
    !badge
  ) {
    return (
      <div
        className={cn(
          "text-base sm:text-lg font-bold font-quicksand text-ink leading-tight",
          className,
        )}
      >
        {title}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {icon && (
        <span className="text-coral shrink-0 flex items-center">
          {icon}
        </span>
      )}
      {typeof title === "string" ? (
        <h2 className="text-base sm:text-lg font-bold font-quicksand text-ink leading-tight">
          {title}
        </h2>
      ) : (
        title
      )}
      {badge ? (
        badge
      ) : count !== undefined && count !== null ? (
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-muted text-ink-muted border border-border-peach shrink-0">
          {typeof count === "number" ? `${count}` : count}
        </span>
      ) : null}
    </div>
  );
};

// ============================================
// 🎨 Component
// ============================================

const DynamicTable = <T extends object>({
  data,
  columns,
  selectable = false,
  onSelectionChange,
  pagination = false,
  pageSize = 10,
  pageSizeOptions,
  onPageSizeChange,
  showRowNumber = true,
  rowNumberOffset,
  searchable = false,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  manualFiltering = false,
  searchSuggestions,
  searchLoading = false,
  onSearch,
  actions,
  bulkActions,
  emptyMessage = "No data available",
  loading = false,
  getRowKey,
  rowClassName,
  hoverable = true,
  striped = false,
  title,
  titleIcon,
  countBadge,
  headerRight,
  filterContent,
  footer,
  showFilterButton = false,
  onFilterClick,
  isFilterActive = false,
  activeFilterCount,
  reorderable = false,
  rowNumberHeader = "No.",
  onRowReorder,
  enableViewToggle = true,
  viewMode,
  defaultViewMode = "table",
  onViewModeChange,
  getCardImage,
  cardImageKey,
  getCardTitle,
  getCardSubtitle,
  renderGridCard,
  gridClassName,
}: DynamicTableProps<T>) => {
  // ============================================
  // 📊 State Management
  // ============================================
  const [internalViewMode, setInternalViewMode] =
    useState<TableViewMode>(defaultViewMode);
  const currentViewMode = viewMode !== undefined ? viewMode : internalViewMode;

  const handleViewModeChange = (mode: TableViewMode) => {
    if (viewMode === undefined) {
      setInternalViewMode(mode);
    }
    onViewModeChange?.(mode);
  };
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const effectiveSearchQuery =
    searchValue !== undefined ? searchValue : searchQuery;
  const isControlledSearch = searchValue !== undefined;
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(
    new Set(),
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // ============================================
  // 🔍 Search & Filter Logic
  // ============================================
  const filteredData = useMemo(() => {
    if (manualFiltering) return data;
    if (!effectiveSearchQuery) return data;

    if (onSearch) {
      return onSearch(effectiveSearchQuery, data);
    }

    // Default search: search all string values
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(effectiveSearchQuery.toLowerCase()),
      ),
    );
  }, [data, effectiveSearchQuery, onSearch, manualFiltering]);

  // ============================================
  // 🔀 Sorting Logic
  // ============================================
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const column = columns.find((col) => col.key === sortConfig.key);
      if (!column) return 0;

      let aValue: unknown;
      let bValue: unknown;

      if (typeof column.accessor === "function") {
        aValue = column.accessor(a);
        bValue = column.accessor(b);
      } else if (column.accessor) {
        aValue = a[column.accessor];
        bValue = b[column.accessor];
      } else {
        return 0;
      }

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filteredData, sortConfig, columns]);

  // ============================================
  // 📄 Pagination Logic
  // ============================================
  const [internalPageSize, setInternalPageSize] = useState<number | "all">(pageSize);
  const effectivePageSize = onPageSizeChange ? pageSize : internalPageSize;

  useEffect(() => {
    setInternalPageSize(pageSize);
  }, [pageSize]);

  const paginatedData = useMemo(() => {
    if (!pagination || effectivePageSize === "all") {
      return sortedData;
    }
    const startIndex = (currentPage - 1) * effectivePageSize;
    const endIndex = startIndex + effectivePageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [pagination, sortedData, currentPage, effectivePageSize]);

  const totalPages =
    !pagination || effectivePageSize === "all"
      ? 1
      : Math.ceil(sortedData.length / effectivePageSize);

  // ============================================
  // 🎯 Event Handlers
  // ============================================
  const handleSort = (columnKey: string) => {
    setSortConfig((prev) => {
      if (prev?.key === columnKey) {
        return {
          key: columnKey,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key: columnKey, direction: "asc" };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = paginatedData.map((row, index) =>
        getRowKey ? getRowKey(row, index) : index,
      );
      setSelectedRows(new Set(allKeys));

      if (onSelectionChange) {
        onSelectionChange(paginatedData);
      }
    } else {
      setSelectedRows(new Set());
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    }
  };

  const handleSelectRow = (rowKey: string | number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowKey);
    } else {
      newSelected.delete(rowKey);
    }
    setSelectedRows(newSelected);

    if (onSelectionChange) {
      const selectedData = data.filter((row, index) =>
        newSelected.has(getRowKey ? getRowKey(row, index) : index),
      );
      onSelectionChange(selectedData);
    }
  };

  const toggleRowExpansion = (rowKey: string | number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowKey)) {
      newExpanded.delete(rowKey);
    } else {
      newExpanded.add(rowKey);
    }
    setExpandedRows(newExpanded);
  };

  const getCellValue = (row: T, column: Column<T>) => {
    if (column.render) {
      return column.render(row, data.indexOf(row));
    }

    if (typeof column.accessor === "function") {
      return String(column.accessor(row));
    }

    if (column.accessor) {
      return String(row[column.accessor] ?? "");
    }

    return "";
  };

  const getTooltipText = (row: T, column: Column<T>) => {
    if (column.showTooltip === false) return "";
    if (typeof column.accessor === "function") {
      return String(column.accessor(row));
    }
    if (column.accessor) {
      const val = row[column.accessor as keyof T];
      if (typeof val === "string" || typeof val === "number")
        return String(val);
    }

    // If no accessor, check the data object using the key
    const value = row[column.key as keyof T];
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    // Handle objects (e.g., { name: '...' })
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const obj = value as Record<string, unknown>;
      if (typeof obj.name === "string") return obj.name;
      if (typeof obj.label === "string") return obj.label;
    }

    // Handle arrays (e.g., [{ name: '...' }])
    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === "string" || typeof item === "number")
            return String(item);
          if (item && typeof item === "object") {
            const obj = item as Record<string, unknown>;
            return String(obj.name || obj.label || "");
          }
          return "";
        })
        .filter(Boolean)
        .join(", ");
    }

    return "";
  };

  const getColumnAlignment = (column: Column<T>, colIndex: number): ColumnAlignment => {
    if (column.align) {
      return column.align;
    }
    // Per requirement: first column is left-aligned, rest of the columns are center-aligned (middle)
    return colIndex === 0 ? "left" : "center";
  };

  const getAlignmentClass = (align?: ColumnAlignment) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  const toDisplayString = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") return val.trim();
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (typeof val === "object") {
      if (Array.isArray(val)) {
        return val
          .map((item) => toDisplayString(item))
          .filter(Boolean)
          .join(", ");
      }
      const obj = val as Record<string, unknown>;
      const textCandidate =
        obj.name ||
        obj.title ||
        obj.label ||
        obj.displayName ||
        obj.text ||
        obj.value;
      if (textCandidate && typeof textCandidate === "string") {
        return textCandidate.trim();
      }
      return "";
    }
    return "";
  };

  const extractCardImage = (row: T): string | null => {
    if (getCardImage) {
      const custom = getCardImage(row);
      if (custom && typeof custom === "string" && custom.trim().length > 0) {
        return custom.trim();
      }
    }

    const r = row as Record<string, unknown>;
    if (cardImageKey && r[cardImageKey as string]) {
      const val = r[cardImageKey as string];
      if (typeof val === "string" && val.trim().length > 0) return val.trim();
    }

    const candidateKeys = [
      "coverImage",
      "image",
      "imageUrl",
      "thumbnail",
      "photo",
      "picture",
      "banner",
    ];

    for (const k of candidateKeys) {
      if (typeof r[k] === "string" && (r[k] as string).trim().length > 0) {
        return (r[k] as string).trim();
      }
    }

    if (typeof r.avatar === "string" && r.avatar.trim().length > 0) {
      return r.avatar.trim();
    }

    return null;
  };

  const extractCardTitle = (row: T, index: number): React.ReactNode => {
    if (getCardTitle) {
      return getCardTitle(row);
    }
    const r = row as Record<string, unknown>;
    const titleKeys = [
      "title",
      "name",
      "breedName",
      "productName",
      "fileName",
      "subject",
      "label",
    ];
    for (const k of titleKeys) {
      if (r[k] !== undefined && r[k] !== null) {
        const text = toDisplayString(r[k]);
        if (text) return text;
      }
    }
    if (columns.length > 0) {
      const firstVal = getCellValue(row, columns[0]);
      if (firstVal !== undefined && firstVal !== null) {
        return firstVal;
      }
    }
    return `Item #${index + 1}`;
  };

  const extractCardSubtitle = (row: T): string | null => {
    if (getCardSubtitle) {
      const res = getCardSubtitle(row);
      const str = toDisplayString(res);
      return str || null;
    }
    const r = row as Record<string, unknown>;
    const subtitleKeys = [
      "category",
      "subtitle",
      "petType",
      "species",
      "breed",
      "type",
      "role",
      "storeName",
      "department",
    ];
    for (const k of subtitleKeys) {
      if (r[k] !== undefined && r[k] !== null) {
        const text = toDisplayString(r[k]);
        if (text) return text;
      }
    }
    return null;
  };

  // ============================================
  // 🎨 Render
  // ============================================
  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Separated Title & Search/Controls Row */}
      {(title ||
        titleIcon ||
        countBadge !== undefined ||
        searchable ||
        showFilterButton ||
        enableViewToggle ||
        headerRight) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {(title || titleIcon || countBadge !== undefined) && (
            <TableTitle
              title={title}
              icon={titleIcon}
              count={countBadge}
            />
          )}

          {(searchable ||
            showFilterButton ||
            enableViewToggle ||
            headerRight) && (
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:ml-auto w-full sm:w-auto justify-end">
              {searchable && (
                <SearchField
                  value={effectiveSearchQuery}
                  onChange={(val) => {
                    if (isControlledSearch) {
                      onSearchChange?.(val);
                    } else {
                      setSearchQuery(val);
                      setCurrentPage(1);
                    }
                  }}
                  placeholder={searchPlaceholder}
                  suggestions={searchSuggestions}
                  isLoading={searchLoading}
                  className="h-10 rounded-lg"
                  containerClassName="flex-1 sm:flex-initial sm:w-72 md:w-80"
                />
              )}

              {showFilterButton && (
                <button
                  type="button"
                  onClick={onFilterClick}
                  className={cn(
                    "flex items-center gap-2 h-10 px-4 bg-card border rounded-lg text-sm font-semibold shadow-2xs transition-all min-w-fit cursor-pointer shrink-0",
                    isFilterActive
                      ? "border-coral text-coral bg-coral/5"
                      : "border-border-peach text-ink-muted hover:border-coral/50 hover:text-ink",
                  )}
                >
                  <Filter className="size-4" />
                  <span>Filter By</span>
                  {typeof activeFilterCount === "number" &&
                    activeFilterCount > 0 && (
                      <span className="size-5 rounded-full bg-coral text-white text-[11px] font-bold flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                </button>
              )}

              {/* View Mode Toggle: Table vs Grid */}
              {enableViewToggle && (
                <div className="inline-flex items-center p-0.5 rounded-lg border border-border-peach bg-surface-muted shadow-2xs shrink-0">
                  <button
                    type="button"
                    onClick={() => handleViewModeChange("table")}
                    title="Table View"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold font-quicksand transition-all cursor-pointer",
                      currentViewMode === "table"
                        ? "bg-coral text-white shadow-2xs"
                        : "text-ink-muted hover:text-ink hover:bg-card/60",
                    )}
                    aria-label="Table View"
                  >
                    <LayoutList className="size-4" />
                    <span className="hidden sm:inline">Table</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewModeChange("grid")}
                    title="Grid View"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold font-quicksand transition-all cursor-pointer",
                      currentViewMode === "grid"
                        ? "bg-coral text-white shadow-2xs"
                        : "text-ink-muted hover:text-ink hover:bg-card/60",
                    )}
                    aria-label="Grid View"
                  >
                    <LayoutGrid className="size-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                </div>
              )}

              {headerRight}
            </div>
          )}
        </div>
      )}

      {/* 2. Separated Filter Panel Card */}
      {filterContent && (
        <div className="w-full rounded-lg bg-card border border-border-peach p-4 sm:p-5 shadow-xs">
          {filterContent}
        </div>
      )}

      {/* 3. Separated Table Card */}
      <div className="w-full bg-card rounded-lg shadow-xs border border-border-peach overflow-hidden">

      {/* Selected Items Toolbar */}
      {selectable && selectedRows.size > 0 && (
        <div className="px-6 py-3 bg-primary-brand/[0.03] border-b border-border flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-primary-brand dark:text-slate-100 bg-primary-brand/10 px-3 py-1 rounded-full border border-primary-brand/20">
              {selectedRows.size} Selected
            </span>
            <div className="h-4 w-px bg-border" />

            {bulkActions && (
              <div className="flex items-center gap-1">
                {bulkActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const selectedData = data.filter((row, index) =>
                        selectedRows.has(
                          getRowKey ? getRowKey(row, index) : index,
                        ),
                      );
                      action.onClick(selectedData);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all",
                      action.variant === "danger"
                        ? "text-rose-500 hover:bg-rose-500/10"
                        : action.variant === "primary"
                          ? "text-primary-brand hover:bg-primary-brand/5"
                          : "text-secondary-text hover:bg-light-background",
                    )}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 💻 Desktop Table View */}
      {currentViewMode === "grid" ? (
        <div className="w-full">
          {/* Grid Select-All Subheader */}
          {selectable && paginatedData.length > 0 && (
            <div className="px-4 sm:px-6 py-2.5 bg-surface-soft border-b border-border-peach flex items-center justify-between text-xs font-bold text-ink-muted font-quicksand">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={
                    paginatedData.length > 0 &&
                    selectedRows.size === paginatedData.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="size-4 rounded border-border-peach text-coral focus:ring-coral/20 transition-all cursor-pointer accent-coral"
                />
                <span>Select All ({paginatedData.length} items)</span>
              </label>
              <span>{selectedRows.size} Selected</span>
            </div>
          )}

          {loading ? (
            <div
              className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-5",
                gridClassName,
              )}
            >
              {Array.from({ length: typeof pageSize === "number" ? pageSize : 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border-peach bg-card p-5 animate-pulse shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="h-5 bg-surface-muted rounded-md w-3/4" />
                    <div className="h-4 bg-surface-muted/60 rounded-md w-1/3" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-peach">
                    <div className="h-3 bg-surface-muted/60 rounded w-1/2" />
                    <div className="h-3 bg-surface-muted/60 rounded w-1/2" />
                    <div className="h-4 bg-surface-muted/80 rounded w-3/4" />
                    <div className="h-4 bg-surface-muted/80 rounded w-3/4" />
                  </div>
                  <div className="h-7 w-20 bg-surface-muted rounded-lg self-end" />
                </div>
              ))}
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-bold text-ink">{emptyMessage}</p>
                <p className="text-xs text-ink-muted">
                  Try adjusting your search or filters
                </p>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-5",
                gridClassName,
              )}
            >
              {paginatedData.map((row, index) => {
                const rowKey = getRowKey ? getRowKey(row, index) : index;
                const isSelected = selectedRows.has(rowKey);
                const imageUrl = extractCardImage(row);
                const hasImage = Boolean(
                  imageUrl && imageUrl.trim().length > 0,
                );
                const titleNode = extractCardTitle(row, index);
                const subtitleText = extractCardSubtitle(row);

                if (renderGridCard) {
                  return (
                    <div key={rowKey} className="w-full">
                      {renderGridCard(row, index, {
                        isSelected,
                        onSelect: (checked) =>
                          handleSelectRow(rowKey, checked),
                        hasImage,
                      })}
                    </div>
                  );
                }

                const baseCardCols = columns.filter((col) => {
                  const k = col.key.toLowerCase();
                  return (
                    k !== "image" &&
                    k !== "coverimage" &&
                    k !== "photo" &&
                    k !== "avatar" &&
                    col.key !== columns[0]?.key
                  );
                });

                const hasCategoryCol = baseCardCols.some((col) =>
                  col.key.toLowerCase().includes("category")
                );

                const cardCols: Column<T>[] = [...baseCardCols];

                if (subtitleText && !hasCategoryCol) {
                  const categoryCol: Column<T> = {
                    key: "category",
                    label: "Category",
                    render: () => (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold font-quicksand bg-coral/10 text-coral border border-coral/20">
                        {subtitleText}
                      </span>
                    ),
                  };

                  const statusIdx = cardCols.findIndex((col) =>
                    col.key.toLowerCase().includes("status")
                  );

                  if (statusIdx !== -1) {
                    if (statusIdx % 2 === 1) {
                      // Status is in the right column of a 2-col row.
                      // Place Category on the left of Status, and move the displaced item after Status.
                      const displaced = cardCols[statusIdx - 1];
                      cardCols.splice(statusIdx - 1, 1, categoryCol);
                      cardCols.splice(statusIdx + 1, 0, displaced);
                    } else {
                      cardCols.splice(statusIdx, 0, categoryCol);
                    }
                  } else {
                    cardCols.unshift(categoryCol);
                  }
                }

                return (
                  <div
                    key={rowKey}
                    className={cn(
                      "group bg-card rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative shadow-2xs hover:shadow-md hover:border-coral/50",
                      isSelected
                        ? "border-coral ring-2 ring-coral/30 bg-coral/[0.02]"
                        : "border-border-peach",
                      rowClassName?.(row, index),
                    )}
                  >
                    {/* Top Image Section (Only rendered if item has an image) */}
                    {hasImage && (
                      <div className="relative h-44 sm:h-48 w-full bg-surface-muted overflow-hidden shrink-0 card-image-container">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl!}
                          alt={
                            typeof titleNode === "string"
                              ? titleNode
                              : "Item image"
                          }
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const parent = (
                              e.target as HTMLElement
                            ).closest(".card-image-container");
                            if (parent)
                              (parent as HTMLElement).style.display =
                                "none";
                          }}
                        />

                        {selectable && (
                          <div className="absolute top-3 left-3 z-10 bg-card/90 backdrop-blur-xs p-1.5 rounded-lg border border-border-peach shadow-2xs flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) =>
                                handleSelectRow(rowKey, e.target.checked)
                              }
                              className="size-4 rounded border-border-peach text-coral focus:ring-coral/20 transition-all cursor-pointer accent-coral"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Content Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Header Checkbox (Only if item has no image and is selectable) */}
                        {!hasImage && selectable && (
                          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-border-peach">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) =>
                                handleSelectRow(rowKey, e.target.checked)
                              }
                              className="size-4 rounded border-border-peach text-coral focus:ring-coral/20 transition-all cursor-pointer accent-coral"
                            />
                            <span className="text-xs font-bold font-quicksand text-ink-muted">
                              Select Item
                            </span>
                          </div>
                        )}

                        {/* Title (Consistent height for 2 lines so card layouts align) */}
                        <div className="min-w-0">
                          <h3 className="font-bold font-quicksand text-base sm:text-lg text-ink leading-snug line-clamp-2 tracking-tight group-hover:text-coral transition-colors h-12 sm:h-14 flex items-start">
                            {titleNode}
                          </h3>
                        </div>

                        {/* Columns / Fields Grid */}
                        {cardCols.length > 0 && (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 pt-4 mt-4 border-t border-border-peach">
                            {cardCols.map((col) => {
                              return (
                                <div
                                  key={col.key}
                                  className="flex flex-col min-w-0"
                                >
                                  <span className="text-[11px] font-bold font-quicksand uppercase tracking-wider text-ink-muted mb-1">
                                    {col.label}
                                  </span>
                                  <div className="text-xs font-bold text-ink flex items-center min-w-0 overflow-visible">
                                    {getCellValue(row, col)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {actions && actions.length > 0 && (
                        <div className="flex items-center justify-end gap-1.5 pt-3.5 border-t border-border-peach mt-4">
                          {actions.map((action, idx) => (
                            <Tooltip key={idx} content={action.label}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row, index);
                                }}
                                className={cn(
                                  "size-8 rounded-lg border flex items-center justify-center transition-all duration-150 hover:scale-105 cursor-pointer shadow-2xs",
                                  getActionVariantClass(action.variant, action.className),
                                )}
                              >
                                {action.icon}
                              </button>
                            </Tooltip>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="hidden md:block w-full overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-border">
          <table className="w-full table-auto border-collapse min-w-full">
            <thead>
              <tr className="bg-coral text-white border-b border-coral-dark">
                {selectable && (
                  <th className="px-3 py-3 w-10 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          paginatedData.length > 0 &&
                          selectedRows.size === paginatedData.length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="size-4 rounded border-white/60 accent-white transition-all cursor-pointer"
                      />
                    </div>
                  </th>
                )}
                {showRowNumber && (
                  <th
                    className={cn(
                      "px-2 py-3 text-center text-xs font-bold font-quicksand text-white uppercase tracking-wider whitespace-nowrap",
                      reorderable ? "w-16" : "w-10"
                    )}
                  >
                    {rowNumberHeader}
                  </th>
                )}
                {columns.map((column, colIndex) => {
                  const alignment = getColumnAlignment(column, colIndex);
                  const isSorted = sortConfig?.key === column.key;
                  return (
                    <th
                      key={column.key}
                      className={cn(
                        "px-3 py-3 text-xs font-bold font-quicksand text-white uppercase tracking-wider whitespace-nowrap",
                        getAlignmentClass(alignment),
                        column.hideOnMobile ? "hidden lg:table-cell" : "",
                      )}
                      style={{ width: column.width }}
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          onClick={() => handleSort(column.key)}
                          className={cn(
                            "group inline-flex items-center gap-1.5 text-xs font-bold font-quicksand uppercase tracking-wider text-white hover:text-white/85 transition-colors cursor-pointer w-full",
                            alignment === "left" && "justify-start text-left",
                            alignment === "center" && "justify-center text-center",
                            alignment === "right" && "justify-end text-right",
                          )}
                        >
                          <span>{column.label}</span>
                          <span className="inline-flex items-center text-white/75 group-hover:text-white transition-colors shrink-0">
                            {isSorted ? (
                              sortConfig.direction === "asc" ? (
                                <ChevronUp
                                  size={14}
                                  className="text-white"
                                />
                              ) : (
                                <ChevronDown
                                  size={14}
                                  className="text-white"
                                />
                              )
                            ) : (
                              <ChevronsUpDown size={14} className="opacity-80" />
                            )}
                          </span>
                        </button>
                      ) : (
                        <span>{column.label}</span>
                      )}
                    </th>
                  );
                })}
                {actions && actions.length > 0 && (
                  <th className="px-2 py-3 text-xs font-bold font-quicksand text-white uppercase tracking-wider whitespace-nowrap text-center min-w-[140px]">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="">
              {loading ? (
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-border/40 animate-pulse">
                    {selectable && (
                      <td className="px-3 py-2.5">
                        <div className="size-4 rounded bg-surface-muted" />
                      </td>
                    )}
                    {showRowNumber && (
                      <td className="px-2 py-2.5 text-center">
                        <div className="h-4 w-6 rounded bg-surface-muted mx-auto" />
                      </td>
                    )}
                    {columns.map((col, colIndex) => {
                      const alignment = getColumnAlignment(col, colIndex);
                      return (
                        <td
                          key={colIndex}
                          className={cn(
                            "px-3 py-2.5",
                            getAlignmentClass(alignment)
                          )}
                        >
                          <div
                            className={cn(
                              "h-4 bg-surface-muted rounded",
                              alignment === "center" && "mx-auto",
                              alignment === "right" && "ml-auto"
                            )}
                            style={{ width: `${55 + ((colIndex * 15) % 35)}%` }}
                          />
                        </td>
                      );
                    })}
                    {actions && (
                      <td className="px-2 py-2.5 text-center">
                        <div className="h-6 w-16 bg-surface-muted rounded-full mx-auto" />
                      </td>
                    )}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (selectable ? 1 : 0) +
                      (showRowNumber ? 1 : 0) +
                      (actions ? 1 : 0)
                    }
                    className="px-6 py-20 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">
                        {emptyMessage}
                      </p>
                      <p className="text-xs text-gray-400">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => {
                  const rowKey = getRowKey ? getRowKey(row, index) : index;
                  const isSelected = selectedRows.has(rowKey);

                  const computedBaseOffset =
                    rowNumberOffset !== undefined
                      ? rowNumberOffset
                      : pagination && typeof effectivePageSize === "number"
                      ? (currentPage - 1) * effectivePageSize
                      : 0;
                  const rowNum = computedBaseOffset + index + 1;

                  return (
                    <tr
                      key={rowKey}
                      draggable={reorderable}
                      onDragStart={(e) => {
                        if (!reorderable) return;
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", `${index}`);
                        setDraggedIndex(index);
                      }}
                      onDragOver={(e) => {
                        if (!reorderable || draggedIndex === null) return;
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        if (dragOverIndex !== index) {
                          setDragOverIndex(index);
                        }
                      }}
                      onDragLeave={() => {
                        if (dragOverIndex === index) {
                          setDragOverIndex(null);
                        }
                      }}
                      onDrop={(e) => {
                        if (!reorderable || draggedIndex === null) return;
                        e.preventDefault();
                        if (draggedIndex !== index) {
                          const updated = [...paginatedData];
                          const [moved] = updated.splice(draggedIndex, 1);
                          updated.splice(index, 0, moved);
                          onRowReorder?.(updated, draggedIndex, index);
                        }
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                      onDragEnd={() => {
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                      className={cn(
                        "transition-all duration-200 border-b border-border last:border-0",
                        reorderable && "cursor-grab active:cursor-grabbing",
                        draggedIndex === index && "opacity-40 bg-coral/10",
                        dragOverIndex === index &&
                          draggedIndex !== index &&
                          "border-t-2 border-coral shadow-[inset_0_2px_0_0_var(--color-coral,#ff6b6b)] bg-coral/5",
                        striped
                          ? index % 2 === 0
                            ? "bg-stripe-1"
                            : "bg-stripe-2"
                          : "bg-primary-background",
                        hoverable &&
                          "hover:bg-primary-brand/5 hover:shadow-[inset_4px_0_0_0_var(--secondary-brand)]",
                        isSelected &&
                          "bg-primary-brand/[0.02] shadow-[inset_4px_0_0_0_var(--secondary-brand)]",
                        rowClassName?.(row, index),
                      )}
                    >
                      {selectable && (
                        <td className="px-3 py-2.5 w-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) =>
                              handleSelectRow(rowKey, e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary-brand focus:ring-primary-brand/20 transition-all cursor-pointer"
                          />
                        </td>
                      )}
                      {showRowNumber && (
                        <td
                          className={cn(
                            "px-2 py-2.5 text-xs font-bold font-quicksand text-ink-muted text-center whitespace-nowrap",
                            reorderable ? "w-16" : "w-10"
                          )}
                        >
                          {reorderable ? (
                            <div className="flex items-center justify-center gap-1 text-ink-muted group-hover:text-coral transition-colors">
                              <GripVertical className="size-3.5 text-ink-faint shrink-0" />
                              <span className="tabular-nums font-bold text-xs">{rowNum}</span>
                            </div>
                          ) : (
                            rowNum
                          )}
                        </td>
                      )}
                      {columns.map((column, colIndex) => {
                        const alignment = getColumnAlignment(column, colIndex);
                        return (
                          <td
                            key={column.key}
                            className={cn(
                              "px-3 py-2.5 text-sm font-semibold text-primary-text",
                              getAlignmentClass(alignment),
                              column.hideOnMobile ? "hidden lg:table-cell" : "",
                            )}
                          >
                            <Tooltip content={getTooltipText(row, column)}>
                              <div
                                className={cn(
                                  !column.render && "truncate",
                                  "w-full",
                                  alignment === "left" && "text-left",
                                  alignment === "center" && "text-center flex items-center justify-center",
                                  alignment === "right" && "text-right flex items-center justify-end",
                                )}
                                style={{ maxWidth: column.width || "none" }}
                              >
                                {getCellValue(row, column)}
                              </div>
                            </Tooltip>
                          </td>
                        );
                      })}
                      {actions && actions.length > 0 && (
                        <td className="px-2 py-2.5 text-center whitespace-nowrap min-w-[140px]">
                          <div className="flex items-center justify-center gap-1.5">
                            {actions.map((action, idx) => (
                              <Tooltip key={idx} content={action.label}>
                                <button
                                  type="button"
                                  onClick={() => action.onClick(row, index)}
                                  className={cn(
                                    "size-7 rounded-md border flex items-center justify-center transition-all duration-150 hover:scale-110 cursor-pointer shadow-2xs",
                                    getActionVariantClass(action.variant, action.className),
                                  )}
                                >
                                  {action.icon}
                                </button>
                              </Tooltip>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📱 Mobile Card View */}
      <div className="md:hidden w-full divide-y divide-border">
        {selectable && paginatedData.length > 0 && (
          <div className="px-4 py-3 bg-light-background flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  paginatedData.length > 0 &&
                  selectedRows.size === paginatedData.length
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary-brand focus:ring-primary-brand/20 transition-all cursor-pointer bg-primary-background"
              />
              <span className="text-sm font-bold text-primary-text">
                Select All
              </span>
            </div>
            <span className="text-xs font-bold text-gray-400">
              {paginatedData.length} Items
            </span>
          </div>
        )}

        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-border-peach bg-card space-y-3 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-surface-muted rounded" />
                  <div className="h-4 w-16 bg-surface-muted rounded" />
                </div>
                <div className="h-3 w-48 bg-surface-muted/60 rounded" />
                <div className="h-3 w-24 bg-surface-muted/40 rounded" />
              </div>
            ))}
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <p className="text-sm font-bold text-primary-text">
              {emptyMessage}
            </p>
          </div>
        ) : (
          paginatedData.map((row, index) => {
            const rowKey = getRowKey ? getRowKey(row, index) : index;
            const isSelected = selectedRows.has(rowKey);
            const isExpanded = expandedRows.has(rowKey);
            const visibleColumns = columns.filter((col) => !col.hideOnMobile);
            const primaryColumns = visibleColumns.slice(0, 2);
            const secondaryColumns = visibleColumns.slice(2);

            return (
              <div
                key={rowKey}
                className={cn(
                  "p-4 transition-all duration-200",
                  isSelected
                    ? "bg-primary-brand/[0.02]"
                    : striped && index % 2 !== 0
                      ? "bg-[var(--bg-stripe-2)]"
                      : "bg-[var(--bg-stripe-1)]",
                  selectable && "pr-8 sm:pr-10",
                )}
              >
                <div className="flex items-start gap-4">
                  {selectable && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) =>
                        handleSelectRow(rowKey, e.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-border text-primary-brand focus:ring-primary-brand/20 bg-primary-background"
                    />
                  )}

                  <div className="flex-1 space-y-3">
                    {/* Primary Columns */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {primaryColumns.map((column, colIdx) => (
                        <div
                          key={column.key}
                          className={cn(
                            "flex flex-col items-start gap-0.5 rounded-lg p-2 transition-colors",
                            striped && colIdx % 2 !== 0
                              ? "bg-[var(--bg-stripe-2)]"
                              : "bg-transparent",
                          )}
                        >
                          <span className="text-xs font-bold text-secondary-text/60 uppercase tracking-wider">
                            {column.label}
                          </span>
                          <Tooltip content={getTooltipText(row, column)}>
                            <div className="text-[13px] font-semibold text-primary-text leading-tight truncate w-full">
                              {getCellValue(row, column)}
                            </div>
                          </Tooltip>
                        </div>
                      ))}
                    </div>

                    {/* Expandable Content - Two Column Layout with Zebra Fields */}
                    {isExpanded && secondaryColumns.length > 0 && (
                      <div className="grid grid-cols-1 gap-y-1 pt-3 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
                        {secondaryColumns.map((column, colIdx) => (
                          <div
                            key={column.key}
                            className={cn(
                              "flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg transition-colors",
                              striped && colIdx % 2 !== 0
                                ? "bg-[var(--bg-stripe-2)]"
                                : "bg-transparent",
                            )}
                          >
                            <span className="text-[11px] font-bold text-secondary-text/60 uppercase tracking-wider whitespace-nowrap">
                              {column.label}
                            </span>
                            <Tooltip
                              content={getTooltipText(row, column)}
                              className="right-0 translate-x-0"
                            >
                              <div className="text-[13px] font-bold text-primary-text leading-tight text-right truncate max-w-[150px]">
                                {getCellValue(row, column)}
                              </div>
                            </Tooltip>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Mobile Actions & Toggle */}
                    <div
                      className={cn(
                        "flex items-center justify-between",
                        isExpanded
                          ? "pt-3 border-t border-border mt-1"
                          : "pt-2",
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        {actions &&
                          actions.map((action, idx) => (
                            <Tooltip key={idx} content={action.label}>
                              <button
                                type="button"
                                onClick={() => action.onClick(row, index)}
                                className={cn(
                                  "size-7 rounded-md border flex items-center justify-center transition-all cursor-pointer shadow-2xs",
                                  getActionVariantClass(action.variant, action.className),
                                )}
                              >
                                {action.icon}
                              </button>
                            </Tooltip>
                          ))}
                      </div>

                      {secondaryColumns.length > 0 && (
                        <button
                          onClick={() => toggleRowExpansion(rowKey)}
                          className="flex items-center gap-1 text-[11px] font-bold text-primary-brand hover:opacity-80 transition-all bg-primary-brand/5 px-2.5 py-1.5 rounded-sm"
                        >
                          {isExpanded ? "Show Less" : "Show More"}
                          {isExpanded ? (
                            <ChevronUp size={12} />
                          ) : (
                            <ChevronDown size={12} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
        </>
      )}

      {/* Pagination Container */}
      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={
            effectivePageSize === "all" ? sortedData.length : effectivePageSize
          }
          totalItems={sortedData.length}
          onPageChange={setCurrentPage}
          pageSize={effectivePageSize}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={(newSize) => {
            setInternalPageSize(newSize);
            setCurrentPage(1);
            onPageSizeChange?.(newSize);
          }}
          label="entries"
        />
      )}

      {footer}
      </div>
    </div>
  );
};

export default DynamicTable;
