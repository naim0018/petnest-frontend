"use client";

import React, { useState, forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  containerClassName?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon = <Lock className="size-4" />,
      className,
      containerClassName,
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold uppercase tracking-wider text-ink"
          >
            {label} {required && <span className="text-coral">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            disabled={disabled}
            className={cn(
              "w-full h-10.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm font-semibold transition-all duration-200 outline-none placeholder:text-ink-faint placeholder:font-normal",
              "focus:border-coral focus:ring-2 focus:ring-coral/20",
              leftIcon ? "pl-10" : "pl-3.5",
              "pr-10",
              disabled && "bg-surface-muted/60 text-ink-muted cursor-not-allowed border-border-peach/70",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-coral transition-colors p-1 rounded-md cursor-pointer focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        {error ? (
          <p className="text-[11px] font-medium text-red-500 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-ink-muted mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
