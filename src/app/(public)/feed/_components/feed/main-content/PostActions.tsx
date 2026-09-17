"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import PrimaryButton from "@/components/common/PrimaryButton";

interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}

export function PostActions({ likesCount, commentsCount, sharesCount }: PostActionsProps) {
  const [likes, setLikes] = useState(likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="px-5 py-3.5 border-t border-border-peach flex items-center justify-between bg-surface-muted/30">
      <div className="flex items-center gap-2 sm:gap-4">
        <PrimaryButton
          variant={isLiked ? "coralLight" : "ghost"}
          size="sm"
          onClick={toggleLike}
          leftIcon={<Heart className={cn("w-4 h-4", isLiked && "fill-coral")} />}
          aria-label="Like post"
        >
          {likes}
        </PrimaryButton>

        <PrimaryButton
          variant="ghost"
          size="sm"
          className="text-ink-muted hover:text-coral"
          leftIcon={<MessageCircle className="w-4 h-4" />}
          aria-label="Comments"
        >
          {commentsCount}
        </PrimaryButton>

        <PrimaryButton
          variant="ghost"
          size="sm"
          className="text-ink-muted hover:text-coral"
          leftIcon={<Share2 className="w-4 h-4" />}
          aria-label="Shares"
        >
          {sharesCount}
        </PrimaryButton>
      </div>

      <PrimaryButton
        variant={isBookmarked ? "coralLight" : "ghost"}
        size="icon"
        className="size-9 rounded-lg"
        onClick={() => setIsBookmarked(!isBookmarked)}
        aria-label="Bookmark post"
      >
        <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-coral")} />
      </PrimaryButton>
    </div>
  );
}
