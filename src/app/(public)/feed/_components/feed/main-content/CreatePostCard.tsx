"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImageIcon, Sparkles, Send, X } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";

interface CreatePostCardProps {
  onPostSubmit?: (text: string, media?: string | null) => void;
  onClose?: () => void;
  textareaRef?: React.Ref<HTMLTextAreaElement>;
}

export function CreatePostCard({ onPostSubmit, onClose, textareaRef }: CreatePostCardProps) {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const demoImage = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoVideoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      setMediaPreview(demoImage);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !mediaPreview) return;
    onPostSubmit?.(text, mediaPreview);
    setText("");
    setMediaPreview(null);
  };

  return (
    <div className="bg-card border border-border-peach rounded-xl p-5 shadow-xs transition-all duration-200">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />

      <div className="flex gap-4 items-start">
        <div className="size-11 rounded-full overflow-hidden shrink-0 border border-border-peach">
          <Image
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="Your Profile"
            width={44}
            height={44}
            className="w-full h-full object-cover"
          />
        </div>
        <form onSubmit={handleSubmit} className="flex-1 space-y-3">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share a story, photo, or question about your pet..."
            rows={3}
            className="w-full bg-surface-muted border border-border-peach rounded-xl p-3 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-coral transition-colors resize-none font-sans"
          />

          {/* Media Preview Box */}
          {mediaPreview && (
            <div className="relative rounded-xl overflow-hidden border border-border-peach bg-surface-muted max-h-60 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaPreview}
                alt="Story media preview"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => setMediaPreview(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                aria-label="Remove image preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <PrimaryButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePhotoVideoClick}
                leftIcon={<ImageIcon className="w-4 h-4 text-coral" />}
              >
                Photo / Video
              </PrimaryButton>
              <PrimaryButton
                type="button"
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
                leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
              >
                Pet Milestone
              </PrimaryButton>
            </div>

            <div className="flex items-center gap-2">
              {onClose && (
                <PrimaryButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                >
                  Close
                </PrimaryButton>
              )}
              <PrimaryButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={!text.trim() && !mediaPreview}
                rightIcon={<Send className="w-3.5 h-3.5" />}
              >
                Post
              </PrimaryButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreatePostCardSkeleton() {
  return (
    <div className="bg-card border border-border-peach rounded-xl p-5 shadow-xs animate-pulse">
      <div className="flex gap-4 items-start">
        <div className="size-11 rounded-full bg-surface-muted shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-20 w-full bg-surface-muted rounded-xl" />
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-2">
              <div className="h-8 w-28 bg-surface-muted rounded-lg" />
              <div className="h-8 w-28 bg-surface-muted rounded-lg hidden sm:block" />
            </div>
            <div className="h-8 w-20 bg-surface-muted rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
