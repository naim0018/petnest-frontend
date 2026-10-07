import { Metadata } from "next";
import CommonWrapper from "@/components/common/CommonWrapper";
import MarketplaceExplorer from "./_components/MarketplaceExplorer";
import { MARKETPLACE_ITEMS } from "./_components/marketplaceData";

export const metadata: Metadata = {
  title: "Pet Marketplace - Pet Supplies, Cages & Accessories | PetNest",
  description: "Browse cages, accessories, bird food, toys, and pet supplies in Dhaka and nationwide on PetNest Marketplace.",
  alternates: {
    canonical: "https://petnest.org/marketplace",
  },
  openGraph: {
    title: "Pet Marketplace - PetNest",
    description: "Browse cages, accessories, bird food, toys, and pet supplies.",
    url: "https://petnest.org/marketplace",
    siteName: "PetNest",
    type: "website",
  },
};

export default function MarketplacePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PetNest Marketplace Listings",
    itemListElement: MARKETPLACE_ITEMS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.title,
        image: item.image,
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: "BDT",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <CommonWrapper className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Marketplace Explorer (Left Sidebar Filters + Right Products Grid) */}
      <MarketplaceExplorer />
    </CommonWrapper>
  );
}
