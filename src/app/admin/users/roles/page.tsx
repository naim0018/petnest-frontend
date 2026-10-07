"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import { Shield, Plus, KeyRound, CheckCircle2, Lock, Users } from "lucide-react";

interface RoleRecord {
  id: string;
  name: string;
  description: string;
  assignedUsers: number;
  permissionsCount: number;
  isSystemDefault: boolean;
  accessLevel: "Full Admin" | "Editorial" | "Moderator" | "Vendor Tier";
}

const mockRoles: RoleRecord[] = [
  {
    id: "ROLE-01",
    name: "Super Administrator",
    description: "Complete unrestricted access across user RBAC, finance, and system operations.",
    assignedUsers: 3,
    permissionsCount: 42,
    isSystemDefault: true,
    accessLevel: "Full Admin",
  },
  {
    id: "ROLE-02",
    name: "Pet Care Editorial Lead",
    description: "Publish, approve veterinary guides, assign authors, and edit pet catalog taxonomy.",
    assignedUsers: 6,
    permissionsCount: 24,
    isSystemDefault: true,
    accessLevel: "Editorial",
  },
  {
    id: "ROLE-03",
    name: "Marketplace Compliance Officer",
    description: "Audit vendor listings, inspect breeder verification documents, and resolve customer review disputes.",
    assignedUsers: 8,
    permissionsCount: 18,
    isSystemDefault: true,
    accessLevel: "Moderator",
  },
  {
    id: "ROLE-04",
    name: "Verified Breeder & Seller",
    description: "Create and manage certified pet listings, answer inquiries, and update kennel credentials.",
    assignedUsers: 84,
    permissionsCount: 9,
    isSystemDefault: false,
    accessLevel: "Vendor Tier",
  },
  {
    id: "ROLE-05",
    name: "Veterinary Content Author",
    description: "Author, draft, and submit evidence-based clinical articles to review queue.",
    assignedUsers: 32,
    permissionsCount: 6,
    isSystemDefault: false,
    accessLevel: "Editorial",
  },
];

export default function RolesAndPermissionsPage() {
  const [data] = useState<RoleRecord[]>(mockRoles);

  const columns: Column<RoleRecord>[] = [
    {
      key: "name",
      label: "Role Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-coral-light flex items-center justify-center text-coral shrink-0">
            <Shield className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-ink leading-tight">{row.name}</p>
              {row.isSystemDefault && (
                <span className="text-[10px] font-bold uppercase bg-surface-muted text-ink-muted px-1.5 py-0.5 rounded">
                  System
                </span>
              )}
            </div>
            <p className="text-xs text-ink-muted line-clamp-1">{row.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: "accessLevel",
      label: "Privilege Tier",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-xs px-2.5 py-1 rounded-md bg-surface-muted text-ink">
          {row.accessLevel}
        </span>
      ),
    },
    {
      key: "permissionsCount",
      label: "Capabilities",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-semibold text-coral">
          {row.permissionsCount} permissions
        </span>
      ),
    },
    {
      key: "assignedUsers",
      label: "Assigned Users",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs font-bold text-ink">
          {row.assignedUsers} accounts
        </span>
      ),
    },
    {
      key: "isSystemDefault",
      label: "Status",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5" /> Active
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Roles & Permissions</h2>
          <p className="text-sm text-ink-muted mt-1">
            Configure Role-Based Access Control (RBAC), security scopes, and staff delegation privileges.
          </p>
        </div>
        <PrimaryButton
          variant="primary"
          size="md"
          leftIcon={<Plus className="size-4" />}
        >
          Create Custom Role
        </PrimaryButton>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Configured Roles"
            value="5 Roles"
            trendText="3 system default roles"
            trendType="positive"
            icon={<KeyRound className="size-5 text-coral" />}
          />
          <StatsCard
            title="Total Role Assignments"
            value="133 Users"
            trendText="Enforced 2FA protection"
            trendType="positive"
            icon={<Users className="size-5 text-coral" />}
          />
          <StatsCard
            title="Security Audit"
            value="Passed"
            trendText="Zero unassigned admin accounts"
            trendType="positive"
            icon={<Lock className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={data}
            columns={columns}
            searchable
            searchPlaceholder="Search roles or access tiers..."
            pagination
            pageSize={10}
            title="Access Control Hierarchy"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
