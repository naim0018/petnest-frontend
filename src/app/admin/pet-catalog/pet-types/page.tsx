"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { PawPrint, Plus, CheckCircle2, ShieldAlert, Sparkles, Filter } from "lucide-react";

interface PetTypeRecord {
  id: string;
  name: string;
  scientificGroup: string;
  breedsCount: number;
  popularExamples: string;
  status: "Active" | "Archived" | "Draft";
  updatedAt: string;
}

const mockPetTypes: PetTypeRecord[] = [
  {
    id: "PT-01",
    name: "Dogs (Canine)",
    scientificGroup: "Canis lupus familiaris",
    breedsCount: 142,
    popularExamples: "Golden Retriever, German Shepherd, Beagle",
    status: "Active",
    updatedAt: "2026-09-28",
  },
  {
    id: "PT-02",
    name: "Cats (Feline)",
    scientificGroup: "Felis catus",
    breedsCount: 78,
    popularExamples: "Persian, Maine Coon, British Shorthair",
    status: "Active",
    updatedAt: "2026-09-29",
  },
  {
    id: "PT-03",
    name: "Birds (Avian)",
    scientificGroup: "Aves domesticus",
    breedsCount: 46,
    popularExamples: "Budgerigar, Cockatiel, Lovebird",
    status: "Active",
    updatedAt: "2026-10-01",
  },
  {
    id: "PT-04",
    name: "Fish & Aquatic",
    scientificGroup: "Actinopterygii",
    breedsCount: 89,
    popularExamples: "Betta, Guppy, Angelfish",
    status: "Active",
    updatedAt: "2026-09-15",
  },
  {
    id: "PT-05",
    name: "Small Pets & Rodents",
    scientificGroup: "Rodentia & Lagomorpha",
    breedsCount: 34,
    popularExamples: "Hamster, Guinea Pig, Netherland Dwarf Rabbit",
    status: "Active",
    updatedAt: "2026-09-22",
  },
  {
    id: "PT-06",
    name: "Reptiles & Amphibians",
    scientificGroup: "Reptilia",
    breedsCount: 22,
    popularExamples: "Bearded Dragon, Leopard Gecko, Ball Python",
    status: "Draft",
    updatedAt: "2026-10-04",
  },
];

export default function PetTypesPage() {
  const [data] = useState<PetTypeRecord[]>(mockPetTypes);

  const columns: Column<PetTypeRecord>[] = [
    {
      key: "name",
      label: "Pet Classification",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-coral-light flex items-center justify-center text-coral shrink-0">
            <PawPrint className="size-5" />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight">{row.name}</p>
            <p className="text-xs text-ink-muted italic">{row.scientificGroup}</p>
          </div>
        </div>
      ),
    },
    {
      key: "breedsCount",
      label: "Registered Breeds",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="font-semibold px-2.5 py-1 rounded-md bg-surface-muted text-ink text-xs">
          {row.breedsCount} breeds
        </span>
      ),
    },
    {
      key: "popularExamples",
      label: "Popular Examples",
      render: (row) => (
        <span className="text-xs text-ink-muted line-clamp-1">{row.popularExamples}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      align: "center",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.status === "Active"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
          }`}
        >
          {row.status === "Active" ? (
            <CheckCircle2 className="size-3.5" />
          ) : (
            <ShieldAlert className="size-3.5" />
          )}
          {row.status}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Last Modified",
      sortable: true,
      align: "right",
      render: (row) => <span className="text-xs text-ink-muted">{row.updatedAt}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Pet Types</h2>
          <p className="text-sm text-ink-muted mt-1">
            Configure primary animal taxonomy, scientific families, and species groupings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryButton
            variant="outline"
            size="md"
            leftIcon={<Filter className="size-4" />}
          >
            Export Taxonomy
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            size="md"
            leftIcon={<Plus className="size-4" />}
          >
            Add Pet Type
          </PrimaryButton>
        </div>
      </div>

      {/* Metric Cards */}
      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Pet Types"
            value="6 Classes"
            trendText="Covering 411 global breeds"
            trendType="positive"
            icon={<PawPrint className="size-5 text-coral" />}
          />
          <StatsCard
            title="Active in Marketplace"
            value="5 Classes"
            trendText="83% fully cataloged"
            trendType="positive"
            icon={<Sparkles className="size-5 text-coral" />}
          />
          <StatsCard
            title="Pending Review"
            value="1 Class"
            trendText="Reptiles draft in progress"
            trendType="neutral"
            icon={<ShieldAlert className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      {/* Main Table */}
      <AnimatedContainer delay={0.2}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={data}
            columns={columns}
            searchable
            searchPlaceholder="Search pet types or scientific name..."
            pagination
            pageSize={10}
            title="All Pet Classifications"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
