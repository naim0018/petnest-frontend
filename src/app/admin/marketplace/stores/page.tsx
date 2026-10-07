"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import Avatar from "@/components/common/Avatar";
import { Store, Plus, ShieldCheck, Star, PackageCheck, AlertCircle } from "lucide-react";

interface StoreRecord {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  listingsCount: number;
  totalOrders: number;
  rating: number;
  isVerified: boolean;
  status: "Active" | "Pending Approval" | "Suspended";
}

const mockStores: StoreRecord[] = [
  {
    id: "STR-01",
    name: "Willow Creek Kennels",
    category: "Ethical Dog Breeder",
    logoUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=150&q=80",
    listingsCount: 8,
    totalOrders: 142,
    rating: 4.9,
    isVerified: true,
    status: "Active",
  },
  {
    id: "STR-02",
    name: "PetPurity Botanicals",
    category: "Organic Pet Nutrition",
    logoUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=150&q=80",
    listingsCount: 42,
    totalOrders: 1840,
    rating: 4.8,
    isVerified: true,
    status: "Active",
  },
  {
    id: "STR-03",
    name: "SilverMist Cattery",
    category: "Pedigree Cat Breeder",
    logoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80",
    listingsCount: 5,
    totalOrders: 89,
    rating: 5.0,
    isVerified: true,
    status: "Active",
  },
  {
    id: "STR-04",
    name: "TechPaws Labs",
    category: "Smart Pet Gadgets",
    logoUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=150&q=80",
    listingsCount: 16,
    totalOrders: 920,
    rating: 4.6,
    isVerified: true,
    status: "Active",
  },
  {
    id: "STR-05",
    name: "ArtisanPet Studio",
    category: "Bespoke Pet Accessories",
    logoUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=150&q=80",
    listingsCount: 12,
    totalOrders: 310,
    rating: 4.7,
    isVerified: false,
    status: "Pending Approval",
  },
];

export default function StoresPage() {
  const [data] = useState<StoreRecord[]>(mockStores);

  const columns: Column<StoreRecord>[] = [
    {
      key: "name",
      label: "Store / Partner Brand",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.logoUrl}
            name={row.name}
            alt={row.name}
            size="md"
            ring="solid"
            badge={row.isVerified ? "online" : undefined}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-ink leading-tight">{row.name}</p>
              {row.isVerified && (
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <p className="text-xs text-ink-muted">{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "listingsCount",
      label: "Active Listings",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="font-semibold text-xs px-2.5 py-1 rounded-md bg-surface-muted text-ink">
          {row.listingsCount} items
        </span>
      ),
    },
    {
      key: "totalOrders",
      label: "Fulfilled Orders",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-bold text-ink">
          {row.totalOrders.toLocaleString()}
        </span>
      ),
    },
    {
      key: "rating",
      label: "Customer Rating",
      sortable: true,
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-600">
          <Star className="size-3.5 fill-amber-500 text-amber-500" />
          <span>{row.rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Store Status",
      sortable: true,
      align: "right",
      render: (row) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.status === "Active"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Marketplace Stores</h2>
          <p className="text-sm text-ink-muted mt-1">
            Manage verified pet breeders, boutique supply shops, veterinary pharmacies, and brands.
          </p>
        </div>
        <PrimaryButton
          variant="primary"
          size="md"
          leftIcon={<Plus className="size-4" />}
        >
          Add Partner Store
        </PrimaryButton>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Active Stores"
            value="142 Stores"
            trendText="+12 this month"
            trendType="positive"
            icon={<Store className="size-5 text-coral" />}
          />
          <StatsCard
            title="Verified Breeder Accounts"
            value="64 Kennels"
            trendText="DNA & health test verified"
            trendType="positive"
            icon={<ShieldCheck className="size-5 text-coral" />}
          />
          <StatsCard
            title="Pending Verification"
            value="6 Applications"
            trendText="Awaiting business documentation"
            trendType="neutral"
            icon={<AlertCircle className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={data}
            columns={columns}
            searchable
            searchPlaceholder="Search stores, brands, or categories..."
            pagination
            pageSize={10}
            title="Partner Merchant Directory"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
