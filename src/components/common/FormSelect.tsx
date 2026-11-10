"use client";

import React, { useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
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
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  leftIcon?: React.ReactNode;
  searchable?: boolean;
  className?: string;
}

export default function FormSelect({
  id,
  label,
  placeholder = "Select...",
  options = [],
  value,
  onChange,
  disabled = false,
  error,
  leftIcon,
  searchable = false,
  className,
}: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedOptions: FormSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const filteredOptions = searchable && searchQuery
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : normalizedOptions;

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="w-full relative">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-ink-muted select-none block px-1 mb-1"
        >
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger
          render={(props) => (
            <button
              {...props}
              id={id}
              type="button"
              disabled={disabled}
              className={cn(
                "w-full h-[42px] shrink-0 box-border overflow-hidden flex items-center justify-between gap-2 px-3 sm:px-3.5 rounded-md border bg-surface-soft dark:bg-surface-muted transition-colors duration-200 text-left outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
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
                {selectedOption?.icon && (
                  <span className="shrink-0 flex items-center justify-center">
                    {selectedOption.icon}
                  </span>
                )}
                <span
                  className={cn(
                    "text-xs sm:text-sm truncate select-none leading-none",
                    selectedOption ? "text-ink font-medium" : "text-ink-faint"
                  )}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
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
          className="w-[var(--anchor-width)] min-w-[180px] p-1.5 bg-card border border-border-peach rounded-md shadow-xl z-50 overflow-hidden flex flex-col"
        >
          {searchable && (
            <div className="flex items-center px-2 py-1.5 mb-1 border-b border-border-peach text-ink-muted">
              <Search className="size-3.5 shrink-0 mr-1.5 opacity-60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-ink-faint"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-0.5 text-ink-muted hover:text-ink"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          )}

          <div className="overflow-y-auto max-h-48 space-y-0.5 p-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-3 text-center text-xs text-ink-muted">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
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
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="size-3.5 text-coral shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-xs font-semibold text-red-500 px-1 mt-1">{error}</p>
      )}
    </div>
  );
}
