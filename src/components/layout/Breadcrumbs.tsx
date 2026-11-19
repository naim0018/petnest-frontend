"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import {
  useFindOneEditorialQuery,
  useFindOneCategoryQuery,
} from "@/store/Api/Guides/guides.api";
import {
  useFindOneSpeciesQuery,
  useFindOneBreedQuery,
} from "@/store/Api/Pets/pets.api";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface BreadcrumbItem {
  label: string;
  url: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = useMemo(
    () => pathname.split("/").filter((x) => x),
    [pathname]
  );

  // 1. Detect Guide ID (/admin/guides/<uuid>...)
  const activeGuideId = useMemo(() => {
    const guidesIdx = segments.indexOf("guides");
    if (
      guidesIdx !== -1 &&
      segments[guidesIdx + 1] &&
      UUID_PATTERN.test(segments[guidesIdx + 1])
    ) {
      return segments[guidesIdx + 1];
    }
    return "";
  }, [segments]);

  // 2. Detect Guide Category ID (/admin/guides/categories/<uuid>...)
  const activeCategoryId = useMemo(() => {
    const catIdx = segments.indexOf("categories");
    if (
      catIdx !== -1 &&
      segments[catIdx + 1] &&
      UUID_PATTERN.test(segments[catIdx + 1])
    ) {
      return segments[catIdx + 1];
    }
    return "";
  }, [segments]);

  // 3. Detect Pet Species ID or slug (/admin/pet-catalog/<typeId>...)
  const activeSpeciesId = useMemo(() => {
    const petCatalogIdx = segments.indexOf("pet-catalog");
    if (petCatalogIdx !== -1 && segments[petCatalogIdx + 1]) {
      const seg = segments[petCatalogIdx + 1];
      if (
        seg !== "new" &&
        seg !== "categories" &&
        seg !== "breeds" &&
        seg !== "pet-types"
      ) {
        return seg;
      }
    }
    return "";
  }, [segments]);

  // 4. Detect Pet Breed ID (/admin/pet-catalog/<typeId>/breed/<breedId> or edit-breed/<breedId>)
  const activeBreedId = useMemo(() => {
    const breedIdx = segments.indexOf("breed");
    if (breedIdx !== -1 && segments[breedIdx + 1]) {
      return segments[breedIdx + 1];
    }
    const editBreedIdx = segments.indexOf("edit-breed");
    if (editBreedIdx !== -1 && segments[editBreedIdx + 1]) {
      return segments[editBreedIdx + 1];
    }
    return "";
  }, [segments]);

  // Queries (instant from cache when already mounted on that page)
  const { data: guideRes } = useFindOneEditorialQuery(activeGuideId, {
    skip: !activeGuideId,
  });
  const { data: categoryRes } = useFindOneCategoryQuery(activeCategoryId, {
    skip: !activeCategoryId,
  });
  const { data: speciesRes } = useFindOneSpeciesQuery(activeSpeciesId, {
    skip: !activeSpeciesId,
  });
  const { data: breedRes } = useFindOneBreedQuery(activeBreedId, {
    skip: !activeBreedId,
  });

  const activeGuideTitle = guideRes?.data?.title;
  const activeCategoryName = categoryRes?.data?.name;
  const activeSpeciesName = speciesRes?.data?.name;
  const activeBreedName = breedRes?.data?.name;

  const crumbs: BreadcrumbItem[] = useMemo(() => {
    const items: BreadcrumbItem[] = [];

    const customNames: Record<string, string> = {
      admin: "Admin",
      "pet-catalog": "Pet Catalog",
      guides: "Guides",
      categories: "Categories",
      dogs: "Dogs",
      cats: "Cats",
      birds: "Birds",
      aquatics: "Aquatics",
      aquatic: "Aquatics",
      "small-pets": "Small Pets",
      reptiles: "Reptiles",
      faqs: "FAQs",
      edit: "Edit",
      details: "Details",
    };

    const petCatalogIdx = segments.indexOf("pet-catalog");
    const isPetCatalogRoute = petCatalogIdx !== -1;

    const guidesIdx = segments.indexOf("guides");
    const isGuidesRoute = guidesIdx !== -1;

    let skipNext = false;

    for (let index = 0; index < segments.length; index++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const segment = segments[index];
      const prevSegment = index > 0 ? segments[index - 1] : "";
      const nextSegment = index + 1 < segments.length ? segments[index + 1] : "";
      const url = `/${segments.slice(0, index + 1).join("/")}`;

      // ---------------- PET CATALOG HANDLING ----------------
      if (isPetCatalogRoute && index > petCatalogIdx) {
        // A. Species identifier (e.g. "birds" or species UUID)
        if (index === petCatalogIdx + 1) {
          const resolvedSpeciesName =
            activeSpeciesName ||
            customNames[segment.toLowerCase()] ||
            (UUID_PATTERN.test(segment)
              ? "Species"
              : segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()));

          items.push({
            label: resolvedSpeciesName,
            url,
          });
          continue;
        }

        // B. Skip dead "breed" segment and directly render the Breed Name
        // Route: /admin/pet-catalog/[typeId]/breed/[breedId]
        if (segment === "breed") {
          if (nextSegment) {
            const breedUrl = `/${segments.slice(0, index + 2).join("/")}`;
            const breedName =
              activeBreedName ||
              (UUID_PATTERN.test(nextSegment) ? "Breed Details" : nextSegment);
            items.push({
              label: breedName,
              url: breedUrl,
            });
            skipNext = true;
          }
          continue;
        }

        // C. Edit Breed Route: /admin/pet-catalog/[typeId]/edit-breed/[breedId]
        if (segment === "edit-breed") {
          if (nextSegment) {
            const speciesPath = `/${segments.slice(0, petCatalogIdx + 2).join("/")}`;
            const breedViewUrl = `${speciesPath}/breed/${nextSegment}`;
            const breedName =
              activeBreedName ||
              (UUID_PATTERN.test(nextSegment) ? "Breed Details" : nextSegment);
            // Add Breed crumb (links back to breed view)
            items.push({
              label: breedName,
              url: breedViewUrl,
            });
            // Add Edit crumb
            items.push({
              label: "Edit",
              url: `/${segments.slice(0, index + 2).join("/")}`,
            });
            skipNext = true;
          } else {
            items.push({ label: "Edit Breed", url });
          }
          continue;
        }

        // D. Specific subpages
        if (segment === "new-breed") {
          items.push({ label: "Add Breed", url });
          continue;
        }
        if (segment === "details") {
          items.push({ label: "Details", url });
          continue;
        }
        if (segment === "edit") {
          items.push({ label: "Edit", url });
          continue;
        }
      }

      // ---------------- GUIDES ROUTE HANDLING ----------------
      if (isGuidesRoute) {
        // For /admin/guides/<uuid>(/faqs|/edit), insert "All Guides" before guide title
        if (prevSegment === "guides" && UUID_PATTERN.test(segment)) {
          items.push({
            label: "All Guides",
            url: "/admin/guides/all",
          });
          items.push({
            label: activeGuideTitle || "Guide",
            url,
          });
          continue;
        }

        // For /admin/guides/categories/<uuid>
        if (prevSegment === "categories" && UUID_PATTERN.test(segment)) {
          items.push({
            label: activeCategoryName || "Category",
            url,
          });
          continue;
        }
      }

      // ---------------- STANDARD SEGMENT CRUMBS ----------------
      let displayName = "";
      if (segment === "all" && prevSegment === "guides") {
        displayName = "All Guides";
      } else if (segment === "new") {
        if (prevSegment === "categories") displayName = "New Category";
        else if (prevSegment === "guides") displayName = "New Guide";
        else if (prevSegment === "pet-catalog") displayName = "Add Pet Type";
        else displayName = "New";
      } else if (UUID_PATTERN.test(segment)) {
        // Fallback for any unhandled UUID: NEVER display raw hex string
        displayName = "Details";
      } else {
        displayName =
          customNames[segment.toLowerCase()] ||
          segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
      }

      items.push({ label: displayName, url });
    }

    return items;
  }, [
    segments,
    activeGuideTitle,
    activeCategoryName,
    activeSpeciesName,
    activeBreedName,
  ]);

  return (
    <nav className="flex items-center space-x-1.5 text-xs sm:text-sm text-ink-muted min-w-0">
      <Link
        href="/"
        className="text-ink-muted hover:text-coral transition-colors flex items-center p-1 rounded-md hover:bg-coral-light shrink-0"
        aria-label="Home"
      >
        <Home className="size-3.5 sm:size-4" />
      </Link>

      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <div key={`${crumb.url}-${index}`} className="flex items-center space-x-1.5 min-w-0">
            <ChevronRight className="size-3.5 text-ink-faint shrink-0" />
            {isLast ? (
              <span className="text-coral font-bold truncate max-w-36 sm:max-w-60">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.url}
                className="text-ink-muted hover:text-coral transition-colors no-underline font-medium hover:underline truncate max-w-32 sm:max-w-52"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
