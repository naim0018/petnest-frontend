"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, PawPrint } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 selection:bg-coral/20">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 🚀 Self-contained Pet Astronaut Illustration (Zero external CDN dependency) */}
        <div className="relative w-full max-w-[360px] mx-auto">
          <svg
            viewBox="0 0 400 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-sm"
          >
            {/* Background Glow */}
            <circle cx="200" cy="130" r="100" fill="var(--color-coral)" fillOpacity="0.08" filter="blur(30px)" />
            <circle cx="310" cy="70" r="40" fill="var(--color-sunshine)" fillOpacity="0.12" filter="blur(20px)" />

            {/* Orbiting Planet with Ring */}
            <g className="animate-pulse" style={{ animationDuration: "4s" }}>
              <circle cx="320" cy="65" r="22" fill="var(--color-coral)" fillOpacity="0.85" />
              <ellipse
                cx="320"
                cy="65"
                rx="34"
                ry="8"
                fill="none"
                stroke="var(--color-sunshine)"
                strokeWidth="2.5"
                strokeDasharray="6 2"
                transform="rotate(-20 320 65)"
              />
            </g>

            {/* Small Distant Planet */}
            <circle cx="70" cy="180" r="12" fill="var(--color-tint-mint)" stroke="var(--color-border-peach)" strokeWidth="1.5" />

            {/* Twinkling Stars */}
            <path d="M85 60 L87 66 L93 68 L87 70 L85 76 L83 70 L77 68 L83 66 Z" fill="var(--color-sunshine)" opacity="0.9" />
            <path d="M130 35 L131 39 L135 40 L131 41 L130 45 L129 41 L125 40 L129 39 Z" fill="var(--color-coral)" opacity="0.75" />
            <path d="M340 180 L341.5 184 L345.5 185.5 L341.5 187 L340 191 L338.5 187 L334.5 185.5 L338.5 184 Z" fill="var(--color-sunshine)" opacity="0.8" />
            <circle cx="105" cy="120" r="2" fill="currentColor" opacity="0.3" />
            <circle cx="295" cy="140" r="2.5" fill="currentColor" opacity="0.3" />
            <circle cx="270" cy="40" r="1.5" fill="currentColor" opacity="0.4" />

            {/* Paw Print Constellation in Space */}
            <g opacity="0.35" transform="translate(60, 80) scale(0.7)">
              <ellipse cx="20" cy="15" rx="3" ry="4.5" fill="var(--color-coral)" />
              <ellipse cx="32" cy="15" rx="3" ry="4.5" fill="var(--color-coral)" />
              <ellipse cx="14" cy="24" rx="2.5" ry="4" fill="var(--color-coral)" transform="rotate(-20 14 24)" />
              <ellipse cx="38" cy="24" rx="2.5" ry="4" fill="var(--color-coral)" transform="rotate(20 38 24)" />
              <path d="M26 23 C20 23, 16 28, 18 34 C20 39, 32 39, 34 34 C36 28, 32 23, 26 23 Z" fill="var(--color-coral)" />
            </g>

            {/* Astronaut Tether / Floating cord */}
            <path
              d="M175 220 C150 240, 110 230, 95 245 C80 260, 60 250, 40 255"
              fill="none"
              stroke="var(--color-border-peach)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 3"
            />

            {/* Pet Astronaut Body & Suit */}
            <ellipse cx="200" cy="205" rx="36" ry="28" fill="var(--color-surface-soft)" stroke="var(--color-border-peach)" strokeWidth="3" />
            <rect x="186" y="195" width="28" height="18" rx="6" fill="var(--color-coral-light)" stroke="var(--color-coral)" strokeWidth="1.5" />
            {/* Small chest badge */}
            <circle cx="200" cy="204" r="3.5" fill="var(--color-coral)" />

            {/* Astronaut Helmet Bubble (Outer) */}
            <circle
              cx="200"
              cy="125"
              r="62"
              fill="var(--color-card)"
              stroke="var(--color-border-peach)"
              strokeWidth="4"
            />

            {/* Helmet Collar Ring */}
            <rect
              x="165"
              y="180"
              width="70"
              height="12"
              rx="6"
              fill="var(--color-coral)"
              stroke="var(--color-coral-dark)"
              strokeWidth="1.5"
            />

            {/* Helmet Visor Interior (Dark Space View) */}
            <circle cx="200" cy="125" r="52" fill="#1e1826" />

            {/* 🐶 Cute Pet Face inside Helmet */}
            {/* Ears */}
            <path d="M162 105 C152 85, 166 75, 174 95 Z" fill="#e8985e" stroke="#c97b45" strokeWidth="1.5" />
            <path d="M238 105 C248 85, 234 75, 226 95 Z" fill="#e8985e" stroke="#c97b45" strokeWidth="1.5" />
            {/* Head */}
            <ellipse cx="200" cy="128" rx="34" ry="30" fill="#f4af7a" />
            {/* Cheeks */}
            <ellipse cx="178" cy="138" rx="6" ry="4" fill="#ff6b6b" fillOpacity="0.4" />
            <ellipse cx="222" cy="138" rx="6" ry="4" fill="#ff6b6b" fillOpacity="0.4" />
            {/* Eyes with gleam */}
            <circle cx="186" cy="124" r="4.5" fill="#1c1917" />
            <circle cx="184.5" cy="122.5" r="1.5" fill="#ffffff" />
            <circle cx="214" cy="124" r="4.5" fill="#1c1917" />
            <circle cx="212.5" cy="122.5" r="1.5" fill="#ffffff" />
            {/* Snout */}
            <ellipse cx="200" cy="136" rx="11" ry="8" fill="#ffffff" />
            {/* Nose */}
            <path d="M196 132 C196 130, 204 130, 204 132 L200 136 Z" fill="#292524" />
            {/* Mouth */}
            <path d="M197 136 Q200 139 203 136" fill="none" stroke="#292524" strokeWidth="1.2" strokeLinecap="round" />

            {/* Visor Glass Light Reflection Curved Arc */}
            <path
              d="M165 105 A48 48 0 0 1 228 92"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.35"
            />
          </svg>
        </div>

        {/* 🐾 Status & Copy */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-light border border-coral/20 text-coral text-xs font-bold font-quicksand">
            <PawPrint className="size-3.5" />
            <span>Error 404 • Destination Unknown</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-quicksand text-ink tracking-tight">
            Lost in Space?
          </h1>

          <p className="text-sm text-ink-muted max-w-sm mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist, was moved, or your furry companion wandered off with the coordinates!
          </p>
        </div>

        {/* 🔘 Navigation Actions using PetNest standard buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
          <PrimaryButton
            type="button"
            variant="outline"
            size="md"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="size-4" />}
            title="Go Back"
            className="w-full sm:w-auto px-6 rounded-xl"
          />

          <PrimaryButton
            type="button"
            variant="primary"
            size="md"
            onClick={() => router.push("/")}
            leftIcon={<Home className="size-4" />}
            title="Back to Home"
            className="w-full sm:w-auto px-6 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
