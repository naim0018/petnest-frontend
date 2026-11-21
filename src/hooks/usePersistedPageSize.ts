"use client";

import { useState, useEffect, useCallback } from "react";

export function getStorageKey(name: string): string {
  return `petnest_pagesize_${name.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "_")}`;
}

/**
 * Persists table/page pageSize preference ("all" or number) to localStorage keyed by table or page name.
 * Prevents hydration mismatches by syncing on client-side mount.
 */
export function usePersistedPageSize(
  tableOrPageName: string,
  defaultSize: number | "all" = 10
): [number | "all", (newSize: number | "all") => void] {
  const storageKey = getStorageKey(tableOrPageName);
  const [pageSize, setPageSizeState] = useState<number | "all">(defaultSize);

  // Sync saved value from localStorage after client hydration
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        if (saved === "all") {
          setPageSizeState("all");
        } else {
          const num = Number(saved);
          if (!isNaN(num) && num > 0) {
            setPageSizeState(num);
          }
        }
      }
    } catch {
      // Ignore private browsing or localStorage access restrictions
    }
  }, [storageKey]);

  // Setter that updates local state and saves to localStorage
  const setPageSize = useCallback(
    (newSize: number | "all") => {
      setPageSizeState(newSize);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, String(newSize));
        } catch {
          // Ignore
        }
      }
    },
    [storageKey]
  );

  return [pageSize, setPageSize];
}
