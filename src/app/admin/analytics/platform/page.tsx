"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { StatsCard } from "@/components/common/StatsCard";
import ReusableChart, { ChartType } from "@/components/common/ReusableChart";
import { FilterSelect } from "@/components/common/FilterSelect";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import { Users, TrendingUp, PawPrint, Eye, Globe2, Activity } from "lucide-react";

interface TopRegionRecord {
  region: string;
  monthlyUsers: string;
  guideViews: string;
  gmvContribution: string;
  share: string;
}

const mockRegions: TopRegionRecord[] = [
  { region: "North America (US & Canada)", monthlyUsers: "114,200", guideViews: "520,000", gmvContribution: "$58,400", share: "56%" },
  { region: "United Kingdom & Western Europe", monthlyUsers: "48,500", guideViews: "210,400", gmvContribution: "$22,800", share: "24%" },
  { region: "Australia & New Zealand", monthlyUsers: "18,200", guideViews: "84,100", gmvContribution: "$9,200", share: "11%" },
  { region: "Asia Pacific", monthlyUsers: "12,400", guideViews: "61,200", gmvContribution: "$4,100", share: "9%" },
];

const trafficData = [
  { label: "May", value: 68000 },
  { label: "Jun", value: 89000 },
  { label: "Jul", value: 112000 },
  { label: "Aug", value: 145000 },
  { label: "Sep", value: 168000 },
  { label: "Oct", value: 193300 },
];

export default function PlatformAnalyticsPage() {
  const [chartType, setChartType] = useState<ChartType>("Area");

  const columns: Column<TopRegionRecord>[] = [
    {
      key: "region",
      label: "Geographic Region",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Globe2 className="size-4 text-coral shrink-0" />
          <span className="font-bold text-ink text-sm">{row.region}</span>
        </div>
      ),
    },
    {
      key: "monthlyUsers",
      label: "Active Users",
      sortable: true,
      align: "center",
      render: (row) => <span className="text-xs font-semibold text-ink">{row.monthlyUsers}</span>,
    },
    {
      key: "guideViews",
      label: "Guide Views",
      sortable: true,
      align: "center",
      render: (row) => <span className="text-xs font-semibold text-ink-muted">{row.guideViews}</span>,
    },
    {
      key: "gmvContribution",
      label: "GMV Volume",
      sortable: true,
      align: "center",
      render: (row) => <span className="text-xs font-bold text-coral">{row.gmvContribution}</span>,
    },
    {
      key: "share",
      label: "Traffic Share",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-surface-muted text-ink">
          {row.share}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Platform Analytics</h2>
          <p className="text-sm text-ink-muted mt-1">
            Global audience traffic, monthly active users, session frequency, and regional distribution.
          </p>
        </div>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatsCard
            title="Monthly Active Users"
            value="193,300"
            trendText="+15.2% vs last month"
            trendType="positive"
            icon={<Users className="size-5 text-coral" />}
          />
          <StatsCard
            title="Total Monthly Pageviews"
            value="875,700"
            trendText="+22.8% content impressions"
            trendType="positive"
            icon={<Eye className="size-5 text-coral" />}
          />
          <StatsCard
            title="Avg. Session Duration"
            value="4m 38s"
            trendText="+32s reading time"
            trendType="positive"
            icon={<Activity className="size-5 text-coral" />}
          />
          <StatsCard
            title="Organic Search Traffic"
            value="74.2%"
            trendText="High search rankings"
            trendType="positive"
            icon={<TrendingUp className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="p-6 rounded-xl border border-border-peach bg-card shadow-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-ink">Platform Traffic Trajectory</h3>
              <p className="text-xs text-ink-muted">Monthly unique active visitors across web and mobile web</p>
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
              data={trafficData}
              strokeColor="#FF6B6B"
              fillColor="#FF6B6B"
            />
          </div>
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.3}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={mockRegions}
            columns={columns}
            searchable
            searchPlaceholder="Filter regions..."
            title="Regional Traffic & Engagement Breakdown"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
