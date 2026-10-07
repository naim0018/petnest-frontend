"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { ShoppingBag, Plus, Filter, Tag, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface ListingRecord {
  id: string;
  title: string;
  category: string;
  storeName: string;
  price: string;
  inventory: number;
  featured: boolean;
  status: "Active" | "Pending" | "Sold Out";
  createdAt: string;
}

const mockListings: ListingRecord[] = [
  {
    id: "LST-101",
    title: "Purebred Golden Retriever Puppies (CKC Registered)",
    category: "Dogs & Puppies",
    storeName: "Willow Creek Kennels",
    price: "$1,850",
    inventory: 4,
    featured: true,
    status: "Active",
    createdAt: "2026-10-04",
  },
  {
    id: "LST-102",
    title: "Organic Freeze-Dried Raw Beef Dog Food (5 lbs)",
    category: "Nutrition",
    storeName: "PetPurity Botanicals",
    price: "$54.99",
    inventory: 140,
    featured: false,
    status: "Active",
    createdAt: "2026-10-03",
  },
  {
    id: "LST-103",
    title: "Ergonomic Memory Foam Orthopedic Pet Bed (Large)",
    category: "Supplies & Beds",
    storeName: "CozyPaws Essentials",
    price: "$89.00",
    inventory: 28,
    featured: true,
    status: "Active",
    createdAt: "2026-10-02",
  },
  {
    id: "LST-104",
    title: "Maine Coon Kittens with Full Pedigree Papers",
    category: "Cats & Kittens",
    storeName: "SilverMist Cattery",
    price: "$1,600",
    inventory: 2,
    featured: true,
    status: "Active",
    createdAt: "2026-10-01",
  },
  {
    id: "LST-105",
    title: "Smart Wi-Fi Pet Feeder with HD 1080p Camera",
    category: "Tech & Accessories",
    storeName: "TechPaws Labs",
    price: "$119.00",
    inventory: 64,
    featured: false,
    status: "Active",
    createdAt: "2026-09-28",
  },
  {
    id: "LST-106",
    title: "Handmade Natural Sisal Cat Scratching Post 36-Inch",
    category: "Toys & Scratchers",
    storeName: "ArtisanPet Studio",
    price: "$48.50",
    inventory: 0,
    featured: false,
    status: "Sold Out",
    createdAt: "2026-09-20",
  },
];

export default function ListingsPage() {
  const [data] = useState<ListingRecord[]>(mockListings);

  const columns: Column<ListingRecord>[] = [
    {
      key: "title",
      label: "Listing & Product",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-coral-light flex items-center justify-center text-coral shrink-0">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight line-clamp-1">{row.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-coral font-medium">{row.category}</span>
              {row.featured && (
                <span className="text-[10px] uppercase font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-1.5 py-0.2 rounded">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "storeName",
      label: "Seller / Store",
      sortable: true,
      render: (row) => <span className="text-xs font-semibold text-ink">{row.storeName}</span>,
    },
    {
      key: "price",
      label: "Unit Price",
      sortable: true,
      render: (row) => <span className="text-sm font-bold text-coral">{row.price}</span>,
    },
    {
      key: "inventory",
      label: "In Stock",
      sortable: true,
      align: "center",
      render: (row) => (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
            row.inventory === 0
              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
              : row.inventory < 5
              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
              : "bg-surface-muted text-ink"
          }`}
        >
          {row.inventory} units
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
            row.status === "Active"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : row.status === "Sold Out"
              ? "bg-surface-muted text-ink-muted"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date Added",
      sortable: true,
      align: "right",
      render: (row) => <span className="text-xs text-ink-muted">{row.createdAt}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Marketplace Listings</h2>
          <p className="text-sm text-ink-muted mt-1">
            Browse, inspect, toggle visibility, and moderate all active vendor inventory listings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryButton
            variant="outline"
            size="md"
            leftIcon={<Filter className="size-4" />}
          >
            Filter by Category
          </PrimaryButton>
          <Link href="/admin/marketplace/create">
            <PrimaryButton
              variant="primary"
              size="md"
              leftIcon={<Plus className="size-4" />}
            >
              Add Listing
            </PrimaryButton>
          </Link>
        </div>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Active Listings"
            value="1,290"
            trendText="+42 listed this week"
            trendType="positive"
            icon={<ShoppingBag className="size-5 text-coral" />}
          />
          <StatsCard
            title="Featured Promotions"
            value="68 Items"
            trendText="High priority carousel visibility"
            trendType="positive"
            icon={<Tag className="size-5 text-coral" />}
          />
          <StatsCard
            title="Out of Stock Items"
            value="14 Items"
            trendText="Awaiting vendor restock"
            trendType="neutral"
            icon={<ShieldAlert className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={data}
            columns={columns}
            searchable
            searchPlaceholder="Search listings, sellers, or products..."
            pagination
            pageSize={10}
            title="Master Marketplace Inventory"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
