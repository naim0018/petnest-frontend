"use client";

import Image from "next/image";
import { Heart, Pencil } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";

interface ShareLoveWidgetProps {
  onCreatePostClick?: () => void;
  className?: string;
}

export function ShareLoveWidget({ onCreatePostClick, className }: ShareLoveWidgetProps) {
  return (
    <div
      className={`bg-coral-light/70 border border-coral/20 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between ${className || ""
        }`}
    >
      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <small className="text-coral font-bold flex items-center gap-1.5">
            Share love. <Heart className="w-4 h-4 fill-coral stroke-none text-coral" />
          </small>
          <h4 className="text-2xl font-black text-ink leading-tight">
            Change lives.
          </h4>
        <span className="text-ink-muted">
          Every post helps our pet community grow!
        </span>
        </div>


        <PrimaryButton
          variant="primary"
          size="sm"
          fullWidth
          onClick={onCreatePostClick}
          className=""
          leftIcon={<Pencil className="w-4 h-4" />}
        >
          Create Post
        </PrimaryButton>
      </div>

      <div className="relative h-56 w-full overflow-hidden shrink-0 mt-2">
        <Image
          src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80"
          alt="Happy Golden Retriever in field"
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 320px"
        />
      </div>
    </div>
  );
}

export function ShareLoveWidgetSkeleton() {
  return (
    <div className="bg-card border border-border-peach rounded-xl overflow-hidden shadow-xs animate-pulse p-5 space-y-4">
      <div className="h-5 w-28 bg-surface-muted rounded-md" />
      <div className="h-8 w-36 bg-surface-muted rounded-md" />
      <div className="h-4 w-full bg-surface-muted rounded-md" />
      <div className="h-10 w-full bg-surface-muted rounded-full" />
      <div className="h-48 w-full bg-surface-muted rounded-xl" />
    </div>
  );
}
