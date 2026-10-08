"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { NavGroup, NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";

interface SidebarProps {
  navGroups: NavGroup[];
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

// Check if a specific route item matches the current pathname
const isItemActive = (item: NavItem, pathname: string): boolean => {
  if (!item.path) return false;
  // If item has children, it is active if any descendant matches
  if (item.children && item.children.length > 0) {
    return item.children.some((child) => isItemActive(child, pathname));
  }
  // Exact match
  if (pathname === item.path) return true;
  // Prefix match for nested sub-routes (avoid matching root "/" or "/admin" prefixes unintentionally)
  if (item.path !== "/" && item.path !== "/admin" && item.path !== "/user") {
    if (pathname.startsWith(`${item.path}/`)) {
      return true;
    }
  }
  return false;
};

// Check if a parent expandable item has an active descendant
const hasActiveChild = (menuItem: NavItem, pathname: string): boolean => {
  if (!menuItem.children || menuItem.children.length === 0) return false;
  return menuItem.children.some((child) => isItemActive(child, pathname));
};

const SidebarItem = ({ item, pathname, depth = 0 }: { item: NavItem; pathname: string; depth?: number }) => {
  const hasChildren = !!item.children?.length;
  const isChildActive = hasActiveChild(item, pathname);
  const [isOpen, setIsOpen] = useState(() => isChildActive);

  // Keep parent open when navigating into its children
  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  // Item is active if it matches the current path or has an active descendant
  const isActive = isItemActive(item, pathname);
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
                <SidebarItem key={child.path} item={child} pathname={pathname} depth={depth + 1} />
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
        <Link href={navGroups[0]?.items?.[0]?.path || "/admin"} className={cn("no-underline outline-none flex items-center", showCollapsed ? "justify-center" : "w-full")}>
          <Logo collapsed={showCollapsed} className={showCollapsed ? "justify-center gap-0" : "w-full justify-start"} />
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6 scrollbar-thin scrollbar-thumb-border-peach">
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
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center justify-center h-10 w-10 mx-auto rounded-lg transition-all duration-200",
                      isItemActive(item, pathname)
                        ? "bg-coral text-white shadow-xs"
                        : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                    )}
                    title={item.name}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "size-5 shrink-0",
                          isItemActive(item, pathname)
                            ? "text-white"
                            : "text-ink-muted hover:text-ink"
                        )}
                      />
                    )}
                  </Link>
                ) : (
                  <SidebarItem key={item.path} item={item} pathname={pathname} />
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-3.5 border-t border-border-peach mt-auto shrink-0 bg-surface-soft">
        {showCollapsed ? (
          <div className="flex flex-col items-center gap-3">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
              alt="User Avatar"
              width={36}
              height={36}
              className="size-9 rounded-full border border-border-peach object-cover"
            />
            <button
              onClick={() => window.location.href = "/"}
              className="text-ink-muted hover:text-coral transition-colors cursor-pointer p-1 rounded-md hover:bg-surface-muted"
              title="Sign Out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 border border-border-peach rounded-lg bg-card">
            <div className="flex items-center gap-2.5 min-w-0">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                alt="User Avatar"
                width={40}
                height={40}
                className="size-10 rounded-full border border-border-peach object-cover shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-ink leading-tight truncate font-quicksand">Alex Morgan</span>
                <span className="text-[11px] text-coral font-medium leading-tight mt-0.5 truncate">PetNest Admin</span>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = "/"}
              className="text-ink-muted hover:text-coral transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-coral-light shrink-0"
              title="Sign Out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
