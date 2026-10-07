"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  allowManualInput?: boolean;
  className?: string;
  /**
   * Fixed/dynamic height for the container to prevent layout jumping between upload and preview.
   * Can be a tailwind height class (e.g. "h-[340px]", "h-[400px]") or full style string.
   * Defaults to "h-[340px]".
   */
  height?: string;
}

export function ImageUpload({
  value = "",
  onChange,
  label,
  placeholder = "Click or drag & drop to upload image",
  helperText = "PNG, JPG, WEBP, or SVG (Up to 10MB)",
  allowManualInput = true,
  className,
  height = "h-[340px]",
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [onChange]
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
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    onChange("");
  };

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {label && (
        <label className="block text-xs font-bold text-ink font-quicksand">
          {label}
        </label>
      )}

      {/* Main Container with identical fixed/dynamic height in both states */}
      <div className={cn("w-full relative", height)}>
        {previewUrl ? (
          <div className="border-2 border-border-peach rounded-2xl bg-surface-soft/40 p-4 sm:p-5 overflow-hidden transition-all shadow-2xs group flex flex-col justify-between h-full w-full">
            {/* Header Controls */}
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-border-peach/60 shrink-0">
              <div className="flex items-center gap-2">
                <ImageIcon className="size-4 text-coral" />
                <span className="text-xs font-bold text-ink font-quicksand">
                  Image Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-card border border-border-peach hover:border-coral text-ink hover:text-coral transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs">
                  <Upload className="size-3.5" /> Change Photo
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
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <X className="size-3.5" /> Remove
                </button>
              </div>
            </div>

            {/* Full Image Display Container - fills exact available height without distorting */}
            <div className="relative w-full rounded-xl bg-card border border-border-peach/80 p-2.5 flex items-center justify-center overflow-hidden flex-1 min-h-0">
              <img
                src={previewUrl}
                alt="Uploaded preview"
                className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg drop-shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>

            {/* Status info bar */}
            <div className="mt-2.5 pt-2 border-t border-border-peach/60 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[11px] text-ink-muted truncate font-mono max-w-[260px]">
                {previewUrl.startsWith("data:") ? "Local file ready" : previewUrl}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="size-3" /> Ready to save
              </span>
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group h-full w-full",
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

            <div className="size-14 rounded-2xl bg-card border border-border-peach shadow-2xs flex items-center justify-center text-coral mb-3 group-hover:scale-110 transition-transform">
              <Upload className="size-6" />
            </div>

            <p className="text-sm sm:text-base font-bold text-ink font-quicksand">
              {placeholder}
            </p>
            <p className="text-xs text-ink-muted mt-1">{helperText}</p>

            {allowManualInput && (
              <div className="mt-4 pt-3 border-t border-border-peach/60 w-full max-w-sm">
                <p className="text-[11px] text-ink-muted font-medium mb-1">
                  Or enter direct photo path / URL:
                </p>
                <input
                  type="text"
                  value={value}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    onChange(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="/CareGuide/breeds/dogs/breed.jpg"
                  className="w-full px-3 py-1.5 bg-card border border-border-peach rounded-lg text-xs text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral font-mono relative z-20"
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
