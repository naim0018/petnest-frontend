"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { FolderTree, Plus, Sparkles, BookOpen, Layers } from "lucide-react";

interface GuideCategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  guidesCount: number;
  totalViews: string;
  status: "Active" | "Archived";
}

const mockGuideCategories: GuideCategoryRecord[] = [
  {
    id: "CAT-G01",
    name: "Puppy & Kitten Onboarding",
    slug: "puppy-kitten-onboarding",
    description: "First-year essentials, initial vaccinations, and crate training foundations.",
    guidesCount: 48,
    totalViews: "412.5k",
    status: "Active",
  },
  {
    id: "CAT-G02",
    name: "Clinical Nutrition & Diets",
    slug: "clinical-nutrition-diets",
    description: "Veterinary-reviewed feeding schedules, portion calculators, and allergy diets.",
    guidesCount: 64,
    totalViews: "580.2k",
    status: "Active",
  },
  {
    id: "CAT-G03",
    name: "Behavior, Training & Socialization",
    slug: "behavior-training-socialization",
    description: "Positive reinforcement guides, leash manners, and anxiety reduction techniques.",
    guidesCount: 72,
    totalViews: "620.4k",
    status: "Active",
  },
  {
    id: "CAT-G04",
    name: "Aquatic Life & Tank Chemistry",
    slug: "aquatic-tank-chemistry",
    description: "Nitrogen cycles, filter equipment setup, and aquatic plant maintenance.",
    guidesCount: 38,
    totalViews: "190.8k",
    status: "Active",
  },
  {
    id: "CAT-G05",
    name: "Senior Pet Wellness & Mobility",
    slug: "senior-pet-wellness",
    description: "Arthritis care, joint supplements, cognitive health, and comfort protocols.",
    guidesCount: 29,
    totalViews: "145.1k",
    status: "Active",
  },
  {
    id: "CAT-G06",
    name: "Emergency First Aid & Triage",
    slug: "emergency-first-aid",
    description: "Immediate toxicity response, wound care, choking rescue, and vet finder steps.",
    guidesCount: 22,
    totalViews: "260.9k",
    status: "Active",
  },
];

export default function GuideCategoriesPage() {
  const [data] = useState<GuideCategoryRecord[]>(mockGuideCategories);

  const columns: Column<GuideCategoryRecord>[] = [
    {
      key: "name",
      label: "Category Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-coral-light flex items-center justify-center text-coral shrink-0">
            <FolderTree className="size-5" />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight">{row.name}</p>
            <p className="text-xs text-ink-muted">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Category Scope",
      render: (row) => (
        <span className="text-xs text-ink-muted line-clamp-1">{row.description}</span>
      ),
    },
    {
      key: "guidesCount",
      label: "Published Articles",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="font-semibold text-xs px-2.5 py-1 rounded-md bg-surface-muted text-ink">
          {row.guidesCount} guides
        </span>
      ),
    },
    {
      key: "totalViews",
      label: "Total Readership",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-bold text-coral">{row.totalViews}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Guide Categories</h2>
          <p className="text-sm text-ink-muted mt-1">
            Organize veterinary content clusters, topic taxonomy, and navigation pillars.
          </p>
        </div>
        <PrimaryButton
          variant="primary"
          size="md"
          leftIcon={<Plus className="size-4" />}
        >
          Add Topic Category
        </PrimaryButton>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Article Clusters"
            value="18 Categories"
            trendText="Covering all pet species"
            trendType="positive"
            icon={<Layers className="size-5 text-coral" />}
          />
          <StatsCard
            title="Most Read Topic"
            value="Behavior & Training"
            trendText="620k lifetime views"
            trendType="positive"
            icon={<BookOpen className="size-5 text-coral" />}
          />
          <StatsCard
            title="Curated Topics"
            value="100% Complete"
            trendText="All pillar pages active"
            trendType="positive"
            icon={<Sparkles className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={data}
            columns={columns}
            searchable
            searchPlaceholder="Search categories, slugs, or topics..."
            pagination
            pageSize={10}
            title="Guide Content Clusters"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
