"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import FormSelect from "@/components/common/FormSelect";
import { FormInput } from "@/components/common/FormInput";
import TagsInput from "@/components/common/DynamicForm/FormFields/TagsInput";
import ImageUpload from "@/components/common/ImageUpload";
import ConfirmModal from "@/components/reuseable/ConfirmModal";
import ProcessingModal, {
  type ProcessingStep,
} from "@/components/reuseable/ProcessingModal";
import RichTextEditor, {
  ArticleContentRenderer,
} from "@/components/admin/guides/RichTextEditor";
import { useHeaderAction } from "@/context/HeaderActionContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import guidesApi, {
  useFindAllCategoriesPublicQuery,
  useCreateGuideMutation,
  useUpdateGuideMutation,
  useGenerateGuideAiMutation,
  useCreateFaqsBulkMutation,
} from "@/store/Api/Guides/guides.api";
import type { GuideTranslationsMap } from "@/store/Api/Guides/guides.types";
import {
  useAllSpeciesDropdown,
  useBreedsBySpeciesDropdown,
} from "@/hooks/usePetQueries";
import { useUploadMediaMutation } from "@/store/Api/Media/media.api";
import {
  Cpu,
  BookOpen,
  Image as ImageIcon,
  Save,
  Send,
  CheckCircle2,
  HelpCircle,
  Eye,
  Columns2,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Wand2,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CreateGuidePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setHeaderAction } = useHeaderAction();

  // Mode: side-by-side split (default) or full-width reader preview
  const [viewMode, setViewMode] = useState<"split" | "preview">("split");

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [breedId, setBreedId] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  // Localized Bangla Variant State (Optional)
  const [activeLanguageTab, setActiveLanguageTab] = useState<"en" | "bn">("en");
  const [banglaTitle, setBanglaTitle] = useState("");
  const [banglaExcerpt, setBanglaExcerpt] = useState("");
  const [banglaContent, setBanglaContent] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>("");
  const [pendingBodyImages, setPendingBodyImages] = useState<Map<string, File>>(
    () => new Map()
  );
  const [isProcessingUploads, setIsProcessingUploads] = useState(false);
  const [customReadTime, setCustomReadTime] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [createdGuide, setCreatedGuide] = useState<{
    id: string;
    title: string;
    status: "DRAFT" | "IN_REVIEW" | "PUBLISHED";
  } | null>(null);

  // Existing/Auto-Saved Guide ID from AI generation
  const [savedGuideId, setSavedGuideId] = useState<string | null>(null);

  // AI Guide Generation State
  const [aiTopic, setAiTopic] = useState("");
  const [aiCategoryId, setAiCategoryId] = useState("");
  const [aiSaveDirectly, setAiSaveDirectly] = useState(true);

  // Auto-populated / Staged FAQs
  const [stagedFaqs, setStagedFaqs] = useState<
    { question: string; answer: string; displayOrder?: number; isActive?: boolean }[]
  >([]);
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(null);

  const [processingState, setProcessingState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    progress: number;
    steps: ProcessingStep[];
  }>({
    isOpen: false,
    title: "",
    description: "",
    progress: 0,
    steps: [],
  });

  // Redux Auth User
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAppSelector((state) => (state.auth as any)?.user);
  const isSuperAdmin = user?.role?.toUpperCase() === "SUPERADMIN";
  const authorName = isSuperAdmin
    ? "Super Admin"
    : user?.name || (user?.email ? user.email.split("@")[0] : "Editor");

  // Queries: Real Categories, Species, and Breeds
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useFindAllCategoriesPublicQuery();
  const { data: speciesList = [], isLoading: isLoadingSpecies } =
    useAllSpeciesDropdown();
  const { data: breedList = [], isLoading: isLoadingBreeds } =
    useBreedsBySpeciesDropdown(speciesId);

  // Mutations
  const [createGuide, { isLoading: isSubmitting }] = useCreateGuideMutation();
  const [updateGuide, { isLoading: isUpdatingGuide }] = useUpdateGuideMutation();
  const [generateGuideAi, { isLoading: isGeneratingAi }] =
    useGenerateGuideAiMutation();
  const [createFaqsBulk] = useCreateFaqsBulkMutation();
  const [uploadMedia, { isLoading: isUploadingCover }] = useUploadMediaMutation();

  // Options for FormSelect (always pin default "Basic" category to the top)
  const categories = useMemo(() => {
    const list = categoriesResponse?.data || [];
    return [...list].sort((a, b) => {
      const aIsBasic = a.slug.toLowerCase() === "basic";
      const bIsBasic = b.slug.toLowerCase() === "basic";
      if (aIsBasic && !bIsBasic) return -1;
      if (!aIsBasic && bIsBasic) return 1;
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    });
  }, [categoriesResponse]);

  const basicCategory = useMemo(
    () => categories.find((cat) => cat.slug.toLowerCase() === "basic"),
    [categories]
  );

  // Pre-select default "Basic" category when loaded
  useEffect(() => {
    if (!categoryId && basicCategory?.id) {
      setCategoryId(basicCategory.id);
    }
  }, [categoryId, basicCategory]);

  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => ({
        value: cat.id,
        label:
          cat.slug.toLowerCase() === "basic" ? "Basic (Default)" : cat.name,
      })),
    [categories]
  );

  const speciesOptions = useMemo(
    () => [
      { value: "", label: "All Species (General Guide)" },
      ...speciesList.map((sp) => ({
        value: sp.id,
        label: sp.name,
        icon: sp.image ? (
          <span className="relative size-5 rounded-full overflow-hidden border border-border-peach bg-surface-muted shrink-0 block">
            <Image
              src={sp.image}
              alt={sp.name}
              fill
              unoptimized
              className="object-cover"
            />
          </span>
        ) : (
          <span className="size-5 rounded-full bg-coral/10 text-coral font-bold text-[10px] flex items-center justify-center shrink-0">
            {sp.name.charAt(0)}
          </span>
        ),
      })),
    ],
    [speciesList]
  );

  const breedOptions = useMemo(
    () => [
      { value: "", label: "All Breeds / General" },
      ...breedList.map((b) => ({
        value: b.id,
        label: b.name,
        icon: b.image ? (
          <span className="relative size-5 rounded-full overflow-hidden border border-border-peach bg-surface-muted shrink-0 block">
            <Image
              src={b.image}
              alt={b.name}
              fill
              unoptimized
              className="object-cover"
            />
          </span>
        ) : (
          <span className="size-5 rounded-full bg-coral/10 text-coral font-bold text-[10px] flex items-center justify-center shrink-0">
            {b.name.charAt(0)}
          </span>
        ),
      })),
    ],
    [breedList]
  );

  // Auto-calculated read time
  const autoReadTimeMinutes = useMemo(() => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [content]);

  const displayReadTime = customReadTime || `${autoReadTimeMinutes} min read`;

  // Selected names for preview
  const selectedCategoryName = useMemo(() => {
    const found = categories.find((c) => c.id === categoryId);
    return found ? found.name : "Basic";
  }, [categories, categoryId]);

  const selectedSpeciesName = useMemo(() => {
    const found = speciesList.find((s) => s.id === speciesId);
    return found ? found.name : null;
  }, [speciesList, speciesId]);

  const selectedBreedName = useMemo(() => {
    const found = breedList.find((b) => b.id === breedId);
    return found ? found.name : null;
  }, [breedList, breedId]);

  const handleRegisterPendingImage = (blobUrl: string, file: File) => {
    setPendingBodyImages((prev) => {
      const next = new Map(prev);
      next.set(blobUrl, file);
      return next;
    });
  };

  // Handle AI Full Guide Generation
  const handleGenerateAi = async () => {
    if (!aiTopic.trim()) {
      toast.error("Please enter a guide topic for AI generation");
      return;
    }

    try {
      const res = await generateGuideAi({
        topic: aiTopic.trim(),
        categoryId: aiCategoryId || categoryId || basicCategory?.id,
        speciesId: speciesId || undefined,
        saveToDb: aiSaveDirectly,
      }).unwrap();

      const data = res?.data;
      if (!data) {
        toast.error("No content returned from AI generator");
        return;
      }

      setTitle(data.title);
      setSummary(data.summary);
      setContent(data.content);
      if (data.tags && data.tags.length > 0) {
        setTags(data.tags);
      }
      if (data.readTime) {
        setCustomReadTime(`${data.readTime} min read`);
      }
      if (data.coverImage) {
        setCoverPreviewUrl(data.coverImage);
      }
      if (aiCategoryId) {
        setCategoryId(aiCategoryId);
      }
      if (data.faqs && data.faqs.length > 0) {
        setStagedFaqs(
          data.faqs.map((f, i) => ({
            question: f.question,
            answer: f.answer,
            displayOrder: i,
            isActive: true,
          }))
        );
      }

      if (data.savedGuideId) {
        setSavedGuideId(data.savedGuideId);
        toast.success(
          `AI Guide & FAQs generated and saved as Draft to database!`
        );
      } else {
        toast.success("AI Guide & FAQs generated and populated in editor!");
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to generate guide with AI. Please ensure GEMINI_API_KEY is configured in server environment.";
      toast.error(errorMsg);
    }
  };

  const formStateRef = React.useRef({
    title,
    categoryId,
    speciesId,
    breedId,
    summary,
    content,
    banglaTitle,
    banglaExcerpt,
    banglaContent,
    displayOrder,
    tags,
    coverFile,
    coverPreviewUrl,
    pendingBodyImages,
    savedGuideId,
  });

  useEffect(() => {
    formStateRef.current = {
      title,
      categoryId,
      speciesId,
      breedId,
      summary,
      content,
      banglaTitle,
      banglaExcerpt,
      banglaContent,
      displayOrder,
      tags,
      coverFile,
      coverPreviewUrl,
      pendingBodyImages,
      savedGuideId,
    };
  });

  // Handle Save Draft, Submit for Review, or Direct Publish (Super Admin)
  const handleSave = async (status: "DRAFT" | "IN_REVIEW" | "PUBLISHED") => {
    const state = formStateRef.current;
    const resolvedCategoryId = state.categoryId || basicCategory?.id;
    if (!state.title.trim()) {
      toast.error("Please enter an article title");
      return;
    }
    if (!state.summary.trim()) {
      toast.error("Please provide an executive summary");
      return;
    }
    if (!state.content.trim()) {
      toast.error("Please write the article content");
      return;
    }

    const actionTitle =
      status === "PUBLISHED"
        ? "Publishing Guide"
        : status === "IN_REVIEW"
        ? "Submitting for Review"
        : "Saving Draft";

    const saveStepLabel =
      status === "PUBLISHED"
        ? "Publishing article live"
        : status === "IN_REVIEW"
        ? "Submitting to editorial queue"
        : "Saving article draft";

    let finalContent = state.content.trim();
    let finalBanglaContent = state.banglaContent.trim();

    const blobUrlsInContent = Array.from(
      new Set(finalContent.match(/blob:[^\s)"]+/g) || [])
    );
    const blobUrlsInBangla = Array.from(
      new Set(finalBanglaContent.match(/blob:[^\s)"]+/g) || [])
    );
    const allBlobUrls = Array.from(
      new Set([...blobUrlsInContent, ...blobUrlsInBangla])
    );

    const pendingBodyEntries = allBlobUrls
      .map((blobUrl) => ({ blobUrl, file: state.pendingBodyImages.get(blobUrl) }))
      .filter((entry): entry is { blobUrl: string; file: File } =>
        Boolean(entry.file)
      );

    const totalMediaUploads = (state.coverFile ? 1 : 0) + pendingBodyEntries.length;

    const initialSteps: ProcessingStep[] = [
      ...(totalMediaUploads > 0
        ? [
            {
              id: "upload",
              label: "Uploading guide images",
              status: "active" as const,
              detail: `0 / ${totalMediaUploads}`,
            },
          ]
        : []),
      {
        id: "save",
        label: saveStepLabel,
        status: totalMediaUploads > 0 ? ("pending" as const) : ("active" as const),
      },
    ];

    setIsProcessingUploads(true);
    setProcessingState({
      isOpen: true,
      title: actionTitle,
      description:
        totalMediaUploads > 0
          ? `Uploading ${totalMediaUploads} image${totalMediaUploads > 1 ? "s" : ""} in parallel...`
          : "Saving your guide to PetNest...",
      progress: totalMediaUploads > 0 ? 10 : 35,
      steps: initialSteps,
    });

    try {
      let finalCoverUrl: string | null =
        state.coverPreviewUrl && !state.coverPreviewUrl.startsWith("blob:")
          ? state.coverPreviewUrl
          : null;

      // 1. Upload Cover Photo + All Inline Body Images IN PARALLEL
      if (totalMediaUploads > 0) {
        let completedUploads = 0;

        const uploadOne = async (file: File) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", "guides");
          const uploadRes = await uploadMedia(formData).unwrap();
          completedUploads += 1;

          const uploadPercent = Math.round(
            10 + (completedUploads / totalMediaUploads) * 60
          );
          setProcessingState((prev) => ({
            ...prev,
            progress: uploadPercent,
            description: `Uploaded ${completedUploads} of ${totalMediaUploads} image${totalMediaUploads > 1 ? "s" : ""}...`,
            steps: prev.steps.map((s) =>
              s.id === "upload"
                ? {
                    ...s,
                    detail: `${completedUploads} / ${totalMediaUploads}`,
                    status:
                      completedUploads === totalMediaUploads ? "done" : "active",
                  }
                : s
            ),
          }));

          return uploadRes?.data?.url || null;
        };

        const [uploadedCoverUrl, ...uploadedBodyUrls] = await Promise.all([
          state.coverFile ? uploadOne(state.coverFile) : Promise.resolve(finalCoverUrl),
          ...pendingBodyEntries.map(({ file }) => uploadOne(file)),
        ]);

        if (uploadedCoverUrl) {
          finalCoverUrl = uploadedCoverUrl;
        }

        pendingBodyEntries.forEach(({ blobUrl }, idx) => {
          const remoteUrl = uploadedBodyUrls[idx];
          if (remoteUrl) {
            finalContent = finalContent.split(blobUrl).join(remoteUrl);
            finalBanglaContent = finalBanglaContent.split(blobUrl).join(remoteUrl);
          }
        });
      }

      // 2. Create guide on backend with finalized remote URLs
      setProcessingState((prev) => ({
        ...prev,
        progress: 80,
        description: `${saveStepLabel}...`,
        steps: prev.steps.map((s) =>
          s.id === "upload"
            ? { ...s, status: "done" }
            : s.id === "save"
            ? { ...s, status: "active" }
            : s
        ),
      }));

      let newGuideId = state.savedGuideId;
      let newGuideTitle = state.title.trim();

      const hasBanglaContent = Boolean(
        state.banglaTitle.trim() ||
        state.banglaExcerpt.trim() ||
        finalBanglaContent.trim()
      );

      const translationsPayload: GuideTranslationsMap = hasBanglaContent
        ? {
            bn: {
              title: state.banglaTitle.trim(),
              excerpt: state.banglaExcerpt.trim(),
              content: finalBanglaContent.trim(),
            },
          }
        : {};

      if (state.savedGuideId) {
        const updateRes = await updateGuide({
          id: state.savedGuideId,
          payload: {
            title: state.title.trim(),
            categoryId: resolvedCategoryId,
            speciesId: state.speciesId || null,
            breedIds: state.breedId ? [state.breedId] : undefined,
            excerpt: state.summary.trim(),
            content: finalContent,
            coverImage: finalCoverUrl,
            displayOrder: state.displayOrder,
            tags: state.tags,
            status,
            translations: translationsPayload,
          },
        }).unwrap();
        newGuideId = updateRes?.data?.id || state.savedGuideId;
        newGuideTitle = updateRes?.data?.title || state.title.trim();
      } else {
        const createdRes = await createGuide({
          title: state.title.trim(),
          categoryId: resolvedCategoryId,
          speciesId: state.speciesId || null,
          breedIds: state.breedId ? [state.breedId] : undefined,
          excerpt: state.summary.trim(),
          content: finalContent,
          coverImage: finalCoverUrl,
          displayOrder: state.displayOrder,
          tags: state.tags,
          status,
          translations: translationsPayload,
        }).unwrap();

        newGuideId = createdRes?.data?.id;
        newGuideTitle = createdRes?.data?.title || state.title.trim();
        if (newGuideId) {
          setSavedGuideId(newGuideId);
        }
      }

      // If there are staged FAQs that weren't auto-saved, attach them now
      if (newGuideId && stagedFaqs.length > 0 && !state.savedGuideId) {
        try {
          await createFaqsBulk({
            guideId: newGuideId,
            faqs: stagedFaqs.map((f, idx) => ({
              question: f.question,
              answer: f.answer,
              displayOrder: f.displayOrder ?? idx,
              isActive: f.isActive ?? true,
            })),
          }).unwrap();
        } catch {
          // FAQs can also be managed via the dedicated FAQ manager
        }
      }

      // Revoke created blobs
      if (state.coverPreviewUrl && state.coverPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(state.coverPreviewUrl);
      }
      allBlobUrls.forEach((bUrl) => URL.revokeObjectURL(bUrl));

      setProcessingState((prev) => ({
        ...prev,
        progress: 100,
        steps: prev.steps.map((s) => ({ ...s, status: "done" })),
      }));

      if (newGuideId) {
        router.prefetch(`/admin/guides/${newGuideId}/faqs`);
      }

      toast.success(
        status === "PUBLISHED"
          ? "Guide published live!"
          : status === "IN_REVIEW"
          ? "Guide submitted for editorial review!"
          : "Guide draft saved successfully!"
      );

      setProcessingState((prev) => ({ ...prev, isOpen: false }));

      if (newGuideId) {
        setCreatedGuide({ id: newGuideId, title: newGuideTitle, status });
      } else {
        router.push("/admin/guides/all");
      }
    } catch (err: unknown) {
      setProcessingState((prev) => ({ ...prev, isOpen: false }));
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to save guide. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsProcessingUploads(false);
    }
  };

  // Header Actions
  useEffect(() => {
    setHeaderAction(
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setViewMode(viewMode === "split" ? "preview" : "split")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all border cursor-pointer",
            viewMode === "preview"
              ? "bg-coral text-white border-coral shadow-xs"
              : "bg-card text-ink border-border-peach hover:border-coral/50"
          )}
        >
          {viewMode === "preview" ? (
            <>
              <Columns2 className="size-3.5" />
              <span>Split View</span>
            </>
          ) : (
            <>
              <Eye className="size-3.5" />
              <span>Full Preview</span>
            </>
          )}
        </button>

        <PrimaryButton
          type="button"
          variant="outline"
          size="sm"
          rounded="md"
          leftIcon={<Save className="size-4" />}
          onClick={() => handleSave("DRAFT")}
          disabled={isSubmitting || isProcessingUploads}
          className="font-bold cursor-pointer"
        >
          Save Draft
        </PrimaryButton>

        <PrimaryButton
          type="button"
          variant="primary"
          size="sm"
          rounded="md"
          leftIcon={
            isSuperAdmin ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <Send className="size-4" />
            )
          }
          isLoading={isSubmitting || isProcessingUploads}
          onClick={() => handleSave(isSuperAdmin ? "PUBLISHED" : "IN_REVIEW")}
          className="font-bold cursor-pointer"
        >
          {isSuperAdmin ? "Publish Guide" : "Submit for Review"}
        </PrimaryButton>
      </div>
    );

    return () => setHeaderAction(null);
  }, [
    setHeaderAction,
    viewMode,
    isSuperAdmin,
    isSubmitting,
    isProcessingUploads,
    title,
    categoryId,
    speciesId,
    breedId,
    summary,
    content,
    banglaTitle,
    banglaExcerpt,
    banglaContent,
    coverPreviewUrl,
    coverFile,
    pendingBodyImages,
  ]);

  // Shared live preview content used in both side-by-side split pane and full preview
  const renderGuidePreviewBody = (isFullWidth: boolean) => {
    const previewTitle =
      activeLanguageTab === "bn" && banglaTitle.trim()
        ? banglaTitle
        : title || "Untitled Editorial Guide";
    const previewSummary =
      activeLanguageTab === "bn" && banglaExcerpt.trim()
        ? banglaExcerpt
        : summary;
    const previewContent =
      activeLanguageTab === "bn" && banglaContent.trim()
        ? banglaContent
        : content;

    return (
      <div className={cn("space-y-6", isFullWidth && "space-y-8")}>
        {/* Guide Title */}
        <h1
          className={cn(
            "font-bold font-quicksand text-ink leading-tight break-words",
            isFullWidth ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"
          )}
        >
          {previewTitle}
        </h1>

      {/* Metadata Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted border-y border-border-peach/80 py-3">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-coral/10 text-coral flex items-center justify-center font-bold text-xs">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-ink">{authorName}</span>
          <span className="text-ink-faint">
            ({isSuperAdmin ? "Super Admin" : user?.role || "Author"})
          </span>
        </div>

        <span className="text-border-peach">•</span>
        <div className="flex items-center gap-1.5 font-medium text-ink">
          <Tag className="size-3.5 text-coral" />
          <span>{selectedCategoryName}</span>
        </div>

        {selectedSpeciesName && (
          <>
            <span className="text-border-peach">•</span>
            <div className="flex items-center gap-1 text-ink-muted">
              <span>{selectedSpeciesName}</span>
              {selectedBreedName && (
                <span className="text-ink-faint">({selectedBreedName})</span>
              )}
            </div>
          </>
        )}

        <span className="text-border-peach">•</span>
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5 text-coral" />
          <span>{displayReadTime}</span>
        </div>

        <span className="text-border-peach">•</span>
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5 text-ink-faint" />
          <span>Today</span>
        </div>

        <span className="text-border-peach">•</span>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-500" />
          <span className="font-semibold text-amber-600">Draft Preview</span>
        </div>

        {displayOrder > 0 && (
          <>
            <span className="text-border-peach">•</span>
            <span className="text-ink-faint">Order #{displayOrder}</span>
          </>
        )}
      </div>

      {/* Executive Summary Callout */}
      {previewSummary ? (
        <div className="p-4 rounded-xl bg-surface-muted/60 border border-border-peach/70">
          <p className="text-xs font-bold uppercase tracking-wider text-coral font-quicksand mb-1">
            Executive Summary
          </p>
          <p className="text-sm text-ink font-medium leading-relaxed italic">
            &ldquo;{previewSummary}&rdquo;
          </p>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-surface-muted/30 border border-dashed border-border-peach text-xs text-ink-faint italic">
          Executive summary preview will appear here as you type...
        </div>
      )}

      {/* Hero Cover Photo */}
      {coverPreviewUrl ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border-peach bg-surface-muted shadow-xs">
          <Image
            src={coverPreviewUrl}
            alt={previewTitle || "Cover photo"}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-40 rounded-lg border-2 border-dashed border-border-peach bg-surface-muted/30 flex flex-col items-center justify-center gap-1.5 text-ink-faint text-xs">
          <ImageIcon className="size-6 opacity-50" />
          <span>No featured cover photo selected</span>
        </div>
      )}

      {/* Formatted Article Body */}
      <div className="pt-1">
        <ArticleContentRenderer content={previewContent} />
      </div>

      {/* Attached FAQs Accordion Preview in Live Reader Preview */}
      {stagedFaqs.length > 0 && (
        <div className="pt-6 border-t border-border-peach/70 space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-4.5 text-coral" />
            <h3 className="text-base font-bold font-quicksand text-ink">
              Frequently Asked Questions ({stagedFaqs.length})
            </h3>
          </div>
          <div className="space-y-2.5">
            {stagedFaqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="rounded-xl border border-border-peach bg-surface-soft/40 p-4 space-y-1.5"
              >
                <p className="text-sm font-bold font-quicksand text-ink">
                  {faq.question}
                </p>
                <p className="text-xs font-medium text-ink-muted leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO & Search Tags Preview */}
      {tags.length > 0 && (
        <div className="pt-3 border-t border-border-peach/70">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 font-quicksand">
            Tags ({tags.length})
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => (
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

      {/* Veterinary Review Requirement Notice (not needed for Super Admin) */}
      {!isSuperAdmin && (
        <div className="p-4 rounded-xl bg-tint-rose/60 border border-coral/20 flex items-start gap-3">
          <HelpCircle className="size-5 text-coral shrink-0 mt-0.5" />
          <div className="text-xs text-ink space-y-1">
            <p className="font-bold text-coral">Veterinary Review Notice</p>
            <p className="text-ink-muted">
              This preview reflects formatting upon publication. Guides addressing clinical conditions, medications, or diets will undergo clinical vetting by an accredited DVM prior to general indexing.
            </p>
          </div>
        </div>
      )}
    </div>
    );
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between">
          <span>Guide draft saved successfully to the editorial queue.</span>
          <button
            onClick={() => setIsSaved(false)}
            className="text-emerald-700 dark:text-emerald-400 hover:underline text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {viewMode === "preview" ? (
        /* ======================================================== */
        /* 👁️ FULL-WIDTH LIVE GUIDE PREVIEW                         */
        /* ======================================================== */
        <AnimatedContainer delay={0.05}>
          <div className="w-full bg-card border border-border-peach rounded-lg p-6 sm:p-10 shadow-sm">
            {renderGuidePreviewBody(true)}
          </div>
        </AnimatedContainer>
      ) : (
        /* ======================================================== */
        /* ✍️ SIDE-BY-SIDE SPLIT: EDITOR (LEFT) + LIVE PREVIEW (RIGHT) */
        /* ======================================================== */
        <AnimatedContainer delay={0.05}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
            {/* Left Column: Editor + Metadata Controls */}
            <div className="lg:col-span-6 space-y-6 min-w-0">
              {/* Card 0: AI Guide Generator (Gemini Flash) */}
              <div className="rounded-lg border border-coral/30 bg-gradient-to-r from-tint-rose/40 via-card to-card p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-coral text-white flex items-center justify-center shadow-xs">
                      <Wand2 className="size-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold font-quicksand text-ink">
                          Generate Guide with AI
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-coral/10 text-coral border border-coral/20">
                          Gemini Flash
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted">
                        Prompt Gemini to generate full chapters, image prompts, and FAQs.
                      </p>
                    </div>
                  </div>

                  {savedGuideId && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Draft Saved in DB
                    </span>
                  )}
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5 font-quicksand">
                      Guide Topic / Question <span className="text-coral">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Common Health Issues in Budgies"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleGenerateAi();
                        }
                      }}
                      className="w-full px-4 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <FormSelect
                      label="CATEGORY PILLAR"
                      placeholder={
                        isLoadingCategories ? "Loading..." : "Select category..."
                      }
                      options={categoryOptions}
                      value={aiCategoryId || categoryId}
                      onChange={(val) => {
                        setAiCategoryId(val);
                        setCategoryId(val);
                      }}
                      searchable
                    />

                    <PrimaryButton
                      type="button"
                      variant="primary"
                      size="md"
                      rounded="lg"
                      isLoading={isGeneratingAi}
                      disabled={!aiTopic.trim() || isGeneratingAi}
                      leftIcon={<Cpu className="size-4" />}
                      onClick={handleGenerateAi}
                      className="w-full font-bold cursor-pointer h-10"
                    >
                      {isGeneratingAi ? "Generating Full Guide..." : "Generate Full Guide"}
                    </PrimaryButton>
                  </div>
                </div>
              </div>

              {/* Card 1: Article Content & Language Variants */}
              <div className="rounded-lg border border-border-peach bg-card p-5 sm:p-6 shadow-xs space-y-5">
                {/* Language Switcher Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-peach pb-4">
                  <div className="flex items-center gap-1.5 p-1 bg-surface-muted rounded-lg border border-border-peach">
                    <button
                      type="button"
                      onClick={() => setActiveLanguageTab("en")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all font-quicksand cursor-pointer",
                        activeLanguageTab === "en"
                          ? "bg-card text-ink shadow-2xs border border-border-peach/60"
                          : "text-ink-muted hover:text-ink"
                      )}
                    >
                      <span>🇺🇸 English (Primary)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLanguageTab("bn")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all font-quicksand cursor-pointer",
                        activeLanguageTab === "bn"
                          ? "bg-coral text-white shadow-2xs"
                          : "text-ink-muted hover:text-ink"
                      )}
                    >
                      <span>🇧🇩 বাংলা সংস্করণ (Bangla)</span>
                      {banglaTitle.trim() || banglaContent.trim() ? (
                        <span
                          className={cn(
                            "size-2 rounded-full",
                            activeLanguageTab === "bn"
                              ? "bg-white"
                              : "bg-emerald-500"
                          )}
                        />
                      ) : (
                        <span className="text-[10px] opacity-75 font-normal">
                          Optional
                        </span>
                      )}
                    </button>
                  </div>

                  {activeLanguageTab === "bn" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!banglaTitle && title) setBanglaTitle(title);
                        if (!banglaExcerpt && summary) setBanglaExcerpt(summary);
                        if (!banglaContent && content) setBanglaContent(content);
                        toast.info("Copied English content as translation base draft");
                      }}
                      className="text-xs font-bold text-coral hover:underline font-quicksand cursor-pointer"
                    >
                      Copy English text as draft
                    </button>
                  )}
                </div>

                {activeLanguageTab === "en" ? (
                  <>
                    {/* Article Title */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2 font-quicksand">
                        Article Title <span className="text-coral">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Essential Puppy Socialization Milestones (Weeks 8 to 16)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all font-quicksand"
                        required
                      />
                    </div>

                    {/* Executive Summary */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2 font-quicksand">
                        Executive Summary / Meta Excerpt <span className="text-coral">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="A clear 2-3 sentence overview of this guide for search cards and social previews..."
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all resize-none font-quicksand"
                        required
                      />
                    </div>

                    {/* Article Body Rich Text Editor */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink font-quicksand">
                          Article Body <span className="text-coral">*</span>
                        </label>
                        <span className="text-xs text-ink-muted">
                          Changes sync live to preview
                        </span>
                      </div>
                      <RichTextEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Write complete article chapters, veterinary references, and step-by-step guidance here..."
                        onRegisterPendingImage={handleRegisterPendingImage}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-medium font-quicksand leading-relaxed">
                      💡 <strong>বাংলা সংস্করণ (Native Bangla):</strong> যখন কোনো ভিজিটর ওয়েবসাইটে বাংলা ভাষা নির্বাচন করবেন, তখন গুগল ট্রান্সলেটরের পরিবর্তে এই অনুমোদিত বাংলা টেক্সটটি দেখানো হবে।
                    </div>

                    {/* Bangla Title */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2 font-quicksand">
                        Bangla Title (বাংলা শিরোনাম)
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: বাজেট পাখির সম্পূর্ণ যত্ন ও স্বাস্থ্য সহায়িকা..."
                        value={banglaTitle}
                        onChange={(e) => setBanglaTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all font-quicksand"
                      />
                    </div>

                    {/* Bangla Summary */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2 font-quicksand">
                        Bangla Summary / Excerpt (বাংলা সংক্ষিপ্ত বিবরণ)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="যেমন: খাঁচায় পোষা বাজেট পাখির সুষম খাবার, যত্ন ও সাধারণ রোগবালাই নিয়ে বিস্তারিত বাংলা গাইড..."
                        value={banglaExcerpt}
                        onChange={(e) => setBanglaExcerpt(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all resize-none font-quicksand"
                      />
                    </div>

                    {/* Bangla Body */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink font-quicksand">
                          Bangla Article Body (বাংলা সম্পূর্ণ কনটেন্ট)
                        </label>
                        <span className="text-xs text-ink-muted">
                          Rich text or markdown supported
                        </span>
                      </div>
                      <RichTextEditor
                        value={banglaContent}
                        onChange={setBanglaContent}
                        placeholder="বাংলায় সম্পূর্ণ নির্দেশিকা লিখুন..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Guide Metadata & Cover Photo */}
              <div className="rounded-lg border border-border-peach bg-card p-5 sm:p-6 shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-ink flex items-center gap-2 font-quicksand border-b border-border-peach pb-3">
                  <BookOpen className="size-4 text-coral" /> Guide Metadata & Cover Media
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. Category Pillar */}
                  <FormSelect
                    label="CATEGORY PILLAR"
                    placeholder={
                      isLoadingCategories ? "Loading categories..." : "Select category..."
                    }
                    options={categoryOptions}
                    value={categoryId}
                    onChange={setCategoryId}
                    searchable={true}
                    required={true}
                    disabled={isLoadingCategories}
                  />

                  {/* 2. Target Pet Species */}
                  <FormSelect
                    label="TARGET PET SPECIES"
                    placeholder={
                      isLoadingSpecies ? "Loading species..." : "Select pet species..."
                    }
                    options={speciesOptions}
                    value={speciesId}
                    onChange={(val) => {
                      setSpeciesId(val);
                      setBreedId("");
                    }}
                    searchable={true}
                    disabled={isLoadingSpecies}
                  />

                  {/* 3. Target Breed */}
                  <FormSelect
                    label="TARGET BREED (OPTIONAL)"
                    placeholder={
                      !speciesId
                        ? "Select species first"
                        : isLoadingBreeds
                        ? "Loading breeds..."
                        : "Select specific breed..."
                    }
                    options={breedOptions}
                    value={breedId}
                    onChange={setBreedId}
                    searchable={true}
                    disabled={!speciesId || isLoadingBreeds}
                  />

                  {/* 4. Estimated Read Time */}
                  <div>
                    <label className="block text-xs leading-4 font-bold uppercase tracking-wider text-ink mb-1.5 font-quicksand">
                      Estimated Read Time
                    </label>
                    <input
                      type="text"
                      value={displayReadTime}
                      onChange={(e) => setCustomReadTime(e.target.value)}
                      placeholder="e.g. 6 min read"
                      className="w-full h-10.5 px-3.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coral/20"
                    />
                  </div>

                  {/* 5. Homepage Display Order */}
                  <FormInput
                    label="HOMEPAGE DISPLAY ORDER"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={displayOrder}
                    onChange={(e) =>
                      setDisplayOrder(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    helperText="Priority order on homepage (lower numbers appear first, 0 = default)."
                  />

                  {/* 6. Assigned Author */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5 font-quicksand">
                      Assigned Author
                    </label>
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border-peach bg-surface-muted/50 text-xs font-semibold text-ink">
                      <div className="size-6 rounded-full bg-coral/10 text-coral flex items-center justify-center font-bold text-xs shrink-0">
                        {authorName.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{authorName}</span>
                      <span className="ml-auto text-xs text-coral font-bold uppercase shrink-0">
                        {isSuperAdmin ? "Superadmin" : user?.role || "Author"}
                      </span>
                    </div>
                  </div>

                  {/* 7. SEO & Search Tags */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink font-quicksand">
                      SEO & Search Tags
                    </label>
                    <TagsInput
                      value={tags}
                      onChange={setTags}
                      placeholder="Type tag and press Enter (e.g. puppy, nutrition, vet-approved)..."
                      maxTags={15}
                    />
                    <p className="text-[11px] text-ink-muted">
                      Used for search indexing, related article discovery, and meta keywords.
                    </p>
                  </div>
                </div>

                {/* 6. Featured Cover Image (Reusable ImageUpload with Drag, Click & Ctrl+V Paste) */}
                <ImageUpload
                  label="Featured Cover Image"
                  value={coverPreviewUrl}
                  onChange={setCoverPreviewUrl}
                  onFileSelect={setCoverFile}
                  placeholder="Click, drag & drop, or press Ctrl+V to paste cover photo"
                  helperText="PNG, JPG, or WebP up to 5MB (Uploads on submit)"
                  allowManualInput={false}
                  enableClipboardPaste={true}
                  height="h-60"
                />
              </div>

              {/* Card 3: Attached Guide FAQs Accordion */}
              <div className="rounded-lg border border-border-peach bg-card p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border-peach pb-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="size-4 text-coral" />
                    <h3 className="text-sm font-bold text-ink font-quicksand">
                      Attached Guide FAQs ({stagedFaqs.length})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStagedFaqs((prev) => [
                        ...prev,
                        {
                          question: "New FAQ Question?",
                          answer: "Write a clear, helpful veterinary-backed answer...",
                          displayOrder: prev.length,
                          isActive: true,
                        },
                      ]);
                      setExpandedFaqIdx(stagedFaqs.length);
                    }}
                    className="text-xs font-bold text-coral hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    Add FAQ
                  </button>
                </div>

                {stagedFaqs.length === 0 ? (
                  <div className="p-4 text-center text-xs text-ink-muted border border-dashed border-border-peach rounded-lg bg-surface-muted/30">
                    No FAQs attached yet. Use the AI generator above or click &ldquo;Add FAQ&rdquo; to add frequently asked questions.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {stagedFaqs.map((faq, idx) => {
                      const isExpanded = expandedFaqIdx === idx;
                      return (
                        <div
                          key={idx}
                          className="rounded-lg border border-border-peach bg-surface-soft/40 overflow-hidden transition-all"
                        >
                          <div className="p-3.5 flex items-start justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setExpandedFaqIdx(isExpanded ? null : idx)}
                              className="flex items-start gap-2 text-left flex-1 min-w-0 cursor-pointer"
                            >
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-muted border border-border-peach text-ink-muted shrink-0 mt-0.5">
                                #{idx + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold font-quicksand text-ink leading-snug">
                                  {faq.question}
                                </p>
                                {!isExpanded && (
                                  <p className="text-[11px] text-ink-muted line-clamp-1 mt-0.5">
                                    {faq.answer}
                                  </p>
                                )}
                              </div>
                              <span className="text-ink-muted shrink-0 mt-0.5">
                                {isExpanded ? (
                                  <ChevronUp className="size-3.5" />
                                ) : (
                                  <ChevronDown className="size-3.5" />
                                )}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setStagedFaqs((prev) =>
                                  prev.filter((_, fIdx) => fIdx !== idx)
                                )
                              }
                              className="p-1 text-ink-muted hover:text-destructive rounded transition-colors cursor-pointer"
                              title="Remove FAQ"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="p-3.5 pt-0 border-t border-border-peach/50 bg-card/60 space-y-2.5">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                                  Question
                                </label>
                                <input
                                  type="text"
                                  value={faq.question}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setStagedFaqs((prev) =>
                                      prev.map((item, i) =>
                                        i === idx ? { ...item, question: val } : item
                                      )
                                    );
                                  }}
                                  className="w-full px-3 py-1.5 rounded-md border border-border-peach bg-surface-muted text-xs font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-coral"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                                  Answer
                                </label>
                                <textarea
                                  rows={3}
                                  value={faq.answer}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setStagedFaqs((prev) =>
                                      prev.map((item, i) =>
                                        i === idx ? { ...item, answer: val } : item
                                      )
                                    );
                                  }}
                                  className="w-full px-3 py-1.5 rounded-md border border-border-peach bg-surface-muted text-xs text-ink focus:outline-none focus:ring-1 focus:ring-coral resize-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Veterinary Review Requirement Box (not needed for Super Admin) */}
              {!isSuperAdmin && (
                <div className="p-4 rounded-xl bg-tint-rose/60 border border-coral/20 text-ink">
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="size-5 text-coral shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-coral">Veterinary Review Requirement</p>
                      <p className="text-ink-muted leading-relaxed">
                        Guides addressing clinical conditions, medications, or diets require review from a verified DVM before being published live.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Side-by-Side Live Preview */}
            <div className="lg:col-span-6 lg:sticky lg:top-20 min-w-0">
              <div className="rounded-lg border border-border-peach bg-card shadow-xs overflow-hidden flex flex-col lg:max-h-[calc(100vh-6.5rem)]">
                {/* Preview Panel Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-peach bg-surface-muted/40 shrink-0">
                  <div className="flex items-center gap-2">
                    <Eye className="size-4 text-coral" />
                    <span className="text-xs font-bold font-quicksand uppercase tracking-wider text-ink">
                      Live Guide Preview
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tint-mint border border-success/30 text-xs font-bold text-success">
                    <span className="size-1.5 rounded-full bg-success animate-pulse" />
                    Realtime
                  </div>
                </div>

                {/* Scrollable Rendered Article Preview */}
                <div className="p-5 sm:p-6 overflow-y-auto flex-1">
                  {renderGuidePreviewBody(false)}
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      )}

      {/* Reusable Processing Modal during parallel uploads & guide save */}
      <ProcessingModal
        isOpen={processingState.isOpen}
        title={processingState.title}
        description={processingState.description}
        progress={processingState.progress}
        steps={processingState.steps}
      />

      {/* Post-Save Success Modal -> Step 2: Add Guide FAQs */}
      <ConfirmModal
        isOpen={Boolean(createdGuide)}
        onClose={() => {
          setCreatedGuide(null);
          router.push("/admin/guides/all");
        }}
        onConfirm={() => {
          if (!createdGuide) return;
          const targetId = createdGuide.id;
          setCreatedGuide(null);
          router.push(`/admin/guides/${targetId}/faqs`);
        }}
        variant="success"
        title={
          createdGuide
            ? `Guide "${createdGuide.title}" ${
                createdGuide.status === "PUBLISHED"
                  ? "Published!"
                  : createdGuide.status === "IN_REVIEW"
                  ? "Submitted!"
                  : "Saved!"
              }`
            : "Guide Saved!"
        }
        description={
          createdGuide?.status === "PUBLISHED"
            ? "Your guide is now published live. Would you like to add Frequently Asked Questions (FAQs) to this guide?"
            : "Your guide is now created. Would you like to add Frequently Asked Questions (FAQs) to this guide?"
        }
        confirmText="Add Guide FAQs"
        cancelText="Go to Guides"
      />
    </div>
  );
}
