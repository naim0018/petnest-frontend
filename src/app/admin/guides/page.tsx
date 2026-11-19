"use client";

import React, { useState, useEffect, useMemo } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useFindAllEditorialQuery,
  useGetEditorialStatsQuery,
} from "@/store/Api/Guides/guides.api";
import {
  BookOpen,
  Clock,
  Users,
  Plus,
  TrendingUp,
  FileArchive,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import BulkGuideImportModal from "@/components/admin/guides/BulkGuideImportModal";
import GuideStatusDropdown from "@/components/admin/guides/GuideStatusDropdown";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface RecentGuideRecord {
  id: string;
  title: string;
  category: string;
  author: string;
  views: number;
  status: string;
  publishedDate: string;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().split("T")[0];
}

const tooltipContentStyle: React.CSSProperties = {
  backgroundColor: "var(--card, #ffffff)",
  borderColor: "var(--border-peach, #f3dcd3)",
  borderRadius: "12px",
  color: "var(--ink, #1f2937)",
  fontSize: "12px",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  padding: "8px 12px",
};

export default function GuidesOverviewPage() {
  const { setHeaderAction } = useHeaderAction();
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const { data: statsResponse, isLoading: isLoadingStats } = useGetEditorialStatsQuery();
  const { data: recentGuidesResponse, isLoading: isLoadingRecent } =
    useFindAllEditorialQuery({
      page: 1,
      limit: 5,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const stats = statsResponse?.data;
  const recentItems = recentGuidesResponse?.data?.items;

  // Real recent articles from database
  const displayGuides: RecentGuideRecord[] = useMemo(() => {
    if (recentItems && recentItems.length > 0) {
      return recentItems.slice(0, 5).map((g) => ({
        id: g.id,
        title: g.title,
        category: g.category?.name || "General Care",
        author:
          g.author?.role?.toUpperCase() === "SUPERADMIN"
            ? "Super Admin"
            : g.author?.name || "Editor",
        views: g.viewCount ?? 0,
        status: g.status,
        publishedDate: formatDate(g.publishedAt || g.createdAt),
      }));
    }
    return [];
  }, [recentItems]);

  // Chart 1: Monthly Readership & Publishing Trend (Area)
  const monthlyData = useMemo(() => {
    if (stats?.monthlyTrend && stats.monthlyTrend.length > 0) {
      return stats.monthlyTrend.map((m) => ({
        label: m.label,
        published: m.published,
        views: m.views,
      }));
    }
    return [
      { label: "Jun", published: 0, views: 0 },
      { label: "Jul", published: 0, views: 0 },
      { label: "Aug", published: 0, views: 0 },
      { label: "Sep", published: 0, views: 0 },
      { label: "Oct", published: 0, views: 0 },
      { label: "Nov", published: stats?.publishedCount ?? 0, views: stats?.totalViews ?? 0 },
    ];
  }, [stats]);

  // Chart 2: Guides by Pet Category (Bar)
  const categoryData = useMemo(() => {
    if (stats?.categoryDistribution && stats.categoryDistribution.length > 0) {
      return stats.categoryDistribution.map((c) => ({
        name: c.name,
        guideCount: c.guideCount,
        views: c.views,
      }));
    }
    return [];
  }, [stats]);

  // Chart 3: Publication Status & Lifecycle Distribution (Donut)
  const statusData = useMemo(() => {
    if (stats?.statusDistribution && stats.statusDistribution.length > 0) {
      const activeOnly = stats.statusDistribution.filter((s) => s.value > 0);
      if (activeOnly.length > 0) return activeOnly;
    }
    return [
      {
        name: "Published",
        value: stats?.publishedCount ?? 0,
        color: "#10B981",
        status: "PUBLISHED",
      },
    ];
  }, [stats]);

  const totalGuidesCount = stats?.totalGuides ?? stats?.publishedCount ?? 0;

  useEffect(() => {
    setHeaderAction(
      <div className="flex items-center gap-2">
        <PrimaryButton
          variant="outline"
          size="sm"
          rounded="md"
          leftIcon={<FileArchive className="size-4 text-coral" />}
          onClick={() => setIsBulkImportOpen(true)}
          className="font-bold cursor-pointer"
        >
          Bulk Import (.zip)
        </PrimaryButton>
        <Link href="/admin/guides/all">
          <PrimaryButton
            variant="outline"
            size="sm"
            rounded="md"
            leftIcon={<Clock className="size-4" />}
            className="font-bold cursor-pointer"
          >
            Review Queue ({stats?.inReviewCount ?? 0})
          </PrimaryButton>
        </Link>
        <Link href="/admin/guides/create">
          <PrimaryButton
            variant="primary"
            size="sm"
            rounded="md"
            leftIcon={<Plus className="size-4" />}
            className="font-bold cursor-pointer"
          >
            Create Guide
          </PrimaryButton>
        </Link>
      </div>
    );

    return () => setHeaderAction(null);
  }, [setHeaderAction, stats]);

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
            <Link
              href={`/admin/guides/${row.id}`}
              className="font-bold text-ink leading-tight line-clamp-1 hover:text-coral transition-colors"
            >
              {row.title}
            </Link>
            <p className="text-xs text-ink-muted">{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      label: "Author",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold text-ink">{row.author}</span>
      ),
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
        <GuideStatusDropdown
          guideId={row.id}
          currentStatus={row.status}
          guideTitle={row.title}
        />
      ),
    },
    {
      key: "publishedDate",
      label: "Date",
      sortable: true,
      align: "center",
      render: (row) => <span className="text-xs text-ink-muted">{row.publishedDate}</span>,
    },
  ];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* 4 Real Metric Cards */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatsCard
            title="Total Published Guides"
            value={stats ? stats.publishedCount.toLocaleString() : "0"}
            trendText={
              stats
                ? `+${stats.publishedThisMonth ?? 0} published this month`
                : "Active publications"
            }
            trendType="positive"
            icon={<BookOpen className="size-5 text-coral" />}
          />
          <StatsCard
            title="Review & Workflow Pipeline"
            value={stats ? stats.inReviewCount.toString() : "0"}
            trendText={
              stats
                ? `${stats.draftCount ?? 0} drafts • ${stats.needsRevisionCount ?? 0} revisions`
                : "Editorial checks pending"
            }
            trendType={stats && stats.inReviewCount > 0 ? "positive" : "neutral"}
            icon={<Clock className="size-5 text-coral" />}
          />
          <StatsCard
            title="Active Authors & Contributors"
            value={stats ? stats.activeAuthorsCount.toString() : "0"}
            trendText={
              stats
                ? `${stats.faqCount ?? 0} verified guide FAQs`
                : "Verified contributors"
            }
            trendType="positive"
            icon={<Users className="size-5 text-coral" />}
          />
          <StatsCard
            title="Total Reader Reach"
            value={stats ? (stats.totalViews ?? 0).toLocaleString() : "0"}
            trendText={
              stats
                ? `${stats.totalLikes ?? 0} reactions • ${stats.totalBookmarks ?? 0} bookmarks`
                : "All-time guide views"
            }
            trendType="positive"
            icon={<TrendingUp className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      {/* 3 Real Guide Analytics Charts */}
      <AnimatedContainer delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
          {/* Chart 1: Area Chart (Monthly Publishing & Readership Trend) */}
          <div className="p-5 rounded-2xl border border-border-peach bg-card shadow-xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-coral shrink-0" />
                  <h3 className="text-sm font-bold text-ink truncate">Publishing Growth</h3>
                </div>
                <p className="text-xs text-ink-muted mt-0.5 truncate">
                  6-month articles volume & reader trend
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tint-mint text-success border border-success/30 shrink-0">
                Area Trend
              </span>
            </div>

            <div className="w-full h-56 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="guideGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(243, 220, 211, 0.5)" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#8c7e7a", fontSize: 11 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#8c7e7a", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={tooltipContentStyle}
                    formatter={(val, name) => [
                      `${val} ${name === "published" ? "guides" : "views"}`,
                      name === "published" ? "Published Articles" : "Reader Views",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="published"
                    name="published"
                    stroke="#FF6B6B"
                    strokeWidth={2.5}
                    fill="url(#guideGrowthGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-border-peach/60 flex items-center justify-between text-xs text-ink-muted">
              <span>Current Activity</span>
              <span className="font-semibold text-ink">
                +{stats?.publishedThisMonth ?? 0} published this month
              </span>
            </div>
          </div>

          {/* Chart 2: Bar Chart (Guides by Pet Category) */}
          <div className="p-5 rounded-2xl border border-border-peach bg-card shadow-xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-coral shrink-0" />
                  <h3 className="text-sm font-bold text-ink truncate">Coverage by Category</h3>
                </div>
                <p className="text-xs text-ink-muted mt-0.5 truncate">
                  Article density across pet care taxonomies
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tint-sky text-info border border-info/30 shrink-0">
                Category Bar
              </span>
            </div>

            <div className="w-full h-56 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(243, 220, 211, 0.5)" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#8c7e7a", fontSize: 11 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#8c7e7a", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={tooltipContentStyle}
                    formatter={(val) => [`${val} articles`, "Total Guides"]}
                  />
                  <Bar
                    dataKey="guideCount"
                    name="guideCount"
                    fill="#FF8E8E"
                    radius={[6, 6, 0, 0]}
                    activeBar={{ fill: "#FF6B6B" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-border-peach/60 flex items-center justify-between text-xs text-ink-muted">
              <span>Categories Tracked</span>
              <span className="font-semibold text-ink">
                {categoryData.length} active topics
              </span>
            </div>
          </div>

          {/* Chart 3: Donut / Pie Chart (Guide Status Breakdown) */}
          <div className="p-5 rounded-2xl border border-border-peach bg-card shadow-xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="size-4 text-coral shrink-0" />
                  <h3 className="text-sm font-bold text-ink truncate">Status Distribution</h3>
                </div>
                <p className="text-xs text-ink-muted mt-0.5 truncate">
                  Live catalog vs review pipeline states
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tint-cream text-warning border border-warning/30 shrink-0">
                Donut View
              </span>
            </div>

            <div className="relative w-full h-56 min-w-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={tooltipContentStyle}
                    formatter={(val, name) => [`${val} guides`, name]}
                  />
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {statusData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Metric Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-quicksand text-ink leading-none">
                  {totalGuidesCount}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mt-0.5">
                  Guides
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border-peach/60 flex items-center justify-between text-xs text-ink-muted">
              <span>Catalog State</span>
              <span className="font-semibold text-ink">
                {stats?.publishedCount ?? 0} Published of {totalGuidesCount} Total
              </span>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Recent Guides Table (Last 5 Only) */}
      <AnimatedContainer delay={0.25}>
        <DynamicTable
          data={displayGuides}
          columns={columns}
          loading={isLoadingRecent}
          searchable
          searchPlaceholder="Search recent care guides..."
          pagination
          pageSize={5}
          title="Recent Pet Care Publications"
          headerRight={
            <Link href="/admin/guides/all">
              <PrimaryButton
                variant="outline"
                size="sm"
                rounded="md"
                className="font-bold text-xs cursor-pointer"
              >
                View All Guides
              </PrimaryButton>
            </Link>
          }
          hoverable
        />
      </AnimatedContainer>

      <BulkGuideImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
      />
    </div>
  );
}
