"use client";

import React from "react";
import Image from "next/image";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import { ArticleContentRenderer } from "@/components/admin/guides/RichTextEditor";
import { CheckCircle2, User, Calendar, Languages, Clock, Eye } from "lucide-react";
import type { GuideTranslationsMap } from "@/store/Api/Guides/guides.types";

export interface LocalizedGuideArticleProps {
  defaultTitle: string;
  defaultExcerpt?: string;
  defaultContent: string;
  defaultKeyTakeaways?: string[];
  translations?: GuideTranslationsMap | null;
  locale?: string;
  isNativeTranslation?: boolean;
  availableLocales?: string[];
  author: string;
  publishedAt: string;
  coverImage?: string;
  category?: string;
  species?: { id: string; name: string; slug: string } | null;
  readTime?: string;
  viewCount?: number;
}

export default function LocalizedGuideArticle({
  defaultTitle,
  defaultExcerpt,
  defaultContent,
  defaultKeyTakeaways,
  translations,
  locale = "en",
  isNativeTranslation = false,
  availableLocales = ["en"],
  author,
  publishedAt,
  coverImage,
  category,
  species,
  readTime,
  viewCount,
}: LocalizedGuideArticleProps) {
  const currentLang = useCurrentLanguage();

  // If server pre-localized to Bangla or client explicitly switched to Bangla
  const isServerBangla = locale === "bn" && isNativeTranslation;
  const isClientBangla = currentLang === "bn";
  const nativeVariant = translations?.bn;
  const hasClientNative = Boolean(
    nativeVariant &&
      (nativeVariant.title?.trim() || nativeVariant.content?.trim()),
  );

  const isBangla = isServerBangla || (isClientBangla && hasClientNative);
  const hasNativeContent = isServerBangla || hasClientNative;

  const title =
    !isServerBangla && isClientBangla && hasClientNative && nativeVariant?.title?.trim()
      ? nativeVariant.title
      : defaultTitle;
  const excerpt =
    !isServerBangla && isClientBangla && hasClientNative && nativeVariant?.excerpt?.trim()
      ? nativeVariant.excerpt
      : defaultExcerpt;
  const content =
    !isServerBangla && isClientBangla && hasClientNative && nativeVariant?.content?.trim()
      ? nativeVariant.content
      : defaultContent;
  const keyTakeaways =
    !isServerBangla &&
    isClientBangla &&
    hasClientNative &&
    nativeVariant?.keyTakeaways &&
    nativeVariant.keyTakeaways.length > 0
      ? nativeVariant.keyTakeaways
      : defaultKeyTakeaways;

  const hasBothLocales =
    availableLocales.includes("en") && availableLocales.includes("bn");

  const switchLanguage = (target: "en" | "bn") => {
    if (typeof document !== "undefined") {
      const hostname = window.location.hostname;
      document.cookie = `petnest_lang=${target}; path=/; max-age=31536000;`;
      localStorage.setItem("petnest_lang", target);

      if (target === "en") {
        document.cookie =
          "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
      } else {
        const cookieVal = `/en/${target}`;
        document.cookie = `googtrans=${cookieVal}; path=/;`;
        document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname};`;
      }

      // Reload or navigate with ?lang= to fetch fresh server-rendered language
      const url = new URL(window.location.href);
      url.searchParams.set("lang", target);
      window.location.href = url.toString();
    }
  };

  return (
    <div
      className={isBangla ? "notranslate space-y-6" : "space-y-6"}
      translate={isBangla ? "no" : undefined}
    >
      {/* Top Locale Bar: Native Badge & One-Click Dual Language Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {isBangla ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-quicksand select-none shadow-2xs">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            <span>অনুমোদিত বাংলা সংস্করণ (Curated Native Bangla)</span>
          </div>
        ) : (
          <div />
        )}

        {hasBothLocales && (
          <div className="flex items-center gap-2">
            {isBangla ? (
              <button
                type="button"
                onClick={() => switchLanguage("en")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-ink-muted hover:text-coral hover:bg-surface-muted border border-border-peach/80 transition-colors cursor-pointer font-quicksand"
                title="Switch to English version"
              >
                <span>🇺🇸</span>
                <span>Read in English</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchLanguage("bn")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-coral/10 text-coral hover:bg-coral hover:text-white border border-coral/30 transition-all cursor-pointer font-quicksand shadow-2xs"
                title="বাংলায় পড়ুন"
              >
                <span>🇧🇩</span>
                <span>বাংলায় পড়ুন (Curated Bangla)</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Article Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink leading-tight font-quicksand">
        {title}
      </h1>

      {/* Author, Published Date & Tags Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted pt-3 border-t border-border-peach">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-ink">
            <User className="w-3.5 h-3.5 text-coral" /> {author}
          </span>
          <span className="text-ink-faint">•</span>
          <span className="flex items-center gap-1.5 text-ink-muted">
            <Calendar className="w-3.5 h-3.5 text-coral" /> {publishedAt}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {category && (
            <span className="text-coral bg-coral/10 px-2.5 py-0.5 rounded-full border border-coral/20 font-bold text-[11px]">
              {category}
            </span>
          )}
          {species && (
            <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-bold text-[11px]">
              {species.name}
            </span>
          )}
          {readTime && (
            <>
              <span className="text-ink-faint">•</span>
              <span className="flex items-center gap-1 text-ink-muted font-medium">
                <Clock className="w-3.5 h-3.5 text-coral" /> {readTime}
              </span>
            </>
          )}
          {viewCount !== undefined && viewCount > 0 && (
            <>
              <span className="text-ink-faint">•</span>
              <span className="flex items-center gap-1 text-ink-muted">
                <Eye className="w-3.5 h-3.5" /> {viewCount} views
              </span>
            </>
          )}
        </div>
      </div>

      {/* Hero Cover Image */}
      {coverImage && (
        <div className="relative w-full aspect-16/9 rounded-lg overflow-hidden bg-surface-muted border border-border-peach shadow-xs">
          <Image
            src={coverImage}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
        </div>
      )}

      {/* Key Takeaways Callout */}
      {keyTakeaways && keyTakeaways.length > 0 && (
        <div className="p-5 rounded-lg bg-tint-mint/50 border border-success/30 space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-success flex items-center gap-1.5 font-quicksand">
            <CheckCircle2 className="size-4.5" />{" "}
            {isBangla ? "মূল বিষয়সমূহ (Key Takeaways)" : "Key Takeaways"}
          </h2>
          <ul className="space-y-1.5 text-xs sm:text-sm text-ink leading-relaxed">
            {keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-success font-bold mt-0.5">•</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Excerpt */}
      {excerpt && (
        <p className="text-sm sm:text-base font-semibold text-ink-muted leading-relaxed italic bg-surface-muted/50 p-4 rounded-lg border border-border-peach/70">
          {excerpt}
        </p>
      )}

      {/* Rich Markdown / HTML Article Body */}
      <section className="space-y-6 pt-4 border-t border-border-peach">
        <ArticleContentRenderer content={content} />
      </section>
    </div>
  );
}
