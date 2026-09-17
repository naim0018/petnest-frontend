import CommonWrapper from "@/components/common/CommonWrapper";
import { CreatePostCardSkeleton } from "./feed/_components/feed/main-content/CreatePostCard";
import { FeedPostCardSkeleton } from "./feed/_components/feed/main-content/FeedPostCard";
import { TrendingTopicsWidgetSkeleton } from "./feed/_components/feed/right-content/TrendingTopicsWidget";
import { ShareLoveWidgetSkeleton } from "./feed/_components/feed/left-content/ShareLoveWidget";
import { StorySectionSkeleton } from "./feed/_components/feed/main-content/StorySection";
import { FeedFilterTabsSkeleton } from "./feed/_components/feed/main-content/FeedFilterTabs";

export default function Loading() {
  return (
    <CommonWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-16 gap-6">
        {/* Left Column Skeleton */}
        <div className="hidden lg:block lg:col-span-3">
          <ShareLoveWidgetSkeleton />
        </div>

        {/* Center Main Feed Skeletons */}
        <div className="col-span-1 lg:col-span-10 space-y-6">
          <StorySectionSkeleton />
          <FeedFilterTabsSkeleton />
          <CreatePostCardSkeleton />
          <FeedPostCardSkeleton />
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="col-span-1 lg:col-span-3">
          <TrendingTopicsWidgetSkeleton />
        </div>
      </div>
    </CommonWrapper>
  );
}
