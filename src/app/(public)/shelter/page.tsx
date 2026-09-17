import { Metadata } from "next";
import Image from "next/image";
import { MapPin, Phone, Mail, ShieldCheck } from "lucide-react";
import { getShelters } from "@/lib/data/petnest-data";
import CommonWrapper from "@/components/common/CommonWrapper";

export const metadata: Metadata = {
  title: "Verified Pet Shelters & Rescue Partners | PetNest",
  description: "Explore verified pet shelters, rescue organizations, and non-profit animal rescue partners nationwide.",
  alternates: {
    canonical: "https://petnest.org/shelter",
  },
  openGraph: {
    title: "Verified Pet Shelters - PetNest",
    description: "Explore verified pet shelters and rescue organizations.",
    url: "https://petnest.org/shelter",
    siteName: "PetNest",
    type: "website",
  },
};

export default async function ShelterPage() {
  const shelters = await getShelters();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PetNest Verified Shelters Directory",
    itemListElement: shelters.map((shelter, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Organization",
        name: shelter.name,
        telephone: shelter.phone,
        email: shelter.email,
        address: shelter.location,
      },
    })),
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
            VERIFIED SHELTER DIRECTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink font-quicksand">Partner Shelters & Rescues</h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-lg">
            We partner with non-profit shelters, rescue organizations, and foster networks to connect adoptable pets with loving homes.
          </p>
        </div>
      </header>

      {/* Stats Counter Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card border border-border-peach rounded-xl p-5 text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-bold text-coral">12,400+</p>
          <p className="text-xs font-semibold text-ink-muted">Animals Rescued & Housed</p>
        </div>
        <div className="bg-card border border-border-peach rounded-xl p-5 text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-bold text-coral">185+</p>
          <p className="text-xs font-semibold text-ink-muted">Verified Shelter Partners</p>
        </div>
        <div className="bg-card border border-border-peach rounded-xl p-5 text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-bold text-coral">98.4%</p>
          <p className="text-xs font-semibold text-ink-muted">Adoption Success Rate</p>
        </div>
      </section>

      {/* Shelters List */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-ink uppercase tracking-wider font-quicksand">Verified Partners</h2>
        <div className="space-y-6">
          {shelters.map((shelter) => (
            <article
              key={shelter.id}
              className="bg-card border border-border-peach rounded-xl overflow-hidden p-6 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-xs hover:border-coral/40 transition-all"
            >
              <div className="size-28 rounded-xl overflow-hidden shrink-0 relative border border-border-peach">
                <Image
                  src={shelter.image}
                  alt={shelter.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-ink font-quicksand">{shelter.name}</h3>
                  {shelter.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-muted flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-coral" /> {shelter.location}
                </p>

                <div className="flex flex-wrap gap-4 pt-1 text-xs text-ink-faint font-semibold">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-coral" /> {shelter.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-coral" /> {shelter.email}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                <div className="bg-coral-light px-4 py-2 rounded-xl text-center border border-coral/20">
                  <span className="text-sm font-bold text-coral">{shelter.availableCount} Pets</span>
                  <span className="text-[10px] text-ink-muted block font-semibold">Ready for Adoption</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </CommonWrapper>
  );
}
