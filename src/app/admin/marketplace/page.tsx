"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import ReusableChart, { ChartType } from "@/components/common/ReusableChart";
import { FilterSelect } from "@/components/common/FilterSelect";
import { Store, ShoppingBag, DollarSign, Clock, Plus, Star, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

interface RecentListingRecord {
  id: string;
  title: string;
  category: "Puppy / Dog" | "Kitten / Cat" | "Supplies & Gear" | "Nutrition";
  seller: string;
  price: string;
  status: "Active" | "Pending Review" | "Sold";
  createdAt: string;
}

const mockRecentListings: RecentListingRecord[] = [
  {
    id: "LST-890",
    title: "Purebred Golden Retriever Puppies (CKC Registered)",
    category: "Puppy / Dog",
    seller: "Willow Creek Kennels",
    price: "$1,850",
    status: "Active",
    createdAt: "Today, 10:15 AM",
  },
  {
    id: "LST-891",
    title: "Organic Freeze-Dried Raw Beef Dog Food (5 lbs)",
    category: "Nutrition",
    seller: "PetPurity Botanicals",
    price: "$54.99",
    status: "Active",
    createdAt: "Today, 09:30 AM",
  },
  {
    id: "LST-892",
    title: "Ergonomic Memory Foam Orthopedic Pet Bed (Large)",
    category: "Supplies & Gear",
    seller: "CozyPaws Essentials",
    price: "$89.00",
    status: "Active",
    createdAt: "Yesterday",
  },
  {
    id: "LST-893",
    title: "Champion Bloodline British Shorthair Kittens",
    category: "Kitten / Cat",
    seller: "SilverMist Cattery",
    price: "$1,600",
    status: "Pending Review",
    createdAt: "Yesterday",
  },
  {
    id: "LST-894",
    title: "Interactive Smart Laser Cat Toy & Automatic Feeder",
    category: "Supplies & Gear",
    seller: "TechPaws Labs",
    price: "$45.00",
    status: "Sold",
    createdAt: "2 days ago",
  },
];

const salesMonthlyData = [
  { label: "May", value: 32000 },
  { label: "Jun", value: 41500 },
  { label: "Jul", value: 52800 },
  { label: "Aug", value: 68400 },
  { label: "Sep", value: 81200 },
  { label: "Oct", value: 94500 },
];

export default function MarketplaceOverviewPage() {
  const [chartType, setChartType] = useState<ChartType>("Area");

  const columns: Column<RecentListingRecord>[] = [
    {
      key: "title",
      label: "Listing Title",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-coral-light flex items-center justify-center text-coral shrink-0">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight line-clamp-1">{row.title}</p>
            <span className="text-xs text-ink-muted">{row.category}</span>
          </div>
        </div>
      ),
    },
    {
      key: "seller",
      label: "Seller / Store",
      sortable: true,
      render: (row) => <span className="text-xs font-semibold text-ink">{row.seller}</span>,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (row) => <span className="text-sm font-bold text-coral">{row.price}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      align: "center",
      render: (row) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.status === "Active"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : row.status === "Pending Review"
              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
              : "bg-surface-muted text-ink-muted"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Listed",
      sortable: true,
      align: "right",
      render: (row) => <span className="text-xs text-ink-muted">{row.createdAt}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Marketplace Command Center</h2>
          <p className="text-sm text-ink-muted mt-1">
            Oversee multi-vendor pet listings, store compliance, reviews, and transaction volumes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/marketplace/review">
            <PrimaryButton
              variant="outline"
              size="md"
              leftIcon={<Clock className="size-4" />}
            >
              Review Queue (6)
            </PrimaryButton>
          </Link>
          <Link href="/admin/marketplace/create">
            <PrimaryButton
              variant="primary"
              size="md"
              leftIcon={<Plus className="size-4" />}
            >
              Create Listing
            </PrimaryButton>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatsCard
            title="Active Listings"
            value="1,290"
            trendText="+8.2% vs last week"
            trendType="positive"
            icon={<ShoppingBag className="size-5 text-coral" />}
          />
          <StatsCard
            title="Pending Approval"
            value="18 Listings"
            trendText="6 require vet license check"
            trendType="neutral"
            icon={<Clock className="size-5 text-coral" />}
          />
          <StatsCard
            title="Verified Partner Stores"
            value="142 Stores"
            trendText="+12 onboarding this month"
            trendType="positive"
            icon={<Store className="size-5 text-coral" />}
          />
          <StatsCard
            title="Monthly GMV"
            value="$94,500"
            trendText="+16.4% marketplace volume"
            trendType="positive"
            icon={<DollarSign className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      {/* Sales Growth Chart */}
      <AnimatedContainer delay={0.2}>
        <div className="p-6 rounded-xl border border-border-peach bg-card shadow-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-ink">Gross Marketplace Volume (GMV)</h3>
              <p className="text-xs text-ink-muted">Cumulative gross sales across supplies and verified breeders</p>
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
              data={salesMonthlyData}
              strokeColor="#FF6B6B"
              fillColor="#FF6B6B"
            />
          </div>
        </div>
      </AnimatedContainer>

      {/* Recent Listings */}
      <AnimatedContainer delay={0.3}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={mockRecentListings}
            columns={columns}
            searchable
            searchPlaceholder="Search marketplace listings, sellers, or categories..."
            pagination
            pageSize={5}
            title="Recent Marketplace Listings"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
