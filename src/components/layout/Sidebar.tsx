"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavGroup, NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";
import UserProfile from "@/components/common/UserProfile";

interface SidebarProps {
  navGroups: NavGroup[];
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

// Extract all concrete leaf paths from navigation groups
const getLeafPaths = (groups: NavGroup[]): string[] => {
  const paths: string[] = [];
  const traverse = (items: NavItem[]) => {
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      } else if (item.path) {
        paths.push(item.path);
      }
    }
  };
  for (const group of groups) {
    traverse(group.items);
  }
  return paths;
};

const GUIDE_DETAIL_ROUTE_REGEX =
  /^\/admin\/guides\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(\/|$)/i;

// Check if a specific route item matches the current pathname
const isItemActive = (
  item: NavItem,
  pathname: string,
  allLeafPaths: string[] = []
): boolean => {
  if (!item.path) return false;

  // If item has children, it is active if any descendant matches
  if (item.children && item.children.length > 0) {
    return item.children.some((child) => isItemActive(child, pathname, allLeafPaths));
  }

  // Exact match
  if (pathname === item.path) return true;

  // Guide detail/edit/faqs routes (/admin/guides/<uuid>/...) belong under All Guides, not Overview
  if (GUIDE_DETAIL_ROUTE_REGEX.test(pathname)) {
    if (item.path === "/admin/guides/all") return true;
    if (item.path === "/admin/guides") return false;
  }

  // Root or base module paths should only match exact
  if (
    item.path === "/" ||
    item.path === "/admin" ||
    item.path === "/user" ||
    item.path === "/admin/dashboard" ||
    item.path === "/user/dashboard" ||
    item.path === "/admin/guides"
  ) {
    return false;
  }

  // Prefix match for nested sub-routes (e.g. /admin/pet-catalog/dogs when only /admin/pet-catalog is in nav)
  if (pathname.startsWith(`${item.path}/`)) {
    // If another leaf item in the navigation tree is a more specific (longer) match for pathname,
    // this item is an overview/parent route and must NOT be marked active.
    const hasMoreSpecificMatch = allLeafPaths.some(
      (otherPath) =>
        otherPath !== item.path &&
        otherPath.length > item.path.length &&
        (pathname === otherPath || pathname.startsWith(`${otherPath}/`))
    );
    return !hasMoreSpecificMatch;
  }

  return false;
};

// Check if a parent expandable item has an active descendant
const hasActiveChild = (
  menuItem: NavItem,
  pathname: string,
  allLeafPaths: string[] = []
): boolean => {
  if (!menuItem.children || menuItem.children.length === 0) return false;
  return menuItem.children.some((child) => isItemActive(child, pathname, allLeafPaths));
};

const CollapsedSidebarItem = ({
  item,
  pathname,
  allLeafPaths,
}: {
  item: NavItem;
  pathname: string;
  allLeafPaths: string[];
}) => {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const isActive = isItemActive(item, pathname, allLeafPaths);
  const Icon = item.icon;

  return (
    <div className="relative group/collapsed flex justify-center w-full">
      <Link
        href={item.path}
        className={cn(
          "flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 outline-none",
          isActive
            ? "bg-coral text-white shadow-xs"
            : "text-ink-muted hover:bg-surface-muted hover:text-ink"
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "size-5 shrink-0 transition-colors",
              isActive ? "text-white" : "text-ink-muted group-hover/collapsed:text-ink"
            )}
          />
        )}
      </Link>

      {/* Flyout Submenu if other pages (children) exist */}
      {hasChildren ? (
        <div className="absolute left-full top-1/2 -translate-y-1/2 pl-5 z-[60] pointer-events-none group-hover/collapsed:pointer-events-auto invisible opacity-0 group-hover/collapsed:visible group-hover/collapsed:opacity-100 transition-all duration-150 ease-out">
          <div className="relative bg-card border border-border-peach shadow-xl rounded-xl p-2 min-w-[210px] w-max max-w-[280px] text-left">
            {/* Triangular arrow pointing to icon */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 size-3 bg-card border-l border-b border-border-peach rotate-45 pointer-events-none" />

            {/* Header: Item Group Name */}
            <div className="px-3 py-1.5 border-b border-border-peach/60 mb-1 relative z-10">
              <span className="text-[11px] font-bold text-ink-faint uppercase tracking-wider font-quicksand">
                {item.name}
              </span>
            </div>

            {/* Subpages Links */}
            <div className="space-y-0.5 relative z-10">
              {item.children!.map((child) => {
                const isChildActive = isItemActive(child, pathname, allLeafPaths);
                return (
                  <Link
                    key={child.path}
                    href={child.path}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-quicksand transition-colors",
                      isChildActive
                        ? "bg-coral-light/70 text-coral font-bold"
                        : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full shrink-0 transition-colors",
                        isChildActive ? "bg-coral" : "bg-ink-faint/40"
                      )}
                    />
                    <span className="truncate">{child.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Tooltip only if no other pages exist */
        <div className="absolute left-full top-1/2 -translate-y-1/2 pl-5 z-[60] pointer-events-none invisible opacity-0 group-hover/collapsed:visible group-hover/collapsed:opacity-100 transition-all duration-150 ease-out">
          <div className="relative bg-ink text-white text-xs font-bold font-quicksand px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap">
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 size-2 bg-ink rotate-45 pointer-events-none" />
            <span className="relative z-10">{item.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({
  item,
  pathname,
  depth = 0,
  allLeafPaths = [],
}: {
  item: NavItem;
  pathname: string;
  depth?: number;
  allLeafPaths?: string[];
}) => {
  const hasChildren = !!item.children?.length;
  const isChildActive = hasActiveChild(item, pathname, allLeafPaths);
  const [isOpen, setIsOpen] = useState(() => isChildActive);

  // Keep parent open when navigating into its children
  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  // Item is active if it matches the current path or has an active descendant
  const isActive = isItemActive(item, pathname, allLeafPaths);
  const Icon = item.icon;

  return (
    <div className="w-full">
      {hasChildren ? (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center justify-between w-full rounded-lg transition-all duration-200 group cursor-pointer",
              depth === 0 ? "h-11 px-3.5 text-sm font-bold font-quicksand" : "h-9 px-3 text-xs font-semibold font-quicksand",
              isActive 
                ? depth === 0
                  ? "bg-coral text-white font-bold shadow-xs"
                  : "text-coral font-bold bg-coral-light/60"
                : "text-ink-muted hover:bg-surface-muted hover:text-ink"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {Icon && <Icon className={cn("shrink-0 transition-colors", 
                depth === 0 ? "size-5" : "size-4",
                isActive
                  ? depth === 0 ? "text-white" : "text-coral"
                  : "text-ink-muted group-hover:text-ink"
              )} />}
              <span className="truncate">{item.name}</span>
            </div>
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform duration-200 shrink-0",
                isActive
                  ? depth === 0 ? "text-white" : "text-coral"
                  : "text-ink-faint group-hover:text-ink",
                isOpen && "rotate-90"
              )}
            />
          </button>
          {isOpen && (
            <div className={cn(
              "mt-1 space-y-1 border-l border-border-peach animate-in slide-in-from-top-1 duration-200",
              depth === 0 ? "ml-5 pl-2.5" : "ml-3 pl-2"
            )}>
              {item.children!.map((child) => (
                <SidebarItem
                  key={child.path}
                  item={child}
                  pathname={pathname}
                  depth={depth + 1}
                  allLeafPaths={allLeafPaths}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link
          href={item.path}
          className={cn(
            "flex items-center gap-2.5 rounded-lg transition-all duration-200 group",
            depth === 0 ? "h-11 px-3.5 text-sm font-bold font-quicksand" : "h-9 px-3 text-xs font-semibold font-quicksand",
            isActive
              ? depth === 0
                ? "bg-coral text-white font-bold shadow-xs"
                : "text-coral font-bold"
              : "text-ink-muted hover:bg-surface-muted hover:text-ink"
          )}
        >
          {Icon && <Icon className={cn("shrink-0 transition-colors", 
            depth === 0 ? "size-5" : "size-4",
            isActive
              ? depth === 0 ? "text-white" : "text-coral"
              : "text-ink-muted group-hover:text-ink"
          )} />}
          <span className="truncate">{item.name}</span>
        </Link>
      )}
    </div>
  );
};

export default function Sidebar({ navGroups, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const allLeafPaths = useMemo(() => getLeafPaths(navGroups), [navGroups]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const w = window.innerWidth;
    if (w < 640) return false;
    if (w < 1280) return true;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  const prevBreakpoint = useRef<"mobile" | "sm-xl" | "xl">("xl");

  useEffect(() => {
    const getBreakpoint = (w: number): "mobile" | "sm-xl" | "xl" =>
      w < 640 ? "mobile" : w < 1280 ? "sm-xl" : "xl";

    const handleResize = () => {
      const w = window.innerWidth;
      const bp = getBreakpoint(w);
      setIsMobile(w < 640);

      if (bp === "sm-xl" && prevBreakpoint.current === "xl") {
        setIsCollapsed(true);
      }
      if (bp === "xl" && prevBreakpoint.current === "sm-xl") {
        setIsCollapsed(localStorage.getItem("sidebar-collapsed") === "true");
      }
      prevBreakpoint.current = bp;
    };

    prevBreakpoint.current =
      window.innerWidth < 640 ? "mobile" : window.innerWidth < 1280 ? "sm-xl" : "xl";

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    if (window.innerWidth >= 1280) {
      localStorage.setItem("sidebar-collapsed", String(nextState));
    }
  };

  const showCollapsed = isCollapsed && !isMobile;

  return (
    <aside
      className={cn(
        "bg-card text-ink h-screen flex flex-col transition-all duration-300 z-50 shrink-0 border-r border-border-peach shadow-xs",
        // Desktop layouts
        "sm:sticky sm:top-0 sm:translate-x-0",
        showCollapsed ? "sm:w-20" : "sm:w-[270px]",
        // Mobile layouts (drawer overlay style)
        "fixed left-0 top-0 h-screen w-[270px] sm:static",
        isMobileOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      )}
    >
      {/* Floating Collapse/Expand Button */}
      {isMounted && (
        <button
          onClick={toggleCollapse}
          className="absolute right-[-12px] top-16 z-50 transform -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border-peach hidden sm:flex items-center justify-center cursor-pointer hover:border-coral transition-colors text-ink-muted hover:text-coral focus:outline-none shadow-xs"
          aria-label={showCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {showCollapsed ? (
            <ChevronRight className="size-3.5" />
          ) : (
            <ChevronLeft className="size-3.5" />
          )}
        </button>
      )}

      {/* Sidebar Header with PetNest Logo */}
      <div className={cn("h-16 flex items-center border-b border-border-peach shrink-0", showCollapsed ? "justify-center px-0" : "px-4")}>
        <Link href={navGroups[0]?.items?.[0]?.path || "/admin/dashboard"} className={cn("no-underline outline-none flex items-center", showCollapsed ? "justify-center" : "w-full")}>
          <Logo collapsed={showCollapsed} className={showCollapsed ? "justify-center gap-0" : "w-full justify-start"} />
        </Link>
      </div>

      {/* Navigation Groups */}
      <div
        className={cn(
          "flex-1 px-3.5 py-5 space-y-6",
          showCollapsed
            ? "overflow-visible"
            : "overflow-y-auto scrollbar-thin scrollbar-thumb-border-peach"
        )}
      >
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            {!showCollapsed && (
              <span className="text-[11px] uppercase tracking-wider font-bold text-ink-faint px-3 block font-quicksand">
                {group.group}
              </span>
            )}
            <div className="space-y-1">
              {group.items.map((item) =>
                showCollapsed ? (
                  <CollapsedSidebarItem
                    key={item.path}
                    item={item}
                    pathname={pathname}
                    allLeafPaths={allLeafPaths}
                  />
                ) : (
                  <SidebarItem
                    key={item.path}
                    item={item}
                    pathname={pathname}
                    allLeafPaths={allLeafPaths}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Card & Dropdown at Bottom */}
      <div className="p-3.5 border-t border-border-peach mt-auto shrink-0 bg-surface-soft">
        <UserProfile variant="sidebar" collapsed={showCollapsed} />
      </div>
    </aside>
  );
}
