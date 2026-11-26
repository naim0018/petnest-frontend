"use client";

import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { FilterSelect } from "@/components/common/FilterSelect";

interface CategorySegment {
  name: string;
  value: number;
  percentage: number;
  count: string;
  color: string;
}

// Harmonized palette matching PetNest's signature coral & warm neutrals
const categoryData: CategorySegment[] = [
  { name: "Live Pets & Breeders", value: 38, percentage: 38, count: "490 items", color: "#ff6b6b" },
  { name: "Organic Food & Nutrition", value: 32, percentage: 32, count: "412 items", color: "#fb7185" },
  { name: "Accessories & Habitats", value: 18, percentage: 18, count: "232 items", color: "#fca5a5" },
  { name: "Pet Health & Medicines", value: 12, percentage: 12, count: "156 items", color: "#a89f91" },
];

export function DashboardCategoryDonut() {
  const [viewBy, setViewBy] = useState("All items");

  return (
    <div className="p-6 rounded-xl bg-card border border-border-peach shadow-xs flex flex-col justify-between gap-5 w-full h-full min-w-0">
      {/* Header aligned horizontally with left chart filter row */}
      <div className="flex items-center justify-between gap-3 min-h-10">
        <div>
          <h3 className="font-bold text-ink text-sm sm:text-base font-quicksand leading-tight">
            Category Distribution
          </h3>
          <p className="text-[11px] text-ink-muted">Marketplace volume by category</p>
        </div>
        <FilterSelect
          title={viewBy}
          options={["All items", "By Revenue ($)", "By Volume (Qty)"]}
          variant="outline"
          className="w-32 text-xs"
          value={viewBy}
          onChange={(v) => setViewBy(v)}
        />
      </div>

      {/* Donut Chart with Centered Total */}
      <div className="relative w-full h-[260px] flex items-center justify-center my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(val: any, name: any) => [`${val}% of total`, name]}
              contentStyle={{
                backgroundColor: "var(--color-card, #ffffff)",
                borderColor: "var(--color-border-peach, #fed7aa)",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={92}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold font-quicksand text-coral leading-tight">
            100%
          </span>
          <span className="text-[10px] text-ink-muted uppercase font-semibold tracking-wider">
            Catalog Total
          </span>
        </div>
      </div>

      {/* Legend with percentages and counts matching the clean line design */}
      <div className="space-y-2.5 pt-3 border-t border-border-peach">
        {categoryData.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="size-2.5 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: cat.color }}
              />
              <span className="font-semibold text-ink truncate text-[11px] font-quicksand">
                {cat.name}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0 text-right">
              <span className="text-[11px] text-ink-muted">{cat.count}</span>
              <span className="font-bold text-coral text-xs w-8 text-right font-quicksand">
                {cat.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
