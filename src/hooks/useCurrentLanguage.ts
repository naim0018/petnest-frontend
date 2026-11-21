"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect the currently active language selected via LanguageSelector / Google Translate.
 */
export function useCurrentLanguage(): string {
  const [lang, setLang] = useState<string>("en");

  useEffect(() => {
    const detect = (): string => {
      if (typeof document === "undefined") return "en";
      const match = document.cookie.match(/(^|;\s*)googtrans=([^;]*)/);
      if (match) {
        const parts = decodeURIComponent(match[2]).split("/");
        const code = parts[parts.length - 1];
        if (code) return code;
      }
      return localStorage.getItem("petnest_lang") || "en";
    };

    setLang(detect());

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "petnest_lang" && e.newValue) {
        setLang(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return lang;
}
