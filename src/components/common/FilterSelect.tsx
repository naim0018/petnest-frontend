"use client";

import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FaCaretDown } from "react-icons/fa";

interface FilterSelectProps {
  icon?: LucideIcon;
  title: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  variant?: "primary" | "outline";
}

export function FilterSelect({
  icon: Icon,
  title,
  options,
  value: controlledValue,
  onChange,
  className,
  variant = "primary",
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState<string | undefined>(undefined);

  const value = controlledValue !== undefined ? controlledValue : localValue;
  const displayValue = value || title;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger
        render={(props) => (
          <button
            {...props}
            className={cn(
              "flex items-center justify-between gap-1.5 sm:gap-2 px-3 sm:px-4 h-11 w-full rounded-xl text-xs sm:text-sm font-bold font-quicksand transition-all active:scale-[0.98] outline-none cursor-pointer border",
              variant === "primary"
                ? "bg-coral text-white border-coral shadow-xs hover:bg-coral-dark"
                : "bg-card text-ink border-border-peach hover:bg-surface-muted hover:border-coral/40",
              open && "pointer-events-none",
              className
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {Icon && <Icon className="size-4 shrink-0" />}
              <span className="truncate">{displayValue}</span>
            </div>
            <FaCaretDown className="size-3 shrink-0 ml-1 opacity-70" />
          </button>
        )}
      />
      <PopoverContent
        className="w-[var(--anchor-width)] p-1.5 bg-card border border-border-peach rounded-xl shadow-lg"
        align="start"
        sideOffset={6}
      >
        <div className="flex flex-col gap-0.5">
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                onClick={() => {
                  if (controlledValue === undefined) {
                    setLocalValue(opt);
                  }
                  onChange?.(opt);
                  setOpen(false);
                }}
                className={cn(
                  "text-left px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors outline-none cursor-pointer",
                  isSelected
                    ? "bg-coral-light text-coral font-bold"
                    : "text-ink-muted hover:text-ink hover:bg-surface-muted"
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
