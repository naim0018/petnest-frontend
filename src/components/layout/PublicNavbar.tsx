"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import UserProfile from "@/components/common/UserProfile";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import LanguageSelector from "@/components/common/LanguageSelector";
import Logo from "@/components/common/Logo";
import CommonWrapper from "@/components/common/CommonWrapper";
import {
  Bell,
  Check,
  CheckCheck,
  Home,
  X,
  Search,
  Rss,
  Users,
  BookOpen,
  ShoppingBag,
  HeartHandshake,
  Building2,
  Layers,
  Menu,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_FEATURE_FLAGS, type NavFeatureKey } from "@/lib/nav";
import { useAppSelector } from "@/hooks/useRedux";
import PetSelectorPopover from "./PetSelectorPopover";
import UniversalSearchBar from "./UniversalSearchBar";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "@/store/Api/Notification/notification.api";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";

function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDays = Math.floor(diffHour / 24);
    return `${diffDays}d ago`;
  } catch {
    return "";
  }
}

interface NavLinkItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  feature: NavFeatureKey;
}

const allNavLinks: NavLinkItem[] = [
  { label: "Guides", href: "/", icon: BookOpen, feature: "guides" },
  { label: "Feed", href: "/feed", icon: Rss, feature: "feed" },
  { label: "Community", href: "/community", icon: Users, feature: "community" },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag, feature: "marketplace" },
  { label: "Adoption", href: "/adoption", icon: HeartHandshake, feature: "adoption" },
];

const allDrawerLinks: NavLinkItem[] = [
  { label: "Care Guides", href: "/", icon: BookOpen, feature: "guides" },
  { label: "Browse Topics", href: "/#topics", icon: Layers, feature: "guides" },
  { label: "Feed", href: "/feed", icon: Rss, feature: "feed" },
  { label: "Community", href: "/community", icon: Users, feature: "community" },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag, feature: "marketplace" },
  { label: "Adoption", href: "/adoption", icon: HeartHandshake, feature: "adoption" },
  { label: "Shelter", href: "/shelter", icon: Building2, feature: "shelter" },
];

export default function PublicNavbar() {
  const pathname = usePathname();

  // Redux user for staff shortcuts in mobile drawer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authUser = useAppSelector((state) => (state.auth as any)?.user);
  const userRole = (authUser?.role || "").toUpperCase();
  const isStaff = ["SUPERADMIN", "ADMIN", "VET", "AUTHOR"].includes(userRole);

  const navLinks = allNavLinks.filter((item) => NAV_FEATURE_FLAGS[item.feature]);
  const mobileDrawerLinks = allDrawerLinks.filter((item) => NAV_FEATURE_FLAGS[item.feature]);
  const isOnlyGuidesActive =
    NAV_FEATURE_FLAGS.guides &&
    !NAV_FEATURE_FLAGS.feed &&
    !NAV_FEATURE_FLAGS.community &&
    !NAV_FEATURE_FLAGS.marketplace &&
    !NAV_FEATURE_FLAGS.adoption;

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();

  // Active WebSocket listener
  useNotificationSocket();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [isHomePopoverOpen, setIsHomePopoverOpen] = useState(false);
  const homePopoverRef = useRef<HTMLDivElement>(null);
  const homeButtonRef = useRef<HTMLButtonElement>(null);

  // Live notifications RTK Query
  const { data: notifData } = useGetNotificationsQuery(
    { page: 1, limit: 15 },
    { skip: !authUser?.userId }
  );
  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !authUser?.userId,
  });
  const [markAsReadMutation] = useMarkAsReadMutation();
  const [markAllAsReadMutation] = useMarkAllAsReadMutation();

  const notifications = notifData?.items || [];
  const unreadNotifCount =
    unreadData?.count ?? notifications.filter((n) => !n.isRead).length;

  const handleNotifClick = (n: {
    id: string;
    actionUrl?: string | null;
    isRead: boolean;
  }) => {
    if (!n.isRead) {
      markAsReadMutation(n.id);
    }
    if (n.actionUrl) {
      setIsNotifOpen(false);
      router.push(n.actionUrl);
    }
  };

  const markNotifAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    markAsReadMutation(id);
  };

  const markAllNotifsAsRead = () => {
    markAllAsReadMutation();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
      if (
        homePopoverRef.current &&
        !homePopoverRef.current.contains(target) &&
        !homeButtonRef.current?.contains(target)
      ) {
        setIsHomePopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Header Navbar */}
      <nav className="w-full h-16 sm:h-20 shrink-0 border-b border-border-peach sticky top-0 z-50 transition-colors bg-card/95 backdrop-blur-md">
        <CommonWrapper className="h-full py-0 px-3 sm:px-4 md:px-6 flex flex-row justify-between items-center gap-1.5 sm:gap-3 md:gap-4">
          {/* Logo Group */}
          <Link href="/" className="no-underline shrink-0">
            <Logo />
          </Link>

        {/* Universal Search Bar - Fluid responsive with instant dropdown */}
        <div className="hidden md:flex flex-1 min-w-[140px] max-w-xs xl:max-w-sm mx-1.5 lg:mx-3">
          <UniversalSearchBar />
        </div>

        {/* Nav Tabs */}
        <div className="hidden lg:flex flex-row gap-1.5 justify-start items-center shrink-0">
          {navLinks.map((link) => {
            const LinkIcon = link.icon;
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href + "/")) ||
              (link.href === "/" && link.label === "Guides" && (pathname === "/" || pathname.startsWith("/guides")));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 xl:px-5 py-2 xl:py-2.5 flex flex-row gap-2 justify-center items-center rounded-full no-underline transition-all duration-200 shrink-0",
                  active
                    ? "bg-coral text-white shadow-sm font-bold"
                    : "relative overflow-hidden group text-ink-muted hover:text-white before:absolute before:inset-0 before:rounded-full before:bg-coral before:-translate-x-[101%] hover:before:translate-x-0 before:transition-transform before:duration-300 before:ease-out"
                )}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                  <LinkIcon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors duration-300",
                      active ? "text-white stroke-[2.2]" : "text-ink-muted group-hover:text-white stroke-[2]"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-bold whitespace-nowrap transition-colors duration-300",
                      active ? "text-white" : "text-ink-muted group-hover:text-white"
                    )}
                  >
                    {link.label}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Right User Group */}
        <div className="flex flex-row gap-1.5 sm:gap-2 md:gap-2.5 xl:gap-3.5 justify-end items-center shrink-0 h-full">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className={cn(
              "md:hidden size-9 sm:size-10 flex items-center justify-center rounded-lg border border-border-peach transition-colors cursor-pointer shrink-0",
              isMobileSearchOpen
                ? "bg-coral text-white border-coral"
                : "bg-coral-light/50 text-coral hover:bg-coral-light"
            )}
            aria-label="Toggle search bar"
          >
            <Search className="size-4" />
          </button>

          {/* Select Pets Pill Dropdown */}
          <PetSelectorPopover />

          {/* Notification Bell Button */}
          <div className="relative h-full flex items-center" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
              }}
              className="size-9 sm:size-10 shrink-0 flex flex-row justify-center items-center bg-coral-light/50 hover:bg-coral-light rounded-lg relative cursor-pointer border border-border-peach focus:outline-none transition-colors"
              aria-label="Toggle notifications"
            >
              <div className="size-5 relative overflow-hidden flex items-center justify-center">
                <Bell className="size-4.5 sm:size-5 text-coral stroke-[2]" />
              </div>
              {unreadNotifCount > 0 && (
                <div className="size-4 sm:size-5 absolute -top-1.5 -right-1.5 sm:left-6 sm:-top-2 flex flex-row justify-center items-center bg-coral rounded-full z-10 ring-2 ring-card">
                  <span className="text-[9px] sm:text-[10px] text-white font-bold whitespace-nowrap">
                    {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                  </span>
                </div>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="fixed md:absolute left-3 right-3 md:left-auto md:right-0 top-16 sm:top-20 md:top-full mt-[2px] w-auto md:w-88 bg-popover border border-border-peach rounded-lg z-50 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border-peach bg-surface-muted/50">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={markAllNotifsAsRead}
                      className="text-xs text-coral hover:underline flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-border-peach">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-ink-faint">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className={cn(
                          "p-3.5 hover:bg-surface-muted transition-colors flex gap-3 items-start cursor-pointer",
                          !n.isRead && "bg-coral-light/50"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-ink truncate">
                            {n.title}
                          </p>
                          <p className="text-xs text-ink-muted mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-ink-faint mt-1 block">
                            {formatTimeAgo(n.createdAt)}
                          </span>
                        </div>
                        {!n.isRead && (
                          <button
                            onClick={(e) => markNotifAsRead(n.id, e)}
                            className="text-coral p-1 hover:bg-coral-light rounded-full shrink-0 cursor-pointer"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Language Selector - hidden on compact mobile (accessible via drawer menu), visible sm+ */}
          <div className="hidden sm:flex items-center">
            <LanguageSelector />
          </div>

          {/* Theme Toggle - hidden on compact mobile (accessible via drawer menu), visible sm+ */}
          <div className="hidden sm:flex items-center">
            <ThemeToggle />
          </div>

          {/* User Profile */}
          <UserProfile />
        </div>
        </CommonWrapper>

        {/* Mobile Search Expandable Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden w-full px-3 sm:px-4 py-2 bg-card border-t border-border-peach animate-in fade-in slide-in-from-top-2 duration-150 shadow-xs">
            <div className="flex items-center gap-2">
              <UniversalSearchBar
                autoFocus
                isMobileModal
                onClose={() => setIsMobileSearchOpen(false)}
              />
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="text-xs font-bold text-coral px-2 py-1.5 hover:underline cursor-pointer shrink-0"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Mobile Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Drawer Backdrop Overlay - Only dims content between top navbar and bottom nav */}
        {isHomePopoverOpen && (
          <div
            onClick={() => setIsHomePopoverOpen(false)}
            className="fixed inset-x-0 top-16 bottom-16 bg-black/30 z-40 animate-in fade-in duration-200"
          />
        )}

        {/* Mobile Navigation Drawer Popover - Anchored with bottom nav in single layer */}
        {isHomePopoverOpen && (
          <div
            ref={homePopoverRef}
            className="fixed bottom-[4.25rem] inset-x-2.5 sm:inset-x-4 z-50 bg-popover border border-border-peach shadow-2xl rounded-xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-200 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-border-peach">
              <span className="text-xs font-bold text-ink uppercase tracking-wider">
                PetNest Menu
              </span>
              <div className="flex items-center gap-2">
                <LanguageSelector />
                <ThemeToggle />
                <button
                  onClick={() => setIsHomePopoverOpen(false)}
                  className="p-1 text-ink-faint hover:text-ink rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {mobileDrawerLinks.map((item) => {
                const ItemIcon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href + "/")) ||
                  (item.href === "/" && (pathname === "/" || pathname.startsWith("/guides")));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      if (item.href === "/#topics" && (pathname === "/" || pathname === "/guides")) {
                        e.preventDefault();
                        setIsHomePopoverOpen(false);
                        document.getElementById("topics")?.scrollIntoView({ behavior: "smooth" });
                        return;
                      }
                      setIsHomePopoverOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg no-underline transition-all duration-200 border",
                      active
                        ? "bg-coral-light border-coral/30 text-coral font-bold"
                        : "bg-surface-muted border-border-peach text-ink"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg flex items-center justify-center shrink-0",
                        active ? "bg-coral text-white" : "bg-card text-ink-muted"
                      )}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold truncate">{item.label}</span>
                  </Link>
                );
              })}

              {isStaff && (
                <>
                  <Link
                    href="/admin/guides"
                    onClick={() => setIsHomePopoverOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg no-underline transition-all duration-200 border bg-surface-muted border-border-peach text-ink hover:border-coral/40"
                  >
                    <div className="p-2 rounded-lg flex items-center justify-center shrink-0 bg-coral/10 text-coral">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold truncate">Admin Hub</span>
                  </Link>

                  <Link
                    href="/admin/guides/create"
                    onClick={() => setIsHomePopoverOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg no-underline transition-all duration-200 border bg-surface-muted border-border-peach text-ink hover:border-coral/40"
                  >
                    <div className="p-2 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <PlusCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold truncate">Create Guide</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Bottom Bar: Clean 4-item navigation when only Guides is active; multi-module layout when others are enabled */}
        {isOnlyGuidesActive ? (
          <div className="relative z-50 w-full max-w-full bg-card/95 backdrop-blur-md border-t border-border-peach h-16 pb-[env(safe-area-inset-bottom,0px)] grid grid-cols-4 items-center px-1 sm:px-3 shadow-lg select-none">
            {/* 1. Guides / Home Tab */}
            <Link
              href="/"
              onClick={(e) => {
                if (pathname === "/" || pathname === "/guides") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 w-full py-1 no-underline transition-colors cursor-pointer",
                pathname === "/" || pathname.startsWith("/guides")
                  ? "text-coral font-bold"
                  : "text-ink-muted hover:text-coral"
              )}
            >
              <BookOpen className="size-5 mb-0.5 shrink-0" />
              <span className="text-[10px] sm:text-xs tracking-tight font-medium truncate w-full text-center px-0.5">
                Guides
              </span>
            </Link>

            {/* 2. Topics Tab (Smooth scroll to topic category filters) */}
            <Link
              href="/#topics"
              onClick={(e) => {
                if (pathname === "/" || pathname === "/guides") {
                  e.preventDefault();
                  document.getElementById("topics")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="flex flex-col items-center justify-center min-w-0 w-full py-1 no-underline transition-colors cursor-pointer text-ink-muted hover:text-coral"
            >
              <Layers className="size-5 mb-0.5 shrink-0" />
              <span className="text-[10px] sm:text-xs tracking-tight font-medium truncate w-full text-center px-0.5">
                Topics
              </span>
            </Link>

            {/* 3. Search Toggle Tab */}
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen((prev) => !prev);
                if (!isMobileSearchOpen) {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 w-full py-1 no-underline transition-colors cursor-pointer",
                isMobileSearchOpen ? "text-coral font-bold" : "text-ink-muted hover:text-coral"
              )}
              aria-label="Search guides"
            >
              <Search className="size-5 mb-0.5 shrink-0" />
              <span className="text-[10px] sm:text-xs tracking-tight font-medium truncate w-full text-center px-0.5">
                Search
              </span>
            </button>

            {/* 4. Menu Drawer Toggle Tab */}
            <button
              ref={homeButtonRef}
              type="button"
              onClick={() => setIsHomePopoverOpen((prev) => !prev)}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 w-full py-1 no-underline transition-colors cursor-pointer",
                isHomePopoverOpen ? "text-coral font-bold" : "text-ink-muted hover:text-coral"
              )}
              aria-label="Open menu drawer"
            >
              <Menu className="size-5 mb-0.5 shrink-0" />
              <span className="text-[10px] sm:text-xs tracking-tight font-medium truncate w-full text-center px-0.5">
                Menu
              </span>
            </button>
          </div>
        ) : (
          <div className="relative z-50 w-full max-w-full bg-card border-t border-border-peach h-16 pb-[env(safe-area-inset-bottom,0px)] grid grid-cols-5 items-center px-0.5 sm:px-2 shadow-lg">
            {NAV_FEATURE_FLAGS.feed && (
              <Link
                href="/feed"
                className={cn(
                  "flex flex-col items-center justify-center min-w-0 w-full py-1 no-underline transition-colors",
                  pathname.startsWith("/feed") ? "text-coral font-bold" : "text-ink-muted hover:text-coral"
                )}
              >
                <Rss className="size-5 mb-0.5 shrink-0" />
                <span className="text-[10px] sm:text-xs tracking-tight font-medium truncate w-full text-center px-0.5">
                  Feed
                </span>
              </Link>
            )}

            {NAV_FEATURE_FLAGS.community && (
              <Link
                href="/community"
                className={cn(
                  "flex flex-col items-center justify-center min-w-0 w-full py-1 no-underline transition-colors",
                  pathname === "/community" ? "text-coral font-bold" : "text-ink-muted hover:text-coral"
                )}
              >
                <Users className="size-5 mb-0.5 shrink-0" />
                <span className="text-[10px] sm:text-xs tracking-tight font-medium truncate w-full text-center px-0.5">
                  Community
                </span>
              </Link>
            )}

            {/* Center Floating Home FAB */}
            <div className="relative -mt-5 sm:-mt-6 flex justify-center items-center min-w-0 w-full">
              <button
                ref={homeButtonRef}
                onClick={() => setIsHomePopoverOpen(!isHomePopoverOpen)}
                className={cn(
                  "size-12 sm:size-13 bg-coral text-white rounded-full flex items-center justify-center shadow-lg shadow-coral/40 hover:shadow-coral/60 active:scale-95 transition-all border-3 sm:border-4 border-card cursor-pointer shrink-0",
                  isHomePopoverOpen && "rotate-45"
                )}
                aria-label="Open home menu"
              >
                <Home className="size-5.5 sm:size-6" />
              </button>
            </div>

            {NAV_FEATURE_FLAGS.marketplace && (
              <Link
                href="/marketplace"
                className={cn(
                  "flex flex-col items-center justify-center min-w-0 w-full py-1 no-underline transition-colors",
                  pathname === "/marketplace" ? "text-coral font-bold" : "text-ink-muted hover:text-coral"
                )}
              >
                <ShoppingBag className="size-5 mb-0.5 shrink-0" />
                <span className="text-[10px] sm:text-xs tracking-tight font-medium truncate w-full text-center px-0.5">
                  Marketplace
                </span>
              </Link>
            )}

            {NAV_FEATURE_FLAGS.adoption && (
              <Link
                href="/adoption"
                className={cn(
                  "flex flex-col items-center justify-center min-w-0 w-full py-1 no-underline transition-colors",
                  pathname === "/adoption" ? "text-coral font-bold" : "text-ink-muted hover:text-coral"
                )}
              >
                <HeartHandshake className="size-5 mb-0.5 shrink-0" />
                <span className="text-[10px] sm:text-xs tracking-tight font-medium truncate w-full text-center px-0.5">
                  Adoption
                </span>
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
