"use client";

import React from "react";
import Image from "next/image";
import { Star, MapPin, Heart, ShoppingBag, Eye, Store, Clock } from "lucide-react";
import { MarketplaceProduct } from "./marketplaceData";
import { cn } from "@/lib/utils";

interface MarketplaceProductCardProps {
  product: MarketplaceProduct;
  onAddToCart?: (id: string) => void;
  onWishlistToggle?: (id: string) => void;
}

export default function MarketplaceProductCard({
  product,
  onAddToCart,
  onWishlistToggle,
}: MarketplaceProductCardProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    onWishlistToggle?.(product.id);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    onAddToCart?.(product.id);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <article className="group bg-card border border-border-peach/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-coral/40 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Image Box */}
        <div className="relative h-44 sm:h-48 w-full bg-surface-muted overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          />

          {/* Badge (Best Seller, 20% OFF, etc) */}
          {product.badge && (
            <span
              className={cn(
                "absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs font-quicksand",
                product.badge.includes("OFF")
                  ? "bg-rose-500 text-white"
                  : "bg-amber-400 text-amber-950"
              )}
            >
              {product.badge}
            </span>
          )}

          {/* Favorite button */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white dark:bg-slate-900/90 shadow-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                isLiked
                  ? "fill-coral text-coral"
                  : "text-ink-muted hover:text-coral"
              )}
            />
          </button>
        </div>

        {/* Content Box */}
        <div className="p-3.5 space-y-2">
          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-ink line-clamp-2 hover:text-coral transition-colors font-quicksand leading-snug">
            {product.title}
          </h3>

          {/* Price & Stock */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-extrabold text-coral font-quicksand">
              {product.currencySymbol || "৳"}
              {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-ink-faint line-through font-quicksand">
                {product.currencySymbol || "৳"}
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Condition & Type Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 font-quicksand">
              {product.condition}
            </span>
            {product.isCommunityListing ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 font-quicksand flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Community Seller
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/60 font-quicksand flex items-center gap-1">
                <Store className="w-3 h-3" />
                Verified Store
              </span>
            )}
          </div>

          {/* Location & Time */}
          <div className="flex items-center justify-between text-[11px] text-ink-muted pt-0.5 font-quicksand">
            <span className="flex items-center gap-1 truncate max-w-[150px]">
              <MapPin className="w-3 h-3 text-coral shrink-0" />
              <span className="truncate">{product.location}</span>
            </span>
            {product.timeAgo && (
              <span className="flex items-center gap-0.5 text-ink-faint shrink-0">
                <Clock className="w-3 h-3" />
                {product.timeAgo}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Seller & Action Bottom Bar */}
      <div className="p-3.5 pt-2 border-t border-border-peach/60 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-1">
        {/* Seller Info */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-border-peach bg-surface-muted">
            <Image
              src={product.seller.avatar}
              alt={product.seller.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-ink truncate leading-tight font-quicksand">
              {product.seller.name}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold font-quicksand">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>{product.seller.rating}</span>
              <span className="text-ink-faint font-normal">
                ({product.seller.reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: View Listing or Add to Cart */}
        {product.isCommunityListing ? (
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl bg-coral hover:bg-coral-dark text-white text-xs font-bold font-quicksand transition-all active:scale-95 cursor-pointer shadow-2xs shrink-0"
          >
            View Listing
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-1.5 rounded-xl bg-coral hover:bg-coral-dark text-white text-xs font-bold font-quicksand transition-all active:scale-95 cursor-pointer shadow-2xs flex items-center gap-1.5 shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAdded ? "Added" : "Add to Cart"}</span>
          </button>
        )}
      </div>
    </article>
  );
}
