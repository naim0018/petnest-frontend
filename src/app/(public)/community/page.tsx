import { Metadata } from "next";
import CommonWrapper from "@/components/common/CommonWrapper";
import { PetTopicsWidget } from "./_components/PetTopicsWidget";
import { CommunityBanner } from "./_components/CommunityBanner";
import { CommunityFeedSection } from "./_components/CommunityFeedSection";
import { CommunityStatsWidget } from "./_components/CommunityStatsWidget";
import { CommunityTrendingWidget } from "./_components/CommunityTrendingWidget";
import { FeaturedMembersWidget } from "./_components/FeaturedMembersWidget";
import { JoinConversationCard } from "./_components/JoinConversationCard";
import { COMMUNITY_POSTS } from "./_components/communityData";

export const metadata: Metadata = {
  title: "Pet Community - Ask, Share & Connect | PetNest",
  description: "Connect with pet lovers, ask veterinary questions, share pet moments, and explore trending pet topics nationwide.",
  alternates: {
    canonical: "https://petnest.org/community",
  },
  openGraph: {
    title: "Pet Community & Pet Lovers - PetNest",
    description: "Ask, share, and connect with pet lovers.",
    url: "https://petnest.org/community",
    siteName: "PetNest",
    type: "website",
  },
};

export default function CommunityPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "PetNest Community",
    description: "Ask, share, and connect with pet lovers.",
    url: "https://petnest.org/community",
  };

  return (
    <CommonWrapper className="py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 3-COLUMN RESPONSIVE LAYOUT (3 - 10 - 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-16 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Pet Topics (3 cols) - Sticky to top         */}
        {/* ======================================================== */}
        <aside className="col-span-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-none space-y-6">
          <PetTopicsWidget />
        </aside>

        {/* ======================================================== */}
        {/* MIDDLE COLUMN: Community Banner & Feed Posts (10 cols)   */}
        {/* ======================================================== */}
        <main className="col-span-1 lg:col-span-10 space-y-6">
          <CommunityBanner />
          <CommunityFeedSection posts={COMMUNITY_POSTS} />
        </main>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Stats, Trending, Members, CTA (3 cols)     */}
        {/* ======================================================== */}
        <aside className="col-span-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-none space-y-6">
          <CommunityStatsWidget />
          <CommunityTrendingWidget />
          <FeaturedMembersWidget />
          <JoinConversationCard />
        </aside>
      </div>
    </CommonWrapper>
  );
}

