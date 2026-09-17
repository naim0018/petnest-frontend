"use client";

import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { Avatar } from "@/components/common/Avatar";
import PrimaryButton from "@/components/common/PrimaryButton";
import { cn } from "@/lib/utils";

export interface PostAuthor {
  name: string;
  avatar?: string;
  timestamp: string;
}

export interface CommunityPostCardProps {
  author: PostAuthor;
  content: string;
  images?: string[];
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  variant?: "standard" | "mediaTop";
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onMoreOptions?: () => void;
  className?: string;
}

export function CommunityPostCard({
  author,
  content,
  images = [],
  likesCount = 0,
  commentsCount = 0,
  isLiked: initialLiked = false,
  isSaved: initialSaved = false,
  variant = "standard",
  onLike,
  onComment,
  onShare,
  onSave,
  onMoreOptions,
  className,
}: CommunityPostCardProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(likesCount);
  const [saved, setSaved] = useState(initialSaved);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLikeToggle = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    onLike?.();
  };

  const handleSaveToggle = () => {
    setSaved((prev) => !prev);
    onSave?.();
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Header Subcomponent
  const AuthorHeader = () => (
    <div className="flex items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar name={author.name} src={author.avatar} size="md" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-foreground truncate font-quicksand">
            {author.name}
          </span>
          <span className="text-xs text-muted-foreground">{author.timestamp}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onMoreOptions}
        className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="More options"
      >
        <MoreVertical className="h-4.5 w-4.5" />
      </button>
    </div>
  );

  // Media Display Subcomponent
  const MediaGallery = () => {
    if (images.length === 0) return null;
    const hasMultiple = images.length > 1;

    return (
      <div className="relative w-full aspect-16/9 rounded-lg overflow-hidden bg-muted group">
        <Image
          src={images[currentImageIndex]}
          alt={`Post image ${currentImageIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Counter Badge */}
        {hasMultiple && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-bold font-quicksand select-none">
            {currentImageIndex + 1}/{images.length}
          </div>
        )}

        {/* Navigation Arrows */}
        {hasMultiple && (
          <>
            <PrimaryButton
              type="button"
              onClick={handlePrevImage}
              size="icon"
              variant="ghost"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/70 transition-opacity opacity-0 group-hover:opacity-100 p-0 border-0"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </PrimaryButton>
            <PrimaryButton
              type="button"
              onClick={handleNextImage}
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/70 transition-opacity opacity-0 group-hover:opacity-100 p-0 border-0"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </PrimaryButton>
          </>
        )}
      </div>
    );
  };

  // Engagement Actions Subcomponent
  const ActionButtons = () => (
    <div className="flex flex-wrap items-center gap-2 pt-1 w-full">
      {/* Like Button */}
      <PrimaryButton
        type="button"
        onClick={handleLikeToggle}
        size="sm"
        leftIcon={<Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />}
        title={`Like ${likes}`}
        className={cn(
          "rounded-full border-0 font-semibold transition-all",
          liked
            ? "bg-rose-500 text-white hover:bg-rose-600"
            : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50"
        )}
      />

      {/* Comment Button */}
      <PrimaryButton
        type="button"
        onClick={onComment}
        size="sm"
        leftIcon={<MessageCircle className="h-3.5 w-3.5" />}
        title={`Comment ${commentsCount}`}
        className="rounded-full bg-amber-50 text-amber-900 border border-border dark:bg-amber-950/40 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 font-semibold"
      />

      {/* Share Button */}
      <PrimaryButton
        type="button"
        onClick={onShare}
        size="sm"
        leftIcon={<Share2 className="h-3.5 w-3.5" />}
        title="Share"
        className="rounded-full bg-sky-50 text-sky-700 border-0 dark:bg-sky-950/40 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 font-semibold"
      />

      {/* Save Button */}
      <PrimaryButton
        type="button"
        onClick={handleSaveToggle}
        size="sm"
        leftIcon={<Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} />}
        title={saved ? "Saved" : "Save"}
        className={cn(
          "rounded-full border-0 font-semibold ml-auto transition-all",
          saved
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50"
        )}
      />
    </div>
  );

  return (
    <article
      className={cn(
        "flex flex-col gap-4 p-5 rounded-lg border border-border bg-card text-card-foreground shadow-xs transition-shadow hover:shadow-md",
        className
      )}
    >
      {variant === "standard" ? (
        <>
          <AuthorHeader />
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-normal">
            {content}
          </p>
          <MediaGallery />
          <ActionButtons />
        </>
      ) : (
        <>
          <MediaGallery />
          <AuthorHeader />
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-normal">
            {content}
          </p>
          <ActionButtons />
        </>
      )}
    </article>
  );
}

export default CommunityPostCard;
