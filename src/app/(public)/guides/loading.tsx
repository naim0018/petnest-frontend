import CommonWrapper from "@/components/common/CommonWrapper";

export default function GuidesHubLoading() {
  return (
    <CommonWrapper className="space-y-8 py-6 sm:py-8 lg:py-10 animate-pulse">
      {/* Hero Care Guide Section Skeleton: Hero card + 2 Side cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
        {/* Main Hero Card */}
        <div className="col-span-1 lg:col-span-8 rounded-xl bg-surface-muted/70 p-6 sm:p-8 min-h-[340px] sm:min-h-[400px] flex flex-col justify-between">
          <div className="space-y-4 max-w-lg">
            <div className="h-6 w-28 bg-surface-muted rounded-full" />
            <div className="space-y-2">
              <div className="h-8 sm:h-10 w-full bg-surface-muted rounded-lg" />
              <div className="h-8 sm:h-10 w-4/5 bg-surface-muted rounded-lg" />
            </div>
            <div className="h-4 w-3/4 bg-surface-muted rounded-md" />
          </div>
          <div className="flex items-center gap-4 pt-6">
            <div className="h-10 w-36 bg-surface-muted rounded-xl" />
            <div className="h-4 w-24 bg-surface-muted rounded-md" />
          </div>
        </div>

        {/* 2 Side Cards */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 rounded-xl bg-card border border-border-peach/60 p-4 sm:p-5 flex gap-4 items-center"
            >
              <div className="size-20 sm:size-24 rounded-xl bg-surface-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-surface-muted rounded-full" />
                <div className="h-4 w-full bg-surface-muted rounded-md" />
                <div className="h-3 w-4/5 bg-surface-muted rounded-md" />
                <div className="h-3 w-20 bg-surface-muted rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Filter Pills Bar Skeleton */}
      <div className="flex items-center gap-2.5 overflow-x-hidden py-2 border-y border-border-peach/60">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="h-9 w-24 sm:w-28 rounded-full bg-surface-muted shrink-0"
          />
        ))}
      </div>

      {/* Care Articles Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border-peach/60 bg-card overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="w-full h-52 sm:h-56 bg-surface-muted" />
              <div className="p-4 sm:p-5 space-y-3">
                <div className="h-4 w-20 bg-surface-muted rounded-full" />
                <div className="space-y-1.5">
                  <div className="h-5 w-full bg-surface-muted rounded-md" />
                  <div className="h-5 w-3/4 bg-surface-muted rounded-md" />
                </div>
                <div className="space-y-1 pt-1">
                  <div className="h-3.5 w-full bg-surface-muted rounded-md" />
                  <div className="h-3.5 w-5/6 bg-surface-muted rounded-md" />
                </div>
              </div>
            </div>
            <div className="px-4 sm:px-5 py-3 border-t border-border-peach/50 flex justify-between items-center bg-surface-muted/30">
              <div className="h-3.5 w-20 bg-surface-muted rounded-md" />
              <div className="h-3.5 w-16 bg-surface-muted rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </CommonWrapper>
  );
}
