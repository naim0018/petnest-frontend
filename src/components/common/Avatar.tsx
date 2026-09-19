"use client";

import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/common/Tooltip";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type AvatarRing = "none" | "gradient" | "solid" | "seen";
export type AvatarBadgeType = "plus" | "online" | "offline" | "busy" | React.ReactNode;

export interface AvatarProps {
  src?: string;
  name: string;
  alt?: string;
  size?: AvatarSize;
  ring?: AvatarRing | boolean;
  badge?: AvatarBadgeType;
  badgePosition?: "bottom-right" | "top-right" | "bottom-left" | "top-left";
  onBadgeClick?: (e: React.MouseEvent) => void;
  title?: string | boolean;
  titleIcon?: React.ReactNode;
  titlePosition?: "bottom" | "right";
  titleClassName?: string;
  interactive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  imageClassName?: string;
}

const sizeConfig: Record<
  AvatarSize,
  {
    avatar: string;
    ringPadding: string;
    ringBorder: string;
    badge: string;
    plusIcon: string;
    titleText: string;
    titleGap: string;
    pxSize: number;
  }
> = {
  xs: {
    avatar: "h-6 w-6 text-[10px]",
    ringPadding: "p-0.5",
    ringBorder: "border",
    badge: "h-2.5 w-2.5",
    plusIcon: "h-2 w-2 stroke-[3]",
    titleText: "text-xs font-semibold",
    titleGap: "gap-1 mt-1",
    pxSize: 24,
  },
  sm: {
    avatar: "h-8 w-8 text-xs",
    ringPadding: "p-0.5",
    ringBorder: "border-2",
    badge: "h-3 w-3",
    plusIcon: "h-2.5 w-2.5 stroke-[3]",
    titleText: "text-xs font-semibold",
    titleGap: "gap-1 mt-1.5",
    pxSize: 32,
  },
  md: {
    avatar: "h-10 w-10 text-sm",
    ringPadding: "p-[2.5px]",
    ringBorder: "border-2",
    badge: "h-4 w-4",
    plusIcon: "h-2.5 w-2.5 stroke-[3]",
    titleText: "text-xs font-bold",
    titleGap: "gap-1.5 mt-1.5",
    pxSize: 40,
  },
  lg: {
    avatar: "h-14 w-14 text-base",
    ringPadding: "p-[3px]",
    ringBorder: "border-2",
    badge: "h-5 w-5",
    plusIcon: "h-3.5 w-3.5 stroke-[3]",
    titleText: "text-sm font-bold",
    titleGap: "gap-1.5 mt-2",
    pxSize: 56,
  },
  xl: {
    avatar: "h-20 w-20 text-xl",
    ringPadding: "p-1",
    ringBorder: "border-3",
    badge: "h-7 w-7",
    plusIcon: "h-4 w-4 stroke-[3]",
    titleText: "text-base font-bold",
    titleGap: "gap-2 mt-2.5",
    pxSize: 80,
  },
  "2xl": {
    avatar: "h-24 w-24 text-2xl",
    ringPadding: "p-1.5",
    ringBorder: "border-4",
    badge: "h-8 w-8",
    plusIcon: "h-5 w-5 stroke-[3]",
    titleText: "text-lg font-bold",
    titleGap: "gap-2.5 mt-3",
    pxSize: 96,
  },
  "3xl": {
    avatar: "h-28 w-28 sm:h-32 sm:w-32 text-3xl",
    ringPadding: "p-1.5 sm:p-2",
    ringBorder: "border-4",
    badge: "h-9 w-9",
    plusIcon: "h-5 w-5 stroke-[3]",
    titleText: "text-base sm:text-lg font-bold",
    titleGap: "gap-2.5 mt-3",
    pxSize: 128,
  },
};

const badgePositionClasses: Record<string, string> = {
  "bottom-right": "bottom-0 right-0 translate-x-[15%] translate-y-[15%]",
  "top-right": "top-0 right-0 translate-x-[15%] -translate-y-[15%]",
  "bottom-left": "bottom-0 left-0 -translate-x-[15%] translate-y-[15%]",
  "top-left": "top-0 left-0 -translate-x-[15%] -translate-y-[15%]",
};

export const Avatar = ({
  src,
  name,
  alt,
  size = "lg",
  ring = "none",
  badge,
  badgePosition = "bottom-right",
  onBadgeClick,
  title,
  titleIcon,
  titlePosition = "bottom",
  titleClassName,
  interactive = false,
  onClick,
  className,
  imageClassName,
}: AvatarProps) => {
  const config = sizeConfig[size] || sizeConfig.lg;

  // Initials calculation
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  // Resolve ring style
  const ringStyle: AvatarRing =
    typeof ring === "boolean" ? (ring ? "gradient" : "none") : ring;

  const isGradientRing = ringStyle === "gradient";
  const isSolidRing = ringStyle === "solid";
  const isSeenRing = ringStyle === "seen";

  // Display title text
  const displayTitle = typeof title === "boolean" ? (title ? name : undefined) : title;

  // Render Badge
  const renderBadge = () => {
    if (!badge) return null;

    const baseBadgeClasses = cn(
      "absolute z-10 inline-flex items-center justify-center rounded-full ring-2 ring-background transition-transform",
      config.badge,
      badgePositionClasses[badgePosition]
    );

    if (badge === "plus") {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBadgeClick?.(e);
          }}
          className={cn(
            baseBadgeClasses,
            "bg-[#ff6b6b] text-white hover:bg-[#e85c5c] active:scale-90 cursor-pointer shadow-xs"
          )}
          aria-label="Add story"
        >
          <Plus className={config.plusIcon} />
        </button>
      );
    }

    if (badge === "online") {
      return <span className={cn(baseBadgeClasses, "bg-emerald-500")} />;
    }

    if (badge === "offline") {
      return <span className={cn(baseBadgeClasses, "bg-slate-400")} />;
    }

    if (badge === "busy") {
      return <span className={cn(baseBadgeClasses, "bg-rose-500")} />;
    }

    // Custom React Node badge
    return <div className={baseBadgeClasses}>{badge}</div>;
  };

  // Main Avatar Core Element
  const avatarCore = (
    <div
      onClick={displayTitle ? undefined : onClick}
      className="relative inline-flex shrink-0 select-none"
    >
      {/* Outer Ring Wrapper */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full transition-all duration-200",
          config.ringPadding,
          isGradientRing
            ? "bg-linear-to-br from-[#ff6b6b] to-[#ffe66d]"
            : isSolidRing
            ? cn("border-border-peach dark:border-slate-700 bg-background", config.ringBorder)
            : isSeenRing
            ? "bg-muted-foreground/30"
            : "bg-transparent",
          className
        )}
      >
        {/* Photo Container with white inner separator */}
        <div
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold transition-all font-quicksand",
            config.avatar,
            src ? "bg-muted" : "bg-primary/10 text-primary dark:bg-primary/20",
            isGradientRing ? "border-2 border-white shadow-2xs" : "border-2 border-transparent",
            imageClassName
          )}
        >
          {src ? (
            <Image
              src={src}
              alt={alt || name}
              width={config.pxSize}
              height={config.pxSize}
              className={cn(
                "h-full w-full object-cover transition-transform duration-200",
                interactive && "group-hover:scale-110"
              )}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      </div>

      {/* Render Badge Overlay */}
      {renderBadge()}
    </div>
  );

  // If no title is provided, return just the avatar core
  if (!displayTitle) {
    return avatarCore;
  }

  // Render Avatar with Title (Bottom or Right)
  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center group",
        titlePosition === "bottom" ? "flex-col justify-center text-center" : "flex-row gap-3",
        interactive && "cursor-pointer"
      )}
    >
      {avatarCore}

      {/* Title Container */}
      <div
        className={cn(
          "inline-flex items-center gap-1.5 text-foreground font-quicksand leading-tight select-none",
          titlePosition === "bottom" && config.titleGap,
          titleClassName
        )}
      >
        <span className={cn(config.titleText, "truncate")}>{displayTitle}</span>
        {titleIcon && <span className="shrink-0 flex items-center">{titleIcon}</span>}
      </div>
    </div>
  );
};

/* Component: AvatarStack */
export interface AvatarStackProps {
  users: { src?: string; name: string }[];
  limit?: number;
  size?: AvatarSize;
  className?: string;
}

export const AvatarStack = ({
  users = [],
  limit = 3,
  size = "lg",
  className,
}: AvatarStackProps) => {
  const displayUsers = users.slice(0, limit);
  const remaining = users.length - limit;

  return (
    <div className={cn("inline-flex items-center -space-x-3", className)}>
      {displayUsers.map((user, idx) => (
        <Tooltip key={idx} content={user.name} className="z-[110]">
          <Avatar
            src={user.src}
            name={user.name}
            size={size}
            interactive
            className="ring-2 ring-background hover:z-10 transition-transform"
          />
        </Tooltip>
      ))}
      {remaining > 0 && (
        <Tooltip content={users.slice(limit).map((u) => u.name).join(", ")} className="z-[110]">
          <Avatar
            name={`+${remaining}`}
            size={size}
            className="bg-secondary/80 border-2 border-background text-secondary-foreground font-bold z-0"
          />
        </Tooltip>
      )}
    </div>
  );
};

export default Avatar;
