import { Metadata } from "next";
import Image from "next/image";
import { Star } from "lucide-react";
import { getMarketplaceProducts } from "@/lib/data/petnest-data";
import { AddToCartButton } from "./_components/AddToCartButton";
import CommonWrapper from "@/components/common/CommonWrapper";

export const metadata: Metadata = {
  title: "Pet Marketplace - Organic Food, Toys & Accessories | PetNest",
  description: "Shop high quality organic pet food, orthopedic pet beds, interactive cat toys, and vet-approved supplies on PetNest Marketplace.",
  alternates: {
    canonical: "https://petnest.org/marketplace",
  },
  openGraph: {
    title: "Pet Marketplace - PetNest",
    description: "Shop high quality pet food, toys, and supplies.",
    url: "https://petnest.org/marketplace",
    siteName: "PetNest",
    type: "website",
  },
};

export default async function MarketplacePage() {
  const products = await getMarketplaceProducts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PetNest Marketplace Products",
    itemListElement: products.map((prod, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: prod.title,
        image: prod.image,
        offers: {
          "@type": "Offer",
          price: prod.price,
          priceCurrency: "USD",
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

      {/* Header Banner */}
      <header className="bg-coral-light border border-coral/20 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-coral uppercase tracking-wider bg-card px-3 py-1 rounded-full border border-coral/20">
            PETNEST MARKETPLACE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink font-quicksand">Curated Pet Supplies & Food</h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-lg">
            High quality organic food, comfortable beds, interactive toys, and grooming essentials.
          </p>
        </div>
      </header>

      {/* Products Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-ink uppercase tracking-wider font-quicksand">Top Pet Supplies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((prod) => (
            <article
              key={prod.id}
              className="bg-card border border-border-peach rounded-xl overflow-hidden shadow-xs hover:border-coral/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-surface-muted">
                  <Image
                    src={prod.image}
                    alt={prod.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 250px"
                  />
                  {prod.badge && (
                    <span className="absolute top-3 left-3 bg-coral text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      {prod.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-semibold text-coral">{prod.category}</span>
                  <h3 className="text-xs font-bold text-ink line-clamp-2 hover:text-coral transition-colors font-quicksand">
                    {prod.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{prod.rating}</span>
                    <span className="text-ink-faint font-normal">({prod.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-border-peach flex items-center justify-between mt-2">
                <div>
                  <span className="text-sm font-bold text-ink">${prod.price}</span>
                  {prod.originalPrice && (
                    <span className="text-xs text-ink-faint line-through ml-1.5">${prod.originalPrice}</span>
                  )}
                </div>
                <AddToCartButton productId={prod.id} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </CommonWrapper>
  );
}
