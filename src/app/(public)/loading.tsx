import CommonWrapper from "@/components/common/CommonWrapper";

export default function GenericPublicLoading() {
  return (
    <CommonWrapper className="py-6 sm:py-8 lg:py-10 animate-pulse space-y-8">
      {/* Top Banner / Hero Skeleton */}
      <div className="w-full h-48 sm:h-64 rounded-xl bg-surface-muted" />

      {/* Grid Content Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border-peach/50 bg-card p-4 space-y-4 shadow-2xs"
          >
            <div className="w-full h-44 rounded-lg bg-surface-muted" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-surface-muted rounded-md" />
              <div className="h-3 w-full bg-surface-muted rounded-md" />
              <div className="h-3 w-5/6 bg-surface-muted rounded-md" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border-peach/40">
              <div className="h-3 w-16 bg-surface-muted rounded-md" />
              <div className="h-3 w-12 bg-surface-muted rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </CommonWrapper>
  );
}
