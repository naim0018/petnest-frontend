"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  MessageSquare,
  Users,
  BookOpen,
  ShoppingBag,
  HeartHandshake,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PetSelectorPopover from "./PetSelectorPopover";

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
    title: "New User Registered",
    description: "Alex joined the PetNest admin platform as a Manager.",
    time: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    title: "System Performance Alert",
    description: "Database latency spiked above 250ms on node-1b.",
    time: "10 mins ago",
    read: false,
  },
  {
    id: "3",
    title: "Billing Invoice Paid",
    description: "Invoice #1092-B has been paid by Client BaseKit.",
    time: "1 hour ago",
    read: true,
  },
];

interface MessageItem {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  unread: boolean;
}

const initialMessages: MessageItem[] = [
  {
    id: "m1",
    sender: "Dr. Emily Watson",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&h=100&q=80",
    text: "Luna's vaccination checkup report is ready for download.",
    time: "5m ago",
    unread: true,
  },
  {
    id: "m2",
    sender: "Max (Pet Shelter)",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
    text: "Thanks for inquiring about adoption for Golden Retriever pups!",
    time: "1h ago",
    unread: true,
  },
  {
    id: "m3",
    sender: "Jessica Alba",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    text: "See you at the weekend pet meetup!",
    time: "3h ago",
    unread: false,
  },
];

const navLinks = [
  { label: "Guides", href: "/", icon: BookOpen },
];

const mobileDrawerLinks = [
  { label: "Guides", href: "/", icon: BookOpen },
  { label: "Feed", href: "/feed", icon: Rss },
  { label: "Community", href: "/community", icon: Users },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Adoption", href: "/adoption", icon: HeartHandshake },
  { label: "Shelter", href: "/shelter", icon: Building2 },
];

export default function PublicNavbar() {
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [messages] = useState<MessageItem[]>(initialMessages);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const [isHomePopoverOpen, setIsHomePopoverOpen] = useState(false);
  const homePopoverRef = useRef<HTMLDivElement>(null);
  const homeButtonRef = useRef<HTMLButtonElement>(null);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const unreadMsgCount = messages.filter((m) => m.unread).length;

  const markNotifAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotifsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(target)) {
        setIsMessagesOpen(false);
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

        {/* Search Bar - Fluid responsive */}
        <div className="hidden md:flex flex-1 min-w-[140px] max-w-xs xl:max-w-sm h-10 lg:h-11 flex-row gap-2.5 px-3.5 lg:px-4 justify-start items-center bg-surface-muted rounded-full mx-1.5 lg:mx-3 border border-transparent focus-within:border-coral/40 transition-all">
          <div className="size-4 shrink-0 relative overflow-hidden flex items-center justify-center">
            <Search className="size-3.5 text-ink-faint" />
          </div>
          <input
            type="text"
            placeholder="Search pets, posts, guides, people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs lg:text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-1 text-ink-muted hover:text-ink cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
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
                setIsMessagesOpen(false);
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
                    {unreadNotifCount}
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
                    <div className="p-6 text-center text-xs text-ink-faint">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "p-3.5 hover:bg-surface-muted transition-colors flex gap-3 items-start",
                          !n.read && "bg-coral-light/50"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-ink truncate">{n.title}</p>
                          <p className="text-xs text-ink-muted mt-0.5">{n.description}</p>
                          <span className="text-[10px] text-ink-faint mt-1 block">{n.time}</span>
                        </div>
                        {!n.read && (
                          <button
                            onClick={() => markNotifAsRead(n.id)}
                            className="text-coral p-1 hover:bg-coral-light rounded-full shrink-0 cursor-pointer"
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

          {/* Message Circle Button - hidden on narrow phones, accessible on sm+ */}
          <div className="relative h-full hidden sm:flex items-center" ref={messagesRef}>
            <button
              onClick={() => {
                setIsMessagesOpen(!isMessagesOpen);
                setIsNotifOpen(false);
              }}
              className="size-9 sm:size-10 shrink-0 flex flex-row justify-center items-center bg-coral-light/50 hover:bg-coral-light rounded-lg relative cursor-pointer border-border-peach border focus:outline-none transition-colors"
              aria-label="Toggle messages"
            >
              <div className="size-5 relative overflow-hidden flex items-center justify-center">
                <MessageSquare className="size-4.5 sm:size-5 text-coral stroke-[2]" />
              </div>
              {unreadMsgCount > 0 && (
                <div className="size-4 sm:size-5 absolute -top-1.5 -right-1.5 sm:left-6 sm:-top-2 flex flex-row justify-center items-center bg-coral rounded-full z-10 ring-2 ring-card">
                  <span className="text-[9px] sm:text-[10px] text-white font-bold whitespace-nowrap">
                    {unreadMsgCount}
                  </span>
                </div>
              )}
            </button>

            {/* Messages Dropdown */}
            {isMessagesOpen && (
              <div className="fixed md:absolute left-3 right-3 md:left-auto md:right-0 top-16 sm:top-20 md:top-full mt-[2px] w-auto md:w-88 bg-popover border border-border-peach rounded-lg z-50 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border-peach bg-surface-muted/50">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider">
                    Messages
                  </span>
                  <span className="text-xs text-coral font-bold bg-coral-light px-2 py-0.5 rounded-full">
                    {unreadMsgCount} Unread
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-border-peach">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "p-3.5 hover:bg-surface-muted transition-colors flex gap-3 items-center cursor-pointer",
                        m.unread && "bg-coral-light/50"
                      )}
                    >
                      <div className="size-9 rounded-full overflow-hidden shrink-0 border border-border-peach">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.avatar} alt={m.sender} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="text-xs font-bold text-ink truncate">{m.sender}</p>
                          <span className="text-[10px] text-ink-faint shrink-0">{m.time}</span>
                        </div>
                        <p className="text-xs text-ink-muted truncate mt-0.5">{m.text}</p>
                      </div>
                    </div>
                  ))}
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
            <div className="flex items-center gap-2 h-10 px-3 bg-surface-muted rounded-full border border-border-peach/70">
              <Search className="size-4 text-ink-faint shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search pets, posts, guides, people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="text-xs font-bold text-coral px-1 hover:underline cursor-pointer shrink-0"
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
            className="fixed bottom-[4.25rem] inset-x-2.5 sm:inset-x-4 z-50 bg-popover border border-border-peach shadow-2xl rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-200 overflow-hidden"
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
                  (item.href === "/" && item.label === "Guides" && (pathname === "/" || pathname.startsWith("/guides")));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsHomePopoverOpen(false)}
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
            </div>
          </div>
        )}

        <div className="relative z-50 w-full max-w-full bg-card border-t border-border-peach h-16 pb-[env(safe-area-inset-bottom,0px)] grid grid-cols-5 items-center px-0.5 sm:px-2 shadow-lg">
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
        </div>
      </div>
    </>
  );
}
