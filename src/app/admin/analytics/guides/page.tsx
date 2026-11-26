"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { StatsCard } from "@/components/common/StatsCard";
import ReusableChart, { ChartType } from "@/components/common/ReusableChart";
import { FilterSelect } from "@/components/common/FilterSelect";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import {
  BookOpen,
  BookmarkCheck,
  ThumbsUp,
  Eye,
  TrendingUp,
  Award,
  Layers,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Monthly readership trend
const READERSHIP_TREND = [
  { label: "May", value: 38200 },
  { label: "Jun", value: 52400 },
  { label: "Jul", value: 69100 },
  { label: "Aug", value: 88500 },
  { label: "Sep", value: 112300 },
  { label: "Oct", value: 138500 },
];

// Species & Category Readership Share
const SPECIES_DISTRIBUTION = [
  { species: "Aviary Birds", percentage: 48, count: "66,480 views", color: "bg-coral" },
  { species: "Canines (Dogs)", percentage: 26, count: "36,010 views", color: "bg-amber-500" },
  { species: "Felines (Cats)", percentage: 16, count: "22,160 views", color: "bg-purple-500" },
  { species: "Aquatics & Fish", percentage: 7, count: "9,690 views", color: "bg-sky-500" },
  { species: "Small Pets & Others", percentage: 3, count: "4,160 views", color: "bg-emerald-500" },
];

interface GuidePerformanceMetric {
  id: string;
  title: string;
  species: string;
  category: string;
  views: number;
  readTime: string;
  likes: number;
  bookmarks: number;
  completionRate: string;
}

const TOP_GUIDES: GuidePerformanceMetric[] = [
  {
    id: "g-1",
    title: "বাস্তবায়ন ও বাজেরিগারের খাঁচা সাজানো ও এনরিচমেন্ট গাইড",
    species: "Birds",
    category: "Housing & Cage",
    views: 48900,
    readTime: "6 min",
    likes: 1840,
    bookmarks: 1420,
    completionRate: "88%",
  },
  {
    id: "g-2",
    title: "দ্বিতীয় বাজেরিগার আনার নিয়ম: কোয়ারেন্টাইন ও বন্ধুত্ব গাইড",
    species: "Birds",
    category: "Social & Bonding",
    views: 36200,
    readTime: "5 min",
    likes: 1290,
    bookmarks: 980,
    completionRate: "84%",
  },
  {
    id: "g-3",
    title: "The Complete Cockatiel Diet, Nutrition & Seed Balance Guide",
    species: "Birds",
    category: "Nutrition",
    views: 29400,
    readTime: "7 min",
    likes: 1120,
    bookmarks: 890,
    completionRate: "82%",
  },
  {
    id: "g-4",
    title: "Avian Emergency Kit Checklist & Toxic Plants Prevention",
    species: "Birds",
    category: "Health & First-Aid",
    views: 21800,
    readTime: "4 min",
    likes: 940,
    bookmarks: 760,
    completionRate: "91%",
  },
  {
    id: "g-5",
    title: "Puppy Vaccination Schedules, Socialization & First 90 Days",
    species: "Dogs",
    category: "Preventative Health",
    views: 18400,
    readTime: "8 min",
    likes: 820,
    bookmarks: 640,
    completionRate: "79%",
  },
  {
    id: "g-6",
    title: "Feline Hydration & Wet Food Transition Clinical Protocols",
    species: "Cats",
    category: "Nutrition",
    views: 14200,
    readTime: "5 min",
    likes: 610,
    bookmarks: 490,
    completionRate: "85%",
  },
];

export default function GuideAnalyticsPage() {
  const [chartType, setChartType] = useState<ChartType>("Area");

  const columns: Column<GuidePerformanceMetric>[] = [
    {
      key: "title",
      label: "Guide Article Title",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col py-1">
          <span className="font-bold text-ink text-sm leading-snug line-clamp-1 hover:text-coral transition-colors">
            {row.title}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-bold text-coral bg-coral-light/60 px-2 py-0.5 rounded-full font-quicksand">
              {row.species}
            </span>
            <span className="text-xs text-ink-muted">
              {row.category}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "views",
      label: "Total Views",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-bold text-ink font-mono">
          {row.views.toLocaleString()}
        </span>
      ),
    },
    {
      key: "readTime",
      label: "Read Time",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-semibold text-ink-muted">
          {row.readTime}
        </span>
      ),
    },
    {
      key: "likes",
      label: "Reactions",
      sortable: true,
      align: "center",
      render: (row) => (
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-coral">
          <ThumbsUp className="size-3.5" />
          <span>{row.likes.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: "bookmarks",
      label: "Bookmarks",
      sortable: true,
      align: "center",
      render: (row) => (
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-ink">
          <BookmarkCheck className="size-3.5 text-amber-500" />
          <span>{row.bookmarks.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: "completionRate",
      label: "Read Completion",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20">
          {row.completionRate}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* 1. Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-quicksand text-ink">
            Guide Editorial Analytics
          </h2>
          <p className="text-xs text-ink-muted">
            Care articles readership, reader retention, and bookmark engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink-muted font-quicksand">Category:</span>
          <div className="inline-flex rounded-lg border border-border-peach bg-surface-muted p-1 shadow-2xs">
            {["All Guides", "Birds", "Dogs", "Cats"].map((item, idx) => (
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

      {/* 2. Editorial KPIs */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Article Views"
            value="138,500"
            trendText="+19.4% readership"
            trendType="positive"
            icon={<BookOpen className="size-5" />}
          />
          <StatsCard
            title="Saved Guides (Bookmarks)"
            value="14,890"
            trendText="+1,420 saved to profiles"
            trendType="positive"
            icon={<BookmarkCheck className="size-5" />}
          />
          <StatsCard
            title="Community Reactions"
            value="9,420"
            trendText="Likes & helpful marks"
            trendType="positive"
            icon={<ThumbsUp className="size-5" />}
          />
          <StatsCard
            title="Avg. Completion Rate"
            value="84.2%"
            trendText="High reader retention"
            trendType="positive"
            icon={<TrendingUp className="size-5" />}
          />
        </div>
      </AnimatedContainer>

      {/* 3. Middle Section: Readership Trend (8 cols) + Species Distribution (4 cols) */}
      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: Monthly Trend Chart */}
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-xl border border-border-peach bg-card shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-ink font-quicksand">
                  Readership Volume Progression
                </h3>
                <p className="text-xs text-ink-muted">
                  Monthly article reads across the PetNest care encyclopedia
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
                data={READERSHIP_TREND}
                strokeColor="#FF6B6B"
                fillColor="#FF6B6B"
              />
            </div>
          </div>

          {/* Right: Species & Category Breakdown */}
          <div className="lg:col-span-4 p-5 sm:p-6 rounded-xl border border-border-peach bg-card shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-ink font-quicksand mb-1">
                Readership by Pet Species
              </h3>
              <p className="text-xs text-ink-muted mb-4">
                Total article views distributed across pet categories
              </p>

              <div className="space-y-4">
                {SPECIES_DISTRIBUTION.map((item) => (
                  <div key={item.species} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-ink font-quicksand">
                      <span>{item.species}</span>
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
                ))}
              </div>
            </div>

            <div className="border-t border-border-peach/60 pt-4 mt-4 flex items-center justify-between text-xs text-ink-muted">
              <span>Top Category: <strong>Housing & Enrichment</strong></span>
              <span className="font-bold text-coral">48% share</span>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* 4. Top Performing Guides Table */}
      <AnimatedContainer delay={0.15}>
        <DynamicTable
          data={TOP_GUIDES}
          columns={columns}
          searchable
          searchPlaceholder="Search guide titles, species, or category..."
          title="Top Performing Care Articles"
          countBadge={`${TOP_GUIDES.length} guides`}
          hoverable
        />
      </AnimatedContainer>
    </div>
  );
}
