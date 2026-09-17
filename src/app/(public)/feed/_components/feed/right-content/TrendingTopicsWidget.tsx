"use client";

import Image from "next/image";
import { Flame, ArrowRight, Dog } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";

const trendingItems = [
  { tag: "#PetCareTips", posts: "12.5K posts" },
  { tag: "#AdoptionStories", posts: "8.2K posts" },
  { tag: "#PuppyLove", posts: "6.1K posts" },
  { tag: "#CatLife", posts: "5.3K posts" },
  { tag: "#PetHealth", posts: "4.8K posts" },
];

export function TrendingTopicsWidget() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border-peach rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-coral shrink-0" />
          <h4 className="text-coral">What&apos;s Trending</h4>
        </div>

        <div className="space-y-3.5">
          {trendingItems.map((item) => (
            <div
              key={item.tag}
              className="flex justify-between items-center group cursor-pointer"
            >
              <p className="font-bold group-hover:text-coral transition-colors">
                {item.tag}
              </p>
              <small className="group-hover:text-coral transition-colors">
                {item.posts}
              </small>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="hover:underline cursor-pointer flex items-center gap-1 transition-colors"
          >
            <small className="font-bold text-coral flex items-center gap-1">
              View all trends <ArrowRight className="w-3.5 h-3.5 text-coral" />
            </small>
          </button>
        </div>
      </div>

      <div className="bg-coral-light border border-coral/20 rounded-xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Dog className="w-4 h-4 text-coral" />
          <h4 className="text-coral">Adoption Spotlight</h4>
        </div>
        <div className="relative h-44 rounded-xl overflow-hidden border border-coral/20">
          <Image
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80"
            alt="Barnaby Golden Retriever"
            fill
            sizes="(max-width: 1024px) 100vw, 320px"
            className="object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-bold">
            Barnaby • 1.5 Yrs
          </div>
        </div>
        <p className="line-clamp-3 text-ink-muted">
          Friendly, energetic Golden Retriever looking for an active family in Texas.
        </p>
        <PrimaryButton variant="primary" size="sm" fullWidth className="rounded-full">
          Meet Barnaby
        </PrimaryButton>
      </div>
    </div>
  );
}

export function TrendingTopicsWidgetSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-card border border-border-peach rounded-xl p-5 shadow-xs space-y-3.5">
        <div className="h-6 w-36 bg-surface-muted rounded-md mb-2" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-4 w-28 bg-surface-muted rounded-md" />
            <div className="h-4 w-16 bg-surface-muted rounded-md" />
          </div>
        ))}
        <div className="h-4 w-24 bg-surface-muted rounded-md pt-2" />
      </div>
      <div className="bg-card border border-border-peach rounded-xl p-5 shadow-xs space-y-3">
        <div className="h-5 w-32 bg-surface-muted rounded-md" />
        <div className="h-44 w-full bg-surface-muted rounded-xl" />
        <div className="h-8 w-full bg-surface-muted rounded-xl" />
      </div>
    </div>
  );
}
