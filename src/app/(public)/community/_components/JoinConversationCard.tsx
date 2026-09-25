import React from "react";
import { MessageSquare, Pencil } from "lucide-react";

interface JoinConversationCardProps {
  onCreatePostClick?: () => void;
}

export function JoinConversationCard({ onCreatePostClick }: JoinConversationCardProps) {
  return (
    <div className="bg-coral-light border border-coral/20 rounded-xl p-5 shadow-xs space-y-3">
      <div className="flex items-center gap-2 text-coral">
        <MessageSquare className="w-4 h-4 text-coral" />
        <h4 className="text-coral font-bold font-quicksand">
          Join the Conversation
        </h4>
      </div>

      <p className="text-xs text-ink-muted leading-relaxed">
        Share your pet&apos;s story, ask questions, and get advice from a loving community.
      </p>

      <button
        type="button"
        onClick={onCreatePostClick}
        className="w-full h-10 rounded-full bg-coral hover:bg-coral-dark text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.98] font-quicksand"
      >
        <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Create a Post</span>
      </button>
    </div>
  );
}
