import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { getGuides } from "@/lib/data/petnest-data";
import CommonWrapper from "@/components/common/CommonWrapper";

export const metadata: Metadata = {
  title: "Pet Care & Health Guides - Vet Approved | PetNest",
  description: "Browse expert pet care articles, puppy vaccination schedules, nutrition guides, and training tips written by certified veterinarians.",
  alternates: {
    canonical: "https://petnest.org/guides",
  },
  openGraph: {
    title: "Pet Care & Health Guides - PetNest",
    description: "Expert pet care articles and training guides.",
    url: "https://petnest.org/guides",
    siteName: "PetNest",
    type: "website",
  },
};

export default async function GuidesPage() {
  const guides = await getGuides();
  const featuredGuide = guides.find((g) => g.featured) || guides[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "PetCare & Health Guides",
    description: "Vet-approved articles on pet care, training, and nutrition.",
    url: "https://petnest.org/guides",
  };

  return (
    <CommonWrapper className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Banner */}
      <header className="bg-coral-light border border-coral/20 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-coral uppercase tracking-wider bg-card px-3 py-1 rounded-full border border-coral/20">
            PETNEST KNOWLEDGE BASE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink font-quicksand">Vet-Approved Pet Care Guides</h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-lg">
            Expert articles on nutrition, behavior, grooming, and health written by certified veterinarians and trainers.
          </p>
        </div>
      </header>

      {/* Featured Hero Guide */}
      {featuredGuide && (
        <article className="bg-card border border-border-peach rounded-xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-64 lg:h-auto min-h-[260px]">
            <Image
              src={featuredGuide.image}
              alt={featuredGuide.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <span className="absolute top-4 left-4 bg-coral text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              Featured Guide
            </span>
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-ink-faint font-semibold">
                <span className="text-coral">{featuredGuide.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-coral" /> {featuredGuide.readTime}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-ink hover:text-coral transition-colors font-quicksand">
                <Link href={`/guides/${featuredGuide.slug}`}>
                  {featuredGuide.title}
                </Link>
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                {featuredGuide.excerpt}
              </p>
            </div>
            <div className="pt-4 border-t border-border-peach flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-faint">By {featuredGuide.author}</span>
              <Link
                href={`/guides/${featuredGuide.slug}`}
                className="flex items-center gap-1 text-xs font-bold text-coral hover:underline"
              >
                <span>Read Article</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* Articles Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-ink uppercase tracking-wider font-quicksand">All Care Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <article
              key={guide.id}
              className="bg-card border border-border-peach rounded-xl overflow-hidden shadow-xs hover:border-coral/40 transition-all flex flex-col"
            >
              <div className="relative h-48 w-full bg-surface-muted">
                <Image
                  src={guide.image}
                  alt={guide.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-xs text-ink text-[10px] font-bold px-2.5 py-1 rounded-full border border-border-peach">
                  {guide.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-ink-faint font-semibold">
                    <Clock className="w-3 h-3 text-coral" />
                    <span>{guide.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-ink line-clamp-2 hover:text-coral transition-colors font-quicksand">
                    <Link href={`/guides/${guide.slug}`}>
                      {guide.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-ink-muted line-clamp-3">{guide.excerpt}</p>
                </div>
                <div className="pt-3 border-t border-border-peach flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-ink-faint truncate">By {guide.author}</span>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="text-xs font-bold text-coral hover:underline shrink-0"
                  >
                    Read →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </CommonWrapper>
  );
}
