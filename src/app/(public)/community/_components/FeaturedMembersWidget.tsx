"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Award, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURED_MEMBERS, FeaturedMemberItem } from "./communityData";

export function FeaturedMembersWidget() {
  const [members, setMembers] = useState<FeaturedMemberItem[]>(FEATURED_MEMBERS);

  const handleToggleFollow = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isFollowing: !m.isFollowing } : m
      )
    );
  };

  return (
    <div className="bg-card border border-border-peach dark:border-slate-800/80 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-amber-500 shrink-0" />
        <h4 className="text-coral font-bold font-quicksand">
          Featured Members
        </h4>
      </div>

      <div className="space-y-3.5">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-9 rounded-full overflow-hidden border border-border-peach relative shrink-0">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={36}
                  height={36}
                  className="object-cover size-full"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink truncate font-quicksand">
                  {member.name}
                </p>
                <p className="text-[11px] text-ink-muted truncate">
                  {member.role}
                </p>
              </div>
            </div>

              <button
                type="button"
                onClick={() => handleToggleFollow(member.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer font-quicksand shrink-0",
                  member.isFollowing
                    ? "bg-surface-muted text-ink-muted hover:text-ink"
                    : "bg-coral-light/70 dark:bg-coral/20 text-coral border border-coral/30 hover:bg-coral hover:text-white"
                )}
              >
                {member.isFollowing ? "Following" : "Follow"}
              </button>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border-peach/50">
        <button
          type="button"
          className="text-xs font-bold text-coral hover:underline inline-flex items-center gap-1 cursor-pointer font-quicksand"
        >
          <span>View all members</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
