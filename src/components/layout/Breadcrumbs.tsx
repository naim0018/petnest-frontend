"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center space-x-1.5 text-xs sm:text-sm text-ink-muted">
      <Link
        href="/"
        className="text-ink-muted hover:text-coral transition-colors flex items-center p-1 rounded-md hover:bg-coral-light"
        aria-label="Home"
      >
        <Home className="size-3.5 sm:size-4" />
      </Link>

      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        // Custom friendly segment labels
        const customNames: Record<string, string> = {
          admin: "Admin",
          "pet-catalog": "Pet Catalog",
          dogs: "Dogs",
          cats: "Cats",
          birds: "Birds",
          aquatic: "Aquatic",
          "small-pets": "Small Pets",
          reptiles: "Reptiles",
          new: "Add Pet Type",
          "new-breed": "Add Breed",
        };

        const displayName =
          customNames[segment] ||
          segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <div key={url} className="flex items-center space-x-1.5">
            <ChevronRight className="size-3.5 text-ink-faint shrink-0" />
            {isLast ? (
              <span className="text-coral font-bold truncate max-w-[150px] sm:max-w-[240px]">
                {displayName}
              </span>
            ) : (
              <Link
                href={url}
                className="text-ink-muted hover:text-coral transition-colors no-underline font-medium hover:underline truncate max-w-[120px] sm:max-w-none"
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
