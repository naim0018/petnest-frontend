"use client";

import React from "react";
import ReusableFAQ, { FAQItem } from "@/components/common/ReusableFAQ";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import type { GuideTranslationsMap } from "@/store/Api/Guides/guides.types";

export interface LocalizedGuideFaqProps {
  defaultTitle?: string;
  defaultSubtitle?: string;
  defaultItems: FAQItem[];
  translations?: GuideTranslationsMap | null;
  guideTitle: string;
  categoryName?: string;
  mascotImage?: string;
  mascotAlt?: string;
  viewAllHref?: string;
}

export default function LocalizedGuideFaq({
  defaultTitle = "Frequently Asked Questions",
  defaultSubtitle,
  defaultItems,
  translations,
  guideTitle,
  categoryName,
  mascotImage,
  mascotAlt,
  viewAllHref = "/community",
}: LocalizedGuideFaqProps) {
  const currentLang = useCurrentLanguage();
  const isBangla = currentLang === "bn";
  const bnVariant = isBangla ? translations?.bn : null;

  const rawBnFaqs = bnVariant?.faqs;
  const hasBnFaqs = Array.isArray(rawBnFaqs) && rawBnFaqs.length > 0;

  const bnFaqItems: FAQItem[] = hasBnFaqs
    ? rawBnFaqs.map((f, idx) => ({
        id: f.id || `bn-faq-${idx + 1}`,
        question: f.question,
        answer: f.answer,
      }))
    : [];

  const title = hasBnFaqs ? "সাধারণ প্রশ্নোত্তর" : defaultTitle;
  const subtitle = hasBnFaqs
    ? `${bnVariant?.title || guideTitle} সম্পর্কিত সাধারণ প্রশ্নোত্তর`
    : defaultSubtitle || `Common questions & answers about ${guideTitle}`;

  const items = hasBnFaqs ? bnFaqItems : defaultItems;
  const viewAllText = hasBnFaqs
    ? "কমিউনিটিতে প্রশ্ন করুন"
    : "Ask a question in community";

  if (!items || items.length === 0) return null;

  return (
    <ReusableFAQ
      title={title}
      subtitle={subtitle}
      items={items}
      mascotImage={mascotImage}
      mascotAlt={mascotAlt || `${categoryName || "Guide"} FAQ Mascot`}
      viewAllHref={viewAllHref}
      viewAllText={viewAllText}
    />
  );
}
