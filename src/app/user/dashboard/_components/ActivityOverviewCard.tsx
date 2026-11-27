"use client";

import React from "react";
import { BarChart3, ChevronDown, BookOpen, Eye, Heart, Trophy } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import ReusableChart from "@/components/common/ReusableChart";

export interface ActivityMetricItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgClass: string;
}

export interface ActivityChartDataPoint {
  label: string;
  value: number;
}

interface ActivityOverviewCardProps {
  chartData?: ActivityChartDataPoint[];
  periodLabel?: string;
  metrics?: {
    guidesRead?: number;
    totalViews?: string;
    likes?: number;
    achievements?: number;
  };
}

const DEFAULT_CHART_DATA: ActivityChartDataPoint[] = [
  { label: "Oct 25", value: 30 },
  { label: "Oct 31", value: 38 },
  { label: "Nov 06", value: 48 },
  { label: "Nov 12", value: 78 },
  { label: "Nov 18", value: 65 },
];

export default function ActivityOverviewCard({
  chartData = DEFAULT_CHART_DATA,
  periodLabel = "Last 30 Days",
  metrics = {
    guidesRead: 6,
    totalViews: "1.2K",
    likes: 3,
    achievements: 1,
  },
}: ActivityOverviewCardProps) {
  return (
    <AnimatedContainer
      delay={0.15}
      className="lg:col-span-8 bg-white dark:bg-card border border-border-peach/60 rounded-xl p-5 sm:p-6 shadow-xs space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="size-5 text-[#0284C7]" />
          <h2 className="text-base sm:text-lg font-bold font-quicksand text-ink">
            Your Activity Overview
          </h2>
        </div>

        <div className="rounded-full border border-border-peach bg-surface-muted/50 px-3.5 py-1 text-xs font-bold text-ink-muted inline-flex items-center gap-1.5 shadow-2xs">
          <span>{periodLabel}</span>
          <ChevronDown className="size-3 text-ink-muted" />
        </div>
      </div>

      {/* 4 Vertical Metric Columns */}
      <div className="grid grid-cols-4 gap-2 pt-1 border-b border-border-peach/30 pb-4">
        <div className="flex flex-col items-center text-center">
          <div className="size-8 rounded-lg bg-[#E3EFFD] text-[#0284C7] flex items-center justify-center mb-1.5">
            <BookOpen className="size-4" />
          </div>
          <span className="text-lg sm:text-xl font-bold font-quicksand text-ink">
            {metrics.guidesRead}
          </span>
          <span className="text-[11px] font-medium text-ink-muted">
            Guides Read
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="size-8 rounded-lg bg-[#E2F1EA] text-[#10B981] flex items-center justify-center mb-1.5">
            <Eye className="size-4" />
          </div>
          <span className="text-lg sm:text-xl font-bold font-quicksand text-ink">
            {metrics.totalViews}
          </span>
          <span className="text-[11px] font-medium text-ink-muted">
            Total Views
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="size-8 rounded-lg bg-[#FFEAE7] text-[#F43F5E] flex items-center justify-center mb-1.5">
            <Heart className="size-4 fill-[#F43F5E]" />
          </div>
          <span className="text-lg sm:text-xl font-bold font-quicksand text-ink">
            {metrics.likes}
          </span>
          <span className="text-[11px] font-medium text-ink-muted">
            Likes
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="size-8 rounded-lg bg-[#FEF3DF] text-[#D97706] flex items-center justify-center mb-1.5">
            <Trophy className="size-4" />
          </div>
          <span className="text-lg sm:text-xl font-bold font-quicksand text-ink">
            {metrics.achievements}
          </span>
          <span className="text-[11px] font-medium text-ink-muted">
            Achievements
          </span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-52 sm:h-56 w-full pt-1">
        <ReusableChart
          chartType="Area"
          data={chartData}
          lineValueKey="value"
          strokeColor="#FF6B6B"
          fillColor="#FF8E72"
          showDots={true}
          yDomain={[0, 100]}
          yTicks={[0, 25, 50, 75, 100]}
          margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
          yAxisFormatter={(val) => String(val)}
          tooltipFormatter={(val) => [`${val} Activities`, "Interactions"]}
        />
      </div>
    </AnimatedContainer>
  );
}
