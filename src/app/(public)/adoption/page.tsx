import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getAdoptablePets } from "@/lib/data/petnest-data";
import CommonWrapper from "@/components/common/CommonWrapper";

export const metadata: Metadata = {
  title: "Pet Adoption - Find Dogs & Cats Ready for Adoption | PetNest",
  description: "Discover adoptable rescue dogs and cats from verified shelters nationwide. Start your pet adoption application today.",
  alternates: {
    canonical: "https://petnest.org/adoption",
  },
  openGraph: {
    title: "Pet Adoption - PetNest Rescue Platform",
    description: "Discover adoptable rescue dogs and cats from verified shelters nationwide.",
    url: "https://petnest.org/adoption",
    siteName: "PetNest",
    type: "website",
  },
};

export default async function AdoptionPage() {
  const pets = await getAdoptablePets();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Adoptable Pets Directory",
    description: "Browse rescue dogs and cats looking for loving forever homes.",
    url: "https://petnest.org/adoption",
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
            PETNEST ADOPTION
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink font-quicksand">Find Your New Best Friend</h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-lg">
            Thousands of loving rescue dogs and cats are waiting for a warm, safe home. Start your adoption journey today.
          </p>
        </div>
      </header>

      {/* Adoptable Pets Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-ink uppercase tracking-wider font-quicksand">Pets Looking for a Home</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <article
              key={pet.id}
              className="bg-card border border-border-peach rounded-xl overflow-hidden shadow-xs hover:border-coral/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full bg-surface-muted">
                  <Image
                    src={pet.image}
                    alt={`${pet.name} - ${pet.breed}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 250px"
                  />
                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {pet.gender} • {pet.age}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4>
                      <Link href={`/adoption/${pet.slug}`} className="hover:text-coral transition-colors">
                        {pet.name}
                      </Link>
                    </h4>
                    <span className="text-[10px] font-bold text-coral bg-coral-light px-2 py-0.5 rounded-full border border-coral/20">
                      {pet.species}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted font-medium">{pet.breed}</p>
                  <p className="text-[11px] text-ink-faint flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-coral" /> {pet.location}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {pet.traits.map((t) => (
                      <span key={t} className="text-[9px] font-semibold bg-surface-muted text-ink-muted px-2 py-0.5 rounded-md border border-border-peach">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-border-peach mt-2">
                <Link
                  href={`/adoption/${pet.slug}`}
                  className="w-full block text-center py-2 rounded-full bg-coral hover:bg-coral-dark text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Meet {pet.name} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </CommonWrapper>
  );
}
