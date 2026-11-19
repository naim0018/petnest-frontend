"use client";

import React, { use, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
import ImageUpload from "@/components/common/ImageUpload";
import ConfirmModal from "@/components/reuseable/ConfirmModal";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useFindOneEditorialQuery,
  useUpdateGuideMutation,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useRemoveFaqMutation,
} from "@/store/Api/Guides/guides.api";
import { useUploadMediaMutation } from "@/store/Api/Media/media.api";
import type { GuideFaq } from "@/store/Api/Guides/guides.types";
import {
  HelpCircle,
  Plus,
  CheckCircle2,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  BookOpen,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  Image as ImageIcon,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function GuideFaqsManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const guideId = resolvedParams.id;
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();

  // Fetch guide details + attached FAQs (works for AUTHOR, VET, ADMIN, SUPERADMIN)
  const {
    data: guideResponse,
    isLoading,
    isError,
    refetch,
  } = useFindOneEditorialQuery(guideId, {
    refetchOnMountOrArgChange: true,
  });

  const guide = guideResponse?.data;
  const faqs: GuideFaq[] = useMemo(() => {
    const list = guide?.faqs || [];
    return [...list].sort(
      (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
    );
  }, [guide]);

  // Mutations
  const [uploadMedia] = useUploadMediaMutation();
  const [updateGuide, { isLoading: isUpdatingGuide }] = useUpdateGuideMutation();
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [removeFaq, { isLoading: isDeleting }] = useRemoveFaqMutation();

  // Single FAQ Section Image state (deferred upload on save!)
  const [faqImageFile, setFaqImageFile] = useState<File | null>(null);
  const [faqImagePreview, setFaqImagePreview] = useState<string>("");
  const [isSavingImage, setIsSavingImage] = useState(false);

  // Sync saved faqImage when guide loads
  useEffect(() => {
    if (guide && !faqImageFile) {
      setFaqImagePreview(guide.faqImage || "");
    }
  }, [guide, faqImageFile]);

  const hasFaqImageChanges =
    Boolean(faqImageFile) || (guide ? (guide.faqImage || "") !== faqImagePreview : false);

  // FAQ Form state (create or inline edit)
  const [editingFaq, setEditingFaq] = useState<GuideFaq | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>(
    {}
  );

  // Accordion expanded state for live preview
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Delete confirmation modal state
  const [faqToDelete, setFaqToDelete] = useState<GuideFaq | null>(null);

  // Auto-increment next displayOrder when adding a new FAQ
  useEffect(() => {
    if (!editingFaq) {
      setDisplayOrder(faqs.length);
    }
  }, [faqs.length, editingFaq]);

  // Header action: Finish button
  useEffect(() => {
    setHeaderAction(
      <PrimaryButton
        type="button"
        variant="primary"
        size="sm"
        rounded="md"
        leftIcon={<Check className="size-4" />}
        onClick={() => router.push("/admin/guides/all")}
        className="font-bold cursor-pointer"
      >
        Done &amp; Go to Guides
      </PrimaryButton>
    );

    return () => setHeaderAction(null);
  }, [setHeaderAction, router]);

  // Save single FAQ section image (uploads file ONLY on click!)
  const handleSaveFaqImage = async () => {
    setIsSavingImage(true);
    try {
      let finalFaqImageUrl: string | null = null;

      if (faqImageFile) {
        toast.info("Uploading FAQ image...");
        const formData = new FormData();
        formData.append("file", faqImageFile);
        formData.append("folder", "guides");
        const uploadRes = await uploadMedia(formData).unwrap();
        if (uploadRes?.data?.url) {
          finalFaqImageUrl = uploadRes.data.url;
        }
      } else if (faqImagePreview && !faqImagePreview.startsWith("blob:")) {
        finalFaqImageUrl = faqImagePreview.trim() || null;
      }

      await updateGuide({
        id: guideId,
        payload: { faqImage: finalFaqImageUrl },
      }).unwrap();

      if (faqImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(faqImagePreview);
      }

      setFaqImageFile(null);
      setFaqImagePreview(finalFaqImageUrl || "");
      toast.success(
        finalFaqImageUrl
          ? "FAQ section image saved!"
          : "FAQ section image removed."
      );
      refetch();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string | string[] } })?.data?.message ||
        "Failed to save FAQ section image.";
      toast.error(Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg);
    } finally {
      setIsSavingImage(false);
    }
  };

  const resetForm = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setDisplayOrder(faqs.length);
    setIsActive(true);
    setErrors({});
  };

  const handleStartEdit = (faq: GuideFaq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setDisplayOrder(faq.displayOrder ?? 0);
    setIsActive(faq.isActive ?? true);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQ = question.trim();
    const trimmedA = answer.trim();
    const nextErrors: { question?: string; answer?: string } = {};

    if (trimmedQ.length < 5) {
      nextErrors.question = "Question must be at least 5 characters long.";
    } else if (trimmedQ.length > 250) {
      nextErrors.question = "Question cannot exceed 250 characters.";
    }

    if (trimmedA.length < 10) {
      nextErrors.answer = "Answer must be at least 10 characters long.";
    } else if (trimmedA.length > 2000) {
      nextErrors.answer = "Answer cannot exceed 2000 characters.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fix the FAQ form errors before saving.");
      return;
    }

    setErrors({});

    try {
      // If user also picked an unsaved FAQ image file, upload & save it cleanly first
      if (faqImageFile) {
        await handleSaveFaqImage();
      }

      if (editingFaq) {
        await updateFaq({
          id: editingFaq.id,
          payload: {
            question: trimmedQ,
            answer: trimmedA,
            displayOrder: Number(displayOrder) || 0,
            isActive,
            guideId,
          },
        }).unwrap();
        toast.success("FAQ updated successfully!");
      } else {
        // Attach strictly by guideId (no speciesId needed for guide-specific FAQs)
        await createFaq({
          guideId,
          question: trimmedQ,
          answer: trimmedA,
          displayOrder: Number(displayOrder) || 0,
          isActive,
        }).unwrap();
        toast.success("FAQ added to guide!");
      }

      resetForm();
      refetch();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string | string[] } })?.data?.message ||
        "Failed to save FAQ. Please try again.";
      toast.error(Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg);
    }
  };

  const handleToggleActive = async (faq: GuideFaq) => {
    try {
      await updateFaq({
        id: faq.id,
        payload: {
          isActive: !faq.isActive,
          guideId,
        },
      }).unwrap();
      toast.success(
        !faq.isActive ? "FAQ set to Active" : "FAQ hidden from readers"
      );
      refetch();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to update FAQ visibility.";
      toast.error(errorMsg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return;
    try {
      await removeFaq(faqToDelete.id).unwrap();
      toast.success("FAQ deleted successfully.");
      if (editingFaq?.id === faqToDelete.id) {
        resetForm();
      }
      setFaqToDelete(null);
      refetch();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to delete FAQ.";
      toast.error(errorMsg);
    }
  };

  // Loading Skeleton (No centered spinner)
  if (isLoading) {
    return (
      <div className="w-full space-y-6 pb-12">
        <div className="h-24 rounded-xl bg-card border border-border-peach p-5 animate-pulse space-y-3">
          <div className="h-5 w-64 bg-surface-muted rounded" />
          <div className="h-3.5 w-96 bg-surface-muted rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-96 rounded-xl bg-card border border-border-peach animate-pulse" />
          <div className="lg:col-span-7 h-96 rounded-xl bg-card border border-border-peach animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !guide) {
    return (
      <div className="w-full p-12 text-center rounded-xl bg-card border border-border-peach space-y-4">
        <AlertCircle className="size-12 text-coral mx-auto" />
        <h3 className="text-lg font-bold font-quicksand text-ink">
          Guide Not Found
        </h3>
        <p className="text-xs text-ink-muted">
          Could not load the target guide to manage its FAQs.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <PrimaryButton
            variant="outline"
            size="sm"
            rounded="md"
            onClick={() => router.push("/admin/guides/all")}
          >
            Go to Guides
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

  const isSaving = isCreating || isUpdating || isSavingImage;

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Guide Context Summary Banner */}
      <AnimatedContainer delay={0.05}>
        <div className="w-full rounded-xl bg-card border border-border-peach p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="size-11 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center text-coral shrink-0">
              <HelpCircle className="size-5.5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold font-quicksand text-ink tracking-tight truncate">
                  Guide FAQs &amp; Visual
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-tint-rose text-coral border border-coral/20">
                  {guide.status.replace("_", " ")}
                </span>
                {guide.category?.name && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-surface-muted text-ink-muted border border-border-peach">
                    {guide.category.name}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-ink-muted mt-1 flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-coral shrink-0" />
                <span className="truncate font-semibold text-ink">
                  {guide.title}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-lg bg-surface-muted/70 border border-border-peach text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Attached FAQs
              </p>
              <p className="text-base font-bold font-quicksand text-coral">
                {faqs.length}
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Two-Column Full-Width Layout: Left Controls + Right Live Common Questions Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Left Column: FAQ Section Visual + Add/Edit FAQ Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Single Left-Side FAQ Section Image */}
          <AnimatedContainer delay={0.08}>
            <div className="rounded-xl bg-card border border-border-peach p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border-peach pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="size-4 text-coral" />
                  <h2 className="text-sm font-bold font-quicksand text-ink">
                    FAQ Section Image
                  </h2>
                </div>
                {hasFaqImageChanges && (
                  <PrimaryButton
                    type="button"
                    variant="primary"
                    size="sm"
                    rounded="md"
                    isLoading={isSavingImage || isUpdatingGuide}
                    leftIcon={<Save className="size-3.5" />}
                    onClick={handleSaveFaqImage}
                    className="font-bold cursor-pointer"
                  >
                    Save Image
                  </PrimaryButton>
                )}
              </div>

              <ImageUpload
                value={faqImagePreview}
                onChange={setFaqImagePreview}
                onFileSelect={setFaqImageFile}
                placeholder="Click, drag & drop, or press Ctrl+V to paste FAQ image"
                helperText="Single circular pet/topic image shown on the left of Common Questions (Uploads on save)"
                allowManualInput={false}
                enableClipboardPaste={true}
                height="h-56"
                imageFit="cover"
              />
            </div>
          </AnimatedContainer>

          {/* Card 2: Create / Edit FAQ Form */}
          <AnimatedContainer delay={0.12}>
            <form
              onSubmit={handleSubmit}
              className="rounded-xl bg-card border border-border-peach p-5 sm:p-6 shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border-peach pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-coral" />
                  <h2 className="text-sm font-bold font-quicksand text-ink">
                    {editingFaq ? "Edit Guide FAQ" : "Add New Guide FAQ"}
                  </h2>
                </div>
                {editingFaq && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs font-bold text-coral hover:underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <FormInput
                label="Question"
                required
                placeholder="e.g., Can budgies eat bananas?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                error={errors.question}
                helperText={`${question.length}/250 characters (min 5)`}
              />

              <FormTextarea
                label="Answer"
                required
                rows={4}
                placeholder="Write a clear, helpful veterinary-backed answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                error={errors.answer}
                helperText={`${answer.length}/2000 characters (min 10)`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <FormInput
                  label="Display Order"
                  type="number"
                  min={0}
                  value={displayOrder}
                  onChange={(e) =>
                    setDisplayOrder(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  helperText="Lower appears first"
                />

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Visibility
                  </label>
                  <div className="flex items-center gap-3 pt-1.5">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-peach after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral" />
                      <span className="ml-2.5 text-xs font-bold font-quicksand text-ink">
                        {isActive ? "Active" : "Hidden"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-peach">
                {editingFaq && (
                  <PrimaryButton
                    type="button"
                    variant="outline"
                    size="sm"
                    rounded="md"
                    onClick={resetForm}
                  >
                    Cancel
                  </PrimaryButton>
                )}
                <PrimaryButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  rounded="md"
                  isLoading={isSaving}
                  leftIcon={
                    editingFaq ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      <Plus className="size-4" />
                    )
                  }
                  className="font-bold cursor-pointer"
                >
                  {editingFaq ? "Update FAQ" : "Add FAQ to Guide"}
                </PrimaryButton>
              </div>
            </form>
          </AnimatedContainer>
        </div>

        {/* Right Column: Sticky Live Reader "Common Questions" Preview + Management */}
        <div className="lg:col-span-7 lg:sticky lg:top-20 space-y-5">
          <AnimatedContainer delay={0.15}>
            <div className="rounded-xl bg-card border border-border-peach shadow-xs overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-peach bg-surface-muted/40">
                <div className="flex items-center gap-2">
                  <Eye className="size-4 text-coral" />
                  <h2 className="text-xs font-bold uppercase tracking-wider font-quicksand text-ink">
                    Live Guide Details FAQ Preview ({faqs.length})
                  </h2>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Realtime
                </div>
              </div>

              {/* Exact "Common Questions" Reader Section Layout */}
              <div className="p-5">
                <div className="rounded-2xl bg-tint-mint/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 p-5 sm:p-7">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Left Side: Heading + Single Circular Image */}
                    <div className="md:col-span-4 flex flex-col items-start space-y-4">
                      <div>
                        <h3 className="text-xl font-bold font-quicksand text-ink tracking-tight">
                          Common Questions
                        </h3>
                        <p className="text-xs font-medium text-ink-muted mt-1">
                          Quick answers to help you right away.
                        </p>
                      </div>

                      <div className="relative size-32 sm:size-36 rounded-full bg-white dark:bg-card border border-border-peach/70 shadow-xs overflow-hidden flex items-center justify-center">
                        {faqImagePreview ? (
                          <Image
                            src={faqImagePreview}
                            alt={guide.title || "FAQ visual"}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center px-3 text-ink-faint">
                            <ImageIcon className="size-7 mb-1 opacity-60" />
                            <span className="text-[10px] font-semibold leading-tight">
                              Add FAQ image on left
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side: FAQ Accordion Stack */}
                    <div className="md:col-span-8 space-y-2.5">
                      {/* Live Draft Row while typing a new FAQ */}
                      {!editingFaq && (question.trim() || answer.trim()) && (
                        <div className="rounded-xl border-2 border-dashed border-coral/40 bg-card/90 p-4 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-coral">
                              Live Draft Preview
                            </span>
                            <span className="text-[10px] font-mono text-ink-muted">
                              #{displayOrder}
                            </span>
                          </div>
                          <p className="text-sm font-bold font-quicksand text-ink">
                            {question.trim() || "Your question preview..."}
                          </p>
                          <p className="text-xs sm:text-sm font-medium text-ink leading-relaxed whitespace-pre-line">
                            {answer.trim() || "Your answer preview will appear here..."}
                          </p>
                        </div>
                      )}

                      {faqs.length === 0 ? (
                        <div className="py-10 px-5 text-center rounded-xl border border-dashed border-border-peach bg-card/80 space-y-2">
                          <HelpCircle className="size-8 text-ink-faint mx-auto opacity-60" />
                          <p className="text-sm font-bold font-quicksand text-ink">
                            No FAQs Attached Yet
                          </p>
                          <p className="text-xs text-ink-muted">
                            Add questions on the left to preview them here.
                          </p>
                        </div>
                      ) : (
                        faqs.map((faq) => {
                          const isExpanded = expandedFaqId === faq.id;
                          const isBeingEdited = editingFaq?.id === faq.id;
                          return (
                            <div
                              key={faq.id}
                              className={cn(
                                "rounded-xl bg-card border transition-all overflow-hidden",
                                isBeingEdited
                                  ? "border-coral ring-2 ring-coral/15"
                                  : "border-border-peach/80 hover:border-coral/40"
                              )}
                            >
                              <div className="px-4 py-3 flex items-center justify-between gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedFaqId(isExpanded ? null : faq.id)
                                  }
                                  className="flex items-center justify-between gap-2 text-left flex-1 min-w-0 cursor-pointer"
                                >
                                  <span className="text-sm font-bold font-quicksand text-ink truncate">
                                    {faq.question}
                                  </span>
                                  <span className="text-ink-muted shrink-0">
                                    {isExpanded ? (
                                      <ChevronDown className="size-4 text-coral" />
                                    ) : (
                                      <ChevronRight className="size-4" />
                                    )}
                                  </span>
                                </button>

                                {/* Inline Admin Controls */}
                                <div className="flex items-center gap-1 shrink-0 pl-2 border-l border-border-peach/60">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleActive(faq)}
                                    title={
                                      faq.isActive
                                        ? "Active (Click to hide)"
                                        : "Hidden (Click to show)"
                                    }
                                    className={cn(
                                      "p-1.5 rounded-md border transition-colors cursor-pointer",
                                      faq.isActive
                                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200 dark:border-emerald-800"
                                        : "bg-surface-muted text-ink-muted border-border-peach"
                                    )}
                                  >
                                    {faq.isActive ? (
                                      <Eye className="size-3.5" />
                                    ) : (
                                      <EyeOff className="size-3.5" />
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleStartEdit(faq)}
                                    title="Edit FAQ"
                                    className="p-1.5 rounded-md border border-border-peach bg-card hover:border-coral text-ink-muted hover:text-coral transition-colors cursor-pointer"
                                  >
                                    <Pencil className="size-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setFaqToDelete(faq)}
                                    title="Delete FAQ"
                                    className="p-1.5 rounded-md border border-border-peach bg-card hover:border-destructive text-ink-muted hover:text-destructive transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="px-4 pb-4 pt-2 border-t border-border-peach/60 bg-surface-soft/50">
                                  <p className="text-sm font-medium text-ink leading-relaxed whitespace-pre-line">
                                    {faq.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>

      {/* Reusable Confirm Modal for FAQ Deletion */}
      <ConfirmModal
        isOpen={Boolean(faqToDelete)}
        onClose={() => setFaqToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        variant="danger"
        title={`Delete FAQ "${faqToDelete?.question || ""}"?`}
        description="This FAQ will be permanently removed from this guide. This action cannot be undone."
        confirmText="Yes, Delete FAQ"
        cancelText="Cancel"
      />
    </div>
  );
}
