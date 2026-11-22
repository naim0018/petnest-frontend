"use client";

import React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export const Tooltip = ({
  content,
  children,
  className,
  containerClassName,
  fullWidth = false,
  position = "top",
  delay = 150,
}: TooltipProps) => {
  // If no content is provided, just render children without tooltip overhead
  if (!content) {
    return (
      <div className={cn(fullWidth ? "flex w-full" : "inline-flex", containerClassName)}>
        {children}
      </div>
    );
  }

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger
        delay={delay}
        render={(props) => (
          <div
            {...props}
            className={cn(
              "relative items-center group",
              fullWidth ? "flex w-full" : "inline-flex",
              containerClassName
            )}
          >
            {children}
          </div>
        )}
      />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner
          side={position}
          sideOffset={8}
          collisionPadding={12}
          className="z-[99999] pointer-events-none"
        >
          <TooltipPrimitive.Popup
            className={cn(
              "px-3 py-1.5 bg-gray-900 text-white text-[11px] font-medium rounded-lg shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 select-none",
              "data-[side=top]:slide-in-from-bottom-1 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1",
              className
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="data-[side=top]:bottom-[-4px] data-[side=bottom]:top-[-4px] data-[side=left]:right-[-4px] data-[side=right]:left-[-4px] size-2 rotate-45 bg-gray-900" />
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};
