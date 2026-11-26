"use client";

import React, { useState } from "react";
import { FilterSelect } from "@/components/common/FilterSelect";
import ReusableChart, { ChartType } from "@/components/common/ReusableChart";

export function DashboardChart() {
  const [metric, setMetric] = useState("Gross sales");
  const [chartType, setChartType] = useState<ChartType>("Area");
  const [timeUnit, setTimeUnit] = useState("Days");

  // Data from Jun 03 to Jun 24 (stacked segment values matching design screenshot)
  const salesData = [
    { label: "Jun 03", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 04", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 05", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 06", value: 4100, grey: 0, green: 2500, blue: 1600, red: 0 },
    { label: "Jun 07", value: 1500, grey: 0, green: 0, blue: 1500, red: 0 },
    { label: "Jun 08", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 09", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 10", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 11", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 12", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 13", value: 3900, grey: 0, green: 3000, blue: 900, red: 0 },
    { label: "Jun 14", value: 6100, grey: 3500, green: 1500, blue: 700, red: 400 },
    { label: "Jun 15", value: 15700, grey: 9500, green: 5000, blue: 700, red: 500 },
    { label: "Jun 16", value: 700, grey: 0, green: 700, blue: 0, red: 0 },
    { label: "Jun 17", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 18", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 19", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 20", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 21", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 22", value: 20000, grey: 10000, green: 6000, blue: 3000, red: 1000 },
    { label: "Jun 23", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 24", value: 2500, grey: 2500, green: 0, blue: 0, red: 0 },
  ];

  const trafficData = [
    { label: "Jun 03", value: 420 },
    { label: "Jun 04", value: 580 },
    { label: "Jun 05", value: 640 },
    { label: "Jun 06", value: 1850 },
    { label: "Jun 07", value: 1200 },
    { label: "Jun 08", value: 980 },
    { label: "Jun 09", value: 1100 },
    { label: "Jun 10", value: 1350 },
    { label: "Jun 11", value: 1420 },
    { label: "Jun 12", value: 1680 },
    { label: "Jun 13", value: 2450 },
    { label: "Jun 14", value: 3100 },
    { label: "Jun 15", value: 4800 },
    { label: "Jun 16", value: 2100 },
    { label: "Jun 17", value: 1750 },
    { label: "Jun 18", value: 1900 },
    { label: "Jun 19", value: 2200 },
    { label: "Jun 20", value: 2800 },
    { label: "Jun 21", value: 3200 },
    { label: "Jun 22", value: 5900 },
    { label: "Jun 23", value: 3400 },
    { label: "Jun 24", value: 3650 },
  ];

  const guideData = [
    { label: "Jun 03", value: 320 },
    { label: "Jun 04", value: 410 },
    { label: "Jun 05", value: 490 },
    { label: "Jun 06", value: 1200 },
    { label: "Jun 07", value: 890 },
    { label: "Jun 08", value: 720 },
    { label: "Jun 09", value: 850 },
    { label: "Jun 10", value: 980 },
    { label: "Jun 11", value: 1050 },
    { label: "Jun 12", value: 1180 },
    { label: "Jun 13", value: 1820 },
    { label: "Jun 14", value: 2400 },
    { label: "Jun 15", value: 3950 },
    { label: "Jun 16", value: 1540 },
    { label: "Jun 17", value: 1320 },
    { label: "Jun 18", value: 1480 },
    { label: "Jun 19", value: 1750 },
    { label: "Jun 20", value: 2150 },
    { label: "Jun 21", value: 2600 },
    { label: "Jun 22", value: 4820 },
    { label: "Jun 23", value: 2750 },
    { label: "Jun 24", value: 2900 },
  ];

  const chartData =
    metric === "Page Views & Traffic"
      ? trafficData
      : metric === "Guide Reader Reach"
      ? guideData
      : salesData;

  const bars = [
    { dataKey: "grey", name: "Cost of Goods", color: "#a89f91", opacity: 0.65 },
    { dataKey: "green", name: "Gross Profit", color: "#10b981" },
    { dataKey: "blue", name: "Net Sales", color: "#ff6b6b" },
    { dataKey: "red", name: "Refunds", color: "#e85c5c" },
  ];

  return (
    <div className="p-6 rounded-xl bg-card border border-border-peach shadow-xs flex flex-col justify-between gap-5 w-full h-full min-w-0">
      {/* Filter Row */}
      <div className="flex items-center justify-between flex-wrap gap-4 min-h-10">
        <FilterSelect
          title={metric}
          options={[
            "Gross sales",
            "Page Views & Traffic",
            "Guide Reader Reach",
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
      <div className="w-full h-[380px] select-none min-w-0">
        <ReusableChart
          chartType={chartType}
          data={chartData}
          bars={metric === "Gross sales" ? bars : undefined}
          strokeColor="#ff6b6b"
          fillColor="#ff6b6b"
        />
      </div>
    </div>
  );
}
