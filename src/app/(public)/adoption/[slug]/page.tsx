import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ArrowLeft, HeartHandshake } from "lucide-react";
import { getAdoptablePetBySlug, adoptablePetsData } from "@/lib/data/petnest-data";
import CommonWrapper from "@/components/common/CommonWrapper";
import PrimaryButton from "@/components/common/PrimaryButton";

interface AdoptionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return adoptablePetsData.map((pet) => ({ slug: pet.slug }));
}

export async function generateMetadata({ params }: AdoptionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pet = await getAdoptablePetBySlug(slug);

  if (!pet) {
    return { title: "Pet Not Found - PetNest" };
  }

  return {
    title: `Adopt ${pet.name} - ${pet.breed} | PetNest Adoption`,
    description: `Meet ${pet.name}, a ${pet.age} ${pet.gender} ${pet.breed} currently available for adoption at ${pet.shelterName} in ${pet.location}.`,
    alternates: {
      canonical: `https://petnest.org/adoption/${pet.slug}`,
    },
    openGraph: {
      title: `Adopt ${pet.name} (${pet.breed})`,
      description: pet.description,
      url: `https://petnest.org/adoption/${pet.slug}`,
      siteName: "PetNest Adoption",
      images: [{ url: pet.image }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Adopt ${pet.name} - ${pet.breed}`,
      description: pet.description,
      images: [pet.image],
    },
  };
}

export default async function AdoptionDetailPage({ params }: AdoptionPageProps) {
  const { slug } = await params;
  const pet = await getAdoptablePetBySlug(slug);

  if (!pet) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: `Adopt ${pet.name}`,
    description: pet.description,
    image: pet.image,
    mainEntity: {
      "@type": "Product",
      name: pet.name,
      category: pet.species,
      description: pet.description,
      image: pet.image,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
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
          href="/adoption"
          className="inline-flex items-center gap-2 text-xs font-bold text-coral hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Adoptable Pets
        </Link>
      </nav>

      <article className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card border border-border-peach rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="relative h-80 md:h-full min-h-[300px] rounded-xl overflow-hidden bg-surface-muted border border-border-peach shadow-xs">
          <Image
            src={pet.image}
            alt={`${pet.name} - ${pet.breed}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>

        <div className="space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-coral bg-coral-light px-3 py-1 rounded-full border border-coral/20">
                  {pet.species} • {pet.gender}
                </span>
                <h1 className="text-3xl font-bold text-ink mt-2 font-quicksand">{pet.name}</h1>
                <p className="text-sm font-semibold text-ink-muted">{pet.breed} ({pet.age})</p>
              </div>
            </div>

            <p className="text-xs text-ink-faint flex items-center gap-1">
              <MapPin className="w-4 h-4 text-coral" /> {pet.location}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {pet.traits.map((t) => (
                <span key={t} className="text-xs font-semibold bg-surface-muted text-ink px-3 py-1 rounded-lg border border-border-peach">
                  ✓ {t}
                </span>
              ))}
            </div>

            <p className="text-xs text-ink leading-relaxed pt-2 border-t border-border-peach">
              {pet.description}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-border-peach">
            <div className="flex items-center justify-between text-xs text-ink-muted font-semibold bg-surface-muted p-3 rounded-xl border border-border-peach">
              <span>Shelter Partner:</span>
              <span className="text-ink font-bold">{pet.shelterName}</span>
            </div>

            <PrimaryButton
              variant="primary"
              size="lg"
              fullWidth
              className="rounded-full"
              leftIcon={<HeartHandshake className="w-4 h-4" />}
            >
              Submit Adoption Application
            </PrimaryButton>
          </div>
        </div>
      </article>
    </CommonWrapper>
  );
}
