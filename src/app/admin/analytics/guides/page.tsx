"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { StatsCard } from "@/components/common/StatsCard";
import ReusableChart, { ChartType } from "@/components/common/ReusableChart";
import { FilterSelect } from "@/components/common/FilterSelect";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import { BookOpen, BookmarkCheck, ThumbsUp, Eye, Share2, TrendingUp } from "lucide-react";

interface TopArticleMetric {
  title: string;
  category: string;
  views: number;
  readThroughRate: string;
  saves: number;
  rating: string;
}

const mockTopArticles: TopArticleMetric[] = [
  { title: "Puppy Vaccination Schedules & Milestones", category: "Puppy Care", views: 48900, readThroughRate: "82%", saves: 3410, rating: "99.2%" },
  { title: "Feline Nutrition: Dry vs Wet Clinical Guide", category: "Nutrition", views: 36200, readThroughRate: "78%", saves: 2190, rating: "98.5%" },
  { title: "Separation Anxiety in Rescued Dogs", category: "Behavior", views: 28400, readThroughRate: "86%", saves: 1980, rating: "99.0%" },
  { title: "Freshwater Planted Aquarium Setup", category: "Aquatics", views: 22100, readThroughRate: "71%", saves: 1420, rating: "97.4%" },
  { title: "Dental Care Protocols for Senior Dogs", category: "Senior Pets", views: 18900, readThroughRate: "79%", saves: 1120, rating: "98.8%" },
];

const readershipTrend = [
  { label: "May", value: 38000 },
  { label: "Jun", value: 52000 },
  { label: "Jul", value: 69000 },
  { label: "Aug", value: 88000 },
  { label: "Sep", value: 112000 },
  { label: "Oct", value: 138500 },
];

export default function GuideAnalyticsPage() {
  const [chartType, setChartType] = useState<ChartType>("Area");

  const columns: Column<TopArticleMetric>[] = [
    {
      key: "title",
      label: "Article Title",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-ink leading-tight line-clamp-1">{row.title}</p>
          <span className="text-xs text-coral font-medium">{row.category}</span>
        </div>
      ),
    },
    {
      key: "views",
      label: "Monthly Views",
      sortable: true,
      align: "center",
      render: (row) => <span className="text-xs font-semibold text-ink">{row.views.toLocaleString()}</span>,
    },
    {
      key: "readThroughRate",
      label: "Completion Rate",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          {row.readThroughRate}
        </span>
      ),
    },
    {
      key: "saves",
      label: "Bookmarks / Saves",
      sortable: true,
      align: "center",
      render: (row) => <span className="text-xs font-semibold text-ink-muted">{row.saves.toLocaleString()}</span>,
    },
    {
      key: "rating",
      label: "Helpful Score",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          {row.rating}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Guide Analytics</h2>
          <p className="text-sm text-ink-muted mt-1">
            Track pet health article readership, scroll retention rates, bookmarks, and satisfaction scores.
          </p>
        </div>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatsCard
            title="Total Article Reads"
            value="138,500"
            trendText="+19.4% this month"
            trendType="positive"
            icon={<BookOpen className="size-5 text-coral" />}
          />
          <StatsCard
            title="Avg. Read Completion"
            value="79.4%"
            trendText="High content engagement"
            trendType="positive"
            icon={<TrendingUp className="size-5 text-coral" />}
          />
          <StatsCard
            title="Total Bookmarks"
            value="14,890"
            trendText="+1,420 saved to pet profiles"
            trendType="positive"
            icon={<BookmarkCheck className="size-5 text-coral" />}
          />
          <StatsCard
            title="Helpfulness Score"
            value="98.6%"
            trendText="Based on reader feedback"
            trendType="positive"
            icon={<ThumbsUp className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="p-6 rounded-xl border border-border-peach bg-card shadow-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-ink">Readership Volume Progression</h3>
              <p className="text-xs text-ink-muted">Cumulative article impressions across PetNest care encyclopedia</p>
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
          <div className="w-full h-80 min-w-0">
            <ReusableChart
              chartType={chartType}
              data={readershipTrend}
              strokeColor="#FF6B6B"
              fillColor="#FF6B6B"
            />
          </div>
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.3}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={mockTopArticles}
            columns={columns}
            searchable
            searchPlaceholder="Search articles..."
            title="Top Performing Care Articles"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
