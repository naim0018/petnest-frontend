import Image from "next/image";
import Link from "next/link";
import { Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import PrimaryButton from "@/components/common/PrimaryButton";

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
  image: "/CareGuideCard/budgie-care-guide-bg.png",
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
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1200px"
          priority
        />

        {/* Seamless gradient overlay ensuring text on left is fully legible and seamlessly blends into the pet image on the right */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            guide.blendOverlayClass ||
            "bg-linear-to-r from-[#f0fbf5] via-[#f0fbf5]/95 via-40% sm:via-[#f0fbf5]/80 sm:via-50% md:via-[#f0fbf5]/60 md:via-55% to-transparent"
          )}
        />

        {/* Subtle top & bottom edge softening */}
        <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-[#f0fbf5]/50 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#f0fbf5]/50 to-transparent pointer-events-none" />
      </div>

      {/* Foreground Content Container */}
      <div className="relative z-20 w-full p-6 sm:p-10 lg:p-14 max-w-2xl flex flex-col justify-between space-y-6">
        {/* Badge */}
        {badgeText && (
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#ffeec2] text-[#9b6600] dark:bg-[#332e18] dark:text-[#ffe08a] border border-amber-300/40 dark:border-amber-400/20 shadow-2xs font-quicksand">
              {badgeIcon && <span>{badgeIcon}</span>}
              <span>{badgeText}</span>
            </span>
          </div>
        )}

        {/* Headline & Description */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink font-quicksand leading-tight tracking-tight drop-shadow-2xs max-w-md">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl font-medium">
            {description}
          </p>
        </div>

        {/* Meta Info (Read time & Expert Reviewed) */}
        <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm font-semibold text-ink-muted pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="size-5 text-emerald-600 dark:text-emerald-400" />
            <span>{readTime}</span>
          </div>

          {expertReviewed && (
            <div className="flex items-center gap-1.5">
              <span className="flex items-center justify-center text-white">
                <ShieldCheck className="size-5 stroke-[2.5] text-emerald-600 dark:text-emerald-400" />
              </span>
              <span className="text-emerald-700 dark:text-emerald-400">Expert Reviewed</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Link href={href} className="inline-block">
            <PrimaryButton
              variant="primary"
              size="md"
              title={ctaText}
              rightIcon={<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
              className="font-quicksand font-bold shadow-sm"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
