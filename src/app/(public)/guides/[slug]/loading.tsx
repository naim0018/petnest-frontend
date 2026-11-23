import CommonWrapper from "@/components/common/CommonWrapper";

export default function GuideDetailLoading() {
  return (
    <CommonWrapper className="py-6 sm:py-8 lg:py-10 animate-pulse">
      {/* Main 3-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
        {/* Left Column Promotional Spacer */}
        <aside
          className="hidden lg:block lg:col-span-3 w-full"
          aria-hidden="true"
        />

        {/* Middle Article Column */}
        <div className="col-span-1 lg:col-span-6 space-y-8 min-w-0 w-full">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-full bg-surface-muted" />
            <div className="h-3.5 w-24 bg-surface-muted rounded-md" />
          </div>

          <article className="space-y-6">
            <header className="space-y-3">
              {/* Title Skeleton */}
              <div className="space-y-2">
                <div className="h-7 sm:h-9 md:h-10 w-full bg-surface-muted rounded-lg" />
                <div className="h-7 sm:h-9 md:h-10 w-3/4 bg-surface-muted rounded-lg" />
              </div>

              {/* Combined Author, Date & Tags Metadata Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-peach">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="size-3.5 rounded-full bg-surface-muted" />
                    <div className="h-3.5 w-20 bg-surface-muted rounded-md" />
                  </div>
                  <div className="size-1 rounded-full bg-surface-muted" />
                  <div className="flex items-center gap-1.5">
                    <div className="size-3.5 rounded-full bg-surface-muted" />
                    <div className="h-3.5 w-20 bg-surface-muted rounded-md" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-5 w-14 bg-surface-muted rounded-full" />
                  <div className="h-5 w-16 bg-surface-muted rounded-full" />
                  <div className="size-1 rounded-full bg-surface-muted" />
                  <div className="h-3.5 w-16 bg-surface-muted rounded-md" />
                  <div className="size-1 rounded-full bg-surface-muted" />
                  <div className="h-3.5 w-14 bg-surface-muted rounded-md" />
                </div>
              </div>
            </header>

            {/* Hero Cover Image Skeleton */}
            <div className="relative w-full aspect-16/9 rounded-lg bg-surface-muted border border-border-peach/60 overflow-hidden" />

            {/* Key Takeaways Skeleton Callout */}
            <div className="p-5 rounded-lg bg-tint-mint/40 border border-success/20 space-y-3">
              <div className="h-4 w-32 bg-success/20 rounded-md" />
              <div className="space-y-2">
                <div className="h-3.5 w-full bg-surface-muted rounded-md" />
                <div className="h-3.5 w-11/12 bg-surface-muted rounded-md" />
                <div className="h-3.5 w-4/5 bg-surface-muted rounded-md" />
              </div>
            </div>

            {/* Excerpt Blockquote Skeleton */}
            <div className="p-4 rounded-lg bg-surface-muted/40 border border-border-peach/60 space-y-2">
              <div className="h-4 w-full bg-surface-muted rounded-md" />
              <div className="h-4 w-5/6 bg-surface-muted rounded-md" />
            </div>

            {/* Article Content Paragraph Skeletons */}
            <section className="space-y-4 pt-4 border-t border-border-peach">
              <div className="h-6 w-48 bg-surface-muted rounded-md mb-3" />
              <div className="space-y-2.5">
                <div className="h-4 w-full bg-surface-muted rounded-md" />
                <div className="h-4 w-full bg-surface-muted rounded-md" />
                <div className="h-4 w-11/12 bg-surface-muted rounded-md" />
                <div className="h-4 w-4/5 bg-surface-muted rounded-md" />
              </div>

              <div className="h-5 w-40 bg-surface-muted rounded-md pt-3 mb-2" />
              <div className="space-y-2.5">
                <div className="h-4 w-full bg-surface-muted rounded-md" />
                <div className="h-4 w-full bg-surface-muted rounded-md" />
                <div className="h-4 w-3/4 bg-surface-muted rounded-md" />
              </div>
            </section>
          </article>
        </div>

        {/* Right Sidebar: Related Guides & Support Widgets */}
        <aside className="col-span-1 lg:col-span-3 w-full space-y-6 lg:sticky lg:top-24">
          {/* Related Guides Widget Skeleton - No outer border */}
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-peach">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-surface-muted" />
                <div className="space-y-1">
                  <div className="h-4 w-28 bg-surface-muted rounded-md" />
                  <div className="h-3 w-20 bg-surface-muted rounded-md" />
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-2">
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-lg bg-surface-muted" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="h-3.5 w-12 bg-surface-muted rounded-full" />
                    <div className="h-4 w-full bg-surface-muted rounded-md" />
                    <div className="h-3 w-5/6 bg-surface-muted rounded-md" />
                    <div className="h-3 w-16 bg-surface-muted rounded-md pt-0.5" />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border-peach">
              <div className="h-4 w-32 bg-surface-muted rounded-md" />
            </div>
          </div>

          {/* Need Help Card Skeleton */}
          <div className="rounded-lg border border-coral/20 bg-linear-to-br from-coral-light/50 to-surface-muted p-5 space-y-3">
            <div className="h-4 w-24 bg-coral/20 rounded-md" />
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-surface-muted rounded-md" />
              <div className="h-3 w-4/5 bg-surface-muted rounded-md" />
            </div>
            <div className="h-9 w-full rounded-lg bg-coral/30" />
          </div>
        </aside>
      </div>

      {/* FAQs Skeleton Section */}
      <section className="mt-12 sm:mt-16 pt-8 border-t border-border-peach w-full space-y-6">
        <div className="space-y-2">
          <div className="h-6 sm:h-7 w-64 bg-surface-muted rounded-md" />
          <div className="h-4 w-80 bg-surface-muted rounded-md" />
        </div>

        <div className="space-y-3 max-w-4xl">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 w-full rounded-xl bg-surface-muted/50 border border-border-peach/60"
            />
          ))}
        </div>
      </section>
    </CommonWrapper>
  );
}
