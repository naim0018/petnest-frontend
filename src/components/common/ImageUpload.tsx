"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle2,
  ClipboardPaste,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  /**
   * Returns the selected File object to the parent component.
   * This allows the parent to hold the file in state and only upload it to Cloudflare R2
   * when the user explicitly clicks "Save" / "Submit" (preventing orphaned files).
   */
  onFileSelect?: (file: File | null) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  allowManualInput?: boolean;
  enableClipboardPaste?: boolean;
  maxSizeMB?: number;
  className?: string;
  height?: string;
  imageFit?: "contain" | "cover";
}

export function ImageUpload({
  value = "",
  onChange,
  onFileSelect,
  label,
  placeholder = "Click, drag & drop, or press Ctrl+V to paste image",
  helperText = "PNG, JPG, WEBP, or AVIF (Up to 5MB)",
  allowManualInput = true,
  enableClipboardPaste = true,
  maxSizeMB = 5,
  className,
  height = "h-[340px]",
  imageFit = "cover",
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleFile = useCallback(
    (file: File, sourceLabel?: string) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`Image file size must be under ${maxSizeMB}MB.`);
        return;
      }

      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      // Fast instant local blob preview without network roundtrip
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      onChange?.(localUrl);
      onFileSelect?.(file);

      if (sourceLabel) {
        toast.success(`${sourceLabel} ready! It will upload on submit.`);
      }
    },
    [maxSizeMB, onChange, onFileSelect, previewUrl]
  );

  // Extract an image File (or image URL) from a ClipboardEvent
  const processClipboardData = useCallback(
    (clipboardData: DataTransfer | null): boolean => {
      if (!clipboardData) return false;

      // 1. Check clipboard items for image files (screenshots / copied images)
      const items = Array.from(clipboardData.items || []);
      for (const item of items) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          if (blob) {
            const ext = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "png";
            const file = new File([blob], `pasted-image-${Date.now()}.${ext}`, {
              type: blob.type,
            });
            handleFile(file, "Pasted image");
            return true;
          }
        }
      }

      // 2. Fallback: check clipboard files list directly
      const files = Array.from(clipboardData.files || []);
      const imgFile = files.find((f) => f.type.startsWith("image/"));
      if (imgFile) {
        handleFile(imgFile, "Pasted image");
        return true;
      }

      // 3. Fallback: direct image URL pasted while focused on dropzone
      const text = clipboardData.getData("text/plain")?.trim();
      if (text && /^https?:\/\/.+\.(png|jpe?g|webp|avif|gif)(\?.*)?$/i.test(text)) {
        if (previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(text);
        onChange?.(text);
        onFileSelect?.(null);
        toast.success("Image URL pasted!");
        return true;
      }

      return false;
    },
    [handleFile, onChange, onFileSelect, previewUrl]
  );

  // Local paste handler when upload container itself is focused
  const handleContainerPaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (!enableClipboardPaste) return;
      // Do not hijack pasting inside the manual URL text input
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;

      if (processClipboardData(e.clipboardData)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [enableClipboardPaste, processClipboardData]
  );

  // Smart global Ctrl+V listener when hovering over dropzone or when no text field is focused
  useEffect(() => {
    if (!enableClipboardPaste) return;

    const handleWindowPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const isInsideThis =
        containerRef.current && activeEl && containerRef.current.contains(activeEl);

      // Already handled by container's onPaste when focused inside this component
      if (isInsideThis) return;

      // If a modal overlay is open, only allow an ImageUpload inside that overlay to capture global Ctrl+V
      const activeOverlay = document.querySelector(".fixed.inset-0.z-50");
      if (activeOverlay && containerRef.current && !activeOverlay.contains(containerRef.current)) {
        return;
      }

      // Never steal Ctrl+V from other text inputs, textareas, or contenteditable editors
      const isTypingElsewhere =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable);

      if (isTypingElsewhere && !isHovered) return;

      // Only intercept global paste if clipboard actually has an image file
      const items = Array.from(e.clipboardData?.items || []);
      const hasImageFile = items.some(
        (item) => item.kind === "file" && item.type.startsWith("image/")
      );
      if (!hasImageFile) return;

      if (processClipboardData(e.clipboardData)) {
        e.preventDefault();
      }
    };

    window.addEventListener("paste", handleWindowPaste);
    return () => window.removeEventListener("paste", handleWindowPaste);
  }, [enableClipboardPaste, isHovered, processClipboardData]);

  // Explicit "Paste Image" button using native Clipboard API
  const handleClipboardButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.info("Click the upload box and press Ctrl+V to paste an image.");
      containerRef.current?.focus();
      return;
    }

    try {
      if (navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
          const imageType = item.types.find((t) => t.startsWith("image/"));
          if (imageType) {
            const blob = await item.getType(imageType);
            const ext = imageType.split("/")[1]?.replace("jpeg", "jpg") || "png";
            const file = new File([blob], `clipboard-${Date.now()}.${ext}`, {
              type: imageType,
            });
            handleFile(file, "Clipboard image");
            return;
          }
        }
      }

      // Fallback: check clipboard text for direct image URL
      if (navigator.clipboard.readText) {
        const text = (await navigator.clipboard.readText())?.trim();
        if (text && /^https?:\/\/.+/i.test(text)) {
          if (previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
          }
          setPreviewUrl(text);
          onChange?.(text);
          onFileSelect?.(null);
          toast.success("Image URL pasted from clipboard!");
          return;
        }
      }

      toast.info("No image found in clipboard. Copy an image first or press Ctrl+V.");
    } catch {
      containerRef.current?.focus();
      toast.info("Clipboard access blocked by browser. Press Ctrl+V here to paste.");
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handleRemove = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    onChange?.("");
    onFileSelect?.(null);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={enableClipboardPaste ? 0 : undefined}
      onPaste={handleContainerPaste}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "space-y-2 w-full focus:outline-none group/upload",
        className
      )}
    >
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-ink font-quicksand">
          {label}
        </label>
      )}

      {/* Main Container with identical fixed/dynamic height in both states */}
      <div className={cn("w-full relative", height)}>
        {previewUrl ? (
          <div className="border-2 border-border-peach rounded-xl bg-surface-soft/40 p-3.5 sm:p-4 overflow-hidden transition-all shadow-2xs group flex flex-col justify-between h-full w-full group-focus/upload:border-coral/60">
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-border-peach/60 shrink-0">
              <div className="flex items-center gap-2">
                <ImageIcon className="size-4 text-coral" />
                <span className="text-xs font-bold text-ink font-quicksand">
                  Image Preview
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {enableClipboardPaste && (
                  <button
                    type="button"
                    onClick={handleClipboardButtonClick}
                    title="Paste replacement image from clipboard (Ctrl+V)"
                    className="text-xs font-semibold px-2 py-1 rounded-lg bg-card border border-border-peach hover:border-coral text-ink hover:text-coral transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <ClipboardPaste className="size-3.5" /> Paste
                  </button>
                )}
                <label className="text-xs font-semibold px-2 py-1 rounded-lg bg-card border border-border-peach hover:border-coral text-ink hover:text-coral transition-colors cursor-pointer flex items-center gap-1 shadow-2xs">
                  <Upload className="size-3.5" /> Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs font-semibold px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <X className="size-3.5" /> Remove
                </button>
              </div>
            </div>

            {/* Full Image Display Container */}
            <div className="relative w-full rounded-lg bg-card border border-border-peach/80 flex items-center justify-center overflow-hidden flex-1 min-h-0">
              <img
                src={previewUrl}
                alt="Uploaded preview"
                className={cn(
                  "transition-transform duration-300 group-hover:scale-[1.02]",
                  imageFit === "contain"
                    ? "max-h-full max-w-full w-auto h-auto object-contain p-2 rounded-md"
                    : "w-full h-full object-cover"
                )}
              />
            </div>

            {/* Status info bar */}
            <div className="mt-2 pt-2 border-t border-border-peach/60 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[11px] text-ink-muted truncate font-mono max-w-[240px]">
                {previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")
                  ? "Local file ready (uploads on submit)"
                  : previewUrl}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="size-3" /> Ready
              </span>
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all cursor-pointer group h-full w-full relative group-focus/upload:border-coral group-focus/upload:ring-2 group-focus/upload:ring-coral/15",
              isDragging
                ? "border-coral bg-coral-light/30 scale-[1.01]"
                : "border-border-peach bg-surface-soft/60 hover:border-coral/60 hover:bg-coral-light/10"
            )}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            <div className="size-12 rounded-xl bg-card border border-border-peach shadow-2xs flex items-center justify-center text-coral mb-2.5 group-hover:scale-105 transition-transform">
              <Upload className="size-5" />
            </div>

            <p className="text-xs sm:text-sm font-bold text-ink font-quicksand">
              {placeholder}
            </p>
            <p className="text-xs text-ink-muted mt-1">{helperText}</p>

            {enableClipboardPaste && (
              <div className="mt-3 relative z-20">
                <button
                  type="button"
                  onClick={handleClipboardButtonClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border-peach hover:border-coral text-xs font-bold text-ink hover:text-coral transition-colors cursor-pointer shadow-2xs"
                >
                  <ClipboardPaste className="size-3.5 text-coral" />
                  <span>Paste from Clipboard (Ctrl+V)</span>
                </button>
              </div>
            )}

            {allowManualInput && (
              <div className="mt-3 pt-3 border-t border-border-peach/60 w-full max-w-sm relative z-20">
                <p className="text-[11px] text-ink-muted font-medium mb-1">
                  Or enter direct photo URL:
                </p>
                <input
                  type="text"
                  value={value}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    onChange?.(e.target.value);
                    setPreviewUrl(e.target.value);
                    onFileSelect?.(null);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-1.5 bg-card border border-border-peach rounded-lg text-xs text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral font-mono"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
