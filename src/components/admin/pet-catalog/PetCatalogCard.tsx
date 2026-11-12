"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PawPrint,
  Heart,
  MapPin,
  Feather,
  ArrowRight,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";
import { cn } from "@/lib/utils";

/**
 * Configuration props for `PetCatalogCard`.
 * Supports both Pet Species (taxonomy categories) and Pet Breeds.
 */
export interface PetCatalogCardProps {
  /** Primary name of the pet species or breed (e.g., "Golden Retriever", "Dogs") */
  name: string;

  /** Photo or mascot illustration URL. Falls back to default mascot when omitted. */
  image?: string | null;

  /** Target route when the card title or banner image is clicked (e.g. `/admin/pet-catalog/dogs`) */
  linkHref?: string;

  /** Text displayed inside the frosted top-left badge (e.g., "7 Breeds", "High Care") */
  badgeText?: string;

  /** Icon displayed beside `badgeText`. Defaults to a heart icon. */
  badgeIcon?: ReactNode;

  /** Subtitle text (e.g., country of origin "Scotland, UK" or taxonomy class "Canis lupus") */
  subtitle?: string;

  /** Icon displayed beside `subtitle`. Defaults to `<MapPin />`. */
  subtitleIcon?: ReactNode;

  /** Whether to render `subtitle` in italics (typically for scientific binomial names). */
  subtitleItalic?: boolean;

  /** Pill badge text on the top right (e.g., size "Large", or classification "Species"). */
  pillText?: string;

  /** Icon displayed inside the top-right pill badge. Defaults to `<Feather />`. */
  pillIcon?: ReactNode;

  /** Short descriptive summary or temperament excerpt. Truncated to 2 lines. */
  description?: string | null;

  /** Optional secondary navigation link displayed on the right of the description row (e.g., "Browse Breeds (12) ->"). */
  secondaryLink?: {
    href: string;
    label: string;
  };

  /** Array of keyword tags (e.g., ["friendly", "active"]). Displays up to 3 tags + counter. */
  tags?: string[];

  /** Status label prefix for the metadata bar. Defaults to "Status". */
  statusLabel?: string;

  /** Status value for the metadata bar (e.g., "Active", "Verified"). Defaults to "Active". */
  statusValue?: string;

  /** Tailwind text color class for `statusValue`. Defaults to "text-emerald-600". */
  statusColor?: string;

  /** Secondary metadata text on the right of the status bar. Defaults to "Loved by Pet Lovers". */
  metaText?: string;

  /** Icon displayed beside `metaText`. Defaults to `<Heart />`. */
  metaIcon?: ReactNode;

  /** Triggered when the "Read More" link beneath the description is clicked. */
  onReadMore?: () => void;

  /** Triggered when the outline "Details" action button is clicked. */
  onDetails?: () => void;

  /** Triggered when the primary "Edit" action button is clicked. */
  onEdit?: () => void;

  /** Triggered when the red trash icon button is clicked. */
  onDelete?: () => void;

  /** Accessibility label and tooltip for the delete action button. Defaults to "Delete". */
  deleteTooltip?: string;

  /** Optional outer container class overrides. */
  className?: string;
}

/**
 * PetCatalogCard
 *
 * Reusable card component for PetNest Admin catalog grids.
 * Used on both:
 * 1. Pet Types Catalog Page (`/admin/pet-catalog`)
 * 2. Breed Catalog Page (`/admin/pet-catalog/[typeId]`)
 *
 * Design features:
 * - Top image/mascot banner with decorative paw watermarks and frosted badge.
 * - PetNest signature organic double wavy cut transition at the bottom of the photo.
 * - Strict fixed-height slots (Slot 1 to 5) ensuring cards stay perfectly aligned
 *   in a multi-column responsive grid regardless of variable text lengths.
 */
export default function PetCatalogCard({
  name,
  image,
  linkHref,
  badgeText,
  badgeIcon = <Heart className="size-3.5 fill-coral text-coral" />,
  subtitle,
  subtitleIcon = <MapPin className="size-3.5 text-coral shrink-0 not-italic" />,
  subtitleItalic = false,
  pillText,
  pillIcon = <Feather className="size-3 text-coral" />,
  description,
  secondaryLink,
  tags,
  statusLabel = "Status",
  statusValue = "Active",
  statusColor = "text-emerald-600",
  metaText = "Loved by Pet Lovers",
  metaIcon = <Heart className="size-3.5 text-coral fill-coral/30" />,
  onReadMore,
  onDetails,
  onEdit,
  onDelete,
  deleteTooltip = "Delete",
  className,
}: PetCatalogCardProps) {
  // Detect whether image is an illustration/mascot to apply object-contain vs object-cover
  const isMascot = !image || image.includes("mascot");

  // ========================================================
  // 🖼️ TOP BANNER: Photo / Mascot with Organic Wavy Cut
  // ========================================================
  const imageBanner = (
    <div className="relative h-48 sm:h-52 w-full shrink-0">
      {/* 1. Inner wrapper with overflow-hidden to clip the scaling photo */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-rose-50/80 via-orange-50/40 to-tint-rose/50 dark:from-tint-rose/20 dark:via-surface-soft dark:to-surface-muted flex items-center justify-center">
        <Image
          src={image || "/CareGuideCard/dog-faq-mascot.png"}
          alt={name}
          fill
          className={
            isMascot
              ? "object-contain p-4 drop-shadow-md group-hover/card:scale-105 transition-transform duration-300"
              : "object-cover group-hover/card:scale-105 transition-transform duration-500"
          }
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Top-left Frosted Badge with Care Level or Breed Count */}
        {badgeText && (
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-xs text-xs font-bold text-coral border border-coral/20">
              {badgeIcon}
              {badgeText}
            </span>
          </div>
        )}
      </div>

      {/* 2. Wave Cut: Placed OUTSIDE the overflow-hidden wrapper, overlapping 10px into the card body */}
      <div className="absolute -bottom-2.5 left-0 right-0 w-full pointer-events-none z-10 leading-none">
        <svg
          viewBox="0 0 500 90"
          preserveAspectRatio="none"
          className="w-full h-14 block"
        >
          {/* Accent wave crest layer in soft brand pink */}
          <path
            d="M0,20 C130,2 270,42 500,14 L500,90 L0,90 Z"
            fill="#FFE2DD"
            className="dark:fill-coral/25"
          />
          {/* Accent curve stroke line */}
          <path
            d="M0,20 C130,2 270,42 500,14"
            fill="none"
            stroke="#FB7185"
            strokeWidth="2.5"
            strokeOpacity="0.6"
          />
          {/* Foreground card body transition - deep solid fill matching card surface */}
          <path
            d="M0,30 C140,10 290,50 500,24 L500,90 L0,90 Z"
            className="fill-card"
          />
        </svg>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "bg-card border border-border-peach/90 hover:border-coral/60 rounded-lg overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group/card hover:-translate-y-1 relative transform-gpu",
        className
      )}
    >
      {/* Banner Area (Wrapped in Link if linkHref is specified) */}
      {linkHref ? (
        <Link href={linkHref} className="block relative">
          {imageBanner}
        </Link>
      ) : (
        imageBanner
      )}

      {/* ======================================================== */}
      {/* 📋 CARD BODY: Fixed-Height Vertical Slots Alignment      */}
      {/* ======================================================== */}
      <div className="p-4 pt-1 -mt-2 relative z-20 flex-1 flex flex-col">
        {/* SLOT 1: Header (Title, Subtitle / Taxonomy, Size or Type Pill) */}
        <div
          className={cn(
            "flex items-start justify-between gap-2 shrink-0",
            (subtitle || pillText) ? "min-h-[2.75rem]" : "min-h-0"
          )}
        >
          <div className="min-w-0 flex-1">
            <h4 className="text-lg font-bold font-quicksand text-ink tracking-tight truncate group-hover/card:text-coral transition-colors">
              {linkHref ? <Link href={linkHref}>{name}</Link> : name}
            </h4>
            {subtitle && (
              <p
                className={cn(
                  "text-xs text-ink-muted flex items-center gap-1 mt-0.5 font-medium truncate",
                  subtitleItalic && "italic"
                )}
              >
                {subtitleIcon}
                <span className="truncate">{subtitle}</span>
              </p>
            )}
          </div>

          {pillText && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tint-rose text-coral font-bold text-xs shrink-0 border border-coral/15">
              {pillIcon}
              {pillText}
            </span>
          )}
        </div>

        {/* SLOT 2: Description + Read More / Secondary Link - Fixed height h-14 */}
        <div
          className={cn(
            "h-16 flex flex-col justify-between shrink-0",
            (subtitle || pillText) ? "mt-2" : "mt-1.5"
          )}
        >
          <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed">
            {description || "Care overview and companion profiles across PetNest."}
          </p>
          <div className="flex items-center justify-between pt-0.5">
            {onReadMore ? (
              <button
                type="button"
                onClick={onReadMore}
                className="text-xs font-bold text-coral hover:text-coral-dark inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                Read More <ArrowRight className="size-3" />
              </button>
            ) : (
              <span />
            )}

            {secondaryLink && (
              <Link
                href={secondaryLink.href}
                className="text-xs font-bold text-ink-muted hover:text-coral inline-flex items-center gap-1 transition-colors ml-auto"
              >
                {secondaryLink.label} <ArrowRight className="size-3" />
              </Link>
            )}
          </div>
        </div>

        {/* SLOT 3: Tags & Keywords (Only rendered when tags exist) */}
        {tags && tags.length > 0 && (
          <div className="h-7 mt-2 flex items-center gap-1.5 shrink-0 overflow-hidden">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full bg-tint-rose text-coral text-xs font-semibold border border-coral/15 truncate"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full bg-tint-rose/80 text-coral text-xs font-bold border border-coral/15 shrink-0">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* SLOT 4: Status & Metadata Bar - Fixed height h-9 */}
        <div className="h-9 mt-2.5 px-3 rounded-md bg-tint-rose/40 border border-border-peach/80 flex items-center justify-between text-xs font-medium shrink-0">
          <span className="flex items-center gap-1.5 font-bold text-ink shrink-0">
            {statusLabel}: <span className={cn("font-bold", statusColor)}>{statusValue}</span>
          </span>
          <span className="text-border-peach mx-1">|</span>
          <span className="flex items-center gap-1.5 text-ink-muted font-medium min-w-0">
            {metaIcon}
            <span className="truncate">{metaText}</span>
          </span>
        </div>

        {/* SLOT 5: Bottom Action Toolbar - Pinned to bottom with mt-auto */}
        <div className="mt-auto pt-3 border-t border-border-peach/50 flex items-center gap-2 shrink-0">
          {onDetails && (
            <PrimaryButton
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-9 font-bold"
              onClick={onDetails}
              leftIcon={<Eye className="size-3.5 text-coral" />}
            >
              Details
            </PrimaryButton>
          )}

          {onEdit && (
            <PrimaryButton
              variant="primary"
              size="sm"
              className="flex-1 text-xs h-9 font-bold"
              onClick={onEdit}
              leftIcon={<Pencil className="size-3.5" />}
            >
              Edit
            </PrimaryButton>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              title={deleteTooltip}
              aria-label={deleteTooltip}
              className="size-9 rounded-full border border-red-200 hover:border-destructive bg-card hover:bg-rose-50 dark:hover:bg-rose-950/30 text-destructive flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
