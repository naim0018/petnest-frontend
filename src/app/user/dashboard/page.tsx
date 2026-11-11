"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { User, Settings, ShieldCheck, Mail, Phone, Heart, ArrowRight } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import { useGetMeQuery } from "@/store/Api/User/user.api";

export default function UserDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: meResponse } = useGetMeQuery(undefined, {
    skip: !user,
  });

  const me = meResponse?.data;
  const displayName = me?.name || user?.name || user?.email?.split("@")[0] || "Pet Lover";
  const displayEmail = me?.email || user?.email || "user@example.com";
  const displayPhone = me?.phone || user?.phone;
  const avatarUrl =
    me?.profile?.avatar ||
    `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  const profileSteps = [
    {
      title: "Personal Information",
      desc: "Set up your avatar, display name, and contact details",
      completed: Boolean(me?.name && me?.email),
      icon: User,
    },
    {
      title: "Pet Preferences",
      desc: me?.interestedSpecies
        ? `Interested in ${me.interestedSpecies.name}${me.interestedBreed ? ` (${me.interestedBreed.name})` : ""}`
        : "Choose your favorite pet species and breeds",
      completed: Boolean(me?.interestedSpeciesId),
      icon: Heart,
    },
    {
      title: "Account Security",
      desc: "Keep your password and credentials secure",
      completed: true,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Overview Card */}
      <AnimatedContainer delay={0.1} className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-card border border-border-peach rounded-2xl shadow-xs flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-surface-muted border border-border-peach shadow-inner shrink-0">
            <Image
              src={avatarUrl}
              alt={displayName}
              width={96}
              height={96}
              unoptimized
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xl font-bold font-quicksand text-ink">{displayName}</h2>
              <Link
                href="/user/profile"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-coral hover:text-coral-dark font-quicksand"
              >
                <span>Edit Profile</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-semibold text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-coral" /> {displayEmail}
              </span>
              {displayPhone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-coral" /> {displayPhone}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-coral/10 text-coral uppercase tracking-wider text-[10px] font-bold">
                PetNest Member
              </span>
            </div>
            <p className="text-xs text-ink-muted max-w-lg mt-1 leading-relaxed">
              Welcome to your personal PetNest Dashboard. Explore pet care guides, track favorite companion breeds, and manage your account settings.
            </p>
          </div>
        </div>

        {/* Completion progress */}
        <div className="p-6 bg-card border border-border-peach rounded-2xl shadow-xs space-y-4">
          <h3 className="text-base font-bold font-quicksand text-ink">Account Overview & Progress</h3>
          <div className="space-y-4">
            {profileSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-4 border border-border-peach/60 rounded-xl hover:bg-surface-muted/40 transition-colors">
                  <div className={`p-2.5 rounded-xl ${step.completed ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-surface-muted text-ink-muted"}`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-ink font-quicksand">{step.title}</h4>
                    <p className="text-xs text-ink-muted mt-0.5">{step.desc}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${step.completed ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-surface-muted text-ink-muted"}`}>
                    {step.completed ? "Active" : "Optional"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedContainer>

      {/* Right Column: Mini Info Cards */}
      <AnimatedContainer delay={0.3} className="space-y-6">
        <div className="p-6 bg-card border border-border-peach rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-bold font-quicksand text-ink">Account Security</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-muted font-medium">Status</span>
              <span className="font-bold text-emerald-600">Active</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-muted font-medium">Account Role</span>
              <span className="font-bold text-coral">{me?.role || user?.role || "USER"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-muted font-medium">Session</span>
              <span className="font-bold text-ink">Authenticated</span>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
}
