"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import { StatsCard } from "@/components/common/StatsCard";
import { Star, MessageSquare, Check, X, ShieldAlert, ThumbsUp } from "lucide-react";

interface CustomerReviewRecord {
  id: string;
  customerName: string;
  storeOrProduct: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  status: "Published" | "Flagged" | "Pending";
  date: string;
}

const mockCustomerReviews: CustomerReviewRecord[] = [
  {
    id: "REV-01",
    customerName: "Jessica Hayes",
    storeOrProduct: "Willow Creek Kennels (Golden Retriever)",
    rating: 5,
    comment: "Our puppy arrived in perfect health with all veterinary documents and genetic tests in order!",
    verifiedPurchase: true,
    status: "Published",
    date: "Today, 11:20 AM",
  },
  {
    id: "REV-02",
    customerName: "David Kim",
    storeOrProduct: "PetPurity Botanicals (Freeze-Dried Beef)",
    rating: 5,
    comment: "My German Shepherd has severe grain allergies. This food completely cleared his skin up.",
    verifiedPurchase: true,
    status: "Published",
    date: "Yesterday",
  },
  {
    id: "REV-03",
    customerName: "Mark Sterling",
    storeOrProduct: "TechPaws Labs (Smart Feeder)",
    rating: 2,
    comment: "The Wi-Fi disconnection issue is annoying, had to reset three times this week.",
    verifiedPurchase: true,
    status: "Flagged",
    date: "2 days ago",
  },
  {
    id: "REV-04",
    customerName: "Emily Vance",
    storeOrProduct: "CozyPaws Essentials (Orthopedic Bed)",
    rating: 5,
    comment: "Our 10-year-old lab can finally sleep comfortably through the night without stiffness.",
    verifiedPurchase: true,
    status: "Published",
    date: "3 days ago",
  },
];

export default function CustomerReviewsPage() {
  const [data, setData] = useState<CustomerReviewRecord[]>(mockCustomerReviews);

  const columns: Column<CustomerReviewRecord>[] = [
    {
      key: "customerName",
      label: "Customer & Purchase",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-ink leading-tight">{row.customerName}</p>
          <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">{row.storeOrProduct}</p>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-3.5 ${
                i < row.rating
                  ? "fill-amber-500 text-amber-500"
                  : "text-border fill-transparent"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      key: "comment",
      label: "Customer Feedback",
      render: (row) => (
        <span className="text-xs text-ink-muted line-clamp-2">{row.comment}</span>
      ),
    },
    {
      key: "status",
      label: "Moderation Status",
      sortable: true,
      align: "center",
      render: (row) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.status === "Published"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : row.status === "Flagged"
              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      align: "right",
      render: (row) => <span className="text-xs text-ink-muted">{row.date}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Customer Reviews</h2>
          <p className="text-sm text-ink-muted mt-1">
            Moderate marketplace buyer ratings, seller feedback, disputes, and authenticity flags.
          </p>
        </div>
      </div>

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Average Marketplace Rating"
            value="4.85 / 5.0"
            trendText="From 4,820 verified reviews"
            trendType="positive"
            icon={<Star className="size-5 text-coral" />}
          />
          <StatsCard
            title="Verified Buyer Rate"
            value="99.1%"
            trendText="Automated order linking"
            trendType="positive"
            icon={<ThumbsUp className="size-5 text-coral" />}
          />
          <StatsCard
            title="Flagged for Moderation"
            value="1 Review"
            trendText="Seller dispute resolution requested"
            trendType="neutral"
            icon={<ShieldAlert className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={data}
            columns={columns}
            searchable
            searchPlaceholder="Search reviews, customers, or products..."
            pagination
            pageSize={10}
            title="Customer Reviews & Ratings Feed"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
