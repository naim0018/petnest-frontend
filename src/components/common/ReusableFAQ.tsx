"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ReusableFAQProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  // Background card image (fallback / optional)
  cardImage?: string;
  cardImageAlt?: string;
  // Mascot cutout image displayed on the left under the title (like budgie-faq-mascot.png)
  mascotImage?: string;
  mascotAlt?: string;
  viewAllHref?: string;
  viewAllText?: string;
  bgGradient?: string;
  bubbleColor?: string;
  blendOverlayClass?: string;
  className?: string;
  defaultOpenId?: string | null;
  allowMultiple?: boolean;
}

export default function ReusableFAQ({
  title = "Common Questions",
  subtitle = "Quick answers to help you right away.",
  items,
  cardImage,
  cardImageAlt = "Pet FAQ guide",
  mascotImage = "/CareGuideCard/budgie-faq-mascot.png",
  mascotAlt = "Budgie mascot",
  viewAllHref = "/community",
  viewAllText = "View all questions",
  bgGradient = "bg-[#edf7f2] dark:bg-[#12241b]",
  bubbleColor = "bg-[#c6ebd7]/60 dark:bg-[#1f4230]/40",
  blendOverlayClass,
  className,
  defaultOpenId = null,
  allowMultiple = false,
}: ReusableFAQProps) {
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-emerald-900/10 dark:border-border shadow-xs transition-all duration-300 p-6 sm:p-8 lg:p-10",
        bgGradient,
        className
      )}
    >
      {/* Decorative soft organic bubble behind mascot */}
      <div
        className={cn(
          "absolute -bottom-10 left-10 w-72 h-72 rounded-full blur-2xl pointer-events-none opacity-60 z-0",
          bubbleColor
        )}
      />

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Title + Subtitle + Transparent Mascot Illustration */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
          <div className="space-y-1.5 text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-ink font-quicksand leading-tight tracking-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-medium">
              {subtitle}
            </p>
          </div>

          {/* Mascot Pet Cutout (Budgie / Puppy / Cat / Hamster / Betta / Chameleon) */}
          {mascotImage && (
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 pt-2">
              {/* Soft circular accent background behind mascot */}
              <div className="absolute inset-0 m-auto w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-xs shadow-2xs pointer-events-none" />
              <Image
                src={mascotImage}
                alt={mascotAlt}
                fill
                className="object-contain object-bottom drop-shadow-md select-none transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 640px) 144px, 192px"
              />
            </div>
          )}
        </div>

        {/* Right Column: Interactive Clean Pill FAQ List */}
        <div className="lg:col-span-8 flex flex-col space-y-3.5 w-full">
          <div className="space-y-3">
            {items.map((item) => {
              const isOpen = openIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="rounded-xl sm:rounded-2xl bg-white dark:bg-card shadow-xs border border-border/80 overflow-hidden transition-all duration-200 hover:border-coral/40 hover:shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left transition-colors duration-150 hover:bg-surface-muted/30 group cursor-pointer focus:outline-none"
                  >
                    <span className="font-bold text-sm sm:text-base text-ink font-quicksand group-hover:text-coral transition-colors duration-200">
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="shrink-0 text-ink-muted group-hover:text-coral transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: {
                            height: { duration: 0.26, ease: [0.04, 0.62, 0.23, 0.98] },
                            opacity: { duration: 0.2, delay: 0.05 },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] },
                            opacity: { duration: 0.14 },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-ink-muted leading-relaxed border-t border-border font-medium">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* View All Questions Link */}
          {viewAllHref && (
            <div className="flex justify-end pt-2">
              <Link
                href={viewAllHref}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-coral hover:text-coral-dark transition-colors group cursor-pointer font-quicksand"
              >
                <span>{viewAllText}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
