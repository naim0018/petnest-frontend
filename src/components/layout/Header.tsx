"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, Check, CheckCheck, BellOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import LanguageSelector from "@/components/common/LanguageSelector";
import Breadcrumbs from "./Breadcrumbs";
import { cn } from "@/lib/utils";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "@/store/Api/Notification/notification.api";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";

interface HeaderProps {
  onMenuClick?: () => void;
}

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

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { headerAction } = useHeaderAction();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active WebSocket listener
  useNotificationSocket();

  // Live RTK Query hooks
  const { data: notifData } = useGetNotificationsQuery({ page: 1, limit: 20 });
  const { data: unreadData } = useGetUnreadCountQuery();
  const [markAsReadMutation] = useMarkAsReadMutation();
  const [markAllAsReadMutation] = useMarkAllAsReadMutation();

  const notifications = notifData?.items || [];
  const unreadCount =
    unreadData?.count ?? notifications.filter((n) => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (n: {
    id: string;
    actionUrl?: string | null;
    isRead: boolean;
  }) => {
    if (!n.isRead) {
      markAsReadMutation(n.id);
    }
    if (n.actionUrl) {
      setIsNotifOpen(false);
      setIsModalOpen(false);
      router.push(n.actionUrl);
    }
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation();
  };

  return (
    <header className="relative h-16 bg-card border-b border-border-peach sticky top-0 z-30 flex items-center shrink-0 px-3 sm:px-5 md:px-6 shadow-2xs">
      <div className="flex items-center justify-between w-full gap-2 sm:gap-4 min-w-0">
        {/* Left Side: Mobile Hamburger & Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className="p-1.5 sm:p-2 -ml-1 rounded-lg hover:bg-surface-muted text-ink-muted hover:text-ink sm:hidden cursor-pointer shrink-0 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="size-5" />
          </button>

          {/* Breadcrumb relocated directly into header */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <Breadcrumbs />
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 h-full">
          {/* Dynamic Page Action Button Slot */}
          {headerAction && (
            <div className="flex items-center shrink-0">{headerAction}</div>
          )}

          {/* Notifications Dropdown Container */}
          <div
            className="static sm:relative flex items-center h-full"
            ref={notifRef}
          >
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="size-9 text-ink-muted hover:text-ink hover:bg-surface-muted rounded-lg relative transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="size-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-coral text-[9px] font-bold text-white ring-2 ring-card">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotifOpen && (
              <div className="absolute left-2 right-2 sm:left-auto sm:right-0 top-full mt-2 w-auto sm:w-80 bg-card border border-border-peach rounded-lg py-2 z-50 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border-peach mb-1">
                  <p className="text-xs text-ink font-bold uppercase tracking-wider font-quicksand">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
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
                        onClick={() => handleItemClick(n)}
                        className={cn(
                          "px-4 py-2.5 hover:bg-surface-muted transition-colors flex gap-2.5 items-start cursor-pointer",
                          !n.isRead && "bg-coral-light/40"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline gap-2">
                            <p
                              className={cn(
                                "text-xs truncate font-bold font-quicksand",
                                n.isRead ? "text-ink-muted" : "text-ink"
                              )}
                            >
                              {n.title}
                            </p>
                            <span className="text-[10px] text-ink-faint shrink-0">
                              {formatTimeAgo(n.createdAt)}
                            </span>
                          </div>
                          <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                        {!n.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(n.id, e)}
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

          {/* Language Selector */}
          <LanguageSelector />

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* View All Notifications Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border-peach max-w-lg w-full p-6 animate-in zoom-in-95 duration-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-border-peach pb-4 mb-4">
              <h3 className="text-base font-bold text-ink font-quicksand">
                All Notifications
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-coral font-bold text-xs cursor-pointer px-2 py-1 rounded hover:bg-surface-muted"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-ink-faint flex flex-col items-center gap-1">
                  <BellOff className="size-7 opacity-40 mb-1" />
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={cn(
                      "p-3 rounded-lg border flex gap-3 items-start cursor-pointer transition-colors",
                      n.isRead
                        ? "border-border-peach bg-surface-muted/60"
                        : "border-coral/20 bg-coral-light/50"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4
                          className={cn(
                            "text-xs font-bold font-quicksand",
                            n.isRead ? "text-ink-muted" : "text-ink"
                          )}
                        >
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-ink-faint shrink-0">
                          {formatTimeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(n.id, e)}
                        className="text-coral hover:text-coral-dark p-1 hover:bg-coral-light rounded-full shrink-0 cursor-pointer"
                        title="Mark as read"
                      >
                        <Check className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
