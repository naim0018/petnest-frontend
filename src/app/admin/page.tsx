"use client";

import AnimatedContainer from "@/components/common/AnimatedContainer";
import { DashboardFilters } from "./_components/DashboardFilters";
import { DashboardStats } from "./_components/DashboardStats";
import { DashboardChart } from "./_components/DashboardChart";
import { TopSellingSection } from "./_components/TopSellingSection";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <AnimatedContainer delay={0.1}>
        <div
          className="flex flex-col gap-6 p-6 sm:p-8 rounded-xl w-full bg-card border border-border-peach shadow-xs"
        >
          <DashboardFilters />
          <DashboardStats />

          <div
            className="mt-2 p-6 border rounded-xl border-border-peach bg-surface-soft/60"
          >
            <DashboardChart />
          </div>
          <TopSellingSection />
        </div>
      </AnimatedContainer>
    </div>
  );
}
