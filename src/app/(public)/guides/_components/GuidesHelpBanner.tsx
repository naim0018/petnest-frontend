"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Users, Stethoscope } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";
import { cn } from "@/lib/utils";

export interface GuidesHelpBannerProps {
  className?: string;
}

export default function GuidesHelpBanner({ className }: GuidesHelpBannerProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl bg-linear-to-r from-[#fff1eb] via-[#fff4ef] to-[#ffede5] dark:from-[#261b17] dark:via-[#2b1f1a] dark:to-[#33221c] border border-[#ffdcd2]/80 dark:border-border shadow-xs px-6 py-6 sm:px-8 sm:py-7",
        className
      )}
    >
      {/* BACKGROUND PET GROUP IMAGE ON THE RIGHT SIDE */}
      <div className="absolute right-0 bottom-0 top-0 w-full sm:w-2/5 lg:w-[380px] pointer-events-none select-none z-0 overflow-hidden">
        <Image
          src="/CareGuide/help.webp"
          alt="Pets group - We're here to help"
          fill
          className="object-contain object-bottom sm:object-right-bottom opacity-85 sm:opacity-95 dark:opacity-60"
          sizes="(max-width: 640px) 100vw, 380px"
          priority
        />

        {/* Soft gradient fade on the left of the image for seamless background blend */}
        <div className="absolute inset-0 bg-linear-to-r from-[#fff1eb] via-[#fff1eb]/80 sm:via-transparent to-transparent dark:from-[#261b17] dark:via-[#261b17]/90 sm:dark:via-transparent pointer-events-none" />
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10 max-w-full">
        {/* Left: Message Icon + Title + Subtitle */}
        <div className="flex items-center gap-4 text-left max-w-xl">
          <div className="w-12 h-12 rounded-full bg-coral text-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageCircle className="w-6 h-6 fill-white stroke-none" />
          </div>

          <div className="space-y-0.5">
            <h3 className="text-lg sm:text-xl font-extrabold text-ink font-quicksand">
              Can&apos;t find what you&apos;re looking for?
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted font-medium">
              Ask the PetNest community or get advice from a verified expert.
            </p>
          </div>
        </div>

        {/* Right: Reusable Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 shrink-0 lg:pr-32 xl:pr-44">
          {/* Ask the Community */}
          <Link href="/community" className="shrink-0">
            <PrimaryButton
              variant="outline"
                size="lg"
                leftIcon={<Users className="size-5" />}
                className=""
            >
              Ask the Community
            </PrimaryButton>
          </Link>

          {/* Ask an Expert */}
          <Link href="/feed" className="shrink-0">
            <PrimaryButton
              variant="primary"
                size="lg"
                leftIcon={<Stethoscope className="size-5" />}
                className=""
            >
              Ask an Expert
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
