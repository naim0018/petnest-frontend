"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Menu, Check, CheckCheck, BellOff } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import UserProfile from "@/components/common/UserProfile";
import Breadcrumbs from "./Breadcrumbs";
import { cn } from "@/lib/utils";
import { useHeaderAction } from "@/context/HeaderActionContext";

interface HeaderProps {
  onMenuClick?: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New Breeder Verification Request",
    description: "Willow Creek Kennels submitted license documents for review.",
    time: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    title: "Care Guide Submitted",
    description: "Dr. Sarah Jenkins submitted a puppy vaccination guide.",
    time: "15 mins ago",
    read: false,
  },
  {
    id: "3",
    title: "Marketplace Order Placed",
    description: "Order #PN-9281 confirmed on PetPurity Botanicals.",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    title: "Listing Flagged",
    description: "A customer flagged a listing for veterinary clearance verification.",
    time: "2 hours ago",
    read: false,
  },
];

export default function Header({ onMenuClick }: HeaderProps) {
  const { headerAction } = useHeaderAction();
  const [searchVal, setSearchVal] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="relative h-16 bg-card border-b border-border-peach sticky top-0 z-30 flex items-center shrink-0 px-4 sm:px-6 shadow-2xs">
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left Side: Mobile Hamburger & Breadcrumbs (removed title/description) */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-1 rounded-lg hover:bg-surface-muted text-ink-muted hover:text-ink sm:hidden cursor-pointer shrink-0 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="size-5" />
          </button>

          {/* Breadcrumb relocated directly into header */}
          <div className="min-w-0 overflow-hidden">
            <Breadcrumbs />
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 h-full">
          {/* Dynamic Page Action Button Slot */}
          {headerAction && (
            <div className="flex items-center mr-1">
              {headerAction}
            </div>
          )}

          {/* Search Input */}
          <div className="static sm:relative flex items-center h-full" ref={searchRef}>
            {/* Desktop Search */}
            <div className="relative w-56 lg:w-64 hidden md:block transition-all duration-300">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="size-4 text-ink-faint" />
              </span>
              <input
                type="text"
                placeholder="Search PetNest admin..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-9 pr-3.5 h-9 bg-surface-muted border border-border-peach rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all text-ink placeholder:text-ink-faint"
              />
            </div>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-ink-muted hover:text-ink hover:bg-surface-muted rounded-lg transition-colors cursor-pointer md:hidden"
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>

            {/* Mobile Search Popover */}
            {isSearchOpen && (
              <div className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 w-auto sm:w-72 bg-card border border-border-peach rounded-xl p-2.5 z-50 shadow-md animate-in fade-in zoom-in-95 duration-100 md:hidden">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="size-4 text-ink-faint" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    autoFocus
                    className="w-full pl-9 pr-3.5 py-1.5 bg-surface-muted border border-border-peach rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all text-ink placeholder:text-ink-faint"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown Container */}
          <div className="static sm:relative flex items-center h-full" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="size-9 text-ink-muted hover:text-ink hover:bg-surface-muted rounded-lg relative transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="size-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-coral text-[9px] font-bold text-white ring-2 ring-card">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotifOpen && (
              <div className="absolute left-2 right-2 sm:left-auto sm:right-0 top-full mt-2 w-auto sm:w-80 bg-card border border-border-peach rounded-xl py-2 z-50 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border-peach mb-1">
                  <p className="text-xs text-ink font-bold uppercase tracking-wider font-quicksand">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-coral hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <CheckCheck className="size-3.5" /> Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-border-peach">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-ink-faint flex flex-col items-center gap-1">
                      <BellOff className="size-7 opacity-40 mb-1" />
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "px-4 py-2.5 hover:bg-surface-muted transition-colors flex gap-2.5 items-start",
                          !n.read && "bg-coral-light/40"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline gap-2">
                            <p className={cn("text-xs truncate font-bold font-quicksand", n.read ? "text-ink-muted" : "text-ink")}>
                              {n.title}
                            </p>
                            <span className="text-[10px] text-ink-faint shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-2">
                            {n.description}
                          </p>
                        </div>
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="text-coral hover:text-coral-dark p-1 hover:bg-coral-light rounded-full shrink-0 cursor-pointer"
                            title="Mark as read"
                          >
                            <Check className="size-3" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-border-peach mt-1 pt-1.5 px-3">
                  <button
                    onClick={() => {
                      setIsNotifOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="w-full text-center text-xs font-semibold text-ink-muted hover:text-coral py-1.5 hover:bg-surface-muted rounded-lg transition-colors cursor-pointer"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          <div className="h-5 w-px bg-border-peach"></div>

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>

      {/* View All Notifications Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border-peach max-w-lg w-full p-6 animate-in zoom-in-95 duration-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-border-peach pb-4 mb-4">
              <h3 className="text-base font-bold text-ink font-quicksand">All Notifications</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-coral font-bold text-xs cursor-pointer px-2 py-1 rounded hover:bg-surface-muted"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "p-3 rounded-lg border flex gap-3 items-start",
                    n.read 
                      ? "border-border-peach bg-surface-muted/60" 
                      : "border-coral/20 bg-coral-light/50"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className={cn("text-xs font-bold font-quicksand", n.read ? "text-ink-muted" : "text-ink")}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-ink-faint shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">{n.description}</p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-coral hover:text-coral-dark p-1 hover:bg-coral-light rounded-full shrink-0 cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
