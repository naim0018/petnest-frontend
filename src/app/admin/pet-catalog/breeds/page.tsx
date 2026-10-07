"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { Dog, Plus, Filter, HeartHandshake, Award, Sparkles } from "lucide-react";

interface BreedRecord {
  id: string;
  name: string;
  petType: "Dog" | "Cat" | "Bird" | "Small Pet";
  origin: string;
  sizeCategory: "Toy" | "Small" | "Medium" | "Large" | "Giant";
  temperament: string;
  careLevel: "Low" | "Moderate" | "High";
  status: "Active" | "Pending";
}

const mockBreeds: BreedRecord[] = [
  {
    id: "BR-01",
    name: "Golden Retriever",
    petType: "Dog",
    origin: "United Kingdom (Scotland)",
    sizeCategory: "Large",
    temperament: "Friendly, Intelligent, Devoted",
    careLevel: "Moderate",
    status: "Active",
  },
  {
    id: "BR-02",
    name: "Maine Coon",
    petType: "Cat",
    origin: "United States (Maine)",
    sizeCategory: "Large",
    temperament: "Gentle giant, playful, sociable",
    careLevel: "High",
    status: "Active",
  },
  {
    id: "BR-03",
    name: "French Bulldog",
    petType: "Dog",
    origin: "France / England",
    sizeCategory: "Small",
    temperament: "Playful, Adaptable, Alert",
    careLevel: "Moderate",
    status: "Active",
  },
  {
    id: "BR-04",
    name: "Cockatiel",
    petType: "Bird",
    origin: "Australia",
    sizeCategory: "Small",
    temperament: "Affectionate, Vocal, Curious",
    careLevel: "Moderate",
    status: "Active",
  },
  {
    id: "BR-05",
    name: "British Shorthair",
    petType: "Cat",
    origin: "United Kingdom",
    sizeCategory: "Medium",
    temperament: "Calm, Easygoing, Loyal",
    careLevel: "Low",
    status: "Active",
  },
  {
    id: "BR-06",
    name: "Siberian Husky",
    petType: "Dog",
    origin: "Siberia, Russia",
    sizeCategory: "Large",
    temperament: "Energetic, Outgoing, Alert",
    careLevel: "High",
    status: "Active",
  },
  {
    id: "BR-07",
    name: "Roborovski Hamster",
    petType: "Small Pet",
    origin: "Central Asia",
    sizeCategory: "Toy",
    temperament: "Fast, Timid, Active",
    careLevel: "Low",
    status: "Pending",
  },
];

export default function BreedsPage() {
  const [data] = useState<BreedRecord[]>(mockBreeds);

  const columns: Column<BreedRecord>[] = [
    {
      key: "name",
      label: "Breed Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-coral-light flex items-center justify-center text-coral shrink-0">
            <Dog className="size-5" />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight">{row.name}</p>
            <p className="text-xs text-ink-muted">{row.origin}</p>
          </div>
        </div>
      ),
    },
    {
      key: "petType",
      label: "Species",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-xs px-2.5 py-1 rounded-md bg-surface-muted text-ink">
          {row.petType}
        </span>
      ),
    },
    {
      key: "sizeCategory",
      label: "Size",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-semibold text-ink-muted">
          {row.sizeCategory}
        </span>
      ),
    },
    {
      key: "temperament",
      label: "Temperament Traits",
      render: (row) => (
        <span className="text-xs text-ink-muted line-clamp-1">{row.temperament}</span>
      ),
    },
    {
      key: "careLevel",
      label: "Care Needs",
      sortable: true,
      align: "center",
      render: (row) => {
        const color =
          row.careLevel === "High"
            ? "text-rose-600 bg-rose-50 dark:bg-rose-950/40"
            : row.careLevel === "Moderate"
            ? "text-amber-600 bg-amber-50 dark:bg-amber-950/40"
            : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40";
        return (
          <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${color}`}>
            {row.careLevel}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Catalog Status",
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
          <h2 className="text-2xl font-bold font-quicksand text-ink">Pet Breeds</h2>
          <p className="text-sm text-ink-muted mt-1">
            Maintain standardized breed profiles, temperament guidelines, and species origins.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryButton
            variant="outline"
            size="md"
            leftIcon={<Filter className="size-4" />}
          >
            Filter By Species
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            size="md"
            leftIcon={<Plus className="size-4" />}
          >
            Add New Breed
          </PrimaryButton>
        </div>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Registered Breeds"
            value="320"
            trendText="+12 this quarter"
            trendType="positive"
            icon={<Award className="size-5 text-coral" />}
          />
          <StatsCard
            title="Most Adopted Breed"
            value="Golden Retriever"
            trendText="412 verified adoptions"
            trendType="positive"
            icon={<HeartHandshake className="size-5 text-coral" />}
          />
          <StatsCard
            title="Breed Guides Connected"
            value="286 Articles"
            trendText="89% catalog coverage"
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
            searchPlaceholder="Search breeds, temperament, or origin..."
            pagination
            pageSize={10}
            title="Pet Breeds Directory"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
