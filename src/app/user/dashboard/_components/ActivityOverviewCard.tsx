"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { FilterSelect } from "@/components/common/FilterSelect";
import ReusableChart, { ChartType } from "@/components/common/ReusableChart";

export interface ActivityChartDataPoint {
  label: string;
  value: number;
}

interface ActivityOverviewCardProps {
  chartData?: ActivityChartDataPoint[];
}

const ACTIVITY_DATA: ActivityChartDataPoint[] = [
  { label: "Oct 25", value: 30 },
  { label: "Oct 28", value: 24 },
  { label: "Oct 31", value: 38 },
  { label: "Nov 03", value: 42 },
  { label: "Nov 06", value: 48 },
  { label: "Nov 09", value: 64 },
  { label: "Nov 12", value: 78 },
  { label: "Nov 15", value: 58 },
  { label: "Nov 18", value: 65 },
];

const GUIDES_READ_DATA: ActivityChartDataPoint[] = [
  { label: "Oct 25", value: 2 },
  { label: "Oct 28", value: 3 },
  { label: "Oct 31", value: 5 },
  { label: "Nov 03", value: 4 },
  { label: "Nov 06", value: 7 },
  { label: "Nov 09", value: 9 },
  { label: "Nov 12", value: 12 },
  { label: "Nov 15", value: 8 },
  { label: "Nov 18", value: 10 },
];

const COMMUNITY_DATA: ActivityChartDataPoint[] = [
  { label: "Oct 25", value: 12 },
  { label: "Oct 28", value: 18 },
  { label: "Oct 31", value: 15 },
  { label: "Nov 03", value: 28 },
  { label: "Nov 06", value: 34 },
  { label: "Nov 09", value: 40 },
  { label: "Nov 12", value: 52 },
  { label: "Nov 15", value: 46 },
  { label: "Nov 18", value: 55 },
];

export default function ActivityOverviewCard({
  chartData,
}: ActivityOverviewCardProps) {
  const [metric, setMetric] = useState("Activity Overview");
  const [chartType, setChartType] = useState<ChartType>("Area");
  const [timeUnit, setTimeUnit] = useState("Days");

  const activeData =
    chartData ??
    (metric === "Guides Read"
      ? GUIDES_READ_DATA
      : metric === "Community Interactions"
      ? COMMUNITY_DATA
      : ACTIVITY_DATA);

  return (
    <AnimatedContainer
      delay={0.15}
      className="lg:col-span-8 p-6 rounded-xl bg-card border border-border-peach shadow-xs flex flex-col justify-between gap-5 w-full h-full min-w-0"
    >
      {/* Filter Row */}
      <div className="flex items-center justify-between flex-wrap gap-4 min-h-10">
        <FilterSelect
          title={metric}
          options={[
            "Activity Overview",
            "Guides Read",
            "Community Interactions",
          ]}
          variant="outline"
          className="w-56"
          value={metric}
          onChange={(v) => setMetric(v)}
        />
        <div className="flex items-center gap-3">
          <FilterSelect
            title={chartType}
            options={["Area", "Line", "Bar"]}
            variant="outline"
            className="w-32"
            value={chartType}
            onChange={(v) => setChartType(v as ChartType)}
          />
          <FilterSelect
            title={timeUnit}
            options={["Days", "Weeks", "Months"]}
            variant="outline"
            className="w-32"
            value={timeUnit}
            onChange={(v) => setTimeUnit(v)}
          />
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[280px] sm:h-[310px] select-none min-w-0">
        <ReusableChart
          chartType={chartType}
          data={activeData}
          strokeColor="#ff6b6b"
          fillColor="#ff6b6b"
          yAxisFormatter={(val) => String(val)}
          tooltipFormatter={(val) => [`${val}`, metric]}
        />
      </div>
    </AnimatedContainer>
  );
}
