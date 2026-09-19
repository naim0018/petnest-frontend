"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserProfile from "@/components/common/UserProfile";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import Logo from "@/components/common/Logo";
import {
  Bell,
  Check,
  CheckCheck,
  Home,
  X,
  Rss,
  MessageSquare,
  Users,
  BookOpen,
  ShoppingBag,
  HeartHandshake,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  { label: "Feed", href: "/", icon: Rss },
  { label: "Community", href: "/community", icon: Users },
  { label: "Guides", href: "/guides", icon: BookOpen },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Adoption", href: "/adoption", icon: HeartHandshake },
  { label: "Shelter", href: "/shelter", icon: Building2 },
];

export default function PublicNavbar() {
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [messages] = useState<MessageItem[]>(initialMessages);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const [isHomePopoverOpen, setIsHomePopoverOpen] = useState(false);
  const homePopoverRef = useRef<HTMLDivElement>(null);

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
      if (homePopoverRef.current && !homePopoverRef.current.contains(target)) {
        setIsHomePopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Header Navbar - Matching Pencil Spec */}
      <nav className="w-full h-20 shrink-0 flex flex-row px-4 xl:px-15 justify-between items-center border-b border-border-peach sticky top-0 z-40 transition-colors bg-card">

        {/* Logo Group */}
        <Link href="/" className="no-underline shrink-0">
          <Logo />
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex w-80 shrink-0 h-11 flex-row gap-2.5 px-4 justify-start items-center bg-surface-muted rounded-full">
          <div className="size-4.5 shrink-0 relative overflow-hidden flex items-center justify-center">
            <svg
              viewBox="0 0 18 18"
              className="size-3.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.66016 13.66016l4.34 4.34m-10.00016-2.00016c4.41828 0 8-3.58172 8-8m-16 0c0 4.41828 3.58172 8 8 8m0-16c-4.41828 0-8 3.58172-8 8m16 0c0-4.41828-3.58172-8-8-8"
                className="stroke-ink-faint"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search pets, posts, guides, people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>

        {/* Nav Tabs */}
        <div className="hidden lg:flex flex-row gap-1.5 justify-start items-center shrink-0">
          {navLinks.map((link) => {
            const LinkIcon = link.icon;
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href + "/"));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "w-32 py-2.5 px-3 flex flex-row gap-2 justify-center items-center rounded-full no-underline transition-all duration-200 shrink-0",
                  active
                    ? "bg-coral text-white shadow-sm"
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
        <div className="flex flex-row gap-4 xl:gap-6 justify-start items-center shrink-0">

          {/* Notification Bell Button */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsMessagesOpen(false);
              }}
              className="size-10 shrink-0 flex flex-row justify-center items-center bg-coral-light rounded-lg relative cursor-pointer border border-border-peach focus:outline-none"
              aria-label="Toggle notifications"
            >
              <div className="size-5 relative overflow-hidden flex items-center justify-center">
                <Bell className="w-5 h-5 text-coral stroke-[2]" />
              </div>
              {unreadNotifCount > 0 && (
                <div className="size-5 absolute left-6 -top-2 flex flex-row justify-center items-center bg-coral rounded-full z-10">
                  <span className="text-[10px] text-white font-bold whitespace-nowrap">
                    {unreadNotifCount}
                  </span>
                </div>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="fixed md:absolute left-3 right-3 md:left-auto md:right-0 mt-5.5 top-20 md:top-full w-auto md:w-88 bg-popover border border-border-peach rounded-2xl z-50 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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

          {/* Message Circle Button */}
          <div className="relative" ref={messagesRef}>
            <button
              onClick={() => {
                setIsMessagesOpen(!isMessagesOpen);
                setIsNotifOpen(false);
              }}
              className="size-10 shrink-0 flex flex-row justify-center items-center bg-coral-light rounded-lg relative cursor-pointer border-border-peach border  focus:outline-none"
              aria-label="Toggle messages"
            >
              <div className="size-5 relative overflow-hidden flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-coral stroke-[2]" />
              </div>
              {unreadMsgCount > 0 && (
                <div className="size-5 absolute left-6 -top-2 flex flex-row justify-center items-center bg-coral rounded-full z-10">
                  <span className="text-[10px] text-white font-bold whitespace-nowrap">
                    {unreadMsgCount}
                  </span>
                </div>
              )}
            </button>

            {/* Messages Dropdown */}
            {isMessagesOpen && (
              <div className="fixed md:absolute left-3 right-3 md:left-auto md:right-0 mt-5.5 top-20 md:top-full w-auto md:w-88 bg-popover border border-border-peach rounded-2xl z-50 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile */}
          <UserProfile />
        </div>
      </nav>

      {/* Bottom Mobile Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[9999]">
        {/* Drawer Backdrop Overlay */}
        {isHomePopoverOpen && (
          <div
            onClick={() => setIsHomePopoverOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[9998] animate-in fade-in duration-200"
          />
        )}

        {/* Mobile Navigation Drawer Popover */}
        {isHomePopoverOpen && (
          <div
            ref={homePopoverRef}
            className="fixed bottom-20 left-3 right-3 z-[9999] bg-popover/95 backdrop-blur-xl border border-border-peach shadow-2xl rounded-xl p-4 animate-in fade-in slide-in-from-bottom-5 duration-200 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-border-peach">
              <span className="text-xs font-bold text-ink uppercase tracking-wider">
                PetNest Menu
              </span>
              <button
                onClick={() => setIsHomePopoverOpen(false)}
                className="p-1 text-ink-faint hover:text-ink rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {navLinks.map((item) => {
                const ItemIcon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsHomePopoverOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-2xl no-underline transition-all duration-200 border",
                      active
                        ? "bg-coral-light border-coral/30 text-coral font-bold"
                        : "bg-surface-muted border-border-peach text-ink"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-xl flex items-center justify-center shrink-0",
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

        <div className="bg-card/90 backdrop-blur-xl border-t border-border-peach h-16 flex items-center justify-around px-2 shadow-lg">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 no-underline transition-colors",
              pathname === "/" ? "text-coral font-bold" : "text-ink-muted hover:text-coral"
            )}
          >
            <Rss className="w-5 h-5 mb-0.5" />
            <span className="text-xs tracking-tight font-medium">Feed</span>
          </Link>

          <Link
            href="/community"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 no-underline transition-colors",
              pathname === "/community" ? "text-coral font-bold" : "text-ink-muted hover:text-coral"
            )}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-xs tracking-tight font-medium">Community</span>
          </Link>

          {/* Center Floating Home FAB */}
          <div className="relative -mt-6 flex-1 flex justify-center">
            <button
              onClick={() => setIsHomePopoverOpen(!isHomePopoverOpen)}
              className={cn(
                "size-13 bg-coral text-white rounded-full flex items-center justify-center shadow-lg shadow-coral/40 hover:shadow-coral/60 active:scale-95 transition-all border-4 border-card cursor-pointer",
                isHomePopoverOpen && "rotate-45"
              )}
              aria-label="Open home menu"
            >
              <Home className="w-6 h-6" />
            </button>
          </div>

          <Link
            href="/marketplace"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 no-underline transition-colors",
              pathname === "/marketplace" ? "text-coral font-bold" : "text-ink-muted hover:text-coral"
            )}
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            <span className="text-xs tracking-tight font-medium">Marketplace</span>
          </Link>

          <Link
            href="/adoption"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 no-underline transition-colors",
              pathname === "/adoption" ? "text-coral font-bold" : "text-ink-muted hover:text-coral"
            )}
          >
            <HeartHandshake className="w-5 h-5 mb-0.5" />
            <span className="text-xs tracking-tight font-medium">Adoption</span>
          </Link>
        </div>
      </div>
    </>
  );
}
