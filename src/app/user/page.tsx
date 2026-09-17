import React from "react";
import Image from "next/image";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { User, Settings, ShieldCheck, Mail } from "lucide-react";

export default function UserPage() {
  const profileSteps = [
    {
      title: "Personal Information",
      desc: "Set up your avatar, display name, and contact details",
      completed: true,
      icon: User,
    },
    {
      title: "Account Preferences",
      desc: "Configure notification settings and dashboard styling",
      completed: false,
      icon: Settings,
    },
    {
      title: "Security & MFA",
      desc: "Configure multi-factor authentication and passwords",
      completed: false,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Overview Card */}
      <AnimatedContainer delay={0.1} className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-gray-200 shadow-inner flex-shrink-0">
            <Image
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=John"
              alt="John Doe"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">John Doe</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> john@example.com
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase tracking-wider text-[9px] font-black">
                Active Client
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-lg">
              Manage your personal preferences, keep your security parameters up to date, and monitor session activity log from your profile manager.
            </p>
          </div>
        </div>

        {/* Completion progress */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Profile Setup Guide</h3>
          <div className="space-y-4">
            {profileSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-4 border border-gray-50 dark:border-slate-800/80 rounded-xl hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className={`p-2.5 rounded-xl ${step.completed ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-100 dark:bg-slate-800 text-gray-500"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">{step.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                  </div>
                  <span className={`text-xs font-black uppercase tracking-wider ${step.completed ? "text-emerald-500" : "text-gray-400"}`}>
                    {step.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedContainer>

      {/* Right Column: Mini Info Cards */}
      <AnimatedContainer delay={0.3} className="space-y-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Security Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">MFA Status</span>
              <span className="font-bold text-red-500">Disabled</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Password Last Reset</span>
              <span className="font-bold text-slate-700 dark:text-slate-350">3 months ago</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Recent Locations</span>
              <span className="font-bold text-slate-700 dark:text-slate-350">Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
}
