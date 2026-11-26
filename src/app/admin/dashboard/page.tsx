"use client";

import React from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { DashboardFilters } from "../_components/DashboardFilters";
import { DashboardStats } from "../_components/DashboardStats";
import { DashboardChart } from "../_components/DashboardChart";
import { DashboardCategoryDonut } from "../_components/DashboardCategoryDonut";
import { TopSellingSection } from "../_components/TopSellingSection";

export default function AdminDashboardPage() {
  return (
    <div className="w-full space-y-6">
      <AnimatedContainer delay={0.1}>
        <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-lg w-full bg-card border border-border-peach shadow-xs">
          {/* Top Date & Store Filter Pills */}
          <DashboardFilters />

          {/* 5 Core PetNest Vital Cards (Single Row Only - No Duplicates) */}
          <DashboardStats />

          {/* Main Analytics: 2 Separate Cards (Sales Trend 8-cols + Category Donut 4-cols) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full items-stretch">
            <div className="xl:col-span-8 w-full min-w-0">
              <DashboardChart />
            </div>
            <div className="xl:col-span-4 w-full min-w-0">
              <DashboardCategoryDonut />
            </div>
          </div>

          {/* 3-Column Tables: Top Selling Items, Most Read Care Guides, Top Users by Most Visit */}
          <TopSellingSection />
        </div>
      </AnimatedContainer>
    </div>
  );
}
