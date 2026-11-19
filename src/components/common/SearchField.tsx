"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchSuggestionItem {
  id: string | number;
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  category?: string;
  onClick?: () => void;
}

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestionItem[];
  onSelectSuggestion?: (item: SearchSuggestionItem) => void;
  className?: string;
  containerClassName?: string;
  isLoading?: boolean;
  autoFocus?: boolean;
}

export default function SearchField({
  value,
  onChange,
  placeholder = "Search...",
  suggestions = [],
  onSelectSuggestion,
  className,
  containerClassName,
  isLoading = false,
  autoFocus = false,
}: SearchFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open suggestion popover if input has value and is focused
  const shouldShowPopover = isOpen && value.trim().length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSelect = (item: SearchSuggestionItem) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(item);
    } else {
      onChange(item.title);
      item.onClick?.();
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", containerClassName)}
    >
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-ink-faint pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "w-full h-10 pl-10 pr-9 bg-card border border-border-peach rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all text-ink placeholder:text-ink-faint shadow-2xs",
            className
          )}
        />

        {isLoading ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="size-4 animate-spin text-coral" />
          </div>
        ) : value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-faint hover:text-coral rounded-md transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {/* Suggestion Popover Content */}
      {shouldShowPopover && (
        <div className="absolute top-full mt-1.5 left-0 right-0 w-full bg-card rounded-lg border border-border-peach shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-ink-muted bg-surface-muted/40 border-b border-border-peach font-quicksand flex items-center justify-between">
            <span>Suggestions</span>
            {suggestions.length > 0 && (
              <span className="text-[10px] text-ink-faint font-normal">
                {suggestions.length} match{suggestions.length > 1 ? "es" : ""}
              </span>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-border-peach/50 scrollbar-thin">
            {suggestions.length === 0 ? (
              <div className="p-4 text-center text-xs text-ink-muted">
                No suggestions found for &ldquo;
                <span className="text-ink font-semibold">{value}</span>
                &rdquo;
              </div>
            ) : (
              suggestions.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-surface-muted text-left transition-colors cursor-pointer group"
                >
                  {item.image && (
                    <div className="size-8 rounded-lg overflow-hidden bg-surface-muted border border-border-peach shrink-0 relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-ink truncate font-quicksand group-hover:text-coral transition-colors">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="text-[11px] text-ink-muted truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-tint-rose text-coral border border-coral/15 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
