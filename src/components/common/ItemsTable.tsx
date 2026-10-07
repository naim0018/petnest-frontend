"use client";

import React from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import PrimaryButton from "@/components/common/PrimaryButton";

export interface ItemsTableRow {
  id: string | number;
  name: string;
  image: string;
  qty: number;
}

export interface ItemsTableProps {
  title: string;
  rows: ItemsTableRow[];
  className?: string;
  /** Label for the right-side numeric column. Defaults to "Qty" */
  colLabel?: string;
}

export function ItemsTable({
  title,
  rows,
  className,
  colLabel = "Qty",
}: ItemsTableProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl overflow-hidden bg-card border border-border-peach p-5 shadow-xs",
        className
      )}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4">
        <h3 className="font-bold text-ink text-base font-quicksand">{title}</h3>
        <PrimaryButton
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-muted"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </PrimaryButton>
      </div>

      {/* PetNest header column */}
      <div className="flex items-center justify-between py-2.5 text-white text-xs font-bold px-4 rounded-lg bg-coral shadow-2xs font-quicksand">
        <span>Items Name</span>
        <span>{colLabel}</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border-peach">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-surface-muted/60 transition-colors rounded-md my-0.5"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-surface-muted flex items-center justify-center shrink-0 overflow-hidden border border-border-peach">
                <Image
                  src={row.image}
                  alt={row.name}
                  width={36}
                  height={36}
                  className="object-contain w-7 h-7"
                />
              </div>
              <span className="text-sm font-semibold text-ink truncate font-quicksand">
                {row.name}
              </span>
            </div>
            <span className="text-sm font-bold text-coral shrink-0 ml-4">
              {row.qty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
