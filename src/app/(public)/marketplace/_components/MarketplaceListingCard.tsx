"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  MapPin,
  Heart,
  Clock,
  Store,
  ShoppingBag,
  Zap,
  MessageCircle,
  BadgeCheck,
  Check,
} from "lucide-react";
import { MarketplaceListing } from "./marketplaceData";
import { cn } from "@/lib/utils";
import PrimaryButton from "@/components/common/PrimaryButton";
import Avatar from "@/components/common/Avatar";
import { Badge } from "@/components/ui/badge";

interface MarketplaceListingCardProps {
  item: MarketplaceListing;
  onAddToCart?: (id: string) => void;
  onBuyNow?: (id: string) => void;
  onContactSeller?: (id: string) => void;
  onWishlistToggle?: (id: string) => void;
}

export default function MarketplaceListingCard({
  item,
  onAddToCart,
  onBuyNow,
  onContactSeller,
  onWishlistToggle,
}: MarketplaceListingCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    onWishlistToggle?.(item.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedToCart(true);
    onAddToCart?.(item.id);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBuyNow?.(item.id);
  };

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContactSeller?.(item.id);
  };

  // Badge background & text styling based on skill tokens & design system
  const getBadgeVariant = () => {
    switch (item.badgeVariant) {
      case "yellow":
        return "warning";
      case "green":
        return "success";
      case "sky":
        return "info";
      case "coral":
      default:
        return "destructive";
    }
  };

  return (
    <article className="group bg-card border border-border-peach dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs hover:shadow-md hover:border-coral/50 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* 1. PRODUCT / PET IMAGE CONTAINER */}
        <div className="relative h-44 sm:h-48 w-full bg-surface-muted overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          />

          {/* Top Left Badge (For Sale / Rehoming / Like New / Free) */}
          {item.badge && (
            <Badge
              variant={getBadgeVariant() as any}
              className="absolute top-2.5 left-2.5 text-[10px] font-bold font-quicksand shadow-xs"
            >
              {item.badge}
            </Badge>
          )}

          {/* Top Right Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Save listing to wishlist"
            className="absolute top-2.5 right-2.5 size-8 rounded-full bg-card/90 hover:bg-card shadow-xs flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                isLiked ? "fill-coral text-coral" : "text-coral"
              )}
            />
          </button>
        </div>

        {/* 2. CARD CONTENT AREA */}
        <div className="p-3.5 space-y-2.5">
          {/* STORE NAME OR COMMUNITY BADGE */}
          {item.store ? (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-coral font-quicksand">
              <Store className="size-3.5 shrink-0" />
              <span className="truncate hover:underline cursor-pointer">
                {item.store.name}
              </span>
              {item.store.isVerified && (
                <BadgeCheck className="size-3 text-sky-500 shrink-0" />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink-muted font-quicksand">
              <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">Community Pet Parent</span>
            </div>
          )}

          {/* TITLE */}
          <h3 className="text-xs sm:text-sm font-bold text-ink line-clamp-2 hover:text-coral transition-colors font-quicksand leading-snug">
            {item.title}
          </h3>

          {/* PRICE ROW */}
          <div className="flex items-baseline gap-2">
            {item.isFree ? (
              <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-quicksand">
                Free
              </span>
            ) : (
              <>
                <span className="text-sm sm:text-base font-extrabold text-coral font-quicksand">
                  {item.currencySymbol || "৳"}
                  {item.price.toLocaleString()}
                </span>
                {item.originalPrice && (
                  <span className="text-xs text-ink-faint line-through font-quicksand">
                    {item.currencySymbol || "৳"}
                    {item.originalPrice.toLocaleString()}
                  </span>
                )}
              </>
            )}
          </div>

          {/* LOCATION & TIME INFO */}
          <div className="space-y-1 text-[11px] text-ink-muted font-quicksand">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="size-3 text-coral shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-ink-faint">
              <Clock className="size-3 shrink-0" />
              <span>{item.timeAgo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOOTER: SELLER INFO & ACTION BUTTONS */}
      <div className="px-3.5 pb-3.5 pt-2 border-t border-border-peach/60 space-y-2.5">
        {/* SELLER PROFILE ROW */}
        <div className="flex items-center gap-2">
          <Avatar
            src={item.seller.avatar}
            name={item.seller.name}
            size="xs"
            className="shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-ink truncate font-quicksand leading-tight">
              {item.seller.name}
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold font-quicksand text-amber-500">
              <Star className="size-2.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>{item.seller.rating.toFixed(1)}</span>
              <span className="text-ink-faint font-normal">
                ({item.seller.reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS (Add to Cart / Buy Now / Adopt / Contact) */}
        {item.isLivePet ? (
          /* Live Pet Listing: Contact Seller & Adopt Button */
          <div className="grid grid-cols-2 gap-2">
            <PrimaryButton
              variant="outline"
              size="sm"
              onClick={handleContact}
              leftIcon={<MessageCircle className="size-3.5" />}
              className="text-xs h-8 px-2 font-quicksand font-bold"
            >
              Chat
            </PrimaryButton>
            <PrimaryButton
              variant="primary"
              size="sm"
              onClick={handleBuyNow}
              className="text-xs h-8 px-2 font-quicksand font-bold"
            >
              {item.isFree ? "Adopt Free" : "Adopt Pet"}
            </PrimaryButton>
          </div>
        ) : (
          /* Product / Supply: Add to Cart & Buy Now Buttons */
          <div className="grid grid-cols-2 gap-2">
            <PrimaryButton
              variant={addedToCart ? "success" : "secondary"}
              size="sm"
              onClick={handleAddToCart}
              leftIcon={
                addedToCart ? (
                  <Check className="size-3.5" />
                ) : (
                  <ShoppingBag className="size-3.5" />
                )
              }
              className="text-xs h-8 px-2 font-quicksand font-bold"
            >
              {addedToCart ? "Added" : "Add"}
            </PrimaryButton>
            <PrimaryButton
              variant="primary"
              size="sm"
              onClick={handleBuyNow}
              leftIcon={<Zap className="size-3.5" />}
              className="text-xs h-8 px-2 font-quicksand font-bold"
            >
              Buy Now
            </PrimaryButton>
          </div>
        )}
      </div>
    </article>
  );
}
