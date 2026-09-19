import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { getGuides } from "@/lib/data/petnest-data";
import CommonWrapper from "@/components/common/CommonWrapper";
import GuidesBanner from "./_components/GuidesBanner";
import GuidesInteractiveExplorer from "./_components/GuidesInteractiveExplorer";

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Banner */}
      <GuidesBanner />

      <CommonWrapper className="space-y-8">
        {/* Pet Category Selector & Dynamic Care Guide Card */}
        <GuidesInteractiveExplorer />

        
      </CommonWrapper>
    </>
  );
}

