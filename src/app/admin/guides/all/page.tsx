"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { BookOpen, Plus, Filter, Eye, ThumbsUp, BookmarkCheck } from "lucide-react";
import Link from "next/link";

interface GuideRecord {
  id: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  views: number;
  likes: number;
  status: "Published" | "In Review" | "Draft";
  updatedAt: string;
}

const mockGuides: GuideRecord[] = [
  {
    id: "GD-001",
    title: "Complete Puppy Vaccination & Preventive Wellness Checklist",
    category: "Dog Care",
    author: "Dr. Sarah Jenkins",
    readTime: "7 min read",
    views: 18450,
    likes: 842,
    status: "Published",
    updatedAt: "2026-10-02",
  },
  {
    id: "GD-002",
    title: "Raw vs Kibble Diet for Cats: Complete Clinical Breakdown",
    category: "Cat Nutrition",
    author: "Elena Rostova",
    readTime: "10 min read",
    views: 14210,
    likes: 620,
    status: "Published",
    updatedAt: "2026-09-29",
  },
  {
    id: "GD-003",
    title: "Safe Socialization Protocols for Shelter & Rescue Dogs",
    category: "Behavior & Training",
    author: "Amara Williams",
    readTime: "6 min read",
    views: 9340,
    likes: 512,
    status: "Published",
    updatedAt: "2026-09-27",
  },
  {
    id: "GD-004",
    title: "Optimal Water Parameters for Freshwater Planted Aquariums",
    category: "Aquatics",
    author: "Marcus Chen",
    readTime: "12 min read",
    views: 6890,
    likes: 384,
    status: "Published",
    updatedAt: "2026-09-20",
  },
  {
    id: "GD-005",
    title: "Signs of Respiratory Illness in Parrots and Small Birds",
    category: "Avian Health",
    author: "Dr. Sarah Jenkins",
    readTime: "5 min read",
    views: 4120,
    likes: 295,
    status: "Published",
    updatedAt: "2026-09-18",
  },
  {
    id: "GD-006",
    title: "Dental Hygiene Routine for Aging Dogs (7+ Years)",
    category: "Senior Pet Care",
    author: "Michael Vance",
    readTime: "8 min read",
    views: 2840,
    likes: 198,
    status: "In Review",
    updatedAt: "2026-10-04",
  },
];

export default function AllGuidesPage() {
  const [data] = useState<GuideRecord[]>(mockGuides);

  const columns: Column<GuideRecord>[] = [
    {
      key: "title",
      label: "Title & Topic",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-coral-light flex items-center justify-center text-coral shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight line-clamp-1">{row.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-coral font-medium">{row.category}</span>
              <span className="text-[11px] text-ink-muted">• {row.readTime}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      label: "Author",
      sortable: true,
      render: (row) => <span className="text-xs font-semibold text-ink">{row.author}</span>,
    },
    {
      key: "views",
      label: "Views",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="font-semibold text-xs text-ink">
          {row.views.toLocaleString()}
        </span>
      ),
    },
    {
      key: "likes",
      label: "Reactions",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-medium text-ink-muted">
          {row.likes.toLocaleString()}
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
            row.status === "Published"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Last Updated",
      sortable: true,
      align: "right",
      render: (row) => <span className="text-xs text-ink-muted">{row.updatedAt}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">All Care Guides</h2>
          <p className="text-sm text-ink-muted mt-1">
            Browse, search, edit, and organize all published and draft articles across PetNest.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryButton
            variant="outline"
            size="md"
            leftIcon={<Filter className="size-4" />}
          >
            Filter by Topic
          </PrimaryButton>
          <Link href="/admin/guides/create">
            <PrimaryButton
              variant="primary"
              size="md"
              leftIcon={<Plus className="size-4" />}
            >
              Write New Guide
            </PrimaryButton>
          </Link>
        </div>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Guides"
            value="412 Articles"
            trendText="Across 18 pet categories"
            trendType="positive"
            icon={<BookOpen className="size-5 text-coral" />}
          />
          <StatsCard
            title="Lifetime Reader Views"
            value="1.82M"
            trendText="+92.4k this month"
            trendType="positive"
            icon={<Eye className="size-5 text-coral" />}
          />
          <StatsCard
            title="Helpful Rating"
            value="98.2%"
            trendText="Based on 14.2k reader votes"
            trendType="positive"
            icon={<ThumbsUp className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={data}
            columns={columns}
            searchable
            searchPlaceholder="Search all guides, authors, or categories..."
            pagination
            pageSize={10}
            title="Master Guides Directory"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
