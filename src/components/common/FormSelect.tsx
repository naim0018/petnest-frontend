"use client";

import React, { useState, useMemo } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface FormSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface FormSelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  options: (string | FormSelectOption)[];
  value?: string | string[];
  onChange?: (value: string) => void;
  onMultiChange?: (values: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
  leftIcon?: React.ReactNode;
  searchable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
}

export default function FormSelect({
  id,
  label,
  placeholder = "Select...",
  options = [],
  value,
  onChange,
  onMultiChange,
  multiple = false,
  disabled = false,
  error,
  leftIcon,
  searchable = false,
  paginated = false,
  pageSize = 8,
  required = false,
  className,
  labelClassName,
  containerClassName,
}: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const normalizedOptions: FormSelectOption[] = useMemo(
    () =>
      options.map((opt) =>
        typeof opt === "string" ? { value: opt, label: opt } : opt
      ),
    [options]
  );

  const selectedValues: string[] = useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [value]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return normalizedOptions;
    const query = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query)
    );
  }, [normalizedOptions, searchable, searchQuery]);

  const totalPages = Math.ceil(filteredOptions.length / pageSize) || 1;

  const displayedOptions = useMemo(() => {
    if (!paginated) return filteredOptions;
    const start = (page - 1) * pageSize;
    return filteredOptions.slice(start, start + pageSize);
  }, [paginated, filteredOptions, page, pageSize]);

  const handleSelect = (val: string) => {
    if (multiple) {
      const isAlready = selectedValues.includes(val);
      const newValues = isAlready
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val];
      onChange?.(newValues.join(", "));
      onMultiChange?.(newValues);
    } else {
      onChange?.(val);
      setOpen(false);
      setSearchQuery("");
      setPage(1);
    }
  };

  const clearAllSelected = () => {
    onChange?.("");
    onMultiChange?.([]);
  };

  return (
    <div className={cn("w-full relative", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "block text-xs font-bold uppercase tracking-wider text-ink select-none mb-1.5",
            labelClassName
          )}
        >
          {label} {required && <span className="text-coral">*</span>}
        </label>
      )}

      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setSearchQuery("");
            setPage(1);
          }
        }}
        modal={false}
      >
        <PopoverTrigger
          render={(props) => (
            <button
              {...props}
              id={id}
              type="button"
              disabled={disabled}
              className={cn(
                "w-full box-border overflow-hidden flex items-center justify-between gap-2 px-3 sm:px-3.5 rounded-lg border bg-surface-soft dark:bg-surface-muted transition-colors duration-200 text-left outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                multiple ? "min-h-10.5 py-1.5" : "h-10.5",
                error
                  ? "border-red-500 ring-2 ring-red-500/20"
                  : open
                  ? "border-coral ring-2 ring-coral/20"
                  : "border-border-peach hover:border-coral/50",
                className
              )}
            >
              <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                {leftIcon && (
                  <span className="text-ink-muted shrink-0 flex items-center justify-center">
                    {leftIcon}
                  </span>
                )}
                {selectedOption?.icon && !multiple && (
                  <span className="shrink-0 flex items-center justify-center">
                    {selectedOption.icon}
                  </span>
                )}

                {multiple ? (
                  selectedValues.length === 0 ? (
                    <span className="text-xs sm:text-sm text-ink-faint select-none leading-none">
                      {placeholder}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-wrap truncate flex-1 min-w-0">
                      {selectedValues.slice(0, 3).map((val) => (
                        <span
                          key={val}
                          className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-coral/10 text-coral border border-coral/20 shrink-0"
                        >
                          {val}
                        </span>
                      ))}
                      {selectedValues.length > 3 && (
                        <span className="text-[11px] font-semibold text-ink-muted shrink-0">
                          +{selectedValues.length - 3} more
                        </span>
                      )}
                    </div>
                  )
                ) : (
                  <span
                    className={cn(
                      "text-xs sm:text-sm truncate select-none leading-none",
                      selectedOption ? "text-ink font-medium" : "text-ink-faint"
                    )}
                  >
                    {selectedOption ? selectedOption.label : placeholder}
                  </span>
                )}
              </div>

              <div className="size-4 shrink-0 flex items-center justify-center overflow-hidden">
                <ChevronDown
                  className={cn(
                    "size-4 text-ink-muted shrink-0 transition-transform duration-200",
                    open && "rotate-180 text-coral"
                  )}
                />
              </div>
            </button>
          )}
        />

        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-[var(--anchor-width)] min-w-[200px] p-1.5 bg-card border border-border-peach rounded-md shadow-xl z-50 overflow-hidden flex flex-col"
        >
          {searchable && (
            <div className="flex items-center px-2 py-1.5 mb-1 border-b border-border-peach text-ink-muted">
              <Search className="size-3.5 shrink-0 mr-1.5 opacity-60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search..."
                autoFocus
                className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-ink-faint"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setPage(1);
                  }}
                  className="p-0.5 text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          )}

          {multiple && selectedValues.length > 0 && (
            <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] border-b border-border-peach/60">
              <span className="font-bold text-coral">
                {selectedValues.length} selected
              </span>
              <button
                type="button"
                onClick={clearAllSelected}
                className="text-ink-muted hover:text-coral font-semibold cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="overflow-y-auto max-h-56 space-y-0.5 p-0.5">
            {displayedOptions.length === 0 ? (
              <div className="py-3 text-center text-xs text-ink-muted">
                No options found
              </div>
            ) : (
              displayedOptions.map((opt) => {
                const isSelected = multiple
                  ? selectedValues.includes(opt.value)
                  : opt.value === value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors text-left cursor-pointer outline-none",
                      isSelected
                        ? "bg-coral/10 text-coral font-bold"
                        : "text-ink hover:bg-surface-muted hover:text-coral"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    {multiple ? (
                      <div
                        className={cn(
                          "size-4 rounded flex items-center justify-center border transition-colors shrink-0",
                          isSelected
                            ? "bg-coral border-coral text-white"
                            : "border-border-peach bg-surface-muted"
                        )}
                      >
                        {isSelected && <Check className="size-3 stroke-[3]" />}
                      </div>
                    ) : (
                      isSelected && (
                        <Check className="size-3.5 text-coral shrink-0 stroke-[2.5]" />
                      )
                    )}
                  </button>
                );
              })
            )}
          </div>

          {paginated && filteredOptions.length > pageSize && (
            <div className="flex items-center justify-between px-2.5 py-1.5 border-t border-border-peach text-xs text-ink-muted bg-surface-soft/50 select-none mt-1">
              <span className="text-[11px] font-medium text-ink-muted">
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredOptions.length)} of {filteredOptions.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                  className="p-1 rounded hover:bg-surface-muted hover:text-coral disabled:opacity-30 disabled:pointer-events-none text-ink cursor-pointer transition-colors"
                  title="Previous page"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <span className="text-[11px] font-semibold text-ink px-1">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                  className="p-1 rounded hover:bg-surface-muted hover:text-coral disabled:opacity-30 disabled:pointer-events-none text-ink cursor-pointer transition-colors"
                  title="Next page"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-xs font-semibold text-red-500 px-1 mt-1">{error}</p>
      )}
    </div>
  );
}
