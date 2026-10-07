"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { Clock, Check, X, Eye, FileText, AlertTriangle, ShieldCheck } from "lucide-react";

interface ReviewQueueRecord {
  id: string;
  title: string;
  category: string;
  author: string;
  submittedAt: string;
  medicalCheckRequired: boolean;
  priority: "High" | "Normal";
}

const mockQueue: ReviewQueueRecord[] = [
  {
    id: "REV-201",
    title: "Safe NSAID & Pain Relief Protocols for Dogs with Hip Dysplasia",
    category: "Clinical Health",
    author: "Dr. Gregory House (Vet Trainee)",
    submittedAt: "2 hours ago",
    medicalCheckRequired: true,
    priority: "High",
  },
  {
    id: "REV-202",
    title: "Understanding Separation Anxiety in Rescued Dogs",
    category: "Behavior & Training",
    author: "Amara Williams",
    submittedAt: "5 hours ago",
    medicalCheckRequired: false,
    priority: "Normal",
  },
  {
    id: "REV-203",
    title: "Switching Ferrets to Raw Diets: Nutrient Deficiency Risks",
    category: "Small Pet Nutrition",
    author: "Liam O'Connor",
    submittedAt: "1 day ago",
    medicalCheckRequired: true,
    priority: "High",
  },
  {
    id: "REV-204",
    title: "Enrichment DIY Mazes for Hamsters & Gerbils",
    category: "Small Pets",
    author: "Chloe Martinez",
    submittedAt: "2 days ago",
    medicalCheckRequired: false,
    priority: "Normal",
  },
];

export default function ReviewQueuePage() {
  const [data, setData] = useState<ReviewQueueRecord[]>(mockQueue);
  const [notification, setNotification] = useState<string | null>(null);

  const handleApprove = (row: ReviewQueueRecord) => {
    setData((prev) => prev.filter((item) => item.id !== row.id));
    setNotification(`"${row.title}" approved and published to the public library.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReject = (row: ReviewQueueRecord) => {
    setData((prev) => prev.filter((item) => item.id !== row.id));
    setNotification(`"${row.title}" returned to author with revision notes.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const columns: Column<ReviewQueueRecord>[] = [
    {
      key: "title",
      label: "Guide Submission",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-coral-light flex items-center justify-center text-coral shrink-0">
            <FileText className="size-5" />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight line-clamp-1">{row.title}</p>
            <span className="text-xs text-ink-muted">{row.category}</span>
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
      key: "medicalCheckRequired",
      label: "Veterinary Clearance",
      align: "center",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            row.medicalCheckRequired
              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
              : "bg-surface-muted text-ink-muted"
          }`}
        >
          {row.medicalCheckRequired ? (
            <>
              <AlertTriangle className="size-3" /> Vet Review Req.
            </>
          ) : (
            "Standard Review"
          )}
        </span>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      align: "center",
      render: (row) => (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
            row.priority === "High"
              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
              : "bg-surface-muted text-ink-muted"
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      key: "submittedAt",
      label: "Submission Time",
      align: "right",
      render: (row) => <span className="text-xs text-ink-muted">{row.submittedAt}</span>,
    },
  ];

  const actions = [
    {
      label: "Approve Guide",
      icon: <Check className="size-4" />,
      variant: "primary" as const,
      onClick: (row: ReviewQueueRecord) => handleApprove(row),
    },
    {
      label: "Request Changes",
      icon: <X className="size-4" />,
      variant: "danger" as const,
      onClick: (row: ReviewQueueRecord) => handleReject(row),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Guide Review Queue</h2>
          <p className="text-sm text-ink-muted mt-1">
            Vet medical review, editorial accuracy check, and publication approval for pending submissions.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between">
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-700 dark:text-emerald-400 hover:underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Pending Approval"
            value={`${data.length} Articles`}
            trendText="Target review SLA < 24h"
            trendType="positive"
            icon={<Clock className="size-5 text-coral" />}
          />
          <StatsCard
            title="Veterinary Clearance"
            value="2 Guides"
            trendText="Requires DVM verified badge"
            trendType="neutral"
            icon={<AlertTriangle className="size-5 text-coral" />}
          />
          <StatsCard
            title="SLA Compliance"
            value="96.4%"
            trendText="Reviewed within 18 hours"
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
            actions={actions}
            searchable
            searchPlaceholder="Search review queue..."
            emptyMessage="No pending guides in review queue! All caught up."
            title="Articles Awaiting Editorial Review"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
