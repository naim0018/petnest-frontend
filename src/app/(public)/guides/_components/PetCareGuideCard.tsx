import Image from "next/image";
import Link from "next/link";
import { Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PetCareGuideCardData {
  badgeText?: string;
  badgeIcon?: string; // e.g. "👑"
  title: string;
  description: string;
  readTime: string;
  expertReviewed?: boolean;
  ctaText?: string;
  href: string;
  image: string;
  imageAlt?: string;
  slogan?: string;
  heartIcon?: boolean;
  // Gradient / theme accent classes
  bgGradient?: string;
  bubbleColor?: string;
  blendOverlayClass?: string;
}

export interface PetCareGuideCardProps {
  guide?: PetCareGuideCardData;
  className?: string;
}

export const DEFAULT_BUDGIE_GUIDE: PetCareGuideCardData = {
  badgeText: "Start Here",
  badgeIcon: "👑",
  title: "The Complete Budgie Care Guide",
  description:
    "Everything you need to know to give your budgie a healthy, happy life. From housing and diet to training and health care.",
  readTime: "12 min read",
  expertReviewed: true,
  ctaText: "Read Full Guide",
  href: "/guides/budgie-care-guide",
  image: "/CareGuide/budgier.png",
  imageAlt: "Pet blue budgie perched on a branch",
  slogan: "Happy budgies brighter homes",
  heartIcon: true,
  bgGradient: "bg-linear-to-r from-[#eef9f2] via-[#e5f5ed] to-[#d8efe5]",
  bubbleColor: "bg-[#c6ebd7]/60",
};

export default function PetCareGuideCard({
  guide = DEFAULT_BUDGIE_GUIDE,
  className,
}: PetCareGuideCardProps) {
  const {
    badgeText = "Start Here",
    badgeIcon = "👑",
    title,
    description,
    readTime,
    expertReviewed = true,
    ctaText = "Read Full Guide",
    href,
    image,
    imageAlt,
    slogan,
    heartIcon = true,
    bgGradient = "bg-linear-to-r from-[#eef9f2] via-[#e5f5ed] to-[#d8efe5]",
    bubbleColor = "bg-[#c6ebd7]/60",
  } = guide;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-emerald-900/10 shadow-sm transition-all duration-300 min-h-[380px] sm:min-h-[420px] flex items-center",
        bgGradient,
        className
      )}
    >
      {/* Decorative organic background bubble */}
      <div
        className={cn(
          "absolute -bottom-16 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-80 z-10",
          bubbleColor
        )}
      />

      {/* FULL CARD BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          className="object-cover object-[78%_center] sm:object-right"
          sizes="(max-width: 1280px) 100vw, 1200px"
          priority
        />

        {/* Seamless gradient overlay ensuring text on left is fully legible and seamlessly blends into the image */}
        <div className="absolute inset-0 bg-linear-to-r from-[#f0fbf5] via-[#f0fbf5]/95 via-45% sm:via-[#f0fbf5]/85 sm:via-55% to-transparent pointer-events-none" />

        {/* Subtle top & bottom edge softening */}
        <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-[#f0fbf5]/50 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#f0fbf5]/50 to-transparent pointer-events-none" />
      </div>

      {/* Foreground Content Container */}
      <div className="relative z-20 w-full p-6 sm:p-10 lg:p-14 max-w-2xl flex flex-col justify-between space-y-6">
        {/* Badge */}
        {badgeText && (
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#ffeec2] text-[#9b6600] shadow-2xs font-quicksand">
              {badgeIcon && <span>{badgeIcon}</span>}
              <span>{badgeText}</span>
            </span>
          </div>
        )}

        {/* Headline & Description */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1a2e26] font-quicksand leading-tight tracking-tight drop-shadow-2xs">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-[#395e4e] leading-relaxed max-w-xl font-medium">
            {description}
          </p>
        </div>

        {/* Meta Info (Read time & Expert Reviewed) */}
        <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm font-semibold text-[#305946] pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#2b7956]" />
            <span>{readTime}</span>
          </div>

          {expertReviewed && (
            <div className="flex items-center gap-1.5">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#1b8a5a] text-white">
                <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
              </span>
              <span className="text-[#1b8a5a]">Expert Reviewed</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Link
            href={href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff6b6b] hover:bg-[#e85c5c] active:scale-[0.98] text-white font-quicksand font-bold text-sm sm:text-base transition-all duration-200 shadow-sm group cursor-pointer"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Slogan & Heart watermark overlay (Top right) */}
      {slogan && (
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 text-right select-none pointer-events-none drop-shadow-xs">
          <p className="font-handwriting font-bold text-sm sm:text-base text-[#1c4535] tracking-wide leading-tight italic bg-white/75 backdrop-blur-xs px-3 py-1 rounded-full border border-white/60 shadow-2xs">
            {slogan}
          </p>
          {heartIcon && (
            <div className="flex justify-end pt-1 pr-2">
              <svg
                className="w-5 h-5 text-[#1c4535]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
