"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Check, ChevronDown, Globe, Languages, Loader2, RotateCcw, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "zh-CN", name: "Chinese", nativeName: "简体中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
];

function isClientFromBd(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Asia/Dhaka") return true;
    const offset = new Date().getTimezoneOffset();
    if (offset === -360) return true;
  } catch {}
  return false;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : null;
}

function setGoogleTranslateCookie(langCode: string) {
  if (typeof document === "undefined") return;

  const hostname = window.location.hostname;
  document.cookie = `petnest_lang=${langCode}; path=/; max-age=31536000;`;

  if (langCode === "en") {
    // Revert to English (clear googtrans cookies)
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
  } else {
    const cookieVal = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname};`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=.${hostname};`;
  }
}

export interface LanguageSelectorProps {
  className?: string;
  variant?: "icon" | "pill";
}

export default function LanguageSelector({
  className,
  variant = "pill",
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState<string>("en");
  const [hasManualOverride, setHasManualOverride] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // 1. Detect query override like ?lang=bn or ?lang=en
    const urlParams = new URLSearchParams(window.location.search);
    const qLang = urlParams.get("lang");
    if (qLang && LANGUAGES.some((l) => l.code === qLang)) {
      setCurrentCode(qLang);
      setHasManualOverride(true);
      return;
    }

    // 2. Detect active language from cookies or localStorage
    const saved = localStorage.getItem("petnest_lang");
    const cookie = getCookie("googtrans");

    if (cookie) {
      const parts = cookie.split("/");
      const targetLang = parts[parts.length - 1];
      if (targetLang && LANGUAGES.some((l) => l.code === targetLang)) {
        setCurrentCode(targetLang);
        setHasManualOverride(true);
        return;
      }
    }

    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setCurrentCode(saved);
      setHasManualOverride(true);
      return;
    }

    // 3. Location-based auto-detection: if visitor from BD, default to Bangla
    setHasManualOverride(false);
    if (isClientFromBd()) {
      setCurrentCode("bn");
    } else {
      setCurrentCode("en");
    }
  }, []);

  const activeLang =
    LANGUAGES.find((l) => l.code === currentCode) || LANGUAGES[0];

  const handleSelectLanguage = (code: string) => {
    if (code === currentCode && hasManualOverride) {
      setOpen(false);
      return;
    }

    setOpen(false);
    setCurrentCode(code);
    setHasManualOverride(true);
    localStorage.setItem("petnest_lang", code);

    startTransition(() => {
      setGoogleTranslateCookie(code);

      // Attempt instant DOM update via Google's select element
      const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (combo) {
        combo.value = code;
        combo.dispatchEvent(new Event("change"));
      }

      // Update URL param ?lang= and reload cleanly
      const url = new URL(window.location.href);
      url.searchParams.set("lang", code);
      window.location.href = url.toString();
    });
  };

  const handleResetToLocation = () => {
    setOpen(false);
    localStorage.removeItem("petnest_lang");
    setHasManualOverride(false);

    const hostname = window.location.hostname;
    // Clear cookies across all domain variations
    document.cookie = "petnest_lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `petnest_lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
    document.cookie = `petnest_lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;

    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;

    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo) {
      combo.value = "";
      combo.dispatchEvent(new Event("change"));
    }

    const autoCode = isClientFromBd() ? "bn" : "en";
    setCurrentCode(autoCode);

    startTransition(() => {
      // Remove ?lang= query param from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("lang");
      window.location.href = url.toString();
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={(props) => (
          <button
            {...props}
            type="button"
            className={cn(
              "group inline-flex items-center gap-1 sm:gap-1.5 h-9 sm:h-10 px-2 sm:px-2.5 rounded-lg border border-border-peach bg-coral-light/40 hover:bg-coral-light text-ink hover:border-coral/50 transition-all cursor-pointer font-bold select-none shrink-0",
              open && "border-coral ring-2 ring-coral/20",
              className
            )}
            title={`Language: ${activeLang.nativeName} (${activeLang.name})${!hasManualOverride ? " - Auto (Location)" : ""}`}
            aria-label="Select website language"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin text-coral" />
            ) : variant === "icon" ? (
              <div className="relative flex items-center justify-center">
                <Languages className="size-4.5 sm:size-5 text-coral" />
                <span className="absolute -bottom-1 -right-1 text-[9px] font-black uppercase tracking-tighter bg-coral text-white px-1 rounded-xs">
                  {activeLang.code.slice(0, 2)}
                </span>
              </div>
            ) : (
              <>
                <span className="text-base leading-none">{activeLang.flag}</span>
                <span className="hidden sm:inline-block text-xs uppercase font-extrabold text-ink group-hover:text-coral transition-colors font-quicksand">
                  {activeLang.code.slice(0, 2)}
                </span>
                {!hasManualOverride && (
                  <span className="hidden md:inline-block text-[10px] text-emerald-600 bg-emerald-500/10 px-1 rounded font-bold">
                    Auto
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "hidden sm:inline-block size-3 text-ink-muted transition-transform duration-200",
                    open && "rotate-180"
                  )}
                />
              </>
            )}
          </button>
        )}
      />

      <PopoverContent
        align="end"
        sideOffset={2}
        className="w-60 p-1.5 bg-card border border-border-peach rounded-lg shadow-xl z-50 overflow-hidden"
      >
        {/* Popover Header with Reset Action */}
        <div className="px-2.5 py-1.5 border-b border-border-peach/70 flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-coral">
            <Globe className="size-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink font-quicksand">
              Language
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetToLocation}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-coral hover:text-coral-dark hover:underline cursor-pointer font-quicksand transition-colors"
            title="Reset any custom selection and detect automatically from your location"
          >
            <RotateCcw className="size-3" />
            <span>Reset (Location)</span>
          </button>
        </div>

        {/* Location Auto-detect Quick Option */}
        <div className="px-0.5 pb-1 mb-1 border-b border-border-peach/50">
          <button
            type="button"
            onClick={handleResetToLocation}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors text-left outline-none cursor-pointer border border-dashed",
              !hasManualOverride
                ? "bg-coral/10 text-coral border-coral/40 font-bold"
                : "border-border-peach/80 text-ink hover:bg-surface-muted hover:text-coral"
            )}
            title="Detect language automatically from your location"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="size-3.5 text-coral shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-bold font-quicksand">
                  Auto (Based on Location)
                </span>
                <span className="text-[10px] text-ink-faint truncate">
                  {isClientFromBd()
                    ? "🇧🇩 Detected: Bangladesh (বাংলা)"
                    : "Detected by your IP/Country"}
                </span>
              </div>
            </div>
            {!hasManualOverride && (
              <Check className="size-4 shrink-0 text-coral ml-2" />
            )}
          </button>
        </div>

        {/* Full Language Options List */}
        <div className="max-h-64 overflow-y-auto space-y-0.5 p-0.5 scrollbar-thin">
          {LANGUAGES.map((lang) => {
            const isSelected = hasManualOverride && lang.code === currentCode;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors text-left outline-none cursor-pointer",
                  isSelected
                    ? "bg-coral/10 text-coral font-bold"
                    : "text-ink hover:bg-surface-muted hover:text-coral"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-xs font-bold font-quicksand">
                      {lang.nativeName}
                    </span>
                    <span className="text-[10px] text-ink-faint truncate">
                      {lang.name}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <Check className="size-4 shrink-0 text-coral ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
