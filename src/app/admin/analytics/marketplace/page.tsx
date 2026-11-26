"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { StatsCard } from "@/components/common/StatsCard";
import ReusableChart, { ChartType } from "@/components/common/ReusableChart";
import { FilterSelect } from "@/components/common/FilterSelect";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import {
  ShoppingBag,
  Store,
  DollarSign,
  TrendingUp,
  Tag,
  Package,
  PawPrint,
  Utensils,
  BookOpen,
  Pill,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Monthly listing growth trend
const LISTING_GROWTH_TREND = [
  { label: "May", value: 120 },
  { label: "Jun", value: 185 },
  { label: "Jul", value: 240 },
  { label: "Aug", value: 310 },
  { label: "Sep", value: 375 },
  { label: "Oct", value: 428 },
];

// Commercial Domain Share
const DOMAIN_DISTRIBUTION = [
  { domain: "Live Pets", count: 188, percentage: 44, color: "bg-coral", icon: PawPrint },
  { domain: "Pet Food & Diet", count: 120, percentage: 28, color: "bg-amber-500", icon: Utensils },
  { domain: "Gear & Accessories", count: 68, percentage: 16, color: "bg-sky-500", icon: Package },
  { domain: "Medicine & Health", count: 34, percentage: 8, color: "bg-emerald-500", icon: Pill },
  { domain: "Books & Literature", count: 18, percentage: 4, color: "bg-purple-500", icon: BookOpen },
];

interface DomainBreakdownRecord {
  id: string;
  domain: string;
  category: string;
  activeListings: number;
  totalStock: number;
  avgPrice: string;
  featuredCount: number;
  topStore: string;
}

const DOMAIN_RECORDS: DomainBreakdownRecord[] = [
  {
    id: "dom-1",
    domain: "Live Pets",
    category: "Aviary Birds & Handfed Pets",
    activeListings: 188,
    totalStock: 245,
    avgPrice: "৳ 4,500",
    featuredCount: 16,
    topStore: "Bengal Aviary & Birds",
  },
  {
    id: "dom-2",
    domain: "Pet Food",
    category: "Specialized Seeds, Pellets & Mash",
    activeListings: 120,
    totalStock: 680,
    avgPrice: "৳ 850",
    featuredCount: 8,
    topStore: "PetNest Official Direct",
  },
  {
    id: "dom-3",
    domain: "Gear & Accessories",
    category: "Flight Cages, Perches & Bowls",
    activeListings: 68,
    totalStock: 312,
    avgPrice: "৳ 1,800",
    featuredCount: 5,
    topStore: "CozyPaws Essentials",
  },
  {
    id: "dom-4",
    domain: "Medicine & Health",
    category: "Electrolytes, Vitamins & First-Aid",
    activeListings: 34,
    totalStock: 180,
    avgPrice: "৳ 650",
    featuredCount: 3,
    topStore: "PetNest Official Direct",
  },
  {
    id: "dom-5",
    domain: "Books & Media",
    category: "Avian & Canine Care Handbooks",
    activeListings: 18,
    totalStock: 95,
    avgPrice: "৳ 420",
    featuredCount: 2,
    topStore: "Heritage Pet Press",
  },
];

export default function MarketplaceAnalyticsPage() {
  const [chartType, setChartType] = useState<ChartType>("Area");

  const columns: Column<DomainBreakdownRecord>[] = [
    {
      key: "domain",
      label: "Commercial Domain / Category",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col py-1">
          <span className="font-bold text-ink text-sm font-quicksand flex items-center gap-1.5">
            <Tag className="size-3.5 text-coral shrink-0" />
            {row.domain}
          </span>
          <span className="text-xs text-ink-muted">{row.category}</span>
        </div>
      ),
    },
    {
      key: "activeListings",
      label: "Live Listings",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-bold text-ink font-mono">
          {row.activeListings} items
        </span>
      ),
    },
    {
      key: "totalStock",
      label: "Available Inventory",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-semibold text-ink-muted">
          {row.totalStock.toLocaleString()} units
        </span>
      ),
    },
    {
      key: "avgPrice",
      label: "Average Price",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-bold text-coral font-mono">
          {row.avgPrice}
        </span>
      ),
    },
    {
      key: "featuredCount",
      label: "Featured Items",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/20">
          {row.featuredCount} featured
        </span>
      ),
    },
    {
      key: "topStore",
      label: "Leading Vendor Store",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-ink font-semibold">
          <Store className="size-3.5 text-ink-muted shrink-0" />
          <span>{row.topStore}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* 1. Header & Domain Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-quicksand text-ink">
            Marketplace Analytics
          </h2>
          <p className="text-xs text-ink-muted">
            Listing inventory, commercial domains, store activity, and demand
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink-muted font-quicksand">Domain:</span>
          <div className="inline-flex rounded-lg border border-border-peach bg-surface-muted p-1 shadow-2xs">
            {["All Domains", "Live Pets", "Supplies"].map((item, idx) => (
              <button
                key={item}
                type="button"
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-bold font-quicksand transition-all cursor-pointer",
                  idx === 0
                    ? "bg-coral text-white shadow-2xs"
                    : "text-ink-muted hover:text-ink hover:bg-card/60"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Marketplace KPIs */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Active Listings"
            value="428"
            trendText="+14.1% new items"
            trendType="positive"
            icon={<ShoppingBag className="size-5" />}
          />
          <StatsCard
            title="Catalog Retail Value"
            value="৳ 482,500"
            trendText="Total live inventory"
            trendType="positive"
            icon={<DollarSign className="size-5" />}
          />
          <StatsCard
            title="Registered Vendor Stores"
            value="18"
            trendText="Active aviaries & shops"
            trendType="positive"
            icon={<Store className="size-5" />}
          />
          <StatsCard
            title="Promoted / Featured"
            value="34"
            trendText="Homepage spotlight items"
            trendType="neutral"
            icon={<Tag className="size-5" />}
          />
        </div>
      </AnimatedContainer>

      {/* 3. Middle Section: Growth Trend (8 cols) + Domain Inventory Share (4 cols) */}
      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: Monthly Trend Chart */}
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-xl border border-border-peach bg-card shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-ink font-quicksand">
                  Catalog Inventory Growth
                </h3>
                <p className="text-xs text-ink-muted">
                  Monthly additions to active catalog listings
                </p>
              </div>
              <FilterSelect
                title={chartType}
                options={["Area", "Line", "Bar"]}
                variant="outline"
                className="w-32"
                value={chartType}
                onChange={(v) => setChartType(v as ChartType)}
              />
            </div>
            <div className="w-full h-72 min-w-0">
              <ReusableChart
                chartType={chartType}
                data={LISTING_GROWTH_TREND}
                strokeColor="#FF6B6B"
                fillColor="#FF6B6B"
              />
            </div>
          </div>

          {/* Right: Domain Distribution */}
          <div className="lg:col-span-4 p-5 sm:p-6 rounded-xl border border-border-peach bg-card shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-ink font-quicksand mb-1">
                Inventory Mix by Domain
              </h3>
              <p className="text-xs text-ink-muted mb-4">
                Share of active listings across commercial categories
              </p>

              <div className="space-y-3.5">
                {DOMAIN_DISTRIBUTION.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.domain} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-ink font-quicksand">
                        <span className="flex items-center gap-1.5">
                          <Icon className="size-3.5 text-ink-muted" />
                          {item.domain}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-ink-muted font-normal">{item.count}</span>
                          <span className="text-coral">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", item.color)}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border-peach/60 pt-4 mt-4 flex items-center justify-between text-xs text-ink-muted">
              <span>Top Domain: <strong>Live Pets</strong></span>
              <span className="font-bold text-coral">44% catalog share</span>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* 4. Domain Breakdown Table */}
      <AnimatedContainer delay={0.15}>
        <DynamicTable
          data={DOMAIN_RECORDS}
          columns={columns}
          searchable
          searchPlaceholder="Search commercial domains or categories..."
          title="Marketplace Domain Inventory Breakdown"
          countBadge={`${DOMAIN_RECORDS.length} domains`}
          hoverable
        />
      </AnimatedContainer>
    </div>
  );
}
