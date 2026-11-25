"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { useUpdateGuideMutation } from "@/store/Api/Guides/guides.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GuideOrderInputProps {
  guideId: string;
  currentOrder?: number;
  guideTitle?: string;
  className?: string;
  disabled?: boolean;
}

export default function GuideOrderInput({
  guideId,
  currentOrder = 0,
  guideTitle,
  className,
  disabled = false,
}: GuideOrderInputProps) {
  const [val, setVal] = useState<number | string>(currentOrder ?? 0);
  const [updateGuide, { isLoading: isUpdating }] = useUpdateGuideMutation();

  useEffect(() => {
    setVal(currentOrder ?? 0);
  }, [currentOrder]);

  const commitOrder = async (targetVal: number | string) => {
    const parsed = typeof targetVal === "string" ? parseInt(targetVal, 10) : targetVal;
    const validOrder = isNaN(parsed) ? 0 : Math.max(0, Math.round(parsed));

    if (validOrder === currentOrder) {
      setVal(currentOrder);
      return;
    }

    setVal(validOrder);

    try {
      await updateGuide({
        id: guideId,
        payload: { displayOrder: validOrder },
      }).unwrap();

      toast.success(
        guideTitle
          ? `Order for "${guideTitle}" updated to #${validOrder}`
          : `Order updated to #${validOrder}`
      );
    } catch (err: unknown) {
      setVal(currentOrder ?? 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errObj = err as any;
      const message =
        errObj?.data?.message ||
        errObj?.message ||
        "Failed to update guide order. Please try again.";
      toast.error(message);
    }
  };

  const handleStep = (step: number) => {
    if (disabled || isUpdating) return;
    const currentNum = typeof val === "string" ? parseInt(val, 10) || 0 : val;
    const next = Math.max(0, currentNum + step);
    commitOrder(next);
  };

  const currentNum = typeof val === "string" ? parseInt(val, 10) || 0 : val;

  return (
    <div
      className={cn(
        "inline-flex items-center border border-border-peach rounded-lg bg-surface-soft hover:border-coral/40 focus-within:border-coral focus-within:ring-1 focus-within:ring-coral/20 transition-all shadow-2xs select-none h-7",
        isUpdating && "opacity-80 pointer-events-none",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      title="Click + / - or type a number to change display order"
    >
      <button
        type="button"
        onClick={() => handleStep(-1)}
        disabled={disabled || isUpdating || currentNum <= 0}
        aria-label="Decrease display order"
        className="size-7 flex items-center justify-center text-ink-muted hover:text-coral hover:bg-coral/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer rounded-l-lg shrink-0"
      >
        <Minus className="size-3" />
      </button>

      <div className="relative flex items-center">
        <input
          type="number"
          min={0}
          value={val}
          disabled={disabled || isUpdating}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              setVal("");
              return;
            }
            const parsed = parseInt(raw, 10);
            setVal(isNaN(parsed) ? 0 : Math.max(0, parsed));
          }}
          onBlur={() => commitOrder(val)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commitOrder(val);
              (e.target as HTMLInputElement).blur();
            } else if (e.key === "Escape") {
              setVal(currentOrder ?? 0);
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="w-10 h-7 text-center text-xs font-bold font-quicksand bg-transparent text-ink border-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {isUpdating && (
          <span className="absolute inset-0 flex items-center justify-center bg-surface-soft/80 rounded">
            <Loader2 className="size-3 animate-spin text-coral" />
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => handleStep(1)}
        disabled={disabled || isUpdating}
        aria-label="Increase display order"
        className="size-7 flex items-center justify-center text-ink-muted hover:text-coral hover:bg-coral/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer rounded-r-lg shrink-0"
      >
        <Plus className="size-3" />
      </button>
    </div>
  );
}
