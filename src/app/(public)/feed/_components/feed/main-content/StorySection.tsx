"use client";

import Avatar from "@/components/common/Avatar";
import { cn } from "@/lib/utils";

export interface StoryItem {
  id: string;
  name: string;
  avatar: string;
  petIcon?: string;
  hasUnseenStory?: boolean;
  isCurrentUser?: boolean;
}

const defaultStories: StoryItem[] = [
  {
    id: "user-1",
    name: "Sarah M.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    isCurrentUser: true,
  },
  {
    id: "story-1",
    name: "Bella",
    avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80",
    petIcon: "🐱",
    hasUnseenStory: true,
  },
  {
    id: "story-2",
    name: "Luna",
    avatar: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80",
    petIcon: "🐶",
    hasUnseenStory: true,
  },
  {
    id: "story-3",
    name: "Charlie",
    avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80",
    petIcon: "🐱",
    hasUnseenStory: true,
  },
  {
    id: "story-4",
    name: "Max",
    avatar: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=150&q=80",
    petIcon: "🐱",
    hasUnseenStory: true,
  },
  {
    id: "story-5",
    name: "Moco",
    avatar: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=150&q=80",
    petIcon: "🐹",
    hasUnseenStory: true,
  },
  {
    id: "story-6",
    name: "Coco",
    avatar: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=150&q=80",
    petIcon: "🐶",
    hasUnseenStory: true,
  },
  {
    id: "story-7",
    name: "Rocky",
    avatar: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=150&q=80",
    petIcon: "🦝",
    hasUnseenStory: true,
  },
];

interface StorySectionProps {
  stories?: StoryItem[];
  onAddStoryClick?: () => void;
  onStoryClick?: (story: StoryItem) => void;
  className?: string;
}

export function StorySection({
  stories = defaultStories,
  onAddStoryClick,
  onStoryClick,
  className,
}: StorySectionProps) {
  return (
    <div
      className={cn(
        "w-full bg-card border border-border-peach rounded-xl p-5 flex items-center gap-5 sm:gap-7 overflow-x-auto scrollbar-none shadow-xs",
        className
      )}
    >
      {stories.map((story) => {
        if (story.isCurrentUser) {
          return (
            <Avatar
              key={story.id}
              src={story.avatar}
              name={story.name}
              size="lg"
              ring="none"
              badge="plus"
              badgePosition="bottom-right"
              onBadgeClick={onAddStoryClick}
              title="Your Story"
              titlePosition="bottom"
              titleClassName="text-xs font-bold text-ink"
              interactive
              onClick={onAddStoryClick}
            />
          );
        }

        return (
          <Avatar
            key={story.id}
            src={story.avatar}
            name={story.name}
            size="lg"
            ring={story.hasUnseenStory ? "gradient" : "seen"}
            title={story.name}
            titleIcon={
              story.petIcon ? (
                <span className="text-xs leading-none">{story.petIcon}</span>
              ) : undefined
            }
            titlePosition="bottom"
            titleClassName="text-xs font-bold text-ink"
            interactive
            onClick={() => onStoryClick?.(story)}
          />
        );
      })}
    </div>
  );
}

export function StorySectionSkeleton() {
  return (
    <div className="w-full bg-card border border-border-peach rounded-xl p-4 sm:p-5 flex items-center gap-6 overflow-x-auto shadow-xs animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="flex flex-col items-center gap-2 shrink-0">
          <div className="size-14 rounded-full bg-surface-muted" />
          <div className="h-3 w-12 bg-surface-muted rounded-md" />
        </div>
      ))}
    </div>
  );
}
