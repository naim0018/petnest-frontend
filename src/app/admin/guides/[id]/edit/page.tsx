"use client";

import React, { use, useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import FormSelect from "@/components/common/FormSelect";
import { FormInput } from "@/components/common/FormInput";
import TagsInput from "@/components/common/DynamicForm/FormFields/TagsInput";
import ImageUpload from "@/components/common/ImageUpload";
import ProcessingModal, {
  type ProcessingStep,
} from "@/components/reuseable/ProcessingModal";
import RichTextEditor, {
  ArticleContentRenderer,
} from "@/components/admin/guides/RichTextEditor";
import { useHeaderAction } from "@/context/HeaderActionContext";
import { useAppSelector } from "@/hooks/useRedux";
import {
  useFindOneEditorialQuery,
  useFindAllCategoriesPublicQuery,
  useUpdateGuideMutation,
  useImportGuideZipMutation,
  downloadGuideZip,
} from "@/store/Api/Guides/guides.api";
import type { GuideStatus, GuideTranslationsMap } from "@/store/Api/Guides/guides.types";
import {
  useAllSpeciesDropdown,
  useBreedsBySpeciesDropdown,
} from "@/hooks/usePetQueries";
import { useUploadMediaMutation } from "@/store/Api/Media/media.api";
import {
  BookOpen,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  Eye,
  Columns2,
  Calendar,
  Clock,
  HelpCircle,
  AlertCircle,
  Tag,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "PUBLISHED", label: "Published" },
  { value: "NEEDS_REVISION", label: "Needs Revision" },
  { value: "ARCHIVED", label: "Archived" },
];

export default function EditGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const guideId = resolvedParams.id;
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();

  // Mode: side-by-side split or full-width reader preview
  const [viewMode, setViewMode] = useState<"split" | "preview">("split");

  // Load existing guide
  const {
    data: guideResponse,
    isLoading: isLoadingGuide,
    isError,
    refetch,
  } = useFindOneEditorialQuery(guideId);
  const guide = guideResponse?.data;

  // Form state
  const [hydratedId, setHydratedId] = useState<string>("");
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
  const [status, setStatus] = useState<GuideStatus>("DRAFT");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [pendingBodyImages, setPendingBodyImages] = useState<Map<string, File>>(
    () => new Map()
  );
  const [isProcessingUploads, setIsProcessingUploads] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [importGuideZip, { isLoading: isImportingZip }] =
    useImportGuideZipMutation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
      await importGuideZip({ id: guide.id, file }).unwrap();
      toast.success("Guide updated successfully from ZIP!");
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

  // Hydrate form once guide loads
  useEffect(() => {
    if (guide && guide.id !== hydratedId) {
      setTitle(guide.title || "");
      setCategoryId(guide.category?.id || "");
      setSpeciesId(guide.species?.id || "");
      setBreedId(guide.breeds?.[0]?.id || "");
      setSummary(guide.excerpt || "");
      setContent(guide.content || "");
      setStatus(guide.status || "DRAFT");
      setDisplayOrder(guide.displayOrder ?? 0);
      setTags(guide.tags || []);
      setCoverPreviewUrl(guide.coverImage || "");
      setCoverFile(null);
      const bn = guide.translations?.bn;
      if (bn) {
        setBanglaTitle(bn.title || "");
        setBanglaExcerpt(bn.excerpt || "");
        setBanglaContent(bn.content || "");
      } else {
        setBanglaTitle("");
        setBanglaExcerpt("");
        setBanglaContent("");
      }
      setHydratedId(guide.id);
    }
  }, [guide, hydratedId]);

  // Redux Auth User
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAppSelector((state) => (state.auth as any)?.user);
  const isSuperAdmin = user?.role?.toUpperCase() === "SUPERADMIN";
  const canDirectPublish = ["SUPERADMIN", "ADMIN", "VET"].includes(
    user?.role?.toUpperCase() || ""
  );

  // Taxonomy queries
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useFindAllCategoriesPublicQuery();
  const { data: speciesList = [], isLoading: isLoadingSpecies } =
    useAllSpeciesDropdown();
  const { data: breedList = [], isLoading: isLoadingBreeds } =
    useBreedsBySpeciesDropdown(speciesId);

  // Mutations
  const [updateGuide, { isLoading: isUpdating }] = useUpdateGuideMutation();
  const [uploadMedia] = useUploadMediaMutation();

  const categories = useMemo(
    () => categoriesResponse?.data || [],
    [categoriesResponse]
  );

  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ value: cat.id, label: cat.name })),
    [categories]
  );

  const speciesOptions = useMemo(
    () => [
      { value: "", label: "All Species (General Guide)" },
      ...speciesList.map((sp) => ({
        value: sp.id,
        label: sp.name,
        icon: sp.image ? (
          <span className="relative size-5 rounded-full overflow-hidden border border-border-peach bg-surface-muted shrink-0 inline-block">
            <Image
              src={sp.image}
              alt={sp.name}
              fill
              unoptimized
              className="object-cover"
            />
          </span>
        ) : (
          <span className="size-5 rounded-full bg-coral/10 text-coral font-bold text-xs flex items-center justify-center shrink-0">
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
          <span className="relative size-5 rounded-full overflow-hidden border border-border-peach bg-surface-muted shrink-0 inline-block">
            <Image
              src={b.image}
              alt={b.name}
              fill
              unoptimized
              className="object-cover"
            />
          </span>
        ) : (
          <span className="size-5 rounded-full bg-coral/10 text-coral font-bold text-xs flex items-center justify-center shrink-0">
            {b.name.charAt(0)}
          </span>
        ),
      })),
    ],
    [breedList]
  );

  const autoReadTimeMinutes = useMemo(() => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [content]);

  const selectedCategoryName = useMemo(() => {
    const found = categories.find((c) => c.id === categoryId);
    return found ? found.name : guide?.category?.name || "General Care";
  }, [categories, categoryId, guide]);

  const selectedSpeciesName = useMemo(() => {
    const found = speciesList.find((s) => s.id === speciesId);
    return found ? found.name : null;
  }, [speciesList, speciesId]);

  const selectedBreedName = useMemo(() => {
    const found = breedList.find((b) => b.id === breedId);
    return found ? found.name : null;
  }, [breedList, breedId]);

  const isAuthorSuperAdmin =
    guide?.author?.role?.toUpperCase() === "SUPERADMIN" || isSuperAdmin;
  const authorName = isAuthorSuperAdmin
    ? "Super Admin"
    : guide?.author?.name || "Editor";

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
    status,
    displayOrder,
    tags,
    coverFile,
    coverPreviewUrl,
    pendingBodyImages,
    guide,
  });

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
    status,
    displayOrder,
    tags,
    coverFile,
    coverPreviewUrl,
    pendingBodyImages,
    guide,
  };

  const handleRegisterPendingImage = (blobUrl: string, file: File) => {
    setPendingBodyImages((prev) => {
      const next = new Map(prev);
      next.set(blobUrl, file);
      return next;
    });
  };

  const handleSaveChanges = async (overrideStatus?: GuideStatus) => {
    const state = formStateRef.current;
    if (!state.title.trim()) {
      toast.error("Please enter an article title");
      return;
    }
    if (!state.categoryId) {
      toast.error("Please select a category pillar");
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

    const nextStatus = overrideStatus ?? state.status;
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
              label: "Uploading new guide images",
              status: "active" as const,
              detail: `0 / ${totalMediaUploads}`,
            },
          ]
        : []),
      {
        id: "save",
        label:
          overrideStatus === "PUBLISHED"
            ? "Publishing updated guide"
            : "Saving guide changes",
        status: totalMediaUploads > 0 ? ("pending" as const) : ("active" as const),
      },
    ];

    setIsProcessingUploads(true);
    setProcessingState({
      isOpen: true,
      title:
        overrideStatus === "PUBLISHED" ? "Publishing Guide" : "Updating Guide",
      description:
        totalMediaUploads > 0
          ? `Uploading ${totalMediaUploads} image${totalMediaUploads > 1 ? "s" : ""} in parallel...`
          : "Saving your changes...",
      progress: totalMediaUploads > 0 ? 15 : 40,
      steps: initialSteps,
    });

    try {
      let finalCoverUrl: string | null =
        state.coverPreviewUrl && !state.coverPreviewUrl.startsWith("blob:")
          ? state.coverPreviewUrl
          : null;

      if (totalMediaUploads > 0) {
        let completedUploads = 0;

        const uploadOne = async (file: File) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", "guides");
          const uploadRes = await uploadMedia(formData).unwrap();
          completedUploads += 1;

          const uploadPercent = Math.round(
            15 + (completedUploads / totalMediaUploads) * 55
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

      setProcessingState((prev) => ({
        ...prev,
        progress: 85,
        description: "Updating guide record...",
        steps: prev.steps.map((s) =>
          s.id === "upload"
            ? { ...s, status: "done" }
            : s.id === "save"
            ? { ...s, status: "active" }
            : s
        ),
      }));

      const hasBanglaContent = Boolean(
        state.banglaTitle.trim() ||
        state.banglaExcerpt.trim() ||
        finalBanglaContent.trim()
      );

      const existingTranslations =
        (state.guide?.translations as GuideTranslationsMap) || {};

      const translationsPayload: GuideTranslationsMap = hasBanglaContent
        ? {
            ...existingTranslations,
            bn: {
              title: state.banglaTitle.trim(),
              excerpt: state.banglaExcerpt.trim(),
              content: finalBanglaContent.trim(),
            },
          }
        : {};

      await updateGuide({
        id: guideId,
        payload: {
          title: state.title.trim(),
          categoryId: state.categoryId,
          speciesId: state.speciesId || null,
          breedIds: state.speciesId ? (state.breedId ? [state.breedId] : []) : [],
          excerpt: state.summary.trim(),
          content: finalContent,
          coverImage: finalCoverUrl,
          displayOrder: state.displayOrder,
          tags: state.tags,
          translations: translationsPayload,
          ...(canDirectPublish ? { status: nextStatus } : {}),
        },
      }).unwrap();

      if (state.coverPreviewUrl && state.coverPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(state.coverPreviewUrl);
      }
      allBlobUrls.forEach((bUrl) => URL.revokeObjectURL(bUrl));

      setProcessingState((prev) => ({ ...prev, isOpen: false }));
      toast.success(
        overrideStatus === "PUBLISHED"
          ? "Guide updated and published live!"
          : "Guide changes saved successfully!"
      );
      router.push(`/admin/guides/${guideId}`);
    } catch (err: unknown) {
      setProcessingState((prev) => ({ ...prev, isOpen: false }));
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to update guide. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsProcessingUploads(false);
    }
  };

  // Header actions
  useEffect(() => {
    if (!guide) {
      setHeaderAction(null);
      return;
    }

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
            FAQs
          </PrimaryButton>
        </Link>

        {canDirectPublish && status !== "PUBLISHED" && (
          <PrimaryButton
            type="button"
            variant="success"
            size="sm"
            rounded="md"
            leftIcon={<CheckCircle2 className="size-4" />}
            disabled={isUpdating || isProcessingUploads}
            onClick={() => handleSaveChanges("PUBLISHED")}
            className="font-bold cursor-pointer"
          >
            Publish
          </PrimaryButton>
        )}

        <PrimaryButton
          type="button"
          variant="primary"
          size="sm"
          rounded="md"
          leftIcon={<Save className="size-4" />}
          isLoading={isUpdating || isProcessingUploads}
          onClick={() => handleSaveChanges()}
          className="font-bold cursor-pointer"
        >
          Save Changes
        </PrimaryButton>
      </div>
    );

    return () => setHeaderAction(null);
  }, [
    setHeaderAction,
    guide,
    viewMode,
    canDirectPublish,
    status,
    isUpdating,
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
    isDownloadingZip,
    isImportingZip,
  ]);

  // Exact Layout Skeleton
  if (isLoadingGuide) {
    return (
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        <div className="lg:col-span-6 space-y-6">
          <div className="h-96 rounded-xl bg-card border border-border-peach animate-pulse" />
          <div className="h-72 rounded-xl bg-card border border-border-peach animate-pulse" />
        </div>
        <div className="lg:col-span-6 h-96 rounded-xl bg-card border border-border-peach animate-pulse" />
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
          Unable to load this guide for editing.
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
        <h1
          className={cn(
            "font-bold font-quicksand text-ink leading-tight break-words",
            isFullWidth ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"
          )}
        >
          {previewTitle}
        </h1>

      <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted border-y border-border-peach/80 py-3">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-coral/10 text-coral flex items-center justify-center font-bold text-xs">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-ink">{authorName}</span>
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
          <span>{autoReadTimeMinutes} min read</span>
        </div>

        <span className="text-border-peach">•</span>
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5 text-ink-faint" />
          <span>Editing</span>
        </div>

        <span className="text-border-peach">•</span>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "size-2 rounded-full",
              status === "PUBLISHED" && "bg-emerald-500",
              status === "IN_REVIEW" && "bg-amber-500",
              status === "DRAFT" && "bg-slate-400",
              status === "ARCHIVED" && "bg-rose-500"
            )}
          />
          <span
            className={cn(
              "font-semibold",
              status === "PUBLISHED" && "text-emerald-600 dark:text-emerald-400",
              status === "IN_REVIEW" && "text-amber-600 dark:text-amber-400",
              status === "DRAFT" && "text-ink-muted",
              status === "ARCHIVED" && "text-rose-600 dark:text-rose-400"
            )}
          >
            {status.replace("_", " ")}
          </span>
        </div>

        {displayOrder > 0 && (
          <>
            <span className="text-border-peach">•</span>
            <span className="text-ink-faint">Order #{displayOrder}</span>
          </>
        )}
      </div>

      {previewSummary && (
        <div className="p-4 rounded-xl bg-surface-muted/60 border border-border-peach/70">
          <p className="text-xs font-bold uppercase tracking-wider text-coral font-quicksand mb-1">
            Executive Summary
          </p>
          <p className="text-sm text-ink font-medium leading-relaxed italic">
            &ldquo;{previewSummary}&rdquo;
          </p>
        </div>
      )}

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

      <div className="pt-1">
        <ArticleContentRenderer content={previewContent} />
      </div>

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
    </div>
    );
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {viewMode === "preview" ? (
        <AnimatedContainer delay={0.05}>
          <div className="w-full bg-card border border-border-peach rounded-lg p-6 sm:p-10 shadow-xs">
            {renderGuidePreviewBody(true)}
          </div>
        </AnimatedContainer>
      ) : (
        <AnimatedContainer delay={0.05}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
            {/* Left Column: Editor + Metadata */}
            <div className="lg:col-span-6 space-y-6 min-w-0">
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
                    {/* English Title */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2 font-quicksand">
                        Article Title <span className="text-coral">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter guide title..."
                        className="w-full px-4 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all font-quicksand"
                        required
                      />
                    </div>

                    {/* English Summary */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2 font-quicksand">
                        Executive Summary / Meta Excerpt{" "}
                        <span className="text-coral">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Clear 2-3 sentence summary..."
                        className="w-full px-4 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all resize-none font-quicksand"
                        required
                      />
                    </div>

                    {/* English Article Body */}
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
                        placeholder="Edit article body..."
                        onRegisterPendingImage={handleRegisterPendingImage}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-medium font-quicksand leading-relaxed">
                      💡 <strong>বাংলা সংস্করণ (Native Bangla):</strong> যখন কোনো ভিজিটর ওয়েবসাইটে বাংলা ভাষা নির্বাচন করবেন, তখন গুগল ট্রান্সলেটরের পরিবর্তে এই অনুমোদিত বাংলা টেক্সটটি সরাসরি পরিবেশন করা হবে।
                    </div>

                    {/* Bangla Title */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2 font-quicksand">
                        Bangla Title (বাংলা শিরোনাম)
                      </label>
                      <input
                        type="text"
                        value={banglaTitle}
                        onChange={(e) => setBanglaTitle(e.target.value)}
                        placeholder="যেমন: বাজেট পাখির সম্পূর্ণ যত্ন ও স্বাস্থ্য সহায়িকা..."
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
                        value={banglaExcerpt}
                        onChange={(e) => setBanglaExcerpt(e.target.value)}
                        placeholder="যেমন: খাঁচায় পোষা বাজেট পাখির সুষম খাবার, যত্ন ও সাধারণ রোগবালাই নিয়ে বিস্তারিত বাংলা গাইড..."
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

              <div className="rounded-lg border border-border-peach bg-card p-5 sm:p-6 shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-ink flex items-center gap-2 font-quicksand border-b border-border-peach pb-3">
                  <BookOpen className="size-4 text-coral" /> Guide Metadata &amp;
                  Cover Media
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect
                    label="CATEGORY PILLAR"
                    placeholder={
                      isLoadingCategories ? "Loading..." : "Select category..."
                    }
                    options={categoryOptions}
                    value={categoryId}
                    onChange={setCategoryId}
                    searchable
                    required
                    disabled={isLoadingCategories}
                  />

                  <FormSelect
                    label="TARGET PET SPECIES"
                    placeholder={
                      isLoadingSpecies ? "Loading..." : "Select pet species..."
                    }
                    options={speciesOptions}
                    value={speciesId}
                    onChange={(val) => {
                      setSpeciesId(val);
                      setBreedId("");
                    }}
                    searchable
                    disabled={isLoadingSpecies}
                  />

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
                    searchable
                    disabled={!speciesId || isLoadingBreeds}
                  />

                  {canDirectPublish && (
                    <FormSelect
                      label="PUBLICATION STATUS"
                      options={STATUS_OPTIONS}
                      value={status}
                      onChange={(val) => setStatus(val as GuideStatus)}
                    />
                  )}

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

                <ImageUpload
                  label="Featured Cover Image"
                  value={coverPreviewUrl}
                  onChange={setCoverPreviewUrl}
                  onFileSelect={setCoverFile}
                  placeholder="Click, drag & drop, or press Ctrl+V to paste cover photo"
                  helperText="PNG, JPG, or WebP up to 5MB (Uploads on save)"
                  allowManualInput={false}
                  enableClipboardPaste={true}
                  height="h-60"
                />
              </div>
            </div>

            {/* Right Column: Sticky Side-by-Side Live Preview */}
            <div className="lg:col-span-6 lg:sticky lg:top-20 min-w-0">
              <div className="rounded-lg border border-border-peach bg-card shadow-xs overflow-hidden flex flex-col lg:max-h-[calc(100vh-6.5rem)]">
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

                <div className="p-5 sm:p-6 overflow-y-auto flex-1">
                  {renderGuidePreviewBody(false)}
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      )}

      <ProcessingModal
        isOpen={processingState.isOpen}
        title={processingState.title}
        description={processingState.description}
        progress={processingState.progress}
        steps={processingState.steps}
      />
    </div>
  );
}
