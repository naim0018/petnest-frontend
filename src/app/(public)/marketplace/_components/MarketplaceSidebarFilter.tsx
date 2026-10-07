"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown, Check, MapPin, Store, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SIDEBAR_CATEGORIES,
  SIDEBAR_CONDITIONS,
  SIDEBAR_LISTING_TYPES,
  SIDEBAR_LOCATIONS,
  SIDEBAR_RADIUS_OPTIONS,
} from "./marketplaceData";
import PrimaryButton from "@/components/common/PrimaryButton";

export interface MarketplaceSidebarFilterState {
  category: string; // 'all' or id
  condition: string; // 'all' or id
  minPrice: string;
  maxPrice: string;
  location: string;
  radius: string;
  listingTypes: string[]; // ['for-sale', 'free', 'swap']
  sellerType?: "all" | "store" | "individual";
}

export interface MarketplaceSidebarFilterProps {
  filters: MarketplaceSidebarFilterState;
  onChange: (filters: MarketplaceSidebarFilterState) => void;
  onClearAll: () => void;
  onApply: () => void;
  className?: string;
}

export default function MarketplaceSidebarFilter({
  filters,
  onChange,
  onClearAll,
  onApply,
  className,
}: MarketplaceSidebarFilterProps) {
  // Collapsible accordion states
  const [sellerTypeExpanded, setSellerTypeExpanded] = useState(true);
  const [conditionExpanded, setConditionExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [locationExpanded, setLocationExpanded] = useState(true);
  const [listingTypeExpanded, setListingTypeExpanded] = useState(true);

  // Toggle single category selection
  const handleCategorySelect = (categoryId: string) => {
    onChange({
      ...filters,
      category: categoryId,
    });
  };

  // Toggle condition selection
  const handleConditionSelect = (conditionId: string) => {
    onChange({
      ...filters,
      condition: conditionId,
    });
  };

  // Toggle listing type checkbox
  const handleListingTypeToggle = (typeId: string) => {
    const exists = filters.listingTypes.includes(typeId);
    let updated: string[];
    if (exists) {
      updated = filters.listingTypes.filter((t) => t !== typeId);
    } else {
      updated = [...filters.listingTypes, typeId];
    }
    onChange({
      ...filters,
      listingTypes: updated,
    });
  };

  return (
    <aside
      className={cn(
        "bg-card border border-border-peach dark:border-slate-800 rounded-xl p-5 shadow-xs w-full lg:w-[275px] shrink-0 space-y-5 select-none",
        className
      )}
    >
      {/* Top Header: Title & Clear All */}
      <div className="flex items-center justify-between pb-1 border-b border-border-peach/60 dark:border-slate-800/80">
        <h2 className="text-base font-bold text-ink font-quicksand">
          Filters
        </h2>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-bold text-coral hover:underline transition-colors cursor-pointer font-quicksand"
        >
          Clear All
        </button>
      </div>

      {/* 0. SELLER TYPE (Verified Store vs Individual Pet Parent) */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setSellerTypeExpanded(!sellerTypeExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold text-ink font-quicksand cursor-pointer"
        >
          <span>Seller Type</span>
          {sellerTypeExpanded ? (
            <ChevronUp className="size-3.5 text-ink-muted" />
          ) : (
            <ChevronDown className="size-3.5 text-ink-muted" />
          )}
        </button>

        {sellerTypeExpanded && (
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  sellerType: filters.sellerType === "store" ? "all" : "store",
                })
              }
              className={cn(
                "p-2 rounded-lg border text-xs font-bold font-quicksand flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                filters.sellerType === "store"
                  ? "bg-coral text-white border-coral shadow-2xs"
                  : "bg-surface-muted text-ink-muted border-border-peach hover:border-coral/50"
              )}
            >
              <Store className="size-3.5 shrink-0" />
              <span>Stores</span>
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  sellerType:
                    filters.sellerType === "individual" ? "all" : "individual",
                })
              }
              className={cn(
                "p-2 rounded-lg border text-xs font-bold font-quicksand flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                filters.sellerType === "individual"
                  ? "bg-coral text-white border-coral shadow-2xs"
                  : "bg-surface-muted text-ink-muted border-border-peach hover:border-coral/50"
              )}
            >
              <UserCheck className="size-3.5 shrink-0" />
              <span>Owners</span>
            </button>
          </div>
        )}
      </div>

      {/* 1. CATEGORY SECTION */}
      <div className="space-y-2.5 pt-1 border-t border-border-peach/60 dark:border-slate-800/80">
        <h3 className="text-xs font-bold text-ink font-quicksand tracking-tight">
          Category
        </h3>
        <div className="space-y-1.5">
          {SIDEBAR_CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;

            return (
              <label
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="flex items-center justify-between py-0.5 text-xs font-medium cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={cn(
                      "size-4 rounded flex items-center justify-center transition-colors border",
                      isSelected
                        ? "bg-coral border-coral text-white"
                        : "border-border-peach dark:border-slate-700 bg-card group-hover:border-coral/50"
                    )}
                  >
                    {isSelected && <Check className="size-3 stroke-[3]" />}
                  </div>
                  <span
                    className={cn(
                      "truncate font-quicksand transition-colors text-xs",
                      isSelected
                        ? "font-bold text-ink"
                        : "text-ink-muted group-hover:text-ink"
                    )}
                  >
                    {cat.label}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-ink-faint font-quicksand shrink-0 ml-2">
                  ({cat.count})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. CONDITION ACCORDION */}
      <div className="space-y-2.5 pt-1 border-t border-border-peach/60 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => setConditionExpanded(!conditionExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold text-ink font-quicksand cursor-pointer"
        >
          <span>Condition</span>
          {conditionExpanded ? (
            <ChevronUp className="size-3.5 text-ink-muted" />
          ) : (
            <ChevronDown className="size-3.5 text-ink-muted" />
          )}
        </button>

        {conditionExpanded && (
          <div className="space-y-1.5 pt-0.5">
            {SIDEBAR_CONDITIONS.map((cond) => {
              const isSelected = filters.condition === cond.id;

              return (
                <label
                  key={cond.id}
                  onClick={() => handleConditionSelect(cond.id)}
                  className="flex items-center justify-between py-0.5 text-xs font-medium cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={cn(
                        "size-4 rounded flex items-center justify-center transition-colors border",
                        isSelected
                          ? "bg-coral border-coral text-white"
                          : "border-border-peach dark:border-slate-700 bg-card group-hover:border-coral/50"
                      )}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                    <span
                      className={cn(
                        "truncate font-quicksand transition-colors text-xs",
                        isSelected
                          ? "font-bold text-ink"
                          : "text-ink-muted group-hover:text-ink"
                      )}
                    >
                      {cond.label}
                    </span>
                  </div>
                  {cond.count !== undefined && (
                    <span className="text-[11px] font-medium text-ink-faint font-quicksand shrink-0 ml-2">
                      ({cond.count})
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. PRICE RANGE ACCORDION */}
      <div className="space-y-2.5 pt-1 border-t border-border-peach/60 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => setPriceExpanded(!priceExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold text-ink font-quicksand cursor-pointer"
        >
          <span>Price Range</span>
          {priceExpanded ? (
            <ChevronUp className="size-3.5 text-ink-muted" />
          ) : (
            <ChevronDown className="size-3.5 text-ink-muted" />
          )}
        </button>

        {priceExpanded && (
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
              className="w-full h-9 px-3 rounded-lg border border-border-peach bg-surface-muted text-xs font-quicksand text-ink placeholder:text-ink-faint outline-none focus:border-coral transition-colors"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
              className="w-full h-9 px-3 rounded-lg border border-border-peach bg-surface-muted text-xs font-quicksand text-ink placeholder:text-ink-faint outline-none focus:border-coral transition-colors"
            />
          </div>
        )}
      </div>

      {/* 4. LOCATION ACCORDION */}
      <div className="space-y-2.5 pt-1 border-t border-border-peach/60 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => setLocationExpanded(!locationExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold text-ink font-quicksand cursor-pointer"
        >
          <span>Location</span>
          {locationExpanded ? (
            <ChevronUp className="size-3.5 text-ink-muted" />
          ) : (
            <ChevronDown className="size-3.5 text-ink-muted" />
          )}
        </button>

        {locationExpanded && (
          <div className="space-y-2 pt-0.5">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-coral">
                <MapPin className="size-3.5" />
              </div>
              <select
                value={filters.location}
                onChange={(e) => onChange({ ...filters, location: e.target.value })}
                className="w-full h-9 pl-8 pr-7 rounded-lg border border-border-peach bg-surface-muted text-xs font-bold font-quicksand text-ink outline-none cursor-pointer appearance-none hover:border-coral transition-colors"
              >
                {SIDEBAR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted">
                <ChevronDown className="size-3.5" />
              </div>
            </div>

            <div className="relative">
              <select
                value={filters.radius}
                onChange={(e) => onChange({ ...filters, radius: e.target.value })}
                className="w-full h-9 px-3 pr-7 rounded-lg border border-border-peach bg-surface-muted text-xs font-bold font-quicksand text-ink outline-none cursor-pointer appearance-none hover:border-coral transition-colors"
              >
                {SIDEBAR_RADIUS_OPTIONS.map((rad) => (
                  <option key={rad} value={rad}>
                    {rad}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted">
                <ChevronDown className="size-3.5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. LISTING TYPE ACCORDION */}
      <div className="space-y-2.5 pt-1 border-t border-border-peach/60 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => setListingTypeExpanded(!listingTypeExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold text-ink font-quicksand cursor-pointer"
        >
          <span>Listing Type</span>
          {listingTypeExpanded ? (
            <ChevronUp className="size-3.5 text-ink-muted" />
          ) : (
            <ChevronDown className="size-3.5 text-ink-muted" />
          )}
        </button>

        {listingTypeExpanded && (
          <div className="space-y-1.5 pt-0.5">
            {SIDEBAR_LISTING_TYPES.map((lt) => {
              const isChecked = filters.listingTypes.includes(lt.id);

              return (
                <label
                  key={lt.id}
                  onClick={() => handleListingTypeToggle(lt.id)}
                  className="flex items-center justify-between py-0.5 text-xs font-medium cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={cn(
                        "size-4 rounded flex items-center justify-center transition-colors border",
                        isChecked
                          ? "bg-coral border-coral text-white"
                          : "border-border-peach dark:border-slate-700 bg-card group-hover:border-coral/50"
                      )}
                    >
                      {isChecked && <Check className="size-3 stroke-[3]" />}
                    </div>
                    <span
                      className={cn(
                        "truncate font-quicksand transition-colors text-xs",
                        isChecked
                          ? "font-bold text-ink"
                          : "text-ink-muted group-hover:text-ink"
                      )}
                    >
                      {lt.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-ink-faint font-quicksand shrink-0 ml-2">
                    ({lt.count})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. APPLY FILTERS BUTTON */}
      <div className="pt-2">
        <PrimaryButton
          variant="primary"
          size="md"
          fullWidth
          onClick={onApply}
          className="font-quicksand font-bold text-sm"
        >
          Apply Filters
        </PrimaryButton>
      </div>
    </aside>
  );
}
