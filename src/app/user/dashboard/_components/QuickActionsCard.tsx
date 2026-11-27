"use client";

import React from "react";
import Link from "next/link";
import { Zap, BookOpen, ShoppingCart, PawPrint, Home } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";

export default function QuickActionsCard() {
  return (
    <AnimatedContainer
      delay={0.2}
      className="lg:col-span-4 bg-white dark:bg-card border border-border-peach/60 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between"
    >
      <div className="flex items-center gap-2">
        <Zap className="size-5 text-[#F59E0B] fill-[#F59E0B]" />
        <h2 className="text-base sm:text-lg font-bold font-quicksand text-ink">
          Quick Actions
        </h2>
      </div>

      {/* 2x2 Tactile Action Tiles */}
      <div className="grid grid-cols-2 gap-3.5 my-auto pt-4">
        {/* Tile 1: Browse Pet Guides */}
        <Link
          href="/guides"
          className="bg-[#FEE6E6] dark:bg-rose-950/30 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:opacity-90 transition-all min-h-[110px] group"
        >
          <BookOpen className="size-6 text-[#E11D48] mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-[#E11D48] dark:text-rose-300">
            Browse Pet Guides →
          </span>
        </Link>

        {/* Tile 2: Shop Pet Care Products */}
        <Link
          href="/marketplace"
          className="bg-[#E7F6F1] dark:bg-emerald-950/30 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:opacity-90 transition-all min-h-[110px] group"
        >
          <ShoppingCart className="size-6 text-[#059669] mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-[#059669] dark:text-emerald-300">
            Shop Pet Care Products →
          </span>
        </Link>

        {/* Tile 3: Find a Vet */}
        <Link
          href="/community"
          className="bg-[#FEF3DF] dark:bg-amber-950/30 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:opacity-90 transition-all min-h-[110px] group"
        >
          <PawPrint className="size-6 text-[#D97706] mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-[#D97706] dark:text-amber-300">
            Find a Vet →
          </span>
        </Link>

        {/* Tile 4: Adopt a Pet */}
        <Link
          href="/adoption"
          className="bg-[#EAE8FD] dark:bg-purple-950/30 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:opacity-90 transition-all min-h-[110px] group"
        >
          <Home className="size-6 text-[#7C3AED] mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-[#7C3AED] dark:text-purple-300">
            Adopt a Pet →
          </span>
        </Link>
      </div>
    </AnimatedContainer>
  );
}
