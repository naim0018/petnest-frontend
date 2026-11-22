"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Check, ChevronDown, Globe, Languages, Loader2 } from "lucide-react";
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

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : null;
}

function setGoogleTranslateCookie(langCode: string) {
  if (typeof document === "undefined") return;

  const hostname = window.location.hostname;
  if (langCode === "en") {
    // Revert to English (clear cookies)
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
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Detect active language from googtrans cookie or localStorage
    const saved = localStorage.getItem("petnest_lang");
    const cookie = getCookie("googtrans");

    if (cookie) {
      const parts = cookie.split("/");
      const targetLang = parts[parts.length - 1];
      if (targetLang && LANGUAGES.some((l) => l.code === targetLang)) {
        setCurrentCode(targetLang);
        return;
      }
    }

    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setCurrentCode(saved);
    }
  }, []);

  const activeLang =
    LANGUAGES.find((l) => l.code === currentCode) || LANGUAGES[0];

  const handleSelectLanguage = (code: string) => {
    if (code === currentCode) {
      setOpen(false);
      return;
    }

    setOpen(false);
    setCurrentCode(code);
    localStorage.setItem("petnest_lang", code);

    startTransition(() => {
      setGoogleTranslateCookie(code);

      // Attempt instant DOM update via Google's select element
      const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (combo) {
        combo.value = code;
        combo.dispatchEvent(new Event("change"));
      }

      // Reload to ensure full SSR DOM translation if needed
      window.location.reload();
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
            title={`Current Language: ${activeLang.nativeName} (${activeLang.name})`}
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
        className="w-56 p-1.5 bg-card border border-border-peach rounded-lg shadow-xl z-50 overflow-hidden"
      >
        <div className="px-2.5 py-1.5 border-b border-border-peach/70 flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-coral">
            <Globe className="size-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink font-quicksand">
              Language
            </span>
          </div>
          <span className="text-[10px] text-ink-muted">Auto-Translate</span>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-0.5 p-0.5 scrollbar-thin">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentCode;
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
