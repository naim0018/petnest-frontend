"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { StatsCard } from "@/components/common/StatsCard";
import Avatar from "@/components/common/Avatar";
import { Users, UserPlus, ShieldCheck, Mail, Filter, Shield } from "lucide-react";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Breeder" | "Author / Vet" | "Store Owner" | "Pet Parent";
  avatarUrl: string;
  isVerified: boolean;
  status: "Active" | "Pending" | "Suspended";
  joinedDate: string;
}

const mockUsers: UserRecord[] = [
  {
    id: "USR-001",
    name: "Alex Morgan",
    email: "alex.morgan@petnest.com",
    role: "Admin",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    isVerified: true,
    status: "Active",
    joinedDate: "2026-01-10",
  },
  {
    id: "USR-002",
    name: "Dr. Sarah Jenkins",
    email: "s.jenkins@vetclinic.org",
    role: "Author / Vet",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&h=100&q=80",
    isVerified: true,
    status: "Active",
    joinedDate: "2026-02-14",
  },
  {
    id: "USR-003",
    name: "Robert Willow",
    email: "contact@willowcreekkennels.com",
    role: "Breeder",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    isVerified: true,
    status: "Active",
    joinedDate: "2026-03-01",
  },
  {
    id: "USR-004",
    name: "Sophia Martinez",
    email: "sophia.m@gmail.com",
    role: "Pet Parent",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    isVerified: false,
    status: "Active",
    joinedDate: "2026-08-19",
  },
  {
    id: "USR-005",
    name: "Lucas Vance",
    email: "lvance@techpaws.io",
    role: "Store Owner",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    isVerified: true,
    status: "Active",
    joinedDate: "2026-05-11",
  },
  {
    id: "USR-006",
    name: "Hannah Lee",
    email: "hannah.lee.rescue@shelter.org",
    role: "Breeder",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
    isVerified: false,
    status: "Pending",
    joinedDate: "2026-10-03",
  },
];

export default function AllUsersPage() {
  const [data] = useState<UserRecord[]>(mockUsers);

  const columns: Column<UserRecord>[] = [
    {
      key: "name",
      label: "User Profile",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.avatarUrl}
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
                <ShieldCheck className="size-3.5 text-coral" />
              )}
            </div>
            <p className="text-xs text-ink-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "System Role",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-xs px-2.5 py-1 rounded-md bg-surface-muted text-ink">
          {row.role}
        </span>
      ),
    },
    {
      key: "isVerified",
      label: "Verification Status",
      sortable: true,
      align: "center",
      render: (row) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.isVerified
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-surface-muted text-ink-muted"
          }`}
        >
          {row.isVerified ? "Verified" : "Unverified"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Account Status",
      sortable: true,
      align: "center",
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
    {
      key: "joinedDate",
      label: "Joined",
      sortable: true,
      align: "right",
      render: (row) => <span className="text-xs text-ink-muted">{row.joinedDate}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">User Management</h2>
          <p className="text-sm text-ink-muted mt-1">
            Directory of registered pet parents, certified breeders, veterinary authors, and administrators.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryButton
            variant="outline"
            size="md"
            leftIcon={<Filter className="size-4" />}
          >
            Filter by Role
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            size="md"
            leftIcon={<UserPlus className="size-4" />}
          >
            Invite User
          </PrimaryButton>
        </div>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Platform Users"
            value="18,450"
            trendText="+1,210 registered this month"
            trendType="positive"
            icon={<Users className="size-5 text-coral" />}
          />
          <StatsCard
            title="Verified Sellers & Vets"
            value="248 Accounts"
            trendText="Identity & credential checked"
            trendType="positive"
            icon={<ShieldCheck className="size-5 text-coral" />}
          />
          <StatsCard
            title="Active Administrations"
            value="12 Staff"
            trendText="Assigned RBAC privileges"
            trendType="positive"
            icon={<Shield className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={data}
            columns={columns}
            searchable
            searchPlaceholder="Search users by name, email, or role..."
            pagination
            pageSize={10}
            title="All Registered PetNest Accounts"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
