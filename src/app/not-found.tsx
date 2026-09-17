"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Illustration */}
        <div className="relative">
          <Image
            src="https://illustrations.popsy.co/gray/policeman-looking-at-clues.svg"
            alt="Page not found"
            width={400}
            height={260}
            className="w-full h-auto max-h-[260px] mx-auto"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-100/30 rounded-full blur-3xl opacity-50 -z-10" />
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-8xl font-black text-gray-200 dark:text-slate-800">404</h1>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Lost in Space?</h2>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            The page you're looking for doesn't exist or has been moved to another coordinate.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold rounded-xl hover:bg-slate-850 dark:hover:bg-slate-100 transition-all text-xs shadow-md"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
