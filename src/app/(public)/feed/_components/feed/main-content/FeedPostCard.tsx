import Image from "next/image";
import { MapPin, MoreHorizontal } from "lucide-react";
import { FeedPost } from "@/lib/data/petnest-data";
import { PostActions } from "./PostActions";
import PrimaryButton from "@/components/common/PrimaryButton";

interface FeedPostCardProps {
  post: FeedPost;
}

export function FeedPostCard({ post }: FeedPostCardProps) {
  return (
    <article className="bg-card border border-border-peach rounded-xl overflow-hidden shadow-xs hover:border-coral/30 transition-colors">
      {/* Author Bar */}
      <header className="p-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full overflow-hidden border border-border-peach relative shrink-0">
            <Image
              src={post.authorAvatar}
              alt={`${post.authorName}'s avatar`}
              width={44}
              height={44}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4>{post.authorName}</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-coral-light text-coral border border-coral/20">
                {post.petBadge}
              </span>
            </div>
            <small className="flex items-center gap-1.5 mt-0.5">
              <time>{post.timeAgo}</time>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-coral" /> {post.location}
              </span>
            </small>
          </div>
        </div>
        <PrimaryButton variant="ghost" size="icon" className="size-8 rounded-lg" aria-label="Post options">
          <MoreHorizontal className="w-5 h-5 text-ink-faint" />
        </PrimaryButton>
      </header>

      {/* Content */}
      <div className="px-5 pb-3">
        <p>{post.content}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs font-semibold text-coral hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="w-full h-80 sm:h-96 relative bg-surface-muted border-y border-border-peach">
          <Image
            src={post.image}
            alt={`Photo shared by ${post.authorName}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>
      )}

      {/* Interactive Client Leaf Actions */}
      <PostActions
        likesCount={post.likes}
        commentsCount={post.comments}
        sharesCount={post.shares}
      />
    </article>
  );
}

export function FeedPostCardSkeleton() {
  return (
    <div className="bg-card border border-border-peach rounded-xl overflow-hidden shadow-xs animate-pulse">
      <div className="p-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-surface-muted shrink-0" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 bg-surface-muted rounded-md" />
            <div className="h-3 w-24 bg-surface-muted rounded-md" />
          </div>
        </div>
      </div>
      <div className="px-5 pb-3 space-y-2">
        <div className="h-4 w-full bg-surface-muted rounded-md" />
        <div className="h-4 w-4/5 bg-surface-muted rounded-md" />
      </div>
      <div className="w-full h-80 bg-surface-muted" />
      <div className="px-5 py-3.5 border-t border-border-peach flex items-center justify-between">
        <div className="flex gap-6">
          <div className="h-4 w-12 bg-surface-muted rounded-md" />
          <div className="h-4 w-12 bg-surface-muted rounded-md" />
        </div>
        <div className="size-6 bg-surface-muted rounded-md" />
      </div>
    </div>
  );
}
