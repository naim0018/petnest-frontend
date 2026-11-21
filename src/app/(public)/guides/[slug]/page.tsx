import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  ArrowLeft,
  User,
  Calendar,
  CheckCircle2,
  BookOpen,
  HeartHandshake,
  Eye,
  ChevronRight,
} from "lucide-react";
import { getGuideBySlug, guidesData } from "@/lib/data/petnest-data";
import CommonWrapper from "@/components/common/CommonWrapper";
import ReusableFAQ, { FAQItem } from "@/components/common/ReusableFAQ";
import LocalizedGuideArticle from "@/components/public/guides/LocalizedGuideArticle";
import type { GuideTranslationsMap } from "@/store/Api/Guides/guides.types";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export interface RelatedGuideItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  readTimeMinutes?: number;
  category?: { id: string; name: string; slug: string } | null;
  species?: { id: string; name: string; slug: string } | null;
  publishedAt?: string;
  viewCount?: number;
}

export interface GuideViewData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  faqImage?: string | null;
  category: string;
  species?: { id: string; name: string; slug: string } | null;
  breeds?: { id: string; name: string; slug?: string }[];
  author: string;
  readTime: string;
  publishedAt: string;
  viewCount?: number;
  keyTakeaways: string[];
  faqs: FAQItem[];
  translations?: GuideTranslationsMap | null;
}

export interface GuideDetailResult {
  guide: GuideViewData;
  relatedGuides: RelatedGuideItem[];
}

function getGuideFaqMascot(guide: GuideViewData): string {
  if (guide.faqImage && guide.faqImage.trim().length > 0) {
    return guide.faqImage;
  }
  const s = (
    guide.species?.slug ||
    guide.species?.name ||
    guide.category ||
    ""
  ).toLowerCase();

  if (s.includes("dog") || s.includes("canine") || s.includes("puppy")) {
    return "/CareGuideCard/dog-faq-mascot.png";
  }
  if (s.includes("cat") || s.includes("feline") || s.includes("kitten")) {
    return "/CareGuideCard/cat-faq-mascot.png";
  }
  if (s.includes("fish") || s.includes("aquatic") || s.includes("marine")) {
    return "/CareGuideCard/aquatic-faq-mascot.png";
  }
  if (
    s.includes("small") ||
    s.includes("hamster") ||
    s.includes("rabbit") ||
    s.includes("guinea")
  ) {
    return "/CareGuideCard/hamster-faq-mascot.png";
  }
  if (
    s.includes("reptile") ||
    s.includes("lizard") ||
    s.includes("snake") ||
    s.includes("turtle")
  ) {
    return "/CareGuideCard/reptile-faq-mascot.png";
  }
  // Default for birds / avian
  return "/CareGuideCard/budgie-faq-mascot.png";
}

async function getGuide(slug: string): Promise<GuideDetailResult | null> {
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${apiBase}/guides/${encodeURIComponent(cleanSlug)}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      const live = json?.data?.guide;
      const rawRelated = json?.data?.relatedGuides || [];

      if (live) {
        let relatedGuides: RelatedGuideItem[] = rawRelated.map((r: any) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          excerpt: r.excerpt || "",
          coverImage: r.coverImage || "/CareGuideCard/budgie-faq-mascot.png",
          readTimeMinutes: r.readTimeMinutes || 5,
          category: r.category
            ? { id: r.category.id, name: r.category.name, slug: r.category.slug }
            : null,
          species: r.species
            ? { id: r.species.id, name: r.species.name, slug: r.species.slug }
            : null,
          publishedAt: r.publishedAt
            ? new Date(r.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : undefined,
          viewCount: r.viewCount,
        }));

        // If related guides not returned in main payload, fallback to dedicated related endpoint
        if (relatedGuides.length === 0) {
          try {
            const relRes = await fetch(
              `${apiBase}/guides/${encodeURIComponent(cleanSlug)}/related?limit=4`,
              { cache: "no-store" }
            );
            if (relRes.ok) {
              const relJson = await relRes.json();
              const items = relJson?.data || [];
              relatedGuides = items.map((r: any) => ({
                id: r.id,
                title: r.title,
                slug: r.slug,
                excerpt: r.excerpt || "",
                coverImage: r.coverImage || "/CareGuideCard/budgie-faq-mascot.png",
                readTimeMinutes: r.readTimeMinutes || 5,
                category: r.category
                  ? { id: r.category.id, name: r.category.name, slug: r.category.slug }
                  : null,
                species: r.species
                  ? { id: r.species.id, name: r.species.name, slug: r.species.slug }
                  : null,
                publishedAt: r.publishedAt
                  ? new Date(r.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : undefined,
                viewCount: r.viewCount,
              }));
            }
          } catch {
            // Optional related fallback
          }
        }

        return {
          guide: {
            id: live.id,
            title: live.title,
            slug: live.slug,
            excerpt: live.excerpt || "",
            content: live.content || "",
            image: live.coverImage || "/CareGuideCard/budgie-care-guide-bg.png",
            faqImage: live.faqImage || null,
            category: live.category?.name || "General Care",
            species: live.species
              ? {
                  id: live.species.id,
                  name: live.species.name,
                  slug: live.species.slug,
                }
              : null,
            breeds: live.breeds || [],
            author: live.author?.name || "Editorial Team",
            readTime: `${live.readTimeMinutes || 5} min read`,
            viewCount: live.viewCount,
            publishedAt: live.publishedAt
              ? new Date(live.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Recently Published",
            keyTakeaways: live.keyTakeaways || [],
            faqs: (live.faqs || []).map(
              (f: { id: string; question: string; answer: string }) => ({
                id: f.id,
                question: f.question,
                answer: f.answer,
              })
            ),
            translations: live.translations || null,
          },
          relatedGuides,
        };
      }
    }
  } catch {
    // Fall back to static dataset if backend is unreachable
  }

  const fallback = await getGuideBySlug(cleanSlug);
  if (!fallback) return null;

  const fallbackRelated: RelatedGuideItem[] = guidesData
    .filter((g) => g.slug !== fallback.slug)
    .slice(0, 4)
    .map((g) => ({
      id: g.id,
      title: g.title,
      slug: g.slug,
      excerpt: g.excerpt,
      coverImage: g.image,
      readTimeMinutes: parseInt(g.readTime, 10) || 5,
      category: {
        id: g.category,
        name: g.category,
        slug: g.category.toLowerCase().replace(/\s+/g, "-"),
      },
      publishedAt: g.publishedAt,
    }));

  return {
    guide: {
      id: fallback.id,
      title: fallback.title,
      slug: fallback.slug,
      excerpt: fallback.excerpt,
      content: fallback.content,
      image: fallback.image,
      faqImage: null,
      category: fallback.category,
      species: null,
      breeds: [],
      author: fallback.author,
      readTime: fallback.readTime,
      publishedAt: fallback.publishedAt,
      keyTakeaways: [],
      faqs: [],
    },
    relatedGuides: fallbackRelated,
  };
}

export async function generateStaticParams() {
  return guidesData.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getGuide(slug);

  if (!result || !result.guide) {
    return { title: "Guide Not Found - PetNest" };
  }

  const { guide } = result;

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
  const result = await getGuide(slug);

  if (!result || !result.guide) {
    notFound();
  }

  const { guide, relatedGuides } = result;
  const faqMascot = getGuideFaqMascot(guide);

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
    <CommonWrapper className="py-6 sm:py-8 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main 3-Column Responsive Layout: Left Promotional Spacer, Middle Article, Right Related Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
        {/* ======================================================== */}
        {/* 📢 LEFT COLUMN: PROMOTIONAL / SPONSOR SPACE (Free for now)*/}
        {/* ======================================================== */}
        <aside
          className="hidden lg:block lg:col-span-3 w-full space-y-6"
          aria-label="Promotional space"
        >
          {/* Reserved space for promotional content */}
        </aside>

        {/* ======================================================== */}
        {/* 📖 MAIN ARTICLE COLUMN (Middle: 6 Cols)                 */}
        {/* ======================================================== */}
        <div className="col-span-1 lg:col-span-6 space-y-8 min-w-0 w-full">
          <nav aria-label="Breadcrumb">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-xs font-bold text-coral hover:underline font-quicksand group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Guides</span>
            </Link>
          </nav>

          <article className="space-y-6">
            <header className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-ink-faint font-semibold">
                <span className="text-coral bg-coral/10 px-3 py-1 rounded-full border border-coral/20 font-bold">
                  {guide.category}
                </span>
                {guide.species && (
                  <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 font-bold">
                    {guide.species.name}
                  </span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-coral" /> {guide.readTime}
                </span>
                {guide.viewCount !== undefined && guide.viewCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-ink-muted">
                      <Eye className="w-3.5 h-3.5" /> {guide.viewCount} views
                    </span>
                  </>
                )}
              </div>
            </header>

            {/* Localized Article Presentation (handles Title, Author, Cover, Key Takeaways, Excerpt, Content) */}
            <LocalizedGuideArticle
              defaultTitle={guide.title}
              defaultExcerpt={guide.excerpt}
              defaultContent={guide.content}
              defaultKeyTakeaways={guide.keyTakeaways}
              translations={guide.translations}
              author={guide.author}
              publishedAt={guide.publishedAt}
              coverImage={guide.image}
            />

            {/* Dedicated Guide FAQs */}
            {guide.faqs && guide.faqs.length > 0 && (
              <section className="pt-8 border-t border-border-peach">
                <ReusableFAQ
                  title="Frequently Asked Questions"
                  subtitle={`Common questions & answers about ${guide.title}`}
                  items={guide.faqs}
                  mascotImage={faqMascot}
                  mascotAlt={`${guide.category} FAQ Mascot`}
                  viewAllHref="/community"
                  viewAllText="Ask a question in community"
                />
              </section>
            )}
          </article>
        </div>

        {/* ======================================================== */}
        {/* 🧭 RIGHT SIDEBAR: RELATED GUIDES & WIDGETS (Right: 3 Cols)*/}
        {/* ======================================================== */}
        <aside className="col-span-1 lg:col-span-3 w-full space-y-6 lg:sticky lg:top-24">
          {/* Related Guides Card */}
          <div className="rounded-lg border border-border-peach p-4 sm:p-5 xl:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-peach">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-coral/10 text-coral">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-quicksand font-bold text-sm sm:text-base text-ink">
                    Related Guides
                  </h3>
                  <p className="text-[11px] text-ink-muted">
                    {guide.category ? `More in ${guide.category}` : "Recommended for you"}
                  </p>
                </div>
              </div>
            </div>

            {relatedGuides.length > 0 ? (
              <div className="space-y-3.5">
                {relatedGuides.map((item) => (
                  <Link
                    key={item.id}
                    href={`/guides/${item.slug}`}
                    className="group flex items-start gap-3 p-2 rounded-lg hover:bg-surface-muted/60 transition-colors border border-transparent hover:border-border-peach/60"
                  >
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-surface-muted border border-border-peach/80">
                      <Image
                        src={item.coverImage || "/CareGuideCard/budgie-faq-mascot.png"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      {item.category && (
                        <span className="inline-block text-[10px] font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-full">
                          {item.category.name}
                        </span>
                      )}
                      <h4 className="font-quicksand font-bold text-xs sm:text-sm text-ink group-hover:text-coral transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      {item.excerpt && (
                        <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                          {item.excerpt.replace(/<[^>]+>/g, "").trim()}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-ink-faint pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-coral" />
                          {item.readTimeMinutes || 5} min
                        </span>
                        {item.viewCount !== undefined && item.viewCount > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-ink-muted" />
                              {item.viewCount}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-ink-muted italic">
                No related guides found in this category yet.
              </div>
            )}

            <div className="pt-2 border-t border-border-peach">
              <Link
                href="/guides"
                className="flex items-center justify-between text-xs font-bold text-coral hover:text-coral-dark font-quicksand group transition-colors"
              >
                <span>Explore All Guides</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Community & Expert Support Card */}
          <div className="rounded-lg border border-coral/20 bg-linear-to-br from-coral-light/50 to-surface-muted p-5 space-y-3">
            <div className="flex items-center gap-2 text-coral">
              <HeartHandshake className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider font-quicksand">
                Need Help?
              </span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Connect with fellow pet parents, ask veterinary questions, or share your own care experience.
            </p>
            <Link
              href="/community"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-coral hover:bg-coral-dark text-white text-xs font-bold transition-colors shadow-xs font-quicksand"
            >
              Ask the Community
            </Link>
          </div>
        </aside>
      </div>
    </CommonWrapper>
  );
}
