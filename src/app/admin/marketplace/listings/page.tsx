"use client";

import React, { useMemo, useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column, TableBadge } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import {
  ShoppingBag,
  Plus,
  Filter,
  Boxes,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  PawPrint,
  Utensils,
  Package,
  BookOpen,
  Pill,
  Video,
} from "lucide-react";
import Link from "next/link";
import {
  useGetMarketplaceOverviewQuery,
  useGetLivePetsQuery,
  useGetPetFoodsQuery,
  useGetAccessoriesQuery,
  useGetBooksQuery,
  useGetMedicinesQuery,
} from "@/store/Api/Marketplace/marketplace.api";
import { ListingStatus } from "@/store/Api/Marketplace/marketplace.types";

interface ListingRecord {
  id: string;
  title: string;
  category: string;
  domain: "pets" | "food" | "accessories" | "books" | "medicine";
  storeName: string;
  price: number;
  salePrice?: number | null;
  buyingPrice?: number | null;
  thumbnailImage?: string | null;
  coverImage?: string | null;
  videoUrls?: string[];
  inventory: number;
  featured: boolean;
  status: ListingStatus;
  createdAt: string;
}

const fallbackListings: ListingRecord[] = [
  {
    id: "LST-101",
    title: "Hand-Tamed Lutino Cockatiel Pair",
    category: "Live Pets",
    domain: "pets",
    storeName: "Bengal Aviary & Birds",
    price: 3500,
    salePrice: 3200,
    buyingPrice: 2100,
    inventory: 4,
    featured: true,
    status: "ACTIVE",
    createdAt: "2026-11-20",
  },
  {
    id: "LST-102",
    title: "Premium Breeder Seed Mix (5 kg)",
    category: "Pet Food",
    domain: "food",
    storeName: "PetNest Official Direct",
    price: 850,
    salePrice: null,
    buyingPrice: 520,
    inventory: 42,
    featured: false,
    status: "ACTIVE",
    createdAt: "2026-11-18",
  },
  {
    id: "LST-103",
    title: "Galvanized Flight Cage 30x18x18",
    category: "Accessories",
    domain: "accessories",
    storeName: "CozyPaws Essentials",
    price: 2400,
    salePrice: 2200,
    buyingPrice: 1650,
    inventory: 15,
    featured: true,
    status: "ACTIVE",
    createdAt: "2026-11-15",
  },
  {
    id: "LST-104",
    title: "Veterinary Electrolyte Powder (100g)",
    category: "Medicine",
    domain: "medicine",
    storeName: "PetNest Official Direct",
    price: 320,
    salePrice: null,
    buyingPrice: 210,
    inventory: 60,
    featured: false,
    status: "ACTIVE",
    createdAt: "2026-11-14",
  },
  {
    id: "LST-105",
    title: "Budgerigar Genetics & Mutation Guide",
    category: "Books & Media",
    domain: "books",
    storeName: "PetNest Official Direct",
    price: 650,
    salePrice: 550,
    buyingPrice: 600,
    inventory: 8,
    featured: false,
    status: "ACTIVE",
    createdAt: "2026-11-10",
  },
];

const CATEGORY_TABS = [
  { id: "ALL", label: "All Categories" },
  { id: "pets", label: "Live Pets" },
  { id: "food", label: "Pet Food" },
  { id: "accessories", label: "Accessories" },
  { id: "books", label: "Books & Media" },
  { id: "medicine", label: "Medicine" },
];

export default function ListingsPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Live queries
  const { data: overview } = useGetMarketplaceOverviewQuery();
  const { data: petsData } = useGetLivePetsQuery({ limit: 50 });
  const { data: foodData } = useGetPetFoodsQuery({ limit: 50 });
  const { data: accessoriesData } = useGetAccessoriesQuery({ limit: 50 });
  const { data: booksData } = useGetBooksQuery({ limit: 50 });
  const { data: medicinesData } = useGetMedicinesQuery({ limit: 50 });

  // Consolidate real items
  const consolidatedListings = useMemo(() => {
    const list: ListingRecord[] = [];

    (petsData?.items || []).forEach((item) => {
      list.push({
        id: item.id,
        title: item.title,
        category: "Live Pets",
        domain: "pets",
        storeName: item.storeName || "PetNest Official Direct",
        price: Number(item.price),
        salePrice: item.salePrice ? Number(item.salePrice) : null,
        buyingPrice: item.buyingPrice ? Number(item.buyingPrice) : null,
        thumbnailImage: item.thumbnailImage,
        coverImage: item.coverImage,
        videoUrls: item.videoUrls,
        inventory: item.quantity,
        featured: item.isFeatured,
        status: item.status,
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent",
      });
    });

    (foodData?.items || []).forEach((item) => {
      list.push({
        id: item.id,
        title: item.title,
        category: "Pet Food",
        domain: "food",
        storeName: item.storeName || "PetNest Official Direct",
        price: Number(item.price),
        salePrice: item.salePrice ? Number(item.salePrice) : null,
        buyingPrice: item.buyingPrice ? Number(item.buyingPrice) : null,
        thumbnailImage: item.thumbnailImage,
        coverImage: item.coverImage,
        videoUrls: item.videoUrls,
        inventory: item.stockQuantity,
        featured: item.isFeatured,
        status: item.status,
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent",
      });
    });

    (accessoriesData?.items || []).forEach((item) => {
      list.push({
        id: item.id,
        title: item.title,
        category: "Accessories",
        domain: "accessories",
        storeName: item.storeName || "PetNest Official Direct",
        price: Number(item.price),
        salePrice: item.salePrice ? Number(item.salePrice) : null,
        buyingPrice: item.buyingPrice ? Number(item.buyingPrice) : null,
        thumbnailImage: item.thumbnailImage,
        coverImage: item.coverImage,
        videoUrls: item.videoUrls,
        inventory: item.stockQuantity,
        featured: item.isFeatured,
        status: item.status,
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent",
      });
    });

    (booksData?.items || []).forEach((item) => {
      list.push({
        id: item.id,
        title: item.title,
        category: "Books & Media",
        domain: "books",
        storeName: item.storeName || "PetNest Official Direct",
        price: Number(item.price),
        salePrice: item.salePrice ? Number(item.salePrice) : null,
        buyingPrice: item.buyingPrice ? Number(item.buyingPrice) : null,
        thumbnailImage: item.thumbnailImage,
        coverImage: item.coverImage,
        videoUrls: item.videoUrls,
        inventory: item.stockQuantity,
        featured: item.isFeatured,
        status: item.status,
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent",
      });
    });

    (medicinesData?.items || []).forEach((item) => {
      list.push({
        id: item.id,
        title: item.title,
        category: "Medicine",
        domain: "medicine",
        storeName: item.storeName || "PetNest Official Direct",
        price: Number(item.price),
        salePrice: item.salePrice ? Number(item.salePrice) : null,
        buyingPrice: item.buyingPrice ? Number(item.buyingPrice) : null,
        thumbnailImage: item.thumbnailImage,
        coverImage: item.coverImage,
        videoUrls: item.videoUrls,
        inventory: item.stockQuantity,
        featured: item.isFeatured,
        status: item.status,
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent",
      });
    });

    return list.length ? list : fallbackListings;
  }, [petsData, foodData, accessoriesData, booksData, medicinesData]);

  // Client filtering
  const filteredData = useMemo(() => {
    if (selectedCategory === "ALL") return consolidatedListings;
    return consolidatedListings.filter((row) => row.domain === selectedCategory);
  }, [consolidatedListings, selectedCategory]);

  // Fallback valuation computations if overview valuation is empty
  const computedStats = useMemo(() => {
    let totalCost = 0;
    let totalRetail = 0;
    consolidatedListings.forEach((item) => {
      const retail = (item.salePrice ?? item.price) * (item.inventory || 1);
      const cost = (item.buyingPrice ?? 0) * (item.inventory || 1);
      totalRetail += retail;
      totalCost += cost;
    });
    const grossProfit = totalRetail - totalCost;
    const avgMargin = totalRetail > 0 ? ((grossProfit / totalRetail) * 100).toFixed(1) : "0";
    return {
      totalCost,
      totalRetail,
      grossProfit,
      avgMargin,
    };
  }, [consolidatedListings]);

  const valuation = overview?.valuation;
  const costValuationFormatted = valuation
    ? `৳${valuation.totalCostValuation.toLocaleString()}`
    : `৳${computedStats.totalCost.toLocaleString()}`;
  const grossProfitFormatted = valuation
    ? `৳${valuation.estimatedGrossProfit.toLocaleString()}`
    : `৳${computedStats.grossProfit.toLocaleString()}`;
  const avgMarginFormatted = valuation
    ? `${valuation.avgMarginPercent}%`
    : `${computedStats.avgMargin}%`;

  const getDomainIcon = (domain: ListingRecord["domain"]) => {
    switch (domain) {
      case "pets":
        return <PawPrint className="size-4.5" />;
      case "food":
        return <Utensils className="size-4.5" />;
      case "accessories":
        return <Package className="size-4.5" />;
      case "books":
        return <BookOpen className="size-4.5" />;
      case "medicine":
        return <Pill className="size-4.5" />;
      default:
        return <ShoppingBag className="size-4.5" />;
    }
  };

  const columns: Column<ListingRecord>[] = [
    {
      key: "title",
      label: "Listing & Product",
      sortable: true,
      render: (row) => {
        const imgSrc = row.thumbnailImage || row.coverImage;
        return (
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-surface-muted border border-border-peach/80 overflow-hidden flex items-center justify-center text-coral shrink-0 relative">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={row.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                getDomainIcon(row.domain)
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-ink leading-tight line-clamp-1">{row.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-coral font-medium">{row.category}</span>
                {row.featured && (
                  <span className="text-[10px] uppercase font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-1.5 py-0.2 rounded">
                    Featured
                  </span>
                )}
                {row.videoUrls && row.videoUrls.length > 0 && (
                  <span className="text-[10px] font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 px-1.5 py-0.2 rounded inline-flex items-center gap-1">
                    <Video className="size-2.5" /> {row.videoUrls.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "storeName",
      label: "Seller / Store",
      sortable: true,
      render: (row) => <span className="text-xs font-semibold text-ink">{row.storeName}</span>,
    },
    {
      key: "price",
      label: "Retail Price",
      sortable: true,
      render: (row) => {
        const activePrice = row.salePrice ?? row.price;
        return (
          <div>
            <span className="text-sm font-bold text-coral">৳{activePrice.toLocaleString()}</span>
            {row.salePrice && row.salePrice < row.price && (
              <span className="block text-[11px] text-ink-muted line-through">
                ৳{row.price.toLocaleString()}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "buyingPrice",
      label: "Buying Price (Cost)",
      sortable: true,
      render: (row) => {
        if (row.buyingPrice != null) {
          return (
            <span className="text-xs font-semibold text-ink">
              ৳{row.buyingPrice.toLocaleString()}
            </span>
          );
        }
        return <span className="text-xs text-ink-muted italic">No cost logged</span>;
      },
    },
    {
      key: "margin",
      label: "Profit & Margin",
      sortable: true,
      render: (row) => {
        if (row.buyingPrice == null) {
          return (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-surface-muted text-ink-muted">
              —
            </span>
          );
        }
        const effectivePrice = row.salePrice ?? row.price;
        const profit = effectivePrice - row.buyingPrice;
        const marginPercent =
          effectivePrice > 0 ? ((profit / effectivePrice) * 100).toFixed(1) : "0";
        const isProfitable = profit >= 0;

        return (
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
              isProfitable
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800"
            }`}
          >
            {isProfitable ? (
              <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="size-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>
              {isProfitable ? `+৳${profit.toFixed(0)}` : `-৳${Math.abs(profit).toFixed(0)}`} (
              {marginPercent}%)
            </span>
          </div>
        );
      },
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
        <TableBadge
          variant={
            row.status === "ACTIVE"
              ? "success"
              : row.status === "SOLD_OUT"
              ? "neutral"
              : "warning"
          }
          dot={row.status === "ACTIVE"}
          width="w-24"
        >
          {row.status === "ACTIVE"
            ? "Active"
            : row.status === "SOLD_OUT"
            ? "Sold Out"
            : row.status === "DRAFT"
            ? "Draft"
            : "Archived"}
        </TableBadge>
      ),
    },
    {
      key: "createdAt",
      label: "Date Added",
      sortable: true,
      align: "center",
      render: (row) => <span className="text-xs text-ink-muted">{row.createdAt}</span>,
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Marketplace Listings</h2>
          <p className="text-sm text-ink-muted mt-1">
            Browse, inspect, monitor profit margins, and manage inventory across all marketplace domains.
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Valuation & Margin Stats Cards */}
      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Active Listings"
            value={(overview?.counts?.total ?? consolidatedListings.length).toString()}
            trendText="Across 5 catalog categories"
            trendType="positive"
            icon={<ShoppingBag className="size-5 text-coral" />}
          />
          <StatsCard
            title="Inventory Cost Valuation"
            value={costValuationFormatted}
            trendText="Total capital tied in stock"
            trendType="neutral"
            icon={<Boxes className="size-5 text-coral" />}
          />
          <StatsCard
            title="Estimated Gross Profit"
            value={grossProfitFormatted}
            trendText={`${avgMarginFormatted} platform gross margin`}
            trendType="positive"
            icon={<TrendingUp className="size-5 text-emerald-600" />}
          />
          <StatsCard
            title="Average Gross Margin"
            value={avgMarginFormatted}
            trendText="Calculated from buying prices"
            trendType="positive"
            icon={<Percent className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      {/* Category Tab Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-coral text-white shadow-xs"
                  : "bg-card border border-border-peach text-ink-muted hover:text-ink hover:bg-surface-muted"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatedContainer delay={0.2}>
        <DynamicTable
          data={filteredData}
          columns={columns}
          searchable
          searchPlaceholder="Search listings, sellers, products..."
          pagination
          pageSize={10}
          title="Master Marketplace Inventory & Profitability"
          hoverable
        />
      </AnimatedContainer>
    </div>
  );
}
