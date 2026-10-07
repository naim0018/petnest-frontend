"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { Tags, Plus, SlidersHorizontal, CheckCircle2, ShieldCheck, Layers } from "lucide-react";

interface CategoryAttributeRecord {
  id: string;
  name: string;
  groupType: "Product Category" | "Pet Trait" | "Care Filter" | "Dietary Spec";
  applicablePets: string;
  optionsCount: number;
  sampleValues: string;
  isFilterable: boolean;
  status: "Active" | "Archived";
}

const mockCategories: CategoryAttributeRecord[] = [
  {
    id: "ATTR-01",
    name: "Life Stage / Age Group",
    groupType: "Pet Trait",
    applicablePets: "All Pets",
    optionsCount: 4,
    sampleValues: "Puppy/Kitten, Junior, Adult, Senior",
    isFilterable: true,
    status: "Active",
  },
  {
    id: "ATTR-02",
    name: "Food & Dietary Formulation",
    groupType: "Product Category",
    applicablePets: "Dogs, Cats",
    optionsCount: 6,
    sampleValues: "Grain-free, Hypoallergenic, Raw/Freeze-dried, Low-fat",
    isFilterable: true,
    status: "Active",
  },
  {
    id: "ATTR-03",
    name: "Coat Length & Grooming",
    groupType: "Pet Trait",
    applicablePets: "Dogs, Cats, Rabbits",
    optionsCount: 4,
    sampleValues: "Hairless, Short, Medium, Long / Double-coat",
    isFilterable: true,
    status: "Active",
  },
  {
    id: "ATTR-04",
    name: "Habitat / Enclosure Size",
    groupType: "Care Filter",
    applicablePets: "Birds, Fish, Reptiles",
    optionsCount: 5,
    sampleValues: "10 Gallon, 30+ Gallon, Aviary, Terrarium 40L",
    isFilterable: true,
    status: "Active",
  },
  {
    id: "ATTR-05",
    name: "Hypoallergenic Compatibility",
    groupType: "Pet Trait",
    applicablePets: "Dogs, Cats",
    optionsCount: 2,
    sampleValues: "Yes (Hypoallergenic), Standard",
    isFilterable: true,
    status: "Active",
  },
  {
    id: "ATTR-06",
    name: "Toys & Activity Level",
    groupType: "Product Category",
    applicablePets: "All Pets",
    optionsCount: 5,
    sampleValues: "Chewers, Agility, Puzzle toys, Laser/Chase",
    isFilterable: false,
    status: "Active",
  },
];

export default function CategoriesAndAttributesPage() {
  const [data] = useState<CategoryAttributeRecord[]>(mockCategories);

  const columns: Column<CategoryAttributeRecord>[] = [
    {
      key: "name",
      label: "Attribute Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-coral-light flex items-center justify-center text-coral shrink-0">
            <Tags className="size-5" />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight">{row.name}</p>
            <span className="text-xs text-ink-muted">{row.groupType}</span>
          </div>
        </div>
      ),
    },
    {
      key: "applicablePets",
      label: "Applicable Species",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-xs px-2.5 py-1 rounded-md bg-surface-muted text-ink">
          {row.applicablePets}
        </span>
      ),
    },
    {
      key: "sampleValues",
      label: "Attribute Options",
      render: (row) => (
        <div>
          <span className="text-xs text-ink-muted line-clamp-1">{row.sampleValues}</span>
          <span className="text-[11px] text-coral font-medium">
            ({row.optionsCount} values defined)
          </span>
        </div>
      ),
    },
    {
      key: "isFilterable",
      label: "Facet Search",
      sortable: true,
      align: "center",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            row.isFilterable
              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
              : "bg-surface-muted text-ink-muted"
          }`}
        >
          {row.isFilterable ? "Facet Filter" : "Standard Tag"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5" />
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">
            Categories & Attributes
          </h2>
          <p className="text-sm text-ink-muted mt-1">
            Configure metadata tags, search facets, diet classifications, and marketplace filter attributes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryButton
            variant="outline"
            size="md"
            leftIcon={<SlidersHorizontal className="size-4" />}
          >
            Reorder Facets
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            size="md"
            leftIcon={<Plus className="size-4" />}
          >
            Add Attribute
          </PrimaryButton>
        </div>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Custom Attributes"
            value="48 Facets"
            trendText="8 active in marketplace filters"
            trendType="positive"
            icon={<Layers className="size-5 text-coral" />}
          />
          <StatsCard
            title="Search Filterable"
            value="32 Attributes"
            trendText="Indexed for instant instant search"
            trendType="positive"
            icon={<SlidersHorizontal className="size-5 text-coral" />}
          />
          <StatsCard
            title="Taxonomy Integrity"
            value="100% Valid"
            trendText="Zero unlinked category tags"
            trendType="positive"
            icon={<ShieldCheck className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={data}
            columns={columns}
            searchable
            searchPlaceholder="Search categories, attributes, or values..."
            pagination
            pageSize={10}
            title="Global Attributes & Category Facets"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
