import { Metadata } from "next";
import Image from "next/image";
import { Users, Calendar, MapPin, Plus } from "lucide-react";
import CommonWrapper from "@/components/common/CommonWrapper";
import PrimaryButton from "@/components/common/PrimaryButton";
import { JoinClubButton } from "./_components/JoinClubButton";

export const metadata: Metadata = {
  title: "Pet Community - Breed Clubs & Local Meetups | PetNest",
  description: "Join local breed clubs, attend neighborhood pet playdates, and connect with pet lovers in your city.",
  alternates: {
    canonical: "https://petnest.org/community",
  },
  openGraph: {
    title: "Pet Community & Breed Clubs - PetNest",
    description: "Join local breed clubs and attend neighborhood pet playdates.",
    url: "https://petnest.org/community",
    siteName: "PetNest",
    type: "website",
  },
};

const clubs = [
  {
    id: "c1",
    name: "Golden Retriever Lovers TX",
    members: 2450,
    category: "Dog Clubs",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80",
    description: "A community for Golden parents in Texas. Weekly park meetups, training tips & playdates!",
    isJoined: true,
  },
  {
    id: "c2",
    name: "Seattle Feline Friends",
    members: 1820,
    category: "Cat Clubs",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80",
    description: "Indoor cat care tips, cat tree DIYs, and rescue support in the Greater Seattle area.",
    isJoined: false,
  },
  {
    id: "c3",
    name: "Austin Paws & Hikes",
    members: 3100,
    category: "Outdoor & Hikes",
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=500&q=80",
    description: "Trail runs, river swims, and pet-friendly camping trips around Austin greenbelts.",
    isJoined: false,
  },
  {
    id: "c4",
    name: "Senior Dogs Appreciation",
    members: 940,
    category: "Dog Clubs",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=500&q=80",
    description: "Sharing love, mobility advice, and care stories for our beloved golden senior pups.",
    isJoined: true,
  },
];

const meetups = [
  {
    id: "m1",
    title: "Zilker Park Sunday Dog Social",
    date: "Sun, Sep 20 • 10:00 AM",
    location: "Zilker Park, Austin, TX",
    attendees: 42,
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "m2",
    title: "Cat Parent Coffee & Q&A with Dr. Vet",
    date: "Sat, Sep 26 • 2:00 PM",
    location: "Meow Cafe, Seattle, WA",
    attendees: 28,
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=300&q=80",
  },
];

export default async function CommunityPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "PetNest Community & Breed Clubs",
    description: "Connect with local pet owners, join breed clubs, and attend pet meetups.",
    url: "https://petnest.org/community",
  };

  return (
    <CommonWrapper className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="space-y-6">
        {/* Header Banner */}
        <header className="bg-coral-light border border-coral/20 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-coral uppercase tracking-wider bg-card px-3 py-1 rounded-full border border-coral/20">
              PETNEST COMMUNITY
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink font-quicksand">Connect with Local Pet Lovers</h1>
            <p className="text-xs sm:text-sm text-ink-muted max-w-lg">
              Join breed clubs, attend neighborhood meetups, and ask advice from experienced pet parents.
            </p>
          </div>
          <PrimaryButton leftIcon={<Plus className="w-4 h-4" />} title="Create New Club" />
        </header>

        {/* Clubs Grid */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-ink uppercase tracking-wider font-quicksand">Popular Breed & Interest Clubs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clubs.map((club) => (
              <article
                key={club.id}
                className="bg-card border border-border-peach rounded-xl p-5 flex gap-4 items-start shadow-xs hover:border-coral/40 transition-all"
              >
                <div className="size-20 rounded-xl overflow-hidden shrink-0 border border-border-peach relative">
                  <Image src={club.image} alt={club.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <h3 className="text-sm font-bold text-ink truncate font-quicksand">{club.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-ink-faint font-semibold mt-0.5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-coral" /> {club.members.toLocaleString()} Members
                      </span>
                      <span>•</span>
                      <span className="text-coral">{club.category}</span>
                    </div>
                  </div>
                  <p className="text-xs text-ink-muted line-clamp-2">{club.description}</p>
                  <JoinClubButton isInitiallyJoined={club.isJoined} />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Upcoming Meetups Section */}
        <section className="bg-card border border-border-peach rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-coral" />
            <h2 className="text-base font-bold text-ink uppercase tracking-wider font-quicksand">Upcoming Local Meetups</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetups.map((m) => (
              <article key={m.id} className="flex gap-4 p-4 rounded-xl bg-surface-muted border border-border-peach items-center">
                <div className="size-16 rounded-xl overflow-hidden shrink-0 relative">
                  <Image src={m.image} alt={m.title} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-xs font-bold text-ink truncate font-quicksand">{m.title}</h3>
                  <p className="text-[11px] font-semibold text-coral">{m.date}</p>
                  <p className="text-[10px] text-ink-faint flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-coral" /> {m.location}
                  </p>
                </div>
                <PrimaryButton size="sm" title={`RSVP (${m.attendees})`} />
              </article>
            ))}
          </div>
        </section>
      </main>
    </CommonWrapper>
  );
}
