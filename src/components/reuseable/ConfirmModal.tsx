"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle, Info, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import PrimaryButton from "@/components/common/PrimaryButton";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  variant?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  loading?: boolean;
  className?: string;
  rounded?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = "danger",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  showCancel = true,
  loading = false,
  className,
  rounded = "rounded-xl",
  icon,
  children,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  if (!mounted || !isOpen) return null;

  // Format title: highlights quoted entity text while preserving heading font-size
  const renderFormattedTitle = (rawTitle: string) => {
    const match = rawTitle.match(/^(.*?)(["“'])([^"”']+)(["”'])(.*)$/);
    if (match) {
      return (
        <>
          <span className="text-[length:inherit] font-[inherit]">{match[1]}</span>
          <span className="text-coral font-bold text-[length:inherit] font-[inherit]">“{match[3]}”</span>
          <span className="text-[length:inherit] font-[inherit]">{match[5]}</span>
        </>
      );
    }
    return rawTitle;
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "w-full max-w-xl bg-card border border-border-peach p-6 sm:p-10 shadow-2xl relative text-center select-none animate-in zoom-in-95 duration-200 overflow-hidden",
          rounded,
          className
        )}
      >
        {/* ======================================================== */}
        {/* 🌸 ORGANIC PASTEL CORNER BLOBS (USING THEME TINT TOKENS) */}
        {/* ======================================================== */}
        {/* Top-Left Blob */}
        <svg
          className="absolute top-0 left-0 size-48 sm:size-56 pointer-events-none select-none z-0 text-tint-rose opacity-80 dark:opacity-20"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 0 0 L 175 0 C 160 45 130 80 95 105 C 60 130 25 150 0 190 Z"
            fill="currentColor"
          />
        </svg>

        {/* Bottom-Right Blob */}
        <svg
          className="absolute bottom-0 right-0 size-48 sm:size-60 pointer-events-none select-none z-0 text-tint-rose opacity-80 dark:opacity-20"
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 220 220 L 45 220 C 80 190 115 160 138 120 C 160 80 185 45 220 20 Z"
            fill="currentColor"
          />
        </svg>

        {/* ======================================================== */}
        {/* ❌ TOP-RIGHT CLOSE BUTTON                                */}
        {/* ======================================================== */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 text-ink-muted hover:text-ink p-2 rounded-full cursor-pointer z-20 transition-colors hover:bg-surface-muted"
          aria-label="Close modal"
        >
          <X className="size-6" />
        </button>

        {/* ======================================================== */}
        {/* 🛡️ CENTERED ILLUSTRATIVE ICON (TOKENS ONLY)              */}
        {/* ======================================================== */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-4 sm:mb-6 flex items-center justify-center select-none">
            {icon ? (
              icon
            ) : variant === "danger" ? (
              <svg
                viewBox="0 0 100 100"
                className="size-20 sm:size-24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Accent Burst Rays */}
                <rect
                  x="22"
                  y="30"
                  width="8"
                  height="3"
                  rx="1.5"
                  transform="rotate(-30 22 30)"
                  fill="var(--coral)"
                  opacity="0.5"
                />
                <rect
                  x="15"
                  y="44"
                  width="8"
                  height="3"
                  rx="1.5"
                  fill="var(--coral)"
                  opacity="0.5"
                />
                <rect
                  x="71"
                  y="26"
                  width="8"
                  height="3"
                  rx="1.5"
                  transform="rotate(30 71 26)"
                  fill="var(--coral)"
                  opacity="0.5"
                />
                <rect
                  x="77"
                  y="44"
                  width="8"
                  height="3"
                  rx="1.5"
                  fill="var(--coral)"
                  opacity="0.5"
                />

                {/* Shield Body */}
                <path
                  d="M50 22 C37 22 31 29 31 39 C31 60 50 74 50 74 C50 74 69 60 69 39 C69 29 63 22 50 22 Z"
                  fill="var(--tint-rose)"
                  stroke="var(--coral)"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />

                {/* Exclamation Mark */}
                <rect
                  x="48"
                  y="33"
                  width="4"
                  height="17"
                  rx="2"
                  fill="var(--coral-pressed)"
                />
                <circle cx="50" cy="57" r="3" fill="var(--coral-pressed)" />
              </svg>
            ) : variant === "warning" ? (
              <div className="size-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-500 shadow-xs">
                <AlertTriangle className="size-10" />
              </div>
            ) : variant === "success" ? (
              <div className="size-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-xs">
                <CheckCircle className="size-10" />
              </div>
            ) : (
              <div className="size-20 rounded-full bg-sky-500/10 border-2 border-sky-500/30 flex items-center justify-center text-sky-500 shadow-xs">
                <Info className="size-10" />
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 🏷️ TITLE & DESCRIPTION                                   */}
          {/* ======================================================== */}
          <div className="space-y-3 sm:space-y-4 text-center flex flex-col items-center w-full px-2">
            <h2
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)" }}
              className="font-extrabold font-quicksand text-ink dark:text-white leading-tight tracking-tight break-words [&_span]:text-[length:inherit] [&_span]:font-extrabold"
            >
              {renderFormattedTitle(title)}
            </h2>
            {description && (
              <p className="text-sm sm:text-base text-ink-muted dark:text-white/75 font-normal leading-relaxed max-w-md mx-auto">
                {description}
              </p>
            )}
          </div>

          {/* Optional Children / Custom Elements */}
          {children && <div className="w-full mt-4 text-left">{children}</div>}

          {/* ======================================================== */}
          {/* 🔘 ACTION BUTTONS (REUSABLE PRIMARY BUTTONS)             */}
          {/* ======================================================== */}
          <div className="w-full mt-7 sm:mt-9 flex flex-col-reverse sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {showCancel && (
              <PrimaryButton
                type="button"
                variant="outline"
                size="lg"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px] h-12 text-sm sm:text-base font-bold rounded-full"
              >
                {cancelText}
              </PrimaryButton>
            )}

            <PrimaryButton
              type="button"
              variant={variant === "danger" ? "danger" : variant === "success" ? "success" : "primary"}
              size="lg"
              onClick={onConfirm}
              isLoading={loading}
              disabled={loading}
              leftIcon={variant === "danger" ? <Trash2 className="size-4.5" /> : undefined}
              className="w-full sm:w-auto min-w-[170px] sm:min-w-[200px] h-12 text-sm sm:text-base font-bold rounded-full shadow-md"
            >
              {confirmText}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
