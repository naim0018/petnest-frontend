"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Power,
  LayoutDashboard,
  User,
  Settings,
  Activity,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { toast } from "sonner";
import { logOut } from "@/store/features/AuthSlice/authSlice";
import { useLogoutMutation } from "@/store/Api/Auth/auth.api";
import { useGetMeQuery } from "@/store/Api/User/user.api";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  className?: string;
}

export default function UserProfile({ className }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAppSelector((state) => (state.auth as any)?.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn =
    mounted &&
    Boolean(
      user &&
        ((typeof user.email === "string" && user.email.trim().length > 0) ||
          (typeof user.userId === "string" && user.userId.trim().length > 0) ||
          (typeof user.accessToken === "string" && user.accessToken.trim().length > 0))
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
  const displayImage =
    me?.profile?.avatar || user?.avatar || demoImage;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentRole = (me?.role || user?.role || "USER").toUpperCase();
  const isAdminOrSuper = currentRole === "ADMIN" || currentRole === "SUPERADMIN";
  const isEditorial = currentRole === "AUTHOR" || currentRole === "VET";

  const dashboardPath = isAdminOrSuper
    ? "/admin"
    : isEditorial
    ? "/admin/guides"
    : "/user";

  const dashboardLabel = isAdminOrSuper
    ? "Admin Dashboard"
    : isEditorial
    ? "Editorial Hub"
    : "Dashboard";

  const settingsPath = isAdminOrSuper ? "/admin/settings" : "/user/settings";
  const profilePath = "/user";
  const activityLogPath = isAdminOrSuper ? "/admin/analytics" : "/user";

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Even if network API call fails, proceed to clear local auth state
    } finally {
      dispatch(logOut());
      toast.success("Logged out successfully");
      setIsOpen(false);
      router.push("/");
    }
  };

  // If user is NOT logged in: Show the Login button as requested
  if (!isLoggedIn) {
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

  // If user IS logged in: Show the User profile button & dropdown matching the screenshot
  return (
    <div
      className={cn("static sm:relative flex items-center h-full", className)}
      ref={dropdownRef}
    >
      {/* Trigger Button - Sized & Styled matching screenshot */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1 px-1.5 rounded-full hover:bg-surface-muted transition-colors focus:outline-none cursor-pointer group"
        aria-label="Open user profile menu"
      >
        <div className="size-9 rounded-full overflow-hidden border border-border-peach shrink-0 bg-surface-muted">
          <Image
            src={displayImage}
            alt={displayName}
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="hidden sm:inline-block text-xs sm:text-sm font-bold text-ink max-w-[110px] truncate font-quicksand">
          {displayName}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 text-ink-muted transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu - Styled matching screenshot */}
      {isOpen && (
        <div className="absolute left-3 right-3 sm:left-auto sm:right-0 top-full mt-2 w-auto sm:w-72 bg-card rounded-2xl border border-border-peach shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-surface-muted/30 border-b border-border-peach">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl overflow-hidden bg-surface-muted border border-border-peach shrink-0">
                <Image
                  src={displayImage}
                  alt={displayName}
                  width={40}
                  height={40}
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

          {/* Links matching screenshot */}
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

          {/* Footer / Logout */}
          <div className="p-2 border-t border-border-peach bg-surface-muted/20">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group cursor-pointer"
            >
              <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                <Power className="size-4 text-red-600 dark:text-red-400 stroke-[2.2]" />
              </div>
              <span className="text-sm font-semibold">Logout Session</span>
            </button>
          </div>
        </div>
      )}
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
      className="flex items-center gap-3 px-3 py-2 text-ink hover:bg-surface-muted rounded-xl transition-colors duration-200 group"
    >
      <div
        className={cn(
          "size-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200",
          bgColor
        )}
      >
        <Icon className={cn("size-4", iconColor)} />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
}
