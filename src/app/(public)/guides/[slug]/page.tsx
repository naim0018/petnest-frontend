import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, User, Calendar, CheckCircle2 } from "lucide-react";
import { getGuideBySlug, guidesData } from "@/lib/data/petnest-data";
import CommonWrapper from "@/components/common/CommonWrapper";
import ReusableFAQ, { FAQItem } from "@/components/common/ReusableFAQ";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

interface GuideViewData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  faqImage?: string | null;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  keyTakeaways: string[];
  faqs: FAQItem[];
}

async function getGuide(slug: string): Promise<GuideViewData | null> {
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${apiBase}/guides/${encodeURIComponent(cleanSlug)}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      const live = json?.data?.guide;
      if (live) {
        return {
          id: live.id,
          title: live.title,
          slug: live.slug,
          excerpt: live.excerpt || "",
          content: live.content || "",
          image: live.coverImage || "/CareGuideCard/dog-faq-mascot.png",
          faqImage: live.faqImage || null,
          category: live.category?.name || "General Care",
          author: live.author?.name || "Editorial Team",
          readTime: `${live.readTimeMinutes || 5} min read`,
          publishedAt: live.publishedAt
            ? new Date(live.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Recently Published",
          keyTakeaways: live.keyTakeaways || [],
          faqs: (live.faqs || []).map((f: { id: string; question: string; answer: string }) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
          })),
        };
      }
    }
  } catch {
    // Fall back to static dataset if backend is unreachable
  }

  const fallback = await getGuideBySlug(cleanSlug);
  if (!fallback) return null;

  return {
    id: fallback.id,
    title: fallback.title,
    slug: fallback.slug,
    excerpt: fallback.excerpt,
    content: fallback.content,
    image: fallback.image,
    faqImage: null,
    category: fallback.category,
    author: fallback.author,
    readTime: fallback.readTime,
    publishedAt: fallback.publishedAt,
    keyTakeaways: [],
    faqs: [],
  };
}

export async function generateStaticParams() {
  return guidesData.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    return { title: "Guide Not Found - PetNest" };
  }

  return {
    title: `${guide.title} | PetNest Guides`,
    description: guide.excerpt,
    alternates: {
      canonical: `https://petnest.org/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      url: `https://petnest.org/guides/${guide.slug}`,
      siteName: "PetNest",
      images: [{ url: guide.image }],
      type: "article",
      publishedTime: guide.publishedAt,
      authors: [guide.author],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.excerpt,
      images: [guide.image],
    },
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    image: guide.image,
    datePublished: guide.publishedAt,
    author: {
      "@type": "Person",
      name: guide.author,
    },
    publisher: {
      "@type": "Organization",
      name: "PetNest",
      logo: {
        "@type": "ImageObject",
        url: "https://petnest.org/icon.png",
      },
    },
  };

  return (
    <CommonWrapper className="max-w-4xl space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb">
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-xs font-bold text-coral hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Guides
        </Link>
      </nav>

      <article className="space-y-6">
        <header className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-ink-faint font-semibold">
            <span className="text-coral bg-coral-light px-2.5 py-1 rounded-full border border-coral/20">
              {guide.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-coral" /> {guide.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-ink leading-tight font-quicksand">
            {guide.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-ink-muted pt-2 border-t border-border-peach">
            <span className="flex items-center gap-1.5 font-semibold">
              <User className="w-4 h-4 text-coral" /> {guide.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-coral" /> {guide.publishedAt}
            </span>
          </div>
        </header>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-muted border border-border-peach shadow-xs">
          <Image
            src={guide.image}
            alt={guide.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>

        {/* Key Takeaways summary callout */}
        {guide.keyTakeaways && guide.keyTakeaways.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-tint-mint/50 border border-success/30 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-success flex items-center gap-1.5">
              <CheckCircle2 className="size-4" /> Key Takeaways
            </h2>
            <ul className="space-y-1.5 text-xs sm:text-sm text-ink">
              {guide.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-success font-bold">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <section className="prose max-w-none text-sm text-ink leading-relaxed space-y-4 pt-4 border-t border-border-peach">
          <p className="text-base font-semibold text-ink-muted">{guide.excerpt}</p>
          <div className="whitespace-pre-line leading-relaxed text-ink">
            {guide.content}
          </div>
        </section>

        {/* Dedicated Guide FAQs */}
        {guide.faqs && guide.faqs.length > 0 && (
          <section className="pt-6 border-t border-border-peach">
            <ReusableFAQ
              title="Frequently Asked Questions"
              subtitle={`Common questions & answers about ${guide.title}`}
              items={guide.faqs}
              mascotImage={guide.faqImage || guide.image || undefined}
            />
          </section>
        )}
      </article>
    </CommonWrapper>
  );
}
