"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import ReusableChart, { ChartType } from "@/components/common/ReusableChart";
import { FilterSelect } from "@/components/common/FilterSelect";
import { BookOpen, CheckCircle, Clock, Users, Plus, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

interface RecentGuideRecord {
  id: string;
  title: string;
  category: string;
  author: string;
  views: number;
  status: "Published" | "In Review" | "Draft";
  publishedDate: string;
}

const mockRecentGuides: RecentGuideRecord[] = [
  {
    id: "G-101",
    title: "Essential Puppy Vaccination Schedules & Milestones",
    category: "Puppy Care",
    author: "Dr. Sarah Jenkins (DVM)",
    views: 12480,
    status: "Published",
    publishedDate: "2026-10-01",
  },
  {
    id: "G-102",
    title: "Feline Nutrition: Dry vs Wet Food Comprehensive Guide",
    category: "Nutrition",
    author: "Elena Rostova",
    views: 8940,
    status: "Published",
    publishedDate: "2026-09-28",
  },
  {
    id: "G-103",
    title: "Beginner's Guide to Setting Up a Planted Freshwater Aquarium",
    category: "Aquatics",
    author: "Marcus Chen",
    views: 6510,
    status: "Published",
    publishedDate: "2026-09-25",
  },
  {
    id: "G-104",
    title: "Understanding Separation Anxiety in Rescued Dogs",
    category: "Behavior & Training",
    author: "Amara Williams",
    views: 1420,
    status: "In Review",
    publishedDate: "2026-10-04",
  },
  {
    id: "G-105",
    title: "Parrot Enrichment: DIY Foraging Toys & Mental Exercises",
    category: "Avian Care",
    author: "David Thorne",
    views: 310,
    status: "Draft",
    publishedDate: "2026-10-05",
  },
];

const guideMonthlyData = [
  { label: "May", value: 18200 },
  { label: "Jun", value: 24500 },
  { label: "Jul", value: 29800 },
  { label: "Aug", value: 34100 },
  { label: "Sep", value: 42900 },
  { label: "Oct", value: 48600 },
];

export default function GuidesOverviewPage() {
  const [chartType, setChartType] = useState<ChartType>("Area");

  const columns: Column<RecentGuideRecord>[] = [
    {
      key: "title",
      label: "Article Title",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-coral-light flex items-center justify-center text-coral shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight line-clamp-1">{row.title}</p>
            <p className="text-xs text-ink-muted">{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      label: "Author",
      sortable: true,
      render: (row) => <span className="text-xs font-semibold text-ink">{row.author}</span>,
    },
    {
      key: "views",
      label: "Readership",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="font-semibold text-xs px-2.5 py-1 rounded-md bg-surface-muted text-ink">
          {row.views.toLocaleString()} views
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      align: "center",
      render: (row) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.status === "Published"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : row.status === "In Review"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "publishedDate",
      label: "Date",
      sortable: true,
      align: "right",
      render: (row) => <span className="text-xs text-ink-muted">{row.publishedDate}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Guides Editorial Hub</h2>
          <p className="text-sm text-ink-muted mt-1">
            Monitor pet care documentation, expert review queues, and readership trends.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/guides/review-queue">
            <PrimaryButton
              variant="outline"
              size="md"
              leftIcon={<Clock className="size-4" />}
            >
              Review Queue (4)
            </PrimaryButton>
          </Link>
          <Link href="/admin/guides/create">
            <PrimaryButton
              variant="primary"
              size="md"
              leftIcon={<Plus className="size-4" />}
            >
              Create Guide
            </PrimaryButton>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatsCard
            title="Total Published Guides"
            value="412"
            trendText="+24 this month"
            trendType="positive"
            icon={<BookOpen className="size-5 text-coral" />}
          />
          <StatsCard
            title="Awaiting Review"
            value="14"
            trendText="8 medical checks pending"
            trendType="neutral"
            icon={<Clock className="size-5 text-coral" />}
          />
          <StatsCard
            title="Active Authors"
            value="48"
            trendText="+6 verified vets"
            trendType="positive"
            icon={<Users className="size-5 text-coral" />}
          />
          <StatsCard
            title="Monthly Reader Reach"
            value="184,200"
            trendText="+18.4% pageviews"
            trendType="positive"
            icon={<TrendingUp className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      {/* Readership Chart */}
      <AnimatedContainer delay={0.2}>
        <div className="p-6 rounded-xl border border-border-peach bg-card shadow-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-ink">Guide Readership Growth</h3>
              <p className="text-xs text-ink-muted">Monthly unique readers across pet care topics</p>
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
              data={guideMonthlyData}
              strokeColor="#FF6B6B"
              fillColor="#FF6B6B"
            />
          </div>
        </div>
      </AnimatedContainer>

      {/* Recent Guides Table */}
      <AnimatedContainer delay={0.3}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={mockRecentGuides}
            columns={columns}
            searchable
            searchPlaceholder="Search recent care guides..."
            pagination
            pageSize={5}
            title="Recent Pet Care Publications"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
