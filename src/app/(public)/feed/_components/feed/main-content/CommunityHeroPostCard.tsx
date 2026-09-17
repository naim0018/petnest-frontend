"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";

export function CommunityHeroPostCard() {
  const [likes, setLikes] = useState(128);
  const [isLiked, setIsLiked] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <article className="bg-card border border-border-peach rounded-xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-2">
      {/* Left Content Column */}
      <div className="p-5 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          {/* Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full overflow-hidden border border-border-peach relative">
                <Image
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                  alt="James Walker"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <h4>James Walker</h4>
                <small className="block">2h ago</small>
              </div>
            </div>
            <PrimaryButton variant="ghost" size="icon" className="size-8 rounded-lg" aria-label="More options">
              <MoreHorizontal className="w-4 h-4 text-ink-faint" />
            </PrimaryButton>
          </div>

          {/* Post Copy */}
          <p>
            Our new rescue, Bella, is finally feeling at home! 🐱❤️
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border-peach">
          <PrimaryButton
            variant={isLiked ? "coralLight" : "outline"}
            size="sm"
            onClick={() => {
              setIsLiked(!isLiked);
              setLikes(isLiked ? likes - 1 : likes + 1);
            }}
            leftIcon={<Heart className="w-3.5 h-3.5 fill-coral text-coral" />}
          >
            Like {likes}
          </PrimaryButton>

          <PrimaryButton
            variant="outline"
            size="sm"
            leftIcon={<MessageCircle className="w-3.5 h-3.5 text-ink-muted" />}
          >
            Comment 24
          </PrimaryButton>

          <PrimaryButton
            variant="outline"
            size="sm"
            leftIcon={<Share2 className="w-3.5 h-3.5 text-ink-muted" />}
          >
            Share
          </PrimaryButton>

          <PrimaryButton
            variant={isBookmarked ? "coralLight" : "outline"}
            size="sm"
            onClick={() => setIsBookmarked(!isBookmarked)}
            leftIcon={<Bookmark className="w-3.5 h-3.5 text-ink-muted" />}
          >
            Save
          </PrimaryButton>
        </div>
      </div>

      {/* Right Hero Image Column */}
      <div className="relative h-64 md:h-full min-h-[240px] bg-surface-muted border-t md:border-t-0 md:border-l border-border-peach">
        <Image
          src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
          alt="Golden Retriever at home by fireplace"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 500px"
        />
        <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
          1/3
        </span>
      </div>
    </article>
  );
}
