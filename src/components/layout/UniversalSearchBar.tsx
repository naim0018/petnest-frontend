"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  BookOpen,
  PawPrint,
  User,
  Clock,
  ArrowRight,
  Loader2,
  CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useUniversalSearchQuery } from "@/store/Api/Search/search.api";

interface UniversalSearchBarProps {
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onClose?: () => void;
  isMobileModal?: boolean;
}

export default function UniversalSearchBar({
  className,
  inputClassName,
  autoFocus = false,
  onClose,
  isMobileModal = false,
}: UniversalSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query.trim(), 250);

  const { data, isFetching } = useUniversalSearchQuery(
    { q: debouncedQuery, limit: 5 },
    { skip: debouncedQuery.length < 2 }
  );

  const searchData = data?.data;

  // Flatten searchable interactive items for keyboard navigation
  const flatItems = useMemo(() => {
    if (!searchData) return [];
    const items: Array<{
      id: string;
      title: string;
      type: "guide" | "breed" | "species" | "author";
      href: string;
    }> = [];

    (searchData.guides || []).forEach((g) => {
      items.push({
        id: `guide-${g.id}`,
        title: g.title,
        type: "guide",
        href: `/guides/${g.slug}`,
      });
    });

    (searchData.breeds || []).forEach((b) => {
      items.push({
        id: `breed-${b.id}`,
        title: b.name,
        type: "breed",
        href: `/guides?species=${b.species.slug}&breed=${b.slug}`,
      });
    });

    (searchData.species || []).forEach((s) => {
      items.push({
        id: `species-${s.id}`,
        title: s.name,
        type: "species",
        href: `/guides?species=${s.slug}`,
      });
    });

    (searchData.authors || []).forEach((a) => {
      items.push({
        id: `author-${a.id}`,
        title: a.name,
        type: "author",
        href: `/guides?search=${encodeURIComponent(a.name)}`,
      });
    });

    return items;
  }, [searchData]);

  // Execute full search on Enter
  const handleExecuteSearch = useCallback(
    (customTerm?: string) => {
      const term = (customTerm ?? query).trim();
      if (!term) return;
      setIsOpen(false);
      onClose?.();
      router.push(`/guides?search=${encodeURIComponent(term)}`);
    },
    [query, router, onClose]
  );

  // Keyboard navigation & Shortcuts (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && flatItems[activeIndex]) {
        const item = flatItems[activeIndex];
        setIsOpen(false);
        onClose?.();
        router.push(item.href);
      } else {
        handleExecuteSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      onClose?.();
    }
  };

  const handleItemClick = (href: string) => {
    setIsOpen(false);
    onClose?.();
    router.push(href);
  };

  const hasResults = Boolean(searchData && searchData.totalMatches > 0);
  const showDropdown = isOpen && query.trim().length >= 2;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      role="search"
      aria-expanded={showDropdown}
    >
      {/* Search Input Bar */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 sm:px-3.5 h-10 lg:h-11 bg-surface-muted rounded-full border border-transparent transition-all",
          isOpen ? "border-coral/50 ring-2 ring-coral/20 bg-card" : "focus-within:border-coral/40",
          inputClassName
        )}
      >
        <Search className="size-4 text-ink-faint shrink-0" />
        <input
          ref={inputRef}
          type="text"
          autoFocus={autoFocus}
          placeholder="Search pets, breeds, guides, authors..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-xs lg:text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />

        {/* Loading Spinner or Clear Button */}
        {isFetching ? (
          <Loader2 className="size-3.5 text-coral animate-spin shrink-0" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="p-1 text-ink-muted hover:text-ink cursor-pointer rounded-full"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        ) : !isMobileModal ? (
          <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-ink-faint bg-card dark:bg-slate-800 border border-border-peach rounded-md select-none">
            <span className="text-xs">⌘</span>K
          </kbd>
        ) : null}
      </div>

      {/* Live Search Results Dropdown Popover */}
      {showDropdown && (
        <div
          className={cn(
            "absolute left-0 mt-2 bg-popover border border-border-peach rounded-2xl shadow-2xl z-50 overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150",
            isMobileModal
              ? "right-0 max-h-[calc(80vh-4rem)] overflow-y-auto"
              : "w-full md:w-[460px] lg:w-[520px] max-h-[480px] overflow-y-auto"
          )}
        >
          {isFetching && !searchData ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="size-8 rounded-lg bg-surface-muted shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-3/4 bg-surface-muted rounded-md" />
                    <div className="h-2.5 w-1/2 bg-surface-muted rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasResults ? (
            <div className="p-2 divide-y divide-border-peach/50">
              {/* 1. Care Guides Section */}
              {searchData && searchData.guides.length > 0 && (
                <div className="py-2 first:pt-1">
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-coral font-quicksand">
                    <BookOpen className="size-3" />
                    <span>Care Guides ({searchData.guides.length})</span>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {searchData.guides.map((g) => {
                      const isHighlighted =
                        flatItems[activeIndex]?.id === `guide-${g.id}`;
                      return (
                        <div
                          key={g.id}
                          onClick={() => handleItemClick(`/guides/${g.slug}`)}
                          className={cn(
                            "group flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors",
                            isHighlighted
                              ? "bg-coral-light/70 text-coral"
                              : "hover:bg-surface-muted text-ink"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {g.coverImage ? (
                              <div className="relative size-8 rounded-lg overflow-hidden shrink-0 bg-surface-muted">
                                <Image
                                  src={g.coverImage}
                                  alt={g.title}
                                  fill
                                  sizes="32px"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="size-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center shrink-0">
                                <BookOpen className="size-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold font-quicksand truncate group-hover:text-coral transition-colors">
                                {g.title}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-ink-muted">
                                {g.category && <span>{g.category.name}</span>}
                                {g.readTimeMinutes && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5">
                                      <Clock className="size-2.5" />
                                      {g.readTimeMinutes} min
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="size-3.5 text-ink-faint group-hover:text-coral group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Breeds & Species Section */}
              {searchData &&
                (searchData.breeds.length > 0 || searchData.species.length > 0) && (
                  <div className="py-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-quicksand">
                      <PawPrint className="size-3" />
                      <span>Pets & Breeds</span>
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {searchData.breeds.map((b) => {
                        const isHighlighted =
                          flatItems[activeIndex]?.id === `breed-${b.id}`;
                        const href = `/guides?species=${b.species.slug}&breed=${b.slug}`;
                        return (
                          <div
                            key={b.id}
                            onClick={() => handleItemClick(href)}
                            className={cn(
                              "group flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors",
                              isHighlighted
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                : "hover:bg-surface-muted text-ink"
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {b.image ? (
                                <div className="relative size-8 rounded-full overflow-hidden shrink-0 bg-surface-muted">
                                  <Image
                                    src={b.image}
                                    alt={b.name}
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="size-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                                  <PawPrint className="size-4" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-bold font-quicksand truncate">
                                  {b.name}
                                </p>
                                <span className="text-[10px] text-ink-muted">
                                  {b.species.name} Breed
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold bg-surface-muted px-2 py-0.5 rounded-full text-ink-muted group-hover:bg-amber-500/10 group-hover:text-amber-600 transition-colors shrink-0">
                              View Guides
                            </span>
                          </div>
                        );
                      })}

                      {searchData.species.map((s) => {
                        const isHighlighted =
                          flatItems[activeIndex]?.id === `species-${s.id}`;
                        const href = `/guides?species=${s.slug}`;
                        return (
                          <div
                            key={s.id}
                            onClick={() => handleItemClick(href)}
                            className={cn(
                              "group flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors",
                              isHighlighted
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                : "hover:bg-surface-muted text-ink"
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="size-8 rounded-full bg-coral/10 text-coral flex items-center justify-center shrink-0">
                                <PawPrint className="size-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold font-quicksand truncate">
                                  All {s.name}
                                </p>
                                <span className="text-[10px] text-ink-muted">
                                  Species Catalog
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold bg-surface-muted px-2 py-0.5 rounded-full text-ink-muted group-hover:bg-coral/10 group-hover:text-coral transition-colors shrink-0">
                              Explore All
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* 3. Authors & Editorial Section */}
              {searchData && searchData.authors.length > 0 && (
                <div className="py-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-quicksand">
                    <User className="size-3" />
                    <span>Editorial & Authors</span>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {searchData.authors.map((a) => {
                      const isHighlighted =
                        flatItems[activeIndex]?.id === `author-${a.id}`;
                      const href = `/guides?search=${encodeURIComponent(a.name)}`;
                      return (
                        <div
                          key={a.id}
                          onClick={() => handleItemClick(href)}
                          className={cn(
                            "group flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors",
                            isHighlighted
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                              : "hover:bg-surface-muted text-ink"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {a.avatar ? (
                              <div className="relative size-8 rounded-full overflow-hidden shrink-0 bg-surface-muted">
                                <Image
                                  src={a.avatar}
                                  alt={a.name}
                                  fill
                                  sizes="32px"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                                <User className="size-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold font-quicksand truncate">
                                {a.name}
                              </p>
                              <span className="text-[10px] text-ink-muted capitalize">
                                {a.role.toLowerCase()}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-ink-muted group-hover:text-emerald-600">
                            View Articles →
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center space-y-1.5">
              <Search className="size-6 text-ink-faint mx-auto opacity-50" />
              <p className="text-xs font-bold text-ink font-quicksand">
                No direct matches found for &quot;{query}&quot;
              </p>
              <p className="text-[11px] text-ink-muted">
                Press Enter to run a full search across all care guides.
              </p>
            </div>
          )}

          {/* Action Footer: Enter to see all */}
          <div
            onClick={() => handleExecuteSearch()}
            className="p-3 bg-surface-muted/60 border-t border-border-peach flex items-center justify-between text-xs text-ink-muted hover:text-coral hover:bg-coral-light/30 transition-colors cursor-pointer font-quicksand"
          >
            <span className="font-semibold truncate">
              Explore all guides matching &quot;{query}&quot;
            </span>
            <div className="flex items-center gap-1 shrink-0 font-bold text-[11px]">
              <span>Search</span>
              <CornerDownLeft className="size-3" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
