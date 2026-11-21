"use client";

import React from "react";
import Image from "next/image";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import { ArticleContentRenderer } from "@/components/admin/guides/RichTextEditor";
import { Sparkles, CheckCircle2, User, Calendar } from "lucide-react";
import type { GuideTranslationsMap } from "@/store/Api/Guides/guides.types";

export interface LocalizedGuideArticleProps {
  defaultTitle: string;
  defaultExcerpt?: string;
  defaultContent: string;
  defaultKeyTakeaways?: string[];
  translations?: GuideTranslationsMap | null;
  author: string;
  publishedAt: string;
  coverImage?: string;
}

export default function LocalizedGuideArticle({
  defaultTitle,
  defaultExcerpt,
  defaultContent,
  defaultKeyTakeaways,
  translations,
  author,
  publishedAt,
  coverImage,
}: LocalizedGuideArticleProps) {
  const currentLang = useCurrentLanguage();

  const isBangla = currentLang === "bn";
  const nativeVariant = isBangla ? translations?.bn : null;
  const hasNativeContent = Boolean(
    nativeVariant &&
      (nativeVariant.title?.trim() || nativeVariant.content?.trim())
  );

  const title =
    hasNativeContent && nativeVariant?.title?.trim()
      ? nativeVariant.title
      : defaultTitle;
  const excerpt =
    hasNativeContent && nativeVariant?.excerpt?.trim()
      ? nativeVariant.excerpt
      : defaultExcerpt;
  const content =
    hasNativeContent && nativeVariant?.content?.trim()
      ? nativeVariant.content
      : defaultContent;
  const keyTakeaways =
    hasNativeContent &&
    nativeVariant?.keyTakeaways &&
    nativeVariant.keyTakeaways.length > 0
      ? nativeVariant.keyTakeaways
      : defaultKeyTakeaways;

  return (
    <div
      className={hasNativeContent ? "notranslate space-y-6" : "space-y-6"}
      translate={hasNativeContent ? "no" : undefined}
    >
      {/* Native Bangla Badge */}
      {hasNativeContent && isBangla && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-quicksand select-none shadow-2xs">
          <Sparkles className="size-3.5 text-emerald-500" />
          <span>অনুমোদিত বাংলা সংস্করণ (Curated Native Bangla)</span>
        </div>
      )}

      {/* Article Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink leading-tight font-quicksand">
        {title}
      </h1>

      {/* Author & Published Date Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted pt-3 border-t border-border-peach">
        <span className="flex items-center gap-1.5 font-semibold">
          <User className="w-4 h-4 text-coral" /> {author}
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-coral" /> {publishedAt}
        </span>
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
            <CheckCircle2 className="size-4.5" /> Key Takeaways
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
