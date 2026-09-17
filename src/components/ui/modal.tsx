"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);

function useModalContext() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("Modal compound components must be rendered within <Modal>");
  }
  return context;
}

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Modal({ open, onOpenChange, children }: ModalProps) {
  return (
    <ModalContext.Provider value={{ open, onOpenChange }}>
      {open ? children : null}
    </ModalContext.Provider>
  );
}

export function ModalContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { onOpenChange } = useModalContext();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          "bg-popover border border-border-peach rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 relative",
          className
        )}
      >
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-5 right-5 p-1 text-ink-faint hover:text-ink rounded-full cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function ModalHeader({ title, description, className }: { title: string; description?: string; className?: string }) {
  return (
    <div className={cn("border-b border-border-peach pb-3 space-y-1", className)}>
      <h3 className="text-lg font-bold text-ink pr-6">{title}</h3>
      {description && <p className="text-xs text-ink-faint">{description}</p>}
    </div>
  );
}

export function ModalBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("py-2 space-y-3", className)}>{children}</div>;
}

export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("pt-3 border-t border-border-peach flex justify-end gap-2", className)}>{children}</div>;
}

// Compound Pattern Namespace Exports
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
