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
        "flex flex-col rounded-2xl overflow-hidden bg-layout-bg shadow-all px-5",
        className
      )}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between py-4">
        <h3 className="text-card font-semibold text-primary-text">{title}</h3>
        <PrimaryButton
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </PrimaryButton>
      </div>

      {/* Brand gradient column header */}
      <div className="flex items-center justify-between py-3 text-white text-sm font-medium px-5 rounded-md bg-brand-gradient shadow-xs">
        <span>Items Name</span>
        <span>{colLabel}</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                <Image
                  src={row.image}
                  alt={row.name}
                  width={36}
                  height={36}
                  className="object-contain w-7 h-7"
                />
              </div>
              <span className="text-sm font-medium text-primary-text truncate">
                {row.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-secondary-text shrink-0 ml-4">
              {row.qty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
