"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import Avatar from "@/components/common/Avatar";
import PrimaryButton from "@/components/common/PrimaryButton";
import ConfirmModal from "@/components/reuseable/ConfirmModal";
import { TableBadge } from "@/components/common/DynamicTable";
import { cn } from "@/lib/utils";
import {
  useGetUserByIdQuery,
  useToggleBanUserMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useGetMeQuery,
} from "@/store/Api/User/user.api";
import type { UserRole } from "@/store/Api/Auth/auth.types";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Shield,
  UserX,
  UserCheck,
  Ban,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Briefcase,
  Stethoscope,
  BookOpen,
  User,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

interface RoleOption {
  role: UserRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AVAILABLE_ROLES: RoleOption[] = [
  {
    role: "SUPERADMIN",
    label: "Super Administrator",
    description:
      "Unrestricted platform ownership, full RBAC permissions, financial operations, and root database control.",
    icon: ShieldCheck,
  },
  {
    role: "ADMIN",
    label: "Administrator",
    description:
      "Comprehensive management privileges including user moderation, operational review, and catalog settings.",
    icon: Shield,
  },
  {
    role: "VET",
    label: "Veterinary Professional",
    description:
      "Licensed veterinary practitioner authorized to draft, clinically certify, and publish medical pet care guides.",
    icon: Stethoscope,
  },
  {
    role: "AUTHOR",
    label: "Editorial Author",
    description:
      "Verified editorial writer authorized to publish, draft, and maintain pet care and training guides.",
    icon: BookOpen,
  },
  {
    role: "USER",
    label: "Pet Parent (Standard User)",
    description:
      "Standard registered account with access to community forums, guide discussions, and adoption inquiries.",
    icon: User,
  },
];

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const [copiedId, setCopiedId] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  // Current logged in administrator
  const { data: meResponse } = useGetMeQuery();
  const currentUserId = meResponse?.data?.id;
  const currentUserRole = meResponse?.data?.role;

  // Target user details
  const {
    data: userResponse,
    isLoading,
    isError,
    error,
  } = useGetUserByIdQuery(id, {
    skip: !id,
  });
  const user = userResponse?.data;

  const [toggleBan, { isLoading: isTogglingBan }] = useToggleBanUserMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
      toast.success("User ID copied to clipboard");
    }
  };

  const handleOpenBanModal = () => {
    if (!user) return;
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
    setIsBanModalOpen(true);
  };

  const handleConfirmBanToggle = async () => {
    if (!user) return;
    const willBan = !user.isBanned;
    try {
      await toggleBan({
        id: user.id,
        isBanned: willBan,
        reason: willBan
          ? "Suspended by administrator from user details page"
          : undefined,
      }).unwrap();

      toast.success(
        willBan
          ? `User "${user.name}" has been banned and sessions revoked.`
          : `Ban removed for "${user.name}". Access restored.`
      );
      setIsBanModalOpen(false);
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to update ban status"
      );
    }
  };

  const handleOpenDeleteModal = () => {
    if (!user) return;
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
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!user) return;
    try {
      await deleteUser(user.id).unwrap();
      toast.success(`User "${user.name}" has been permanently deleted.`);
      setIsDeleteModalOpen(false);
      router.push("/admin/users/all");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to delete user");
    }
  };

  const handleRoleToggle = (targetRole: UserRole) => {
    if (!user || isUpdatingRole) return;
    if (user.role === targetRole) return; // Already assigned

    if (user.id === currentUserId) {
      toast.error("You cannot modify your own administrative role");
      return;
    }
    if (currentUserRole !== "SUPERADMIN" && (targetRole === "SUPERADMIN" || user.role === "SUPERADMIN")) {
      toast.error("Only a Super Administrator can assign or transfer the SUPERADMIN role");
      return;
    }

    setPendingRole(targetRole);
  };

  const handleConfirmRoleChange = async () => {
    if (!user || !pendingRole) return;
    try {
      await updateUserRole({
        id: user.id,
        role: pendingRole,
      }).unwrap();

      toast.success(
        `Role for "${user.name}" updated to ${formatRole(pendingRole)}.`
      );
      setPendingRole(null);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to update role");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        <div className="lg:col-span-5 xl:col-span-4 h-96 rounded-xl bg-card border border-border-peach p-5 sm:p-6 animate-pulse space-y-4">
          <div className="size-20 rounded-full bg-surface-muted mx-auto" />
          <div className="h-5 w-36 bg-surface-muted rounded mx-auto" />
          <div className="h-4 w-44 bg-surface-muted rounded mx-auto" />
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full bg-surface-muted rounded" />
            <div className="h-4 w-full bg-surface-muted rounded" />
          </div>
        </div>
        <div className="lg:col-span-7 xl:col-span-8 space-y-5 sm:space-y-6">
          <div className="h-20 rounded-xl bg-card border border-border-peach p-5 animate-pulse" />
          <div className="h-80 rounded-xl bg-card border border-border-peach p-6 animate-pulse space-y-3" />
        </div>
      </div>
    );
  }

  if (isError || !user) {
    const errorMsg =
      (error as any)?.data?.message || (error as any)?.message || "User not found";
    return (
      <div className="w-full py-16 text-center space-y-4">
        <div className="size-16 rounded-full bg-tint-rose text-danger flex items-center justify-center mx-auto">
          <UserX className="size-8" />
        </div>
        <h2 className="text-xl font-bold font-quicksand text-ink">
          User Profile Not Found
        </h2>
        <p className="text-xs text-ink-muted max-w-md mx-auto">{errorMsg}</p>
        <Link href="/admin/users/all">
          <PrimaryButton
            variant="outline"
            size="md"
            leftIcon={<ArrowLeft className="size-4" />}
          >
            Back to User Directory
          </PrimaryButton>
        </Link>
      </div>
    );
  }

  const isVerified =
    user.role !== "USER" || Boolean(user.profile?.city && user.profile?.country);

  return (
    <div className="w-full">
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start w-full">
        {/* Left Column: User Information & Account Actions */}
        <AnimatedContainer
          delay={0.05}
          className="lg:col-span-5 xl:col-span-4 w-full"
        >
          <div className="bg-card border border-border-peach rounded-xl p-5 sm:p-6 shadow-xs space-y-5 w-full">
            {/* Back link */}
            <div>
              <Link
                href="/admin/users/all"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-coral transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Directory</span>
              </Link>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-border">
              <Avatar
                src={user.profile?.avatar || undefined}
                name={user.name}
                size="2xl"
                ring="solid"
                badge={
                  user.role === "ADMIN" || user.role === "SUPERADMIN"
                    ? "online"
                    : undefined
                }
              />
              <div className="mt-3">
                <h2 className="text-lg font-bold font-quicksand text-ink flex items-center justify-center gap-1.5">
                  <span>{user.name}</span>
                  {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
                    <ShieldCheck className="size-4 text-coral shrink-0" />
                  )}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                  <TableBadge
                    variant={user.isBanned ? "danger" : "success"}
                    dot
                    width="w-22"
                  >
                    {user.isBanned ? "Banned" : "Active"}
                  </TableBadge>
                  <TableBadge
                    variant={isVerified ? "success" : "neutral"}
                    width="w-24"
                  >
                    {isVerified ? "Verified" : "Unverified"}
                  </TableBadge>
                </div>
              </div>

              {/* Identifier */}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted bg-surface-muted px-2.5 py-1 rounded-md border border-border font-mono">
                <span>
                  ID: {user.id.slice(0, 8)}...{user.id.slice(-4)}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="hover:text-coral transition-colors cursor-pointer"
                  title="Copy UUID"
                >
                  {copiedId ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Contact & Location Details */}
            <div className="space-y-3 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Contact & Location
              </span>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-ink">
                  <Mail className="size-3.5 text-ink-muted shrink-0" />
                  <a
                    href={`mailto:${user.email}`}
                    className="truncate hover:text-coral transition-colors font-medium"
                  >
                    {user.email}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-ink">
                  <Phone className="size-3.5 text-ink-muted shrink-0" />
                  <span className="font-medium">
                    {user.phone || "No phone number registered"}
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-ink">
                  <MapPin className="size-3.5 text-ink-muted shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">
                    {user.profile?.city || user.profile?.country
                      ? `${user.profile?.city || "—"}, ${
                          user.profile?.country || "—"
                        }`
                      : "Location not provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Biography & Notes */}
            <div className="space-y-2 pt-4 border-t border-border text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Biography & Notes
              </span>
              <p className="text-ink-muted leading-relaxed">
                {user.profile?.bio || "No biography provided by user."}
              </p>
              {user.profile?.specialization && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink pt-1">
                  <Briefcase className="size-3.5 text-coral shrink-0" />
                  <span>Specialization: {user.profile.specialization}</span>
                </div>
              )}
            </div>

            {/* Pet Interests */}
            <div className="space-y-2 pt-4 border-t border-border text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Pet Interests & Preferences
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-surface-muted/60 border border-border">
                  <span className="text-[10px] text-ink-muted uppercase block font-semibold">
                    Species
                  </span>
                  <span className="font-bold text-xs text-ink truncate block mt-0.5">
                    {user.interestedSpecies?.name || "None Selected"}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-muted/60 border border-border">
                  <span className="text-[10px] text-ink-muted uppercase block font-semibold">
                    Breed
                  </span>
                  <span className="font-bold text-xs text-ink truncate block mt-0.5">
                    {user.interestedBreed?.name || "None Selected"}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Actions Section (Relocated to Left Column) */}
            <div className="pt-4 border-t border-border space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block">
                Account Actions
              </span>
              <PrimaryButton
                variant={user.isBanned ? "success" : "coralLight"}
                size="md"
                leftIcon={
                  user.isBanned ? (
                    <UserCheck className="size-4" />
                  ) : (
                    <Ban className="size-4" />
                  )
                }
                onClick={handleOpenBanModal}
                className="w-full justify-center"
              >
                {user.isBanned ? "Unban Account" : "Ban Account"}
              </PrimaryButton>
              <PrimaryButton
                variant="danger"
                size="md"
                leftIcon={<Trash2 className="size-4" />}
                onClick={handleOpenDeleteModal}
                className="w-full justify-center"
              >
                Delete User
              </PrimaryButton>
            </div>
          </div>
        </AnimatedContainer>

        {/* Right Column: Roles Management & System Metadata */}
        <AnimatedContainer
          delay={0.1}
          className="lg:col-span-7 xl:col-span-8 space-y-5 sm:space-y-6 w-full"
        >
          {/* Account Standing Banner */}
          {user.isBanned ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 text-danger">
              <div className="size-9 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="size-4.5 text-red-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-red-700">
                  Account Suspended / Banned
                </h3>
                <p className="text-xs text-red-600/90 leading-relaxed">
                  This user account was suspended on {formatDate(user.bannedAt)}.
                  Active login sessions have been revoked and platform access is
                  blocked.
                </p>
                {user.bannedReason && (
                  <p className="text-xs font-semibold text-red-700 mt-2 bg-red-500/15 px-2.5 py-1 rounded-md inline-block">
                    Reason: {user.bannedReason}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
              <Check className="size-4.5 text-emerald-600 shrink-0" />
              <p className="text-xs font-semibold">
                Account is in good standing. No active bans, penalties, or
                restrictions applied.
              </p>
            </div>
          )}

          {/* Roles & Permissions Card (Image 2 Design Style) */}
          <div className="bg-card border border-border-peach rounded-xl p-5 sm:p-6 shadow-xs space-y-5 w-full">
            <div className="border-b border-border pb-4">
              <h3 className="text-base sm:text-lg font-bold font-quicksand text-ink">
                Roles & Permissions
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
                Choose the account role and operational privileges. You can update
                these permissions at any time.
              </p>
            </div>

            {/* List of Roles */}
            <div className="space-y-3 w-full">
              {AVAILABLE_ROLES.map((r) => {
                const isActive = user.role === r.role;
                const IconComponent = r.icon;

                return (
                  <div
                    key={r.role}
                    onClick={() => handleRoleToggle(r.role)}
                    className={cn(
                      "flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer group w-full",
                      isActive
                        ? "bg-coral/5 border-coral/30 shadow-2xs"
                        : "bg-surface-muted/30 border-border hover:border-coral/30 hover:bg-surface-muted/60"
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-4">
                      {/* Icon container */}
                      <div
                        className={cn(
                          "size-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                          isActive
                            ? "bg-coral text-white border-coral"
                            : "bg-surface-muted text-ink-muted border-border group-hover:text-coral group-hover:border-coral/30"
                        )}
                      >
                        <IconComponent className="size-5" />
                      </div>

                      {/* Text info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-ink">
                            {r.label}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-coral/10 text-coral font-mono">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                          {r.description}
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="shrink-0 flex items-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isActive}
                        disabled={isUpdatingRole || isActive}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                          isActive
                            ? "bg-coral"
                            : "bg-zinc-200 dark:bg-zinc-700"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                            isActive ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security & Identity Metadata Card */}
          <div className="bg-card border border-border-peach rounded-xl p-5 sm:p-6 shadow-xs space-y-4 w-full">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <Shield className="size-4 text-coral" />
              <span>Security & Identity Metadata</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 w-full">
              <div className="p-3.5 rounded-lg bg-surface-muted/60 border border-border space-y-1">
                <span className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">
                  User UUID
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-ink truncate">
                    {user.id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1 rounded text-ink-muted hover:text-coral transition-colors cursor-pointer shrink-0"
                    title="Copy UUID"
                  >
                    {copiedId ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-muted/60 border border-border space-y-1">
                <span className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">
                  Active System Role
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink">
                    {formatRole(user.role)}
                  </span>
                  <span className="text-[10px] text-ink-muted font-mono">
                    ({user.role})
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-muted/60 border border-border space-y-1">
                <span className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">
                  Registration Date
                </span>
                <div className="flex items-center gap-1.5 text-xs text-ink font-semibold">
                  <Calendar className="size-3.5 text-ink-muted" />
                  <span>{formatDate(user.createdAt)}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-muted/60 border border-border space-y-1">
                <span className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">
                  Last Updated
                </span>
                <div className="flex items-center gap-1.5 text-xs text-ink font-semibold">
                  <Clock className="size-3.5 text-ink-muted" />
                  <span>{formatDate(user.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Role Change Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(pendingRole)}
        onClose={() => !isUpdatingRole && setPendingRole(null)}
        onConfirm={handleConfirmRoleChange}
        variant="warning"
        icon={<Sparkles className="size-6 text-amber-500" />}
        title={`Change Role to "${formatRole(pendingRole || undefined)}"?`}
        description={`Are you sure you want to change ${user.name}'s system role to ${formatRole(
          pendingRole || undefined
        )}? Their administrative permissions and access scopes will be updated immediately.`}
        confirmText="Yes, Update Role"
        cancelText="Cancel"
        loading={isUpdatingRole}
      />

      {/* Ban / Unban Confirmation Modal */}
      <ConfirmModal
        isOpen={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        onConfirm={handleConfirmBanToggle}
        variant={user.isBanned ? "success" : "danger"}
        icon={
          user.isBanned ? (
            <UserCheck className="size-6 text-success" />
          ) : (
            <Ban className="size-6 text-danger" />
          )
        }
        title={user.isBanned ? `Unban "${user.name}"?` : `Ban "${user.name}"?`}
        description={
          user.isBanned
            ? `Are you sure you want to restore access for ${user.email}? They will be able to log in to PetNest again.`
            : `Are you sure you want to ban ${user.email}? Their active login sessions will be terminated immediately and they will be blocked from accessing the platform.`
        }
        confirmText={user.isBanned ? "Yes, Unban Account" : "Yes, Ban Account"}
        cancelText="Cancel"
        loading={isTogglingBan}
      />

      {/* Delete User Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeletingUser && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        variant="danger"
        icon={<Trash2 className="size-6 text-danger" />}
        title={`Delete "${user.name}"?`}
        description={`Are you sure you want to permanently delete ${user.email}? All associated account records will be removed. This action cannot be undone.`}
        confirmText="Yes, Delete User"
        cancelText="Cancel"
        loading={isDeletingUser}
      />
    </div>
  );
}
