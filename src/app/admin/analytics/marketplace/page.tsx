"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { StatsCard } from "@/components/common/StatsCard";
import ReusableChart, { ChartType } from "@/components/common/ReusableChart";
import { FilterSelect } from "@/components/common/FilterSelect";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import { DollarSign, ShoppingBag, Store, TrendingUp, CreditCard, RefreshCw } from "lucide-react";

interface MarketplaceCategoryRevenue {
  category: string;
  grossSales: string;
  unitsSold: number;
  averageOrderValue: string;
  commissionEarned: string;
}

const mockCategoryRevenues: MarketplaceCategoryRevenue[] = [
  { category: "Pet Food & Clinical Nutrition", grossSales: "$58,400", unitsSold: 1420, averageOrderValue: "$64.50", commissionEarned: "$5,840" },
  { category: "Supplies, Beds & Crates", grossSales: "$32,800", unitsSold: 412, averageOrderValue: "$98.00", commissionEarned: "$3,936" },
  { category: "Ethical Breeder Adoption Fees", grossSales: "$84,500", unitsSold: 48, averageOrderValue: "$1,760.00", commissionEarned: "$6,760" },
  { category: "Smart Gadgets & Feeders", grossSales: "$18,900", unitsSold: 180, averageOrderValue: "$105.00", commissionEarned: "$2,268" },
  { category: "Toys & Activity Kits", grossSales: "$12,400", unitsSold: 610, averageOrderValue: "$28.00", commissionEarned: "$1,488" },
];

const gmvTrend = [
  { label: "May", value: 85000 },
  { label: "Jun", value: 115000 },
  { label: "Jul", value: 142000 },
  { label: "Aug", value: 178000 },
  { label: "Sep", value: 194000 },
  { label: "Oct", value: 207000 },
];

export default function MarketplaceAnalyticsPage() {
  const [chartType, setChartType] = useState<ChartType>("Area");

  const columns: Column<MarketplaceCategoryRevenue>[] = [
    {
      key: "category",
      label: "Marketplace Category",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-ink text-sm">{row.category}</span>
      ),
    },
    {
      key: "grossSales",
      label: "Gross GMV",
      sortable: true,
      align: "center",
      render: (row) => <span className="text-xs font-bold text-coral">{row.grossSales}</span>,
    },
    {
      key: "unitsSold",
      label: "Orders Fulfilled",
      sortable: true,
      align: "center",
      render: (row) => <span className="text-xs font-semibold text-ink">{row.unitsSold.toLocaleString()}</span>,
    },
    {
      key: "averageOrderValue",
      label: "Avg. Order Value",
      sortable: true,
      align: "center",
      render: (row) => <span className="text-xs font-semibold text-ink-muted">{row.averageOrderValue}</span>,
    },
    {
      key: "commissionEarned",
      label: "Platform Revenue",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          {row.commissionEarned}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Marketplace Analytics</h2>
          <p className="text-sm text-ink-muted mt-1">
            Financial revenue metrics, transaction volumes, store performance, and average order values.
          </p>
        </div>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatsCard
            title="Monthly Gross Merchandise"
            value="$207,000"
            trendText="+18.4% vs last month"
            trendType="positive"
            icon={<DollarSign className="size-5 text-coral" />}
          />
          <StatsCard
            title="Orders Processed"
            value="2,670"
            trendText="+340 orders"
            trendType="positive"
            icon={<ShoppingBag className="size-5 text-coral" />}
          />
          <StatsCard
            title="Average Order Value"
            value="$77.50"
            trendText="+8.2% basket size"
            trendType="positive"
            icon={<CreditCard className="size-5 text-coral" />}
          />
          <StatsCard
            title="Net Platform Take"
            value="$20,292"
            trendText="8-12% commission"
            trendType="positive"
            icon={<TrendingUp className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="p-6 rounded-xl border border-border-peach bg-card shadow-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-ink">Marketplace GMV Growth</h3>
              <p className="text-xs text-ink-muted">Monthly gross merchandise transactions across all vendor stores</p>
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
              data={gmvTrend}
              strokeColor="#FF6B6B"
              fillColor="#FF6B6B"
            />
          </div>
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.3}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={mockCategoryRevenues}
            columns={columns}
            searchable
            searchPlaceholder="Search categories..."
            title="Category Revenue & Commission Breakdown"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
