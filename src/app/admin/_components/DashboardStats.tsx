import React from "react";
import { StatsCard } from "@/components/common/StatsCard";
import { PawPrint, BookOpen, ShoppingBag, Users, DollarSign } from "lucide-react";

export function DashboardStats() {
  const stats = [
    {
      title: "Total Pets Cataloged",
      value: "2,480",
      trendText: "+148 this month",
      trendType: "positive" as const,
      icon: <PawPrint className="w-5 h-5 text-coral" />,
    },
    {
      title: "Care Guides Published",
      value: "412",
      trendText: "+24 new guides",
      trendType: "positive" as const,
      icon: <BookOpen className="w-5 h-5 text-coral" />,
    },
    {
      title: "Active Listings",
      value: "1,290",
      trendText: "+8.2% vs last week",
      trendType: "positive" as const,
      icon: <ShoppingBag className="w-5 h-5 text-coral" />,
    },
    {
      title: "Registered Users",
      value: "18,450",
      trendText: "+1,210 new accounts",
      trendType: "positive" as const,
      icon: <Users className="w-5 h-5 text-coral" />,
    },
    {
      title: "Monthly GMV",
      value: "$42,850",
      trendText: "+14.6% platform volume",
      trendType: "positive" as const,
      icon: <DollarSign className="w-5 h-5 text-coral" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, idx) => (
        <StatsCard
          key={idx}
          title={stat.title}
          value={stat.value}
          trendText={stat.trendText}
          trendType={stat.trendType}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
