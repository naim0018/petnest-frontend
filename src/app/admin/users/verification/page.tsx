"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import { StatsCard } from "@/components/common/StatsCard";
import Avatar from "@/components/common/Avatar";
import { ShieldCheck, Check, X, Clock, FileBadge, Building2, AlertCircle } from "lucide-react";

interface VerificationRequestRecord {
  id: string;
  applicantName: string;
  applicantType: "Breeder" | "Veterinarian" | "Pet Shelter / Rescue" | "Pet Store";
  businessName: string;
  licenseNumber: string;
  avatarUrl: string;
  documentType: string;
  submittedAt: string;
}

const mockVerifications: VerificationRequestRecord[] = [
  {
    id: "VR-501",
    applicantName: "Hannah Lee",
    applicantType: "Pet Shelter / Rescue",
    businessName: "Haven Paws Rescue Non-Profit",
    licenseNumber: "501c3-NP-99412",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
    documentType: "Non-profit Charter & Facility Inspection",
    submittedAt: "3 hours ago",
  },
  {
    id: "VR-502",
    applicantName: "Julian Vance",
    applicantType: "Veterinarian",
    businessName: "Metropolitan Animal Hospital",
    licenseNumber: "DVM-NY-77219",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&h=100&q=80",
    documentType: "State Board Medical License Copy",
    submittedAt: "5 hours ago",
  },
  {
    id: "VR-503",
    applicantName: "Arthur Pendelton",
    applicantType: "Breeder",
    businessName: "Pendelton Labrador Retrievers",
    licenseNumber: "AKC-BR-44012",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    documentType: "Kennel Inspection Certificate & OFA Clearances",
    submittedAt: "1 day ago",
  },
  {
    id: "VR-504",
    applicantName: "Samantha Cruz",
    applicantType: "Pet Store",
    businessName: "Bark & Purr Organic Pantry",
    licenseNumber: "BUS-CA-88912",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80",
    documentType: "City Commercial Retail Permit",
    submittedAt: "2 days ago",
  },
];

export default function VerificationRequestsPage() {
  const [data, setData] = useState<VerificationRequestRecord[]>(mockVerifications);
  const [notification, setNotification] = useState<string | null>(null);

  const handleApprove = (row: VerificationRequestRecord) => {
    setData((prev) => prev.filter((item) => item.id !== row.id));
    setNotification(`Applicant "${row.applicantName}" (${row.businessName}) approved with verified badge!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReject = (row: VerificationRequestRecord) => {
    setData((prev) => prev.filter((item) => item.id !== row.id));
    setNotification(`Verification request for "${row.applicantName}" rejected.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const columns: Column<VerificationRequestRecord>[] = [
    {
      key: "applicantName",
      label: "Applicant",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.avatarUrl}
            name={row.applicantName}
            alt={row.applicantName}
            size="md"
            ring="solid"
          />
          <div>
            <p className="font-bold text-ink leading-tight">{row.applicantName}</p>
            <p className="text-xs text-ink-muted">{row.businessName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "applicantType",
      label: "Profile Type",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-xs px-2.5 py-1 rounded-md bg-surface-muted text-ink">
          {row.applicantType}
        </span>
      ),
    },
    {
      key: "licenseNumber",
      label: "Registration / License",
      render: (row) => (
        <div>
          <span className="text-xs font-mono font-bold text-coral">{row.licenseNumber}</span>
          <p className="text-[11px] text-ink-muted">{row.documentType}</p>
        </div>
      ),
    },
    {
      key: "submittedAt",
      label: "Submitted",
      sortable: true,
      align: "right",
      render: (row) => <span className="text-xs text-ink-muted">{row.submittedAt}</span>,
    },
  ];

  const actions = [
    {
      label: "Approve Verification",
      icon: <Check className="size-4" />,
      variant: "primary" as const,
      onClick: (row: VerificationRequestRecord) => handleApprove(row),
    },
    {
      label: "Decline / Request Documents",
      icon: <X className="size-4" />,
      variant: "danger" as const,
      onClick: (row: VerificationRequestRecord) => handleReject(row),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Verification Requests</h2>
          <p className="text-sm text-ink-muted mt-1">
            Audit licensing credentials, non-profit certifications, and official veterinary clearances.
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
            title="Awaiting Verification"
            value={`${data.length} Requests`}
            trendText="Review queue within 24h"
            trendType="positive"
            icon={<Clock className="size-5 text-coral" />}
          />
          <StatsCard
            title="Breeder & Kennel Audits"
            value="2 Submissions"
            trendText="OFA & genetic health test certificates"
            trendType="positive"
            icon={<FileBadge className="size-5 text-coral" />}
          />
          <StatsCard
            title="Shelters & Rescues"
            value="1 Application"
            trendText="Non-profit status verified"
            trendType="positive"
            icon={<Building2 className="size-5 text-coral" />}
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
            searchPlaceholder="Search verification requests by name or license..."
            emptyMessage="No pending verification requests at this time."
            title="Professional Credential Verification Queue"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
