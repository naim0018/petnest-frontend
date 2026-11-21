"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronsUpDown,
  Power,
  LayoutDashboard,
  User,
  Settings,
  Activity,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { toast } from "sonner";
import { logOut } from "@/store/features/AuthSlice/authSlice";
import { useLogoutMutation } from "@/store/Api/Auth/auth.api";
import { useGetMeQuery } from "@/store/Api/User/user.api";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  className?: string;
  variant?: "header" | "sidebar";
  collapsed?: boolean;
}

export default function UserProfile({
  className,
  variant = "header",
  collapsed = false,
}: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAppSelector((state) => (state.auth as any)?.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on pathname change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isLoggedIn =
    mounted &&
    Boolean(
      user &&
        ((typeof user.email === "string" && user.email.trim().length > 0) ||
          (typeof user.userId === "string" && user.userId.trim().length > 0))
    );

  const { data: meResponse } = useGetMeQuery(undefined, {
    skip: !isLoggedIn,
  });

  const me = meResponse?.data;
  const demoImage =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80";

  const displayName =
    me?.name ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "Sarah M.");
  const displayEmail = me?.email || user?.email || "sarah@example.com";
  const displayImage = me?.profile?.avatar || user?.avatar || demoImage;

  const currentRole = (me?.role || user?.role || "USER").toUpperCase();
  const isAdminOrSuper = currentRole === "ADMIN" || currentRole === "SUPERADMIN";
  const isEditorial = currentRole === "AUTHOR" || currentRole === "VET";

  const roleDisplay =
    currentRole === "SUPERADMIN"
      ? "Super Admin"
      : currentRole === "ADMIN"
      ? "PetNest Admin"
      : currentRole === "VET"
      ? "Veterinarian"
      : currentRole === "AUTHOR"
      ? "Author"
      : "PetNest Member";

  const dashboardPath = isAdminOrSuper
    ? "/admin/dashboard"
    : isEditorial
    ? "/admin/guides"
    : "/user/dashboard";

  const dashboardLabel = isAdminOrSuper
    ? "Admin Dashboard"
    : isEditorial
    ? "Editorial Hub"
    : "Dashboard";

  const settingsPath = isAdminOrSuper ? "/admin/settings" : "/user/settings";
  const profilePath = isAdminOrSuper ? "/admin/profile" : "/user/profile";
  const activityLogPath = isAdminOrSuper ? "/admin/analytics" : "/user/dashboard";

  // Click outside and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("just_logged_out", "true");
      }
      await logoutMutation().unwrap();
    } catch {
      // Clear local auth even if network fails
    } finally {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("just_logged_out", "true");
        setTimeout(() => {
          sessionStorage.removeItem("just_logged_out");
        }, 3000);
      }
      dispatch(logOut());
      toast.success("Successfully logged out. See you soon!");
      setIsOpen(false);
      router.replace("/");
    }
  };

  // Reusable dropdown popup menu component
  const renderDropdownMenu = (alignment: "header" | "sidebar-expanded" | "sidebar-collapsed") => {
    return (
      <div
        className={cn(
          "bg-card rounded-md border border-border-peach shadow-xl z-50 overflow-hidden duration-150",
          alignment === "header" &&
            "absolute left-3 right-3 sm:left-auto sm:right-0 top-full mt-3 w-auto sm:w-72 animate-in fade-in zoom-in-95",
          alignment === "sidebar-expanded" &&
            "absolute bottom-full mb-2.5 left-0 w-full animate-in fade-in slide-in-from-bottom-2",
          alignment === "sidebar-collapsed" &&
            "absolute left-full bottom-0 ml-3 w-72 animate-in fade-in zoom-in-95"
        )}
      >
        {/* User Card Header */}
        <div className="p-3.5 bg-surface-muted/30 border-b border-border-peach">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-md overflow-hidden bg-surface-muted border border-border-peach shrink-0">
              <Image
                src={displayImage}
                alt={displayName}
                width={40}
                height={40}
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-ink truncate font-quicksand">
                {displayName}
              </span>
              <span className="text-xs text-ink-muted truncate">
                {displayEmail}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-2 space-y-0.5">
          <DropdownLink
            to={dashboardPath}
            icon={LayoutDashboard}
            label={dashboardLabel}
            onClick={() => setIsOpen(false)}
            iconColor="text-blue-500"
            bgColor="bg-blue-500/10 dark:bg-blue-500/20"
          />
          <DropdownLink
            to={profilePath}
            icon={User}
            label="My Profile"
            onClick={() => setIsOpen(false)}
            iconColor="text-purple-500"
            bgColor="bg-purple-500/10 dark:bg-purple-500/20"
          />
          <DropdownLink
            to={settingsPath}
            icon={Settings}
            label="Settings"
            onClick={() => setIsOpen(false)}
            iconColor="text-amber-500"
            bgColor="bg-amber-500/10 dark:bg-amber-500/20"
          />
          <DropdownLink
            to={activityLogPath}
            icon={Activity}
            label="Activity Log"
            onClick={() => setIsOpen(false)}
            iconColor="text-emerald-500"
            bgColor="bg-emerald-500/10 dark:bg-emerald-500/20"
          />
        </div>

        {/* Logout Action */}
        <div className="p-2 border-t border-border-peach bg-surface-muted/20">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-200 group cursor-pointer"
          >
            <div className="size-8 rounded-md bg-red-500/10 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
              <Power className="size-4 text-red-600 dark:text-red-400 stroke-[2.2]" />
            </div>
            <span className="text-sm font-semibold">Logout Session</span>
          </button>
        </div>
      </div>
    );
  };

  // Not logged in fallback
  if (!isLoggedIn) {
    if (variant === "sidebar") {
      return (
        <div className={cn("w-full", className)}>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full h-10 rounded-md bg-coral hover:bg-coral-dark text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <LogIn className="size-4 shrink-0" />
            {!collapsed && <span>Login</span>}
          </Link>
        </div>
      );
    }

    return (
      <div className={cn("flex items-center", className)}>
        <Link
          href="/login"
          className="h-10 px-4.5 sm:px-5 flex items-center justify-center gap-2 rounded-full bg-coral hover:bg-coral-dark text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
        >
          <LogIn className="size-4 shrink-0" />
          <span>Login</span>
        </Link>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SIDEBAR VARIANT
  // -------------------------------------------------------------
  if (variant === "sidebar") {
    if (collapsed) {
      return (
        <div className={cn("relative flex flex-col items-center", className)} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "size-10 rounded-full overflow-hidden border transition-all cursor-pointer bg-surface-muted flex items-center justify-center",
              isOpen ? "border-coral ring-2 ring-coral/20" : "border-border-peach hover:border-coral"
            )}
            aria-label="Toggle user profile menu"
            aria-expanded={isOpen}
          >
            <Image
              src={displayImage}
              alt={displayName}
              width={40}
              height={40}
              unoptimized
              className="w-full h-full object-cover"
            />
          </button>
          {isOpen && renderDropdownMenu("sidebar-collapsed")}
        </div>
      );
    }

    return (
      <div className={cn("relative w-full", className)} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between w-full p-2.5 rounded-md border transition-all duration-200 cursor-pointer text-left shadow-2xs group",
            isOpen
              ? "bg-surface-muted border-coral/40 ring-1 ring-coral/20"
              : "bg-card border-border-peach hover:bg-surface-muted hover:border-coral/40"
          )}
          aria-label="Toggle user profile menu"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-10 rounded-full overflow-hidden border border-border-peach bg-surface-muted shrink-0">
              <Image
                src={displayImage}
                alt={displayName}
                width={40}
                height={40}
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-ink leading-tight truncate font-quicksand group-hover:text-coral transition-colors">
                {displayName}
              </span>
              <span className="text-[11px] text-coral font-medium leading-tight mt-0.5 truncate">
                {roleDisplay}
              </span>
            </div>
          </div>
          <ChevronsUpDown
            className={cn(
              "size-4 text-ink-muted group-hover:text-ink shrink-0 transition-transform duration-200",
              isOpen && "rotate-180 text-coral"
            )}
          />
        </button>
        {isOpen && renderDropdownMenu("sidebar-expanded")}
      </div>
    );
  }

  // -------------------------------------------------------------
  // HEADER VARIANT (DEFAULT)
  // -------------------------------------------------------------
  return (
    <div
      className={cn("static sm:relative flex items-center h-full", className)}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1 px-1.5 rounded-full hover:bg-surface-muted transition-colors focus:outline-none cursor-pointer group"
        aria-label="Open user profile menu"
        aria-expanded={isOpen}
      >
        <div className="size-9 rounded-full overflow-hidden border border-border-peach shrink-0 bg-surface-muted">
          <Image
            src={displayImage}
            alt={displayName}
            width={36}
            height={36}
            unoptimized
            className="w-full h-full object-cover"
          />
        </div>
        <span className="hidden sm:inline-block text-xs sm:text-sm font-bold text-ink max-w-28 truncate font-quicksand">
          {displayName}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 text-ink-muted transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && renderDropdownMenu("header")}
    </div>
  );
}

interface DropdownLinkProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  iconColor?: string;
  bgColor?: string;
}

function DropdownLink({
  to,
  icon: Icon,
  label,
  onClick,
  iconColor,
  bgColor,
}: DropdownLinkProps) {
  return (
    <Link
      href={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 text-ink hover:bg-surface-muted rounded-md transition-colors duration-200 group"
    >
      <div
        className={cn(
          "size-8 rounded-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200",
          bgColor
        )}
      >
        <Icon className={cn("size-4", iconColor)} />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
}
