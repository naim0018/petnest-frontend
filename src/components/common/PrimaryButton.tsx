"use client";

import { ReactNode, forwardRef, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative overflow-hidden group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer before:absolute before:inset-0 before:rounded-full before:-translate-x-[101%] hover:before:translate-x-0 before:transition-transform before:duration-300 before:ease-out",
  {
    variants: {
      variant: {
        primary:
          "bg-coral text-white border border-coral shadow-xs before:bg-card hover:border-coral",
        outline:
          "border border-border-peach bg-card text-ink hover:border-coral shadow-xs before:bg-coral",
        ghost: "text-coral hover:bg-coral-light before:hidden",
        coralLight:
          "bg-coral-light text-coral border border-coral/20 shadow-xs before:bg-coral",
        danger:
          "bg-red-600 text-white border border-red-600 shadow-xs before:bg-white",
        success:
          "bg-emerald-600 text-white border border-emerald-600 shadow-xs before:bg-white",
        secondary:
          "bg-surface-muted text-ink border border-border-peach shadow-xs before:bg-coral",
        sweep:
          "bg-surface-muted text-ink-muted border border-border-peach shadow-xs before:bg-coral",
        sweepOutline:
          "border border-border-peach bg-card text-ink shadow-xs before:bg-coral",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "size-10 p-0 flex items-center justify-center rounded-xl",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface PrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  title?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  animatedSweep?: boolean;
}

const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    {
      title,
      leftIcon,
      rightIcon,
      isLoading = false,
      animatedSweep = false,
      variant = "primary",
      size,
      fullWidth,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isPrimary = variant === "primary" || variant === "danger" || variant === "success";

    const hoverTextColorClass = isPrimary
      ? "group-hover:text-coral [&_svg]:group-hover:text-coral"
      : "group-hover:text-white [&_svg]:group-hover:text-white";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin relative z-10" />
        ) : (
          <span
            className={cn(
              "relative z-10 flex items-center justify-center gap-2 transition-colors duration-300",
              hoverTextColorClass
            )}
          >
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {title || children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </span>
        )}
      </button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;
