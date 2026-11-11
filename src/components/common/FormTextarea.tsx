"use client";

import React, { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface FormTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  charCount?: number;
  maxCharCount?: number;
  containerClassName?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      helperText,
      error,
      charCount,
      maxCharCount,
      className,
      containerClassName,
      id,
      required,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {(label || maxCharCount !== undefined) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={inputId}
                className="block text-xs font-bold uppercase tracking-wider text-ink"
              >
                {label} {required && <span className="text-coral">*</span>}
              </label>
            )}
            {maxCharCount !== undefined && (
              <span className="text-[11px] text-ink-muted font-medium">
                {charCount ?? 0}/{maxCharCount} chars
              </span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          maxLength={maxCharCount}
          disabled={disabled}
          className={cn(
            "w-full p-3.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm transition-all duration-200 outline-none placeholder:text-ink-faint resize-none leading-relaxed",
            "focus:border-coral focus:ring-2 focus:ring-coral/20",
            disabled && "bg-surface-muted/60 text-ink-muted cursor-not-allowed border-border-peach/70",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-[11px] font-medium text-red-500 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-ink-muted mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
export default FormTextarea;
