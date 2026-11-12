"use client";

import React, { useState, KeyboardEvent, useRef } from "react";
import { X, Tag as TagIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormTagsInputProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  maxTags?: number;
  maxTagLength?: number;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
}

export function FormTagsInput({
  label,
  required,
  helperText,
  error,
  value = [],
  onChange,
  placeholder = "Type tag and press Enter or comma...",
  suggestions = [],
  maxTags = 20,
  maxTagLength = 30,
  disabled = false,
  className,
  containerClassName,
}: FormTagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (rawTag: string) => {
    let tag = rawTag.trim();
    if (!tag) return;

    // Remove any trailing commas
    if (tag.endsWith(",")) {
      tag = tag.slice(0, -1).trim();
    }
    if (!tag) return;

    if (maxTagLength && tag.length > maxTagLength) {
      tag = tag.slice(0, maxTagLength);
    }

    if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setInputValue("");
      return;
    }

    if (maxTags && value.length >= maxTags) {
      setInputValue("");
      return;
    }

    onChange([...value, tag]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      e.preventDefault();
      removeTag(value[value.length - 1]);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const availableSuggestions = suggestions.filter(
    (s) => !value.some((t) => t.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className={cn("w-full space-y-1.5", containerClassName)}>
      {(label || maxTags) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="block text-xs font-bold uppercase tracking-wider text-ink">
              {label} {required && <span className="text-coral">*</span>}
            </label>
          )}
          {maxTags && (
            <span className="text-[11px] text-ink-muted font-medium">
              {value.length}/{maxTags} tags
            </span>
          )}
        </div>
      )}

      {/* Main Tag Box */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "w-full min-h-[46px] p-2 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm font-semibold transition-all duration-200 cursor-text flex flex-wrap items-center gap-1.5",
          "focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20 focus-within:bg-card",
          error && "border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500/20",
          disabled && "opacity-60 pointer-events-none bg-surface-soft",
          className
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-coral/10 text-coral dark:bg-coral/20 font-bold text-xs border border-coral/20 animate-in fade-in zoom-in-95 duration-150"
          >
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="hover:bg-coral/20 text-coral rounded p-0.5 transition-colors cursor-pointer"
                title={`Remove ${tag}`}
              >
                <X className="size-3" />
              </button>
            )}
          </span>
        ))}

        {value.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            disabled={disabled}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={value.length === 0 ? placeholder : "Add more..."}
            className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-ink text-sm font-medium placeholder:text-ink-faint placeholder:font-normal px-1 py-0.5"
          />
        )}
      </div>

      {/* Helper text or error */}
      {error ? (
        <p className="text-xs font-semibold text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-ink-muted">{helperText}</p>
      ) : null}

      {/* Suggested Quick Add Tags */}
      {availableSuggestions.length > 0 && value.length < maxTags && !disabled && (
        <div className="pt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider flex items-center gap-1">
            <TagIcon className="size-3" /> Suggested:
          </span>
          {availableSuggestions.slice(0, 6).map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => addTag(s)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-soft hover:bg-coral-light/60 border border-border-peach hover:border-coral/40 text-ink-muted hover:text-coral transition-colors cursor-pointer"
            >
              <Plus className="size-2.5" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormTagsInput;
