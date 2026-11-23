"use client";

import React, { use, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import ConfirmModal from "@/components/reuseable/ConfirmModal";
import { ArticleContentRenderer } from "@/components/admin/guides/RichTextEditor";
import { useHeaderAction } from "@/context/HeaderActionContext";
import { useAppSelector } from "@/hooks/useRedux";
import { cn } from "@/lib/utils";
import {
  useFindOneEditorialQuery,
  useDeleteGuideMutation,
  useReviewGuideMutation,
  useImportGuideZipMutation,
  downloadGuideZip,
} from "@/store/Api/Guides/guides.api";
import type { GuideStatus } from "@/store/Api/Guides/guides.types";
import {
  Pencil,
  Trash2,
  HelpCircle,
  Clock,
  Calendar,
  Eye,
  ThumbsUp,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Tag,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_BADGE_MAP: Record<
  GuideStatus,
  { label: string; className: string }
> = {
  PUBLISHED: {
    label: "Published",
    className: "bg-tint-mint text-success border border-success/30",
  },
  IN_REVIEW: {
    label: "In Review",
    className: "bg-tint-sky text-info border border-info/30",
  },
  DRAFT: {
    label: "Draft",
    className: "bg-surface-muted text-ink-muted border border-border-peach",
  },
  NEEDS_REVISION: {
    label: "Needs Revision",
    className: "bg-tint-cream text-warning border border-warning/30",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-surface-muted text-ink-faint border border-border-peach",
  },
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ViewGuideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const guideId = resolvedParams.id;
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAppSelector((state) => (state.auth as any)?.user);
  const canPublish = ["SUPERADMIN", "ADMIN", "VET"].includes(
    user?.role?.toUpperCase() || ""
  );

  const {
    data: guideResponse,
    isLoading,
    isError,
    refetch,
  } = useFindOneEditorialQuery(guideId);
  const guide = guideResponse?.data;

  const [deleteGuide, { isLoading: isDeleting }] = useDeleteGuideMutation();
  const [reviewGuide, { isLoading: isPublishing }] = useReviewGuideMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<"en" | "bn">("en");
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [importGuideZip, { isLoading: isImportingZip }] =
    useImportGuideZipMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadZip = async () => {
    if (!guide) return;
    try {
      setIsDownloadingZip(true);
      toast.info("Preparing ZIP archive with images...");
      await downloadGuideZip(guide.id, guide.slug);
      toast.success("Guide ZIP downloaded successfully!");
    } catch {
      toast.error("Failed to download guide ZIP");
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleZipFileSelected = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !guide) return;
    try {
      toast.info("Updating guide and uploading images from ZIP...");
      const res = await importGuideZip({ id: guide.id, file }).unwrap();
      toast.success("Guide updated successfully from ZIP!");
      const updated = res?.data || (res as any);
      if (updated?.translations?.bn?.title || updated?.translations?.bn?.content) {
        setActiveLangTab("bn");
      }
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to update guide from ZIP";
      toast.error(msg);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePublishNow = async () => {
    if (!guide) return;
    try {
      await reviewGuide({
        id: guide.id,
        payload: { decision: "PUBLISH" },
      }).unwrap();
      toast.success(`Guide "${guide.title}" published live!`);
      refetch();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to publish guide.";
      toast.error(errorMsg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!guide) return;
    try {
      await deleteGuide(guide.id).unwrap();
      toast.success(`Guide "${guide.title}" deleted successfully.`);
      setIsDeleteModalOpen(false);
      router.push("/admin/guides/all");
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to delete guide.";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    if (!guide) {
      setHeaderAction(null);
      return;
    }

    setHeaderAction(
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleZipFileSelected}
          className="hidden"
        />

        <PrimaryButton
          type="button"
          variant="outline"
          size="sm"
          rounded="md"
          leftIcon={<Download className="size-4" />}
          isLoading={isDownloadingZip}
          onClick={handleDownloadZip}
          className="font-bold cursor-pointer"
          title="Download guide in ZIP format (guides.json + images/)"
        >
          Download ZIP
        </PrimaryButton>

        <PrimaryButton
          type="button"
          variant="outline"
          size="sm"
          rounded="md"
          leftIcon={<Upload className="size-4" />}
          isLoading={isImportingZip}
          onClick={() => fileInputRef.current?.click()}
          className="font-bold cursor-pointer"
          title="Update this guide with a modified ZIP archive"
        >
          Update from ZIP
        </PrimaryButton>

        <Link href={`/admin/guides/${guide.id}/faqs`}>
          <PrimaryButton
            type="button"
            variant="outline"
            size="sm"
            rounded="md"
            leftIcon={<HelpCircle className="size-4" />}
            className="font-bold cursor-pointer"
          >
            FAQs ({guide.faqs?.length ?? 0})
          </PrimaryButton>
        </Link>

        {canPublish && guide.status !== "PUBLISHED" && (
          <PrimaryButton
            type="button"
            variant="success"
            size="sm"
            rounded="md"
            leftIcon={<CheckCircle2 className="size-4" />}
            isLoading={isPublishing}
            onClick={handlePublishNow}
            className="font-bold cursor-pointer"
          >
            Publish
          </PrimaryButton>
        )}

        <Link href={`/admin/guides/${guide.id}/edit`}>
          <PrimaryButton
            type="button"
            variant="primary"
            size="sm"
            rounded="md"
            leftIcon={<Pencil className="size-4" />}
            className="font-bold cursor-pointer"
          >
            Edit Guide
          </PrimaryButton>
        </Link>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          title="Delete Guide"
          aria-label="Delete Guide"
          className="size-9 rounded-md border border-border-peach hover:border-destructive bg-card hover:bg-tint-rose text-destructive flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    );

    return () => setHeaderAction(null);
  }, [
    setHeaderAction,
    guide,
    canPublish,
    isPublishing,
    isDownloadingZip,
    isImportingZip,
  ]);

  // Exact Layout Skeleton while loading
  if (isLoading) {
    return (
      <div className="w-full space-y-6 pb-12">
        <div className="w-full rounded-lg bg-card border border-border-peach p-6 sm:p-10 space-y-6 animate-pulse">
          <div className="h-10 w-3/4 rounded-lg bg-surface-muted" />
          <div className="h-6 w-1/2 rounded-lg bg-surface-muted" />
          <div className="h-12 w-full rounded-lg bg-surface-muted" />
          <div className="h-80 w-full rounded-lg bg-surface-muted" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-surface-muted" />
            <div className="h-4 w-11/12 rounded bg-surface-muted" />
            <div className="h-4 w-4/5 rounded bg-surface-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !guide) {
    return (
      <div className="w-full p-12 text-center rounded-lg bg-card border border-border-peach space-y-4">
        <AlertCircle className="size-12 text-coral mx-auto" />
        <h3 className="text-lg font-bold font-quicksand text-ink">
          Guide Not Found
        </h3>
        <p className="text-xs text-ink-muted">
          This guide could not be loaded or may have been deleted.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <PrimaryButton
            variant="outline"
            size="sm"
            rounded="md"
            onClick={() => router.push("/admin/guides/all")}
          >
            Back to All Guides
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            size="sm"
            rounded="md"
            onClick={() => refetch()}
          >
            Retry
          </PrimaryButton>
        </div>
      </div>
    );
  }

  const isAuthorSuperAdmin = guide.author?.role?.toUpperCase() === "SUPERADMIN";
  const authorName = isAuthorSuperAdmin
    ? "Super Admin"
    : guide.author?.name || "Editor";
  const statusBadge = STATUS_BADGE_MAP[guide.status] || {
    label: guide.status,
    className: "bg-surface-muted text-ink-muted border border-border-peach",
  };
  const bnVariant = guide.translations?.bn;
  const isBanglaActive = activeLangTab === "bn";
  const hasBnContent = Boolean(bnVariant?.title?.trim());
  const displayTitle = (isBanglaActive && hasBnContent ? bnVariant?.title : guide.title) || "";
  const displayExcerpt = isBanglaActive && hasBnContent ? bnVariant?.excerpt : guide.excerpt;
  const displayContent = (isBanglaActive && hasBnContent ? bnVariant?.content : guide.content) || "";
  const bnFaqs = Array.isArray(bnVariant?.faqs) ? bnVariant.faqs : [];
  const faqs = [
    ...(isBanglaActive && bnFaqs.length > 0 ? bnFaqs : guide.faqs || []),
  ].sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  return (
    <div className="w-full space-y-6 pb-12">
      <AnimatedContainer delay={0.05}>
        <div className="w-full bg-card border border-border-peach rounded-lg p-6 sm:p-10 space-y-7 shadow-xs">
          {/* Language Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-peach">
            <div className="inline-flex p-1 bg-surface-muted rounded-lg border border-border-peach">
              <button
                type="button"
                onClick={() => setActiveLangTab("en")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                  activeLangTab === "en"
                    ? "bg-card text-ink shadow-xs"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                <span>🇺🇸</span>
                <span>English (Primary)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab("bn")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                  activeLangTab === "bn"
                    ? "bg-card text-ink shadow-xs"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                <span>🇧🇩</span>
                <span>বাংলা (Bangla)</span>
                {hasBnContent && (
                  <span
                    className="size-2 rounded-full bg-emerald-500 inline-block"
                    title="Curated translation present"
                  />
                )}
              </button>
            </div>

            {isBanglaActive && hasBnContent && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-tint-mint text-success border border-success/30 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                Curated Bangla Translation (Active)
              </span>
            )}
          </div>

          {/* Missing Bangla Notice */}
          {isBanglaActive && !hasBnContent && (
            <div className="p-4 rounded-lg bg-tint-cream border border-warning/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-ink font-quicksand flex items-center gap-1.5">
                  <AlertCircle className="size-4 text-warning shrink-0" />
                  No Curated Bangla Translation Saved Yet
                </p>
                <p className="text-xs text-ink-muted">
                  Showing default English below. Bangla visitors will see Google auto-translation until a curated Bangla version is added.
                </p>
              </div>
              <Link href={`/admin/guides/${guide.id}/edit`}>
                <PrimaryButton size="sm" variant="primary" rounded="md" className="shrink-0 font-bold">
                  + Add Bangla Version
                </PrimaryButton>
              </Link>
            </div>
          )}

          {/* Title */}
          <h1
            translate={isBanglaActive && hasBnContent ? "no" : undefined}
            className={cn(
              "text-2xl sm:text-4xl font-bold font-quicksand text-ink leading-tight break-words",
              isBanglaActive && hasBnContent && "notranslate"
            )}
          >
            {displayTitle}
          </h1>

          {/* Author & Engagement Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-ink-muted border-y border-border-peach/80 py-3.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-full bg-coral/10 text-coral flex items-center justify-center font-bold text-xs">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-ink">{authorName}</span>
                <span className="text-ink-faint">
                  ({isAuthorSuperAdmin ? "Super Admin" : guide.author?.role || "Author"})
                </span>
              </div>

              <span className="text-border-peach">•</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                <Tag className="size-3.5 text-coral" />
                <span>{guide.category?.name || "General Care"}</span>
              </span>

              {guide.species?.name && (
                <>
                  <span className="text-border-peach">•</span>
                  <span className="inline-flex items-center gap-1 text-ink-muted">
                    <span>{guide.species.name}</span>
                    {guide.breeds && guide.breeds.length > 0 && (
                      <span className="text-ink-faint">
                        ({guide.breeds.map((b) => b.name).join(", ")})
                      </span>
                    )}
                  </span>
                </>
              )}

              <span className="text-border-peach">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5 text-coral" />
                <span>{guide.readTimeMinutes || 1} min read</span>
              </span>

              <span className="text-border-peach">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5 text-ink-faint" />
                <span>Updated {formatDate(guide.updatedAt || guide.createdAt)}</span>
              </span>

              <span className="text-border-peach">•</span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    guide.status === "PUBLISHED" && "bg-emerald-500",
                    guide.status === "IN_REVIEW" && "bg-amber-500",
                    guide.status === "DRAFT" && "bg-slate-400",
                    guide.status === "ARCHIVED" && "bg-rose-500"
                  )}
                />
                <span
                  className={cn(
                    "font-semibold",
                    guide.status === "PUBLISHED" && "text-emerald-600 dark:text-emerald-400",
                    guide.status === "IN_REVIEW" && "text-amber-600 dark:text-amber-400",
                    guide.status === "DRAFT" && "text-ink-muted",
                    guide.status === "ARCHIVED" && "text-rose-600 dark:text-rose-400"
                  )}
                >
                  {statusBadge.label}
                </span>
              </span>

              {guide.displayOrder > 0 && (
                <>
                  <span className="text-border-peach">•</span>
                  <span className="inline-flex items-center gap-1 text-ink-faint">
                    Order #{guide.displayOrder}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 font-semibold text-ink">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="size-3.5 text-coral" />
                {(guide.viewCount ?? 0).toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ThumbsUp className="size-3.5 text-coral" />
                {(guide.likeCount ?? 0).toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bookmark className="size-3.5 text-coral" />
                {(guide.bookmarkCount ?? 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          {displayExcerpt && (
            <div
              translate={isBanglaActive && hasBnContent ? "no" : undefined}
              className={cn(
                "p-4 sm:p-5 rounded-lg bg-surface-muted/60 border border-border-peach/70",
                isBanglaActive && hasBnContent && "notranslate"
              )}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-coral font-quicksand mb-1">
                Executive Summary
              </p>
              <p className="text-sm sm:text-base text-ink font-medium leading-relaxed italic">
                &ldquo;{displayExcerpt}&rdquo;
              </p>
            </div>
          )}

          {/* Hero Cover Photo */}
          {guide.coverImage && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border-peach bg-surface-muted shadow-xs">
              <Image
                src={guide.coverImage}
                alt={guide.coverImageAlt || guide.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}

          {/* Full Rendered Article Body */}
          <div
            translate={isBanglaActive && hasBnContent ? "no" : undefined}
            className={cn("pt-2", isBanglaActive && hasBnContent && "notranslate")}
          >
            <ArticleContentRenderer content={displayContent} />
          </div>

          {guide.tags && guide.tags.length > 0 && (
            <div className="pt-4 border-t border-border-peach/70">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 font-quicksand">
                Tags ({guide.tags.length})
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {guide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-muted text-ink border border-border-peach"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </AnimatedContainer>

      {/* Attached Guide FAQs Section */}
      <AnimatedContainer delay={0.12}>
        <div className="w-full bg-card border border-border-peach rounded-lg p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-peach pb-3.5">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-5 text-coral" />
              <h2 className="text-base sm:text-lg font-bold font-quicksand text-ink">
                Attached Guide FAQs ({faqs.length})
              </h2>
            </div>
            <Link href={`/admin/guides/${guide.id}/faqs`}>
              <PrimaryButton
                type="button"
                variant="outline"
                size="sm"
                rounded="md"
                leftIcon={<HelpCircle className="size-4" />}
                className="font-bold cursor-pointer"
              >
                Manage FAQs
              </PrimaryButton>
            </Link>
          </div>

          {faqs.length === 0 ? (
            <p className="text-xs text-ink-muted py-4 text-center">
              No FAQs attached to this guide yet.
            </p>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const faqKey = faq.id || `faq-${idx}`;
                const isOpen = expandedFaqId === faqKey;
                return (
                  <div
                    key={faqKey}
                    className="rounded-lg border border-border-peach bg-surface-soft/50 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isOpen ? null : faqKey)}
                      className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-surface-muted/40 transition-colors"
                    >
                      <span className="text-sm font-bold font-quicksand text-ink">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="size-4 text-coral shrink-0" />
                      ) : (
                        <ChevronDown className="size-4 text-ink-muted shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-ink-muted leading-relaxed border-t border-border-peach/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AnimatedContainer>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        variant="danger"
        title={`Delete "${guide.title}"?`}
        description="Are you sure you want to delete this guide? It will be permanently removed from the editorial directory."
        confirmText="Yes, Delete Guide"
        cancelText="Cancel"
      />
    </div>
  );
}
