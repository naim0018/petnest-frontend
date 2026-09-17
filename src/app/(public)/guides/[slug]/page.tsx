import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, User, Calendar } from "lucide-react";
import { getGuideBySlug, guidesData } from "@/lib/data/petnest-data";
import CommonWrapper from "@/components/common/CommonWrapper";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guidesData.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

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
  const guide = await getGuideBySlug(slug);

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
        url: "https://petnest.org/basekitfavicon.png",
      },
    },
  };

  return (
    <CommonWrapper className="max-w-4xl space-y-6">
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
            <span className="text-coral bg-coral-light px-2.5 py-1 rounded-full border border-coral/20">{guide.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-coral" /> {guide.readTime}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-ink leading-tight font-quicksand">{guide.title}</h1>
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

        <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-surface-muted border border-border-peach shadow-xs">
          <Image
            src={guide.image}
            alt={guide.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>

        <section className="prose max-w-none text-sm text-ink leading-relaxed space-y-4 pt-4 border-t border-border-peach">
          <p className="text-base font-semibold text-ink-muted">{guide.excerpt}</p>
          <div className="whitespace-pre-line leading-relaxed text-ink">{guide.content}</div>
        </section>
      </article>
    </CommonWrapper>
  );
}
