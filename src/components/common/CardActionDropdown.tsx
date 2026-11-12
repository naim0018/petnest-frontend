"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

interface CardActionDropdownProps {
  onDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  align?: "left" | "right";
  size?: "sm" | "md";
}

export default function CardActionDropdown({
  onDetails,
  onEdit,
  onDelete,
  className = "",
  align = "right",
  size = "sm",
}: CardActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleAction = (e: React.MouseEvent, action?: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    action?.();
  };

  const btnSize = size === "sm" ? "size-7" : "size-8";
  const iconSize = size === "sm" ? "size-3.5" : "size-4";

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={handleTriggerClick}
        aria-label="Actions"
        aria-expanded={isOpen}
        className={`${btnSize} rounded-lg bg-card/90 hover:bg-surface-soft text-ink-muted hover:text-coral border border-border-peach shadow-2xs flex items-center justify-center transition-colors cursor-pointer backdrop-blur-xs`}
      >
        <MoreVertical className={iconSize} />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } top-full mt-1.5 w-36 rounded-xl bg-card border border-border-peach shadow-xl py-1 z-40 text-xs font-semibold animate-in fade-in-0 zoom-in-95`}
        >
          {onDetails && (
            <button
              type="button"
              onClick={(e) => handleAction(e, onDetails)}
              className="w-full px-3 py-2 text-left flex items-center gap-2 text-ink hover:bg-surface-soft hover:text-coral transition-colors cursor-pointer"
            >
              <Eye className="size-3.5 text-sky-500" />
              <span>Details</span>
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={(e) => handleAction(e, onEdit)}
              className="w-full px-3 py-2 text-left flex items-center gap-2 text-ink hover:bg-surface-soft hover:text-coral transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5 text-amber-500" />
              <span>Edit</span>
            </button>
          )}

          {(onDetails || onEdit) && onDelete && (
            <div className="border-t border-border-peach/60 my-1" />
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => handleAction(e, onDelete)}
              className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5 text-rose-500" />
              <span>Delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
