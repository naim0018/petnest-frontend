"use client";

import React, { useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CommonSelectProps {
  options: (string | SelectOption)[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  error?: boolean | string;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
  popoverClassName?: string;
  containerClassName?: string;
  listClassName?: string;
}

const sizeClasses = {
  sm: "h-8 text-xs px-2.5 gap-1.5",
  md: "h-11 text-sm px-4 gap-2",
  lg: "h-13 text-base px-5 gap-2.5",
};

export function CommonSelect({
  options = [],
  value: controlledValue,
  onChange,
  placeholder = "Select an option...",
  label,
  searchable = false,
  clearable = false,
  disabled = false,
  error,
  size = "md",
  icon: LeftIcon,
  className,
  popoverClassName,
  containerClassName,
  listClassName,
}: CommonSelectProps) {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedValue = controlledValue !== undefined ? controlledValue : localValue;

  // Normalize options to SelectOption[]
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === selectedValue);

  const filteredOptions = searchable
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : normalizedOptions;

  const handleSelect = (val: string) => {
    if (controlledValue === undefined) {
      setLocalValue(val);
    }
    onChange?.(val);
    setOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlledValue === undefined) {
      setLocalValue("");
    }
    onChange?.("");
  };

  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : null;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName || "w-full")}>
      {label && (
        <label className="text-sm font-medium text-foreground select-none">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={(props) => (
            <button
              {...props}
              type="button"
              disabled={disabled}
              className={cn(
                "group flex items-center justify-between w-full rounded-lg border border-border-peach bg-surface-soft font-bold text-ink shadow-2xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-coral/30 disabled:cursor-not-allowed disabled:opacity-50 hover:border-coral/50 cursor-pointer",
                sizeClasses[size],
                hasError && "border-destructive focus-visible:ring-destructive",
                !selectedOption && "text-ink-muted font-normal",
                className
              )}
            >
              <div className="flex items-center gap-2 truncate min-w-0">
                {LeftIcon && <span className="shrink-0 text-ink-muted">{LeftIcon}</span>}
                {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
                <span className="truncate">
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                {clearable && selectedValue && !disabled && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={handleClear}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleClear(e as any);
                    }}
                    className="p-0.5 rounded-full hover:bg-surface-muted text-ink-muted hover:text-ink transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-ink-muted transition-transform duration-200",
                    open && "rotate-180"
                  )}
                />
              </div>
            </button>
          )}
        />

        <PopoverContent
          align="start"
          sideOffset={6}
          className={cn(
            "w-[var(--anchor-width)] min-w-[125px] p-1.5 bg-card border border-border-peach shadow-lg rounded-lg overflow-hidden z-50",
            popoverClassName
          )}
        >
          {searchable && (
            <div className="flex items-center px-2.5 py-1.5 mb-1 border-b border-border-peach text-ink-muted">
              <Search className="h-4 w-4 shrink-0 mr-2 opacity-60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-0.5 text-ink-muted hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          <div
            className={cn(
              "space-y-0.5 p-0.5",
              searchable ? "max-h-60 overflow-y-auto" : "max-h-none overflow-hidden",
              listClassName
            )}
          >
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-ink-muted">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors text-left outline-none cursor-pointer disabled:pointer-events-none disabled:opacity-40 whitespace-nowrap",
                      isSelected
                        ? "bg-coral/10 text-coral font-bold"
                        : "text-ink hover:bg-surface-muted hover:text-coral"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.icon && <span className="shrink-0">{option.icon}</span>}
                      <span className="truncate">{option.label}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-coral ml-2" />}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {errorMessage && (
        <span className="text-xs text-destructive font-medium">{errorMessage}</span>
      )}
    </div>
  );
}

export default CommonSelect;
