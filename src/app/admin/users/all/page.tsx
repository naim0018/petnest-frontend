"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column, TableBadge } from "@/components/common/DynamicTable";
import Pagination from "@/components/common/Pagination";
import { StatsCard } from "@/components/common/StatsCard";
import Avatar from "@/components/common/Avatar";
import ConfirmModal from "@/components/reuseable/ConfirmModal";
import { usePersistedPageSize } from "@/hooks/usePersistedPageSize";
import {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useToggleBanUserMutation,
  useDeleteUserMutation,
  useGetMeQuery,
} from "@/store/Api/User/user.api";
import type { UserDetails } from "@/store/Api/User/user.types";
import {
  Users,
  ShieldCheck,
  Shield,
  UserX,
  UserCheck,
  Ban,
  Eye,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\//g, "-");
}

function formatRole(role?: string): string {
  switch (role) {
    case "SUPERADMIN":
      return "Super Admin";
    case "ADMIN":
      return "Admin";
    case "VET":
      return "Author / Vet";
    case "AUTHOR":
      return "Author";
    case "USER":
      return "Pet Parent";
    default:
      return role || "User";
  }
}

export default function AllUsersPage() {
  const router = useRouter();

  // Query parameters & pagination
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = usePersistedPageSize("admin-users-all", 10);
  const [sortValue, setSortValue] = useState("createdAt:desc");

  // Ban confirmation modal state
  const [targetUserForBan, setTargetUserForBan] = useState<UserDetails | null>(null);
  // Delete confirmation modal state
  const [targetUserForDelete, setTargetUserForDelete] = useState<UserDetails | null>(null);

  // Current logged in admin info
  const { data: meResponse } = useGetMeQuery();
  const currentUserId = meResponse?.data?.id;
  const currentUserRole = meResponse?.data?.role;

  // Real-time backend stats
  const { data: statsResponse, isLoading: isLoadingStats } = useGetUserStatsQuery();
  const stats = statsResponse?.data;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const [sortBy, sortOrder] = useMemo(() => {
    const [field, order] = sortValue.split(":");
    return [field || "createdAt", (order === "asc" ? "asc" : "desc") as "asc" | "desc"];
  }, [sortValue]);

  // Fetch paginated registered users
  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
  } = useGetUsersQuery({
    page,
    limit: pageSize === "all" ? 1000 : pageSize,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    sortBy,
    sortOrder,
  });

  const [toggleBan, { isLoading: isTogglingBan }] = useToggleBanUserMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  const users = usersResponse?.data?.items ?? [];
  const meta = usersResponse?.data?.meta;

  const handleOpenBanModal = (user: UserDetails) => {
    if (user.id === currentUserId) {
      toast.error("You cannot ban your own account");
      return;
    }
    if (user.role === "SUPERADMIN") {
      toast.error("SUPERADMIN accounts cannot be banned");
      return;
    }
    if (currentUserRole !== "SUPERADMIN" && user.role === "ADMIN") {
      toast.error("Only SUPERADMIN can ban an ADMIN account");
      return;
    }
    setTargetUserForBan(user);
  };

  const handleConfirmBanToggle = async () => {
    if (!targetUserForBan) return;
    const willBan = !targetUserForBan.isBanned;
    try {
      await toggleBan({
        id: targetUserForBan.id,
        isBanned: willBan,
        reason: willBan ? "Suspended by administrator from dashboard" : undefined,
      }).unwrap();

      toast.success(
        willBan
          ? `User "${targetUserForBan.name}" has been banned and sessions revoked.`
          : `Ban removed for "${targetUserForBan.name}". Access restored.`
      );
      setTargetUserForBan(null);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to update ban status");
    }
  };

  const handleOpenDeleteModal = (user: UserDetails) => {
    if (user.id === currentUserId) {
      toast.error("You cannot delete your own account");
      return;
    }
    if (user.role === "SUPERADMIN") {
      toast.error("SUPERADMIN accounts cannot be deleted");
      return;
    }
    if (currentUserRole !== "SUPERADMIN" && user.role === "ADMIN") {
      toast.error("Only SUPERADMIN can delete an ADMIN account");
      return;
    }
    setTargetUserForDelete(user);
  };

  const handleConfirmDelete = async () => {
    if (!targetUserForDelete) return;
    try {
      await deleteUser(targetUserForDelete.id).unwrap();
      toast.success(`User "${targetUserForDelete.name}" deleted successfully.`);
      setTargetUserForDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to delete user");
    }
  };

  const columns: Column<UserDetails>[] = [
    {
      key: "name",
      label: "User Profile",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.profile?.avatar || undefined}
            name={row.name}
            alt={row.name}
            size="md"
            ring="solid"
            badge={row.role === "ADMIN" || row.role === "SUPERADMIN" ? "online" : undefined}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <Link
                href={`/admin/users/${row.id}`}
                className="font-bold text-ink hover:text-coral transition-colors leading-tight line-clamp-1"
              >
                {row.name}
              </Link>
              {(row.role === "ADMIN" || row.role === "SUPERADMIN") && (
                <ShieldCheck className="size-3.5 text-coral shrink-0" />
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
          {formatRole(row.role)}
        </span>
      ),
    },
    {
      key: "isVerified",
      label: "Verification Status",
      sortable: false,
      align: "center",
      render: (row) => {
        const isVerified =
          row.role !== "USER" || Boolean(row.profile?.city && row.profile?.country);
        return (
          <TableBadge
            variant={isVerified ? "success" : "neutral"}
            width="w-28"
          >
            {isVerified ? "Verified" : "Unverified"}
          </TableBadge>
        );
      },
    },
    {
      key: "isBanned",
      label: "Account Status",
      sortable: true,
      align: "center",
      render: (row) => (
        <TableBadge
          variant={row.isBanned ? "danger" : "success"}
          dot
          width="w-28"
        >
          {row.isBanned ? "Banned" : "Active"}
        </TableBadge>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="text-xs text-ink-muted">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Real Platform User Stats Cards */}
      <AnimatedContainer delay={0.05}>
        {isLoadingStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-lg bg-card border border-border-peach p-5 animate-pulse space-y-3"
              >
                <div className="h-3.5 w-28 bg-surface-muted rounded" />
                <div className="h-7 w-36 bg-surface-muted rounded" />
                <div className="h-3 w-44 bg-surface-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Platform Users"
              value={(stats?.totalUsers ?? 0).toLocaleString()}
              trendText={`+${(stats?.newThisMonth ?? 0).toLocaleString()} registered this month`}
              trendType="positive"
              icon={<Users className="size-5 text-coral" />}
            />
            <StatsCard
              title="Verified Sellers & Vets"
              value={`${(stats?.verifiedSellersVets ?? 0).toLocaleString()} Accounts`}
              trendText="Identity & credential checked"
              trendType="positive"
              icon={<ShieldCheck className="size-5 text-coral" />}
            />
            <StatsCard
              title="Active Administrations"
              value={`${(stats?.activeStaff ?? 0).toLocaleString()} Staff`}
              trendText="Assigned RBAC privileges"
              trendType="positive"
              icon={<Shield className="size-5 text-coral" />}
            />
            <StatsCard
              title="Suspended / Banned Accounts"
              value={`${(stats?.bannedUsers ?? 0).toLocaleString()} Users`}
              trendText={
                (stats?.bannedUsers ?? 0) > 0
                  ? "Access restricted & sessions revoked"
                  : "No active suspensions"
              }
              trendType={(stats?.bannedUsers ?? 0) > 0 ? "negative" : "neutral"}
              icon={<UserX className="size-5 text-coral" />}
            />
          </div>
        )}
      </AnimatedContainer>

      {/* Registered Users Table */}
      <AnimatedContainer delay={0.1}>
        <DynamicTable
          data={users}
          columns={columns}
          loading={isLoadingUsers || isFetchingUsers}
          showRowNumber
          rowNumberHeader="No."
          getRowNumber={(_row, idx) =>
            (page - 1) * (typeof pageSize === "number" ? pageSize : 0) + idx + 1
          }
          rowNumberOffset={(page - 1) * (pageSize === "all" ? 0 : pageSize)}
          searchable
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Search users by name, email, or role..."
          manualFiltering
          manualSorting
          storageKey="admin-users-all"
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          title="All Registered PetNest Accounts"
          hoverable
          actions={[
            {
              label: "View User Details",
              icon: <Eye className="size-3.5" />,
              variant: "info",
              onClick: (row) => router.push(`/admin/users/${row.id}`),
            },
            {
              label: "Ban / Unban User",
              icon: <Ban className="size-3.5" />,
              variant: "warning",
              onClick: (row) => handleOpenBanModal(row),
            },
            {
              label: "Delete User",
              icon: <Trash2 className="size-3.5" />,
              variant: "danger",
              onClick: (row) => handleOpenDeleteModal(row),
            },
          ]}
          footer={
            meta && meta.total > 0 ? (
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                itemsPerPage={pageSize === "all" ? meta.total : meta.limit}
                totalItems={meta.total}
                onPageChange={(nextPage) => setPage(nextPage)}
                pageSize={pageSize}
                pageSizeOptions={[10, 20, 30, 40, 50, 100, "all"]}
                storageKey="admin-users-all"
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPage(1);
                }}
                label="users"
              />
            ) : undefined
          }
        />
      </AnimatedContainer>

      {/* Ban / Unban Confirmation Modal */}
      {targetUserForBan && (
        <ConfirmModal
          isOpen={Boolean(targetUserForBan)}
          onClose={() => setTargetUserForBan(null)}
          onConfirm={handleConfirmBanToggle}
          variant={targetUserForBan.isBanned ? "success" : "danger"}
          icon={targetUserForBan.isBanned ? <UserCheck className="size-6 text-success" /> : <Ban className="size-6 text-danger" />}
          title={
            targetUserForBan.isBanned
              ? `Unban "${targetUserForBan.name}"?`
              : `Ban "${targetUserForBan.name}"?`
          }
          description={
            targetUserForBan.isBanned
              ? `Are you sure you want to restore access for ${targetUserForBan.email}? They will be able to log in to PetNest again.`
              : `Are you sure you want to ban ${targetUserForBan.email}? Their active login sessions will be terminated immediately and they will be blocked from accessing the platform.`
          }
          confirmText={targetUserForBan.isBanned ? "Yes, Unban Account" : "Yes, Ban Account"}
          cancelText="Cancel"
          loading={isTogglingBan}
        />
      )}

      {/* Delete Confirmation Modal */}
      {targetUserForDelete && (
        <ConfirmModal
          isOpen={Boolean(targetUserForDelete)}
          onClose={() => !isDeletingUser && setTargetUserForDelete(null)}
          onConfirm={handleConfirmDelete}
          variant="danger"
          icon={<Trash2 className="size-6 text-danger" />}
          title={`Delete "${targetUserForDelete.name}"?`}
          description={`Are you sure you want to permanently delete ${targetUserForDelete.email}? This action cannot be undone.`}
          confirmText="Yes, Delete User"
          cancelText="Cancel"
          loading={isDeletingUser}
        />
      )}
    </div>
  );
}
