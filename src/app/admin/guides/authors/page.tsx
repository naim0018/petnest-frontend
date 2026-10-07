"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import Avatar from "@/components/common/Avatar";
import { Users, Award, Plus, CheckCircle2, ShieldCheck, Mail } from "lucide-react";

interface AuthorRecord {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  specialization: string;
  guidesPublished: number;
  totalViews: string;
  isVerifiedVet: boolean;
  status: "Active" | "Inactive";
}

const mockAuthors: AuthorRecord[] = [
  {
    id: "AUTH-01",
    name: "Dr. Sarah Jenkins",
    role: "Doctor of Veterinary Medicine (DVM)",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
    specialization: "Canine Preventative Health & Vaccination",
    guidesPublished: 38,
    totalViews: "482.1k",
    isVerifiedVet: true,
    status: "Active",
  },
  {
    id: "AUTH-02",
    name: "Elena Rostova",
    role: "Certified Feline Nutritionist",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    specialization: "Cat Diets, Renal Health, Raw Feeding",
    guidesPublished: 26,
    totalViews: "310.8k",
    isVerifiedVet: false,
    status: "Active",
  },
  {
    id: "AUTH-03",
    name: "Amara Williams",
    role: "IAABC Certified Dog Behavior Consultant",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    specialization: "Separation Anxiety, Shelter Rehabilitation",
    guidesPublished: 22,
    totalViews: "245.0k",
    isVerifiedVet: false,
    status: "Active",
  },
  {
    id: "AUTH-04",
    name: "Marcus Chen",
    role: "Aquatic Biologist",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    specialization: "Freshwater Planted Aquaria & Cichlids",
    guidesPublished: 19,
    totalViews: "189.4k",
    isVerifiedVet: false,
    status: "Active",
  },
  {
    id: "AUTH-05",
    name: "Dr. Marcus Vance",
    role: "Veterinary Dental Specialist",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80",
    specialization: "Periodontal Disease & Senior Canine Dental",
    guidesPublished: 14,
    totalViews: "128.6k",
    isVerifiedVet: true,
    status: "Active",
  },
];

export default function AuthorsPage() {
  const [data] = useState<AuthorRecord[]>(mockAuthors);

  const columns: Column<AuthorRecord>[] = [
    {
      key: "name",
      label: "Author Profile",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.avatarUrl}
            name={row.name}
            alt={row.name}
            size="md"
            ring="solid"
            badge={row.isVerifiedVet ? "online" : undefined}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-ink leading-tight">{row.name}</p>
              {row.isVerifiedVet && (
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <p className="text-xs text-ink-muted">{row.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: "specialization",
      label: "Focus Specialty",
      render: (row) => (
        <span className="text-xs text-ink-muted line-clamp-1">{row.specialization}</span>
      ),
    },
    {
      key: "guidesPublished",
      label: "Guides Published",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="font-semibold text-xs px-2.5 py-1 rounded-md bg-surface-muted text-ink">
          {row.guidesPublished} guides
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
          <h2 className="text-2xl font-bold font-quicksand text-ink">Authors & Contributors</h2>
          <p className="text-sm text-ink-muted mt-1">
            Manage verified veterinarians, animal behaviorists, and pet care editorial staff.
          </p>
        </div>
        <PrimaryButton
          variant="primary"
          size="md"
          leftIcon={<Plus className="size-4" />}
        >
          Invite Author
        </PrimaryButton>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Registered Authors"
            value="48 Contributors"
            trendText="+6 this month"
            trendType="positive"
            icon={<Users className="size-5 text-coral" />}
          />
          <StatsCard
            title="Verified Veterinarians (DVM)"
            value="14 Specialists"
            trendText="Clinical credentials checked"
            trendType="positive"
            icon={<ShieldCheck className="size-5 text-coral" />}
          />
          <StatsCard
            title="Top Contributor"
            value="Dr. Sarah Jenkins"
            trendText="38 articles • 482k reads"
            trendType="positive"
            icon={<Award className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={data}
            columns={columns}
            searchable
            searchPlaceholder="Search authors, credentials, or specialties..."
            pagination
            pageSize={10}
            title="Pet Care Editorial Board"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
