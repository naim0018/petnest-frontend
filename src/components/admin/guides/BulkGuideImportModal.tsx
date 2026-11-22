"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  FileArchive,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  FileCode,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  BookOpen,
  Loader2,
} from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useBulkImportGuidesZipMutation } from "@/store/Api/Guides/guides.api";
import type { BulkImportGuideResult } from "@/store/Api/Guides/guides.types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BulkGuideImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SAMPLE_TEMPLATE_JSON = [
  {
    title: "Complete Budgie Diet & Nutrition Guide",
    slug: "complete-budgie-diet-nutrition-guide",
    category: "Nutrition",
    species: "Bird",
    breeds: ["Budgerigar"],
    summary:
      "A comprehensive veterinary guide to optimal seed, pellet, and fresh vegetable rations for small parakeets.",
    keyTakeaways: [
      "Pellets should comprise 60-70% of daily caloric intake",
      "Fresh leafy greens like kale and spinach provide critical vitamin A",
      "Never feed avocado, chocolate, caffeine, or apple seeds",
    ],
    type: "ARTICLE",
    status: "PUBLISHED",
    isFeatured: true,
    heroImage: "budgie-cover.jpg",
    coverImageAlt: "Two healthy budgies sharing organic pellets",
    faqImage: "budgie-faq.jpg",
    tags: ["budgie", "nutrition", "diet", "parakeet"],
    sections: [
      {
        heading: "1. The Balanced Daily Ration",
        image: "budgie-diet.jpg",
        imageCaption: "Recommended daily balance: 65% pellets, 20% vegetables, 15% seed mix",
        body: "<p>While wild budgies forage on grasses, captive companion birds thrive on fortified pellet formulations. Combine high-grade pellets with dark leafy greens every morning.</p>",
      },
      {
        heading: "2. Safe Vegetables & Greens",
        image: "budgie-greens.jpg",
        imageCaption: "Thoroughly washed organic spinach and shredded carrots",
        body: "<p>Introduce fresh chop dishes early in the day. Always remove uneaten moist foods after 4 hours to avoid bacterial growth.</p><p>You can also place water bowls near the feeding station: {{image:budgie-chop.jpg}}.</p>",
      },
    ],
    faqs: [
      {
        question: "Can budgies eat bananas and berries?",
        answer:
          "Yes! Bananas, blueberries, and strawberries are excellent treats. Feed fruits in moderation (1-2 times weekly) due to natural sugar content.",
        displayOrder: 1,
        isActive: true,
      },
      {
        question: "How do I convert a seed-addicted bird to pellets?",
        answer:
          "Gradually mix pellets into their favorite seed over 3-4 weeks. Start with 10% pellets and increase every 5 days while monitoring droppings and weight.",
        displayOrder: 2,
        isActive: true,
      },
    ],
  },
];

export default function BulkGuideImportModal({
  isOpen,
  onClose,
  onSuccess,
}: BulkGuideImportModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bulkImport, { isLoading }] = useBulkImportGuidesZipMutation();

  const [importResults, setImportResults] = useState<{
    totalProcessed: number;
    successCount: number;
    failureCount: number;
    uploadedImagesCount: number;
    results: BulkImportGuideResult[];
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setImportResults(null);
      setShowFormatGuide(false);
      setIsDragging(false);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      toast.error("Please upload a .zip archive file.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("ZIP archive size exceeds the 50MB limit.");
      return;
    }
    setSelectedFile(file);
    setImportResults(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(SAMPLE_TEMPLATE_JSON, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "guides.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Downloaded sample guides.json template!");
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a .zip archive first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await bulkImport(formData).unwrap();
      if (res?.data) {
        setImportResults(res.data);
        if (res.data.successCount > 0) {
          toast.success(res.data.message);
          onSuccess?.();
        } else {
          toast.error("Bulk import failed. Please check the error details below.");
        }
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Bulk import failed. Please check your ZIP file and guides.json syntax.";
      toast.error(errorMsg);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-card border border-border-peach rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-peach bg-surface-muted/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-coral/10 text-coral flex items-center justify-center">
              <FileArchive className="size-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-quicksand text-ink leading-tight">
                Bulk Guide Importer (.zip)
              </h2>
              <p className="text-xs text-ink-muted">
                Extract images, map inline tokens, and batch-create guides with FAQs
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          {/* Quick Actions & Instructions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-surface-soft border border-border-peach/80">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-4 text-coral shrink-0" />
              <span className="text-xs text-ink font-medium">
                Zip structure: <code className="font-mono text-coral font-bold">guides.json</code> + <code className="font-mono text-coral font-bold">images/</code> folder
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-coral hover:text-coral-dark hover:underline cursor-pointer"
              >
                <Download className="size-3.5" />
                <span>Sample guides.json</span>
              </button>
              <span className="text-border-peach">•</span>
              <button
                type="button"
                onClick={() => setShowFormatGuide(!showFormatGuide)}
                className="inline-flex items-center gap-1 text-xs font-bold text-ink hover:text-coral transition-colors cursor-pointer"
              >
                <span>Format Guide</span>
                {showFormatGuide ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Format & Schema Guide */}
          {showFormatGuide && (
            <div className="rounded-lg border border-border-peach bg-card p-4 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold font-quicksand text-ink border-b border-border-peach pb-2">
                <FileCode className="size-4 text-coral" />
                <span>Complete Specification & Supported Attributes</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-ink-muted">
                <div className="space-y-1 bg-surface-muted/30 p-2.5 rounded-lg border border-border-peach/60">
                  <span className="font-bold text-ink block">Standard Fields:</span>
                  <p><code className="font-mono text-coral">title</code> (min 5 chars, required)</p>
                  <p><code className="font-mono text-coral">summary</code> / <code className="font-mono text-coral">excerpt</code> (required)</p>
                  <p><code className="font-mono text-coral">category</code> (e.g. "Nutrition", "Care", or slug)</p>
                  <p><code className="font-mono text-coral">species</code> (e.g. "Bird", "Dog", "Cat")</p>
                  <p><code className="font-mono text-coral">breeds</code> (e.g. ["Budgerigar"])</p>
                  <p><code className="font-mono text-coral">keyTakeaways</code> (array of bullet strings)</p>
                  <p><code className="font-mono text-coral">status</code> ("PUBLISHED", "DRAFT", "IN_REVIEW")</p>
                </div>
                <div className="space-y-1 bg-surface-muted/30 p-2.5 rounded-lg border border-border-peach/60">
                  <span className="font-bold text-ink block">Images & FAQs:</span>
                  <p><code className="font-mono text-coral">heroImage</code> (cover photo in <code className="font-mono">images/</code>)</p>
                  <p><code className="font-mono text-coral">faqImage</code> (FAQ circular mascot photo)</p>
                  <p><code className="font-mono text-coral">sections[]</code> (heading, image, caption, body)</p>
                  <p><code className="font-mono text-coral">&#123;&#123;image:filename.jpg&#125;&#125;</code> (inline token)</p>
                  <p><code className="font-mono text-coral">faqs[]</code> (question, answer, displayOrder, isActive)</p>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-ink-muted">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                  🇧🇩 Bilingual English & Bangla Auto-Pairing:
                </span>
                <p>
                  Include an English entry and a Bangla entry in <code className="font-mono text-coral">guides.json</code> (with <code className="font-mono text-coral">-bn</code> slug or Bengali title). They are automatically merged into a single bilingual guide with full native Bangla text, images, and FAQs.
                </p>
              </div>
            </div>
          )}

          {/* Upload Dropzone */}
          {!importResults && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group",
                isDragging
                  ? "border-coral bg-coral-light/20 scale-[1.01]"
                  : "border-border-peach bg-surface-soft/60 hover:border-coral/60 hover:bg-coral-light/10"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,application/zip,application/x-zip-compressed"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="size-14 rounded-lg bg-card border border-border-peach shadow-2xs flex items-center justify-center text-coral mb-3 group-hover:scale-105 transition-transform">
                <Upload className="size-6" />
              </div>

              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-ink font-mono">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to import
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="mt-2 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-ink font-quicksand">
                    Click or drag & drop your <span className="text-coral">.zip</span> archive here
                  </p>
                  <p className="text-xs text-ink-muted">
                    Supports up to 50MB with 1 to 50 illustrated guides and images
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Loading / Progress State */}
          {isLoading && (
            <div className="p-8 rounded-lg bg-surface-soft border border-border-peach text-center space-y-4">
              <Loader2 className="size-8 text-coral animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold font-quicksand text-ink">
                  Processing Your ZIP Archive...
                </p>
                <p className="text-xs text-ink-muted max-w-md mx-auto">
                  Extracting images, optimizing to WebP, uploading to storage, replacing inline tokens, and creating guides with FAQs.
                </p>
              </div>
            </div>
          )}

          {/* Results Summary & Guide Links */}
          {importResults && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Header metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-tint-mint border border-success/30 flex items-center gap-3">
                  <CheckCircle2 className="size-6 text-success shrink-0" />
                  <div>
                    <span className="text-lg font-bold font-quicksand text-ink block leading-none">
                      {importResults.successCount}
                    </span>
                    <span className="text-xs font-semibold text-ink-muted">
                      Guides Imported
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-surface-soft border border-border-peach flex items-center gap-3">
                  <ImageIcon className="size-6 text-coral shrink-0" />
                  <div>
                    <span className="text-lg font-bold font-quicksand text-ink block leading-none">
                      {importResults.uploadedImagesCount}
                    </span>
                    <span className="text-xs font-semibold text-ink-muted">
                      Images Hosted & Linked
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    "p-3.5 rounded-lg border flex items-center gap-3",
                    importResults.failureCount > 0
                      ? "bg-tint-rose border-rose-300"
                      : "bg-surface-soft border-border-peach"
                  )}
                >
                  <AlertCircle
                    className={cn(
                      "size-6 shrink-0",
                      importResults.failureCount > 0
                        ? "text-rose-600"
                        : "text-ink-faint"
                    )}
                  />
                  <div>
                    <span className="text-lg font-bold font-quicksand text-ink block leading-none">
                      {importResults.failureCount}
                    </span>
                    <span className="text-xs font-semibold text-ink-muted">
                      Failed Entries
                    </span>
                  </div>
                </div>
              </div>

              {/* Individual guide rows */}
              <div className="rounded-lg border border-border-peach overflow-hidden divide-y divide-border-peach">
                {importResults.results.map((res) => (
                  <div
                    key={res.index}
                    className="p-3.5 flex flex-wrap items-center justify-between gap-3 bg-card hover:bg-surface-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {res.success ? (
                        <CheckCircle2 className="size-4 text-success shrink-0" />
                      ) : (
                        <AlertCircle className="size-4 text-rose-500 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold font-quicksand text-ink truncate">
                          {res.title}
                        </p>
                        {res.success ? (
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-muted mt-0.5">
                            <span className="font-mono text-ink-faint">
                              /{res.slug}
                            </span>
                            <span>•</span>
                            <span className="text-coral font-semibold">
                              {res.faqsCount} FAQs
                            </span>
                            <span>•</span>
                            <span>{res.imagesLinked} images linked</span>
                            {res.hasTranslation && (
                              <>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">
                                  🇧🇩 Bangla Included
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-rose-600 mt-0.5 font-medium">
                            {res.error}
                          </p>
                        )}
                      </div>
                    </div>

                    {res.success && res.id && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Link
                          href={`/admin/guides/${res.id}`}
                          onClick={onClose}
                          className="px-2.5 py-1 rounded-md text-xs font-bold text-coral bg-coral/10 hover:bg-coral/20 transition-colors flex items-center gap-1"
                        >
                          <BookOpen className="size-3" /> View
                        </Link>
                        <Link
                          href={`/admin/guides/${res.id}/faqs`}
                          onClick={onClose}
                          className="px-2.5 py-1 rounded-md text-xs font-bold text-ink bg-surface-muted hover:bg-surface-muted/80 transition-colors flex items-center gap-1"
                        >
                          <HelpCircle className="size-3" /> FAQs
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-peach bg-surface-muted/40 shrink-0">
          <PrimaryButton
            type="button"
            variant="outline"
            size="sm"
            rounded="md"
            onClick={onClose}
            disabled={isLoading}
          >
            {importResults ? "Done" : "Cancel"}
          </PrimaryButton>

          {importResults ? (
            <PrimaryButton
              type="button"
              variant="primary"
              size="sm"
              rounded="md"
              onClick={() => {
                setSelectedFile(null);
                setImportResults(null);
              }}
            >
              Import Another .ZIP
            </PrimaryButton>
          ) : (
            <PrimaryButton
              type="button"
              variant="primary"
              size="sm"
              rounded="md"
              isLoading={isLoading}
              disabled={!selectedFile || isLoading}
              onClick={handleSubmit}
              leftIcon={<Upload className="size-4" />}
              className="font-bold cursor-pointer"
            >
              Start Bulk Import
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
