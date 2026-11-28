"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, HeartPulse, ArrowRight } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";

const CARE_TASKS = [
  { id: "water", label: "Fresh water & morning meal" },
  { id: "play", label: "15-min play or walk session" },
  { id: "groom", label: "Quick coat & paw check" },
];

export default function PromoBannerCard() {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    water: true,
    play: false,
    groom: false,
  });

  const completedCount = Object.values(checked).filter(Boolean).length;

  const toggleTask = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AnimatedContainer
      delay={0.3}
      className="lg:col-span-4 rounded-xl p-5 sm:p-6 border border-[#BCE3C5]/70 dark:border-emerald-800/40 bg-gradient-to-br from-[#F2FAF3] via-[#E8F6EA] to-[#DFF2E2] dark:from-[#122019] dark:via-[#15241D] dark:to-[#111916] shadow-xs flex flex-col justify-between gap-4"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="size-5 text-[#10B981]" />
            <h3 className="text-lg font-extrabold font-quicksand text-ink tracking-tight">
              Daily Care Checklist
            </h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-emerald-950/80 text-[#059669] dark:text-emerald-300 border border-[#BCE3C5] dark:border-emerald-800/50">
            {completedCount}/{CARE_TASKS.length} done
          </span>
        </div>

        <div className="space-y-2">
          {CARE_TASKS.map((task) => {
            const isDone = Boolean(checked[task.id]);
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => toggleTask(task.id)}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-white/85 dark:bg-white/5 border border-[#BCE3C5]/60 dark:border-emerald-800/40 hover:border-[#10B981]/50 dark:hover:border-emerald-500/50 text-left transition-all"
              >
                {isDone ? (
                  <CheckCircle2 className="size-4.5 text-[#10B981] shrink-0" />
                ) : (
                  <Circle className="size-4.5 text-ink-muted/60 shrink-0" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    isDone ? "line-through text-ink-muted/80" : "text-ink"
                  }`}
                >
                  {task.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Link
        href="/guides"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF6B6B] hover:bg-[#FA5252] text-white text-sm font-bold font-quicksand rounded-full shadow-xs transition-transform active:scale-95 w-full"
      >
        <span className="text-inherit">Explore Health Guides</span>
        <ArrowRight className="size-4" />
      </Link>
    </AnimatedContainer>
  );
}
