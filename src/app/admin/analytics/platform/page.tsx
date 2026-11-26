"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { StatsCard } from "@/components/common/StatsCard";
import ReusableChart, { ChartType } from "@/components/common/ReusableChart";
import { FilterSelect } from "@/components/common/FilterSelect";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import {
  Users,
  Eye,
  Activity,
  Globe2,
  Laptop,
  Smartphone,
  Tablet,
  Compass,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Traffic time-series
const TRAFFIC_DATA = [
  { label: "May", value: 68400 },
  { label: "Jun", value: 89200 },
  { label: "Jul", value: 112500 },
  { label: "Aug", value: 145800 },
  { label: "Sep", value: 168300 },
  { label: "Oct", value: 194100 },
];

// Device & Browser distributions
const DEVICE_DISTRIBUTION = [
  { name: "Desktop", percentage: 58, icon: Laptop, color: "bg-coral" },
  { name: "Mobile", percentage: 36, icon: Smartphone, color: "bg-amber-500" },
  { name: "Tablet", percentage: 6, icon: Tablet, color: "bg-sky-500" },
];

const BROWSER_DISTRIBUTION = [
  { browser: "Google Chrome", share: "64.2%" },
  { browser: "Apple Safari", share: "21.5%" },
  { browser: "Mozilla Firefox", share: "8.1%" },
  { browser: "Microsoft Edge", share: "6.2%" },
];

// Top Visited Routes record
interface VisitedPathRecord {
  path: string;
  name: string;
  pageviews: number;
  uniqueSessions: number;
  share: string;
}

const TOP_VISITED_PATHS: VisitedPathRecord[] = [
  { path: "/guides", name: "Guides & Care Directory", pageviews: 74200, uniqueSessions: 31200, share: "38.2%" },
  { path: "/marketplace", name: "Pet Marketplace Catalog", pageviews: 48900, uniqueSessions: 22400, share: "25.2%" },
  { path: "/guides/budgie-care", name: "Budgerigar Complete Care", pageviews: 29400, uniqueSessions: 16100, share: "15.1%" },
  { path: "/marketplace/birds", name: "Aviary Birds Listings", pageviews: 18200, uniqueSessions: 9800, share: "9.4%" },
  { path: "/auth/login", name: "User Authentication", pageviews: 12500, uniqueSessions: 8900, share: "6.4%" },
  { path: "/about", name: "About PetNest Initiative", pageviews: 11100, uniqueSessions: 6700, share: "5.7%" },
];

// Recent Live Session record
interface RecentSessionRecord {
  id: string;
  maskedIp: string;
  country: string;
  deviceType: string;
  browser: string;
  entryPath: string;
  totalVisits: number;
  lastActive: string;
}

const RECENT_SESSIONS: RecentSessionRecord[] = [
  { id: "sess-1", maskedIp: "103.145.***.***", country: "Bangladesh", deviceType: "Desktop", browser: "Chrome 128 / Windows", entryPath: "/guides", totalVisits: 14, lastActive: "2m ago" },
  { id: "sess-2", maskedIp: "182.48.***.***", country: "Bangladesh", deviceType: "Mobile", browser: "Safari 17 / iOS", entryPath: "/marketplace", totalVisits: 6, lastActive: "8m ago" },
  { id: "sess-3", maskedIp: "157.240.***.***", country: "India", deviceType: "Desktop", browser: "Firefox 130 / macOS", entryPath: "/guides/cockatiel-diet", totalVisits: 3, lastActive: "15m ago" },
  { id: "sess-4", maskedIp: "72.229.***.***", country: "United States", deviceType: "Desktop", browser: "Edge 128 / Windows", entryPath: "/marketplace/live-pets", totalVisits: 9, lastActive: "22m ago" },
  { id: "sess-5", maskedIp: "82.165.***.***", country: "United Kingdom", deviceType: "Mobile", browser: "Chrome Mobile / Android", entryPath: "/guides", totalVisits: 2, lastActive: "35m ago" },
  { id: "sess-6", maskedIp: "27.147.***.***", country: "Bangladesh", deviceType: "Desktop", browser: "Chrome 128 / Windows", entryPath: "/admin/analytics", totalVisits: 42, lastActive: "Just now" },
];

export default function PlatformAnalyticsPage() {
  const [chartType, setChartType] = useState<ChartType>("Area");

  // Columns for Top Visited Paths
  const pathColumns: Column<VisitedPathRecord>[] = [
    {
      key: "path",
      label: "Route / Page Name",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-ink text-sm flex items-center gap-1.5">
            <Compass className="size-3.5 text-coral shrink-0" />
            {row.name}
          </span>
          <span className="text-xs text-ink-muted font-mono">{row.path}</span>
        </div>
      ),
    },
    {
      key: "pageviews",
      label: "Total Pageviews",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-semibold text-ink">
          {row.pageviews.toLocaleString()}
        </span>
      ),
    },
    {
      key: "uniqueSessions",
      label: "Unique Sessions",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-semibold text-ink-muted">
          {row.uniqueSessions.toLocaleString()}
        </span>
      ),
    },
    {
      key: "share",
      label: "Traffic Share",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-surface-muted text-ink border border-border-peach/60">
          {row.share}
        </span>
      ),
    },
  ];

  // Columns for Recent Sessions
  const sessionColumns: Column<RecentSessionRecord>[] = [
    {
      key: "maskedIp",
      label: "Visitor IP / Origin",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Globe2 className="size-4 text-coral shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold text-ink">{row.maskedIp}</span>
            <span className="text-[11px] text-ink-muted">{row.country}</span>
          </div>
        </div>
      ),
    },
    {
      key: "browser",
      label: "Device & Browser",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-ink">
          {row.deviceType === "Mobile" ? (
            <Smartphone className="size-3.5 text-amber-500 shrink-0" />
          ) : (
            <Laptop className="size-3.5 text-coral shrink-0" />
          )}
          <span>{row.browser}</span>
        </div>
      ),
    },
    {
      key: "entryPath",
      label: "Active / Entry Path",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-mono text-ink-muted bg-surface-muted px-2 py-0.5 rounded border border-border-peach/40">
          {row.entryPath}
        </span>
      ),
    },
    {
      key: "totalVisits",
      label: "Visit Count",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-bold text-coral">
          {row.totalVisits} visits
        </span>
      ),
    },
    {
      key: "lastActive",
      label: "Last Seen",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-semibold text-ink-muted">
          {row.lastActive}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* 1. Header & Quick Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-quicksand text-ink">
            Platform Analytics
          </h2>
          <p className="text-xs text-ink-muted">
            Platform ecosystem health, registered user growth, and live web traffic
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink-muted font-quicksand">Timeframe:</span>
          <div className="inline-flex rounded-lg border border-border-peach bg-surface-muted p-1 shadow-2xs">
            {["7 Days", "30 Days", "90 Days", "12 Months"].map((period, idx) => (
              <button
                key={period}
                type="button"
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-bold font-quicksand transition-all cursor-pointer",
                  idx === 1
                    ? "bg-coral text-white shadow-2xs"
                    : "text-ink-muted hover:text-ink hover:bg-card/60"
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Platform Core KPIs */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Registered Users"
            value="3,842"
            trendText="+18.4% this month"
            trendType="positive"
            icon={<Users className="size-5" />}
          />
          <StatsCard
            title="Total Platform Pageviews"
            value="194,100"
            trendText="+24.2% impressions"
            trendType="positive"
            icon={<Eye className="size-5" />}
          />
          <StatsCard
            title="Active Visitors (24h)"
            value="1,248"
            trendText="Active readers today"
            trendType="positive"
            icon={<Activity className="size-5" />}
          />
          <StatsCard
            title="Avg. Session Depth"
            value="3.8x"
            trendText="Page hits / session"
            trendType="neutral"
            icon={<ArrowUpRight className="size-5" />}
          />
        </div>
      </AnimatedContainer>

      {/* 3. Middle Section: Traffic Chart (8 cols) + Device Breakdown (4 cols) */}
      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: Traffic Chart */}
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-xl border border-border-peach bg-card shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-ink font-quicksand">
                  Platform Traffic Trajectory
                </h3>
                <p className="text-xs text-ink-muted">
                  Cumulative monthly page impressions across web and mobile browsers
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
                data={TRAFFIC_DATA}
                strokeColor="#FF6B6B"
                fillColor="#FF6B6B"
              />
            </div>
          </div>

          {/* Right: Device & Browser Share */}
          <div className="lg:col-span-4 p-5 sm:p-6 rounded-xl border border-border-peach bg-card shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-ink font-quicksand mb-1">
                Device & Browser Share
              </h3>
              <p className="text-xs text-ink-muted mb-4">
                Visitor device categories and browser distribution
              </p>

              {/* Device Progress Bars */}
              <div className="space-y-3.5 mb-6">
                {DEVICE_DISTRIBUTION.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-ink font-quicksand">
                        <span className="flex items-center gap-1.5">
                          <Icon className="size-3.5 text-ink-muted" />
                          {item.name}
                        </span>
                        <span>{item.percentage}%</span>
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

              {/* Browser Breakdown List */}
              <div className="border-t border-border-peach/60 pt-4">
                <span className="text-xs font-bold text-ink-muted uppercase tracking-wider block mb-2.5 font-quicksand">
                  Top Browsers
                </span>
                <div className="space-y-2">
                  {BROWSER_DISTRIBUTION.map((b) => (
                    <div
                      key={b.browser}
                      className="flex items-center justify-between text-xs font-semibold"
                    >
                      <span className="text-ink">{b.browser}</span>
                      <span className="text-coral font-bold">{b.share}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* 4. Top Visited Routes */}
      <AnimatedContainer delay={0.15}>
        <DynamicTable
          data={TOP_VISITED_PATHS}
          columns={pathColumns}
          searchable
          searchPlaceholder="Search visited pages or routes..."
          title="Top Visited Content Hubs & Pages"
          hoverable
        />
      </AnimatedContainer>

      {/* 5. Live / Recent Visitor Sessions */}
      <AnimatedContainer delay={0.2}>
        <DynamicTable
          data={RECENT_SESSIONS}
          columns={sessionColumns}
          searchable
          searchPlaceholder="Search visitor sessions by IP, Country, or Device..."
          title="Recent Live Visitor Sessions"
          countBadge={`${RECENT_SESSIONS.length} active logs`}
          hoverable
        />
      </AnimatedContainer>
    </div>
  );
}
