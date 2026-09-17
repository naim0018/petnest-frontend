"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Bookmark, MapPin } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";

export function PetUpdatesGalleryCard() {
  const [likes, setLikes] = useState(142);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const images = [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80",
  ];

  return (
    <article className="bg-card border border-border-peach rounded-xl overflow-hidden p-5 shadow-xs space-y-4">
      {/* Author Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full overflow-hidden border border-border-peach relative">
            <Image
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80"
              alt="Luna the Cat"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div>
            <h4>Luna the Cat</h4>
            <small className="flex items-center gap-1 font-semibold">
              <MapPin className="w-3 h-3 text-coral" /> Portland, OR
            </small>
          </div>
        </div>
        <small>3h ago</small>
      </div>

      {/* 3-Column Image Gallery */}
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative h-44 rounded-xl overflow-hidden bg-surface-muted border border-border-peach">
            <Image
              src={img}
              alt={`Gallery photo ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 300px"
            />
          </div>
        ))}
      </div>

      {/* Footer Interactive Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border-peach text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsLiked(!isLiked);
              setLikes(isLiked ? likes - 1 : likes + 1);
            }}
            className="flex items-center gap-1.5 font-bold text-ink-muted hover:text-coral transition-colors cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-coral text-coral" : "text-coral"}`} />
            <span>{likes}</span>
          </button>

          <button className="flex items-center gap-1.5 font-bold text-ink-muted hover:text-coral transition-colors cursor-pointer">
            <MessageCircle className="w-4 h-4 text-ink-faint" />
            <span>18</span>
          </button>

          <button className="flex items-center gap-1.5 font-bold text-ink-muted hover:text-coral transition-colors cursor-pointer">
            <Share2 className="w-4 h-4 text-coral" />
          </button>
        </div>

        <PrimaryButton
          variant={isBookmarked ? "coralLight" : "ghost"}
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => setIsBookmarked(!isBookmarked)}
          aria-label="Bookmark post"
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-coral text-coral" : "text-ink-faint"}`} />
        </PrimaryButton>
      </div>
    </article>
  );
}
