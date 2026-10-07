"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import { StatsCard } from "@/components/common/StatsCard";
import { Clock, Check, X, ShieldAlert, ShoppingBag, Store, ShieldCheck } from "lucide-react";

interface ReviewListingRecord {
  id: string;
  title: string;
  seller: string;
  category: string;
  price: string;
  vetClearanceSubmitted: boolean;
  submittedAt: string;
}

const mockListingsQueue: ReviewListingRecord[] = [
  {
    id: "REV-L01",
    title: "Registered French Bulldog Puppies (Health Guaranteed)",
    seller: "Montrose Frenchies",
    category: "Dogs & Puppies",
    price: "$2,400",
    vetClearanceSubmitted: true,
    submittedAt: "1 hour ago",
  },
  {
    id: "REV-L02",
    title: "Bengal Kittens (F5 Generation with Pedigree Papers)",
    seller: "WildLeopard Cats",
    category: "Cats & Kittens",
    price: "$1,750",
    vetClearanceSubmitted: true,
    submittedAt: "3 hours ago",
  },
  {
    id: "REV-L03",
    title: "NutriBoost Canine Raw Herb Extract (Uncertified)",
    seller: "HerbalPets Direct",
    category: "Supplements",
    price: "$38.00",
    vetClearanceSubmitted: false,
    submittedAt: "6 hours ago",
  },
  {
    id: "REV-L04",
    title: "Hand-reared African Grey Parrot",
    seller: "ExoticAvian Care",
    category: "Birds & Avian",
    price: "$1,900",
    vetClearanceSubmitted: true,
    submittedAt: "1 day ago",
  },
];

export default function ReviewListingPage() {
  const [data, setData] = useState<ReviewListingRecord[]>(mockListingsQueue);
  const [notification, setNotification] = useState<string | null>(null);

  const handleApprove = (row: ReviewListingRecord) => {
    setData((prev) => prev.filter((item) => item.id !== row.id));
    setNotification(`Listing "${row.title}" approved and live in Marketplace.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReject = (row: ReviewListingRecord) => {
    setData((prev) => prev.filter((item) => item.id !== row.id));
    setNotification(`Listing "${row.title}" rejected and returned to seller.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const columns: Column<ReviewListingRecord>[] = [
    {
      key: "title",
      label: "Listing Under Review",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-coral-light flex items-center justify-center text-coral shrink-0">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight line-clamp-1">{row.title}</p>
            <span className="text-xs text-ink-muted">{row.category}</span>
          </div>
        </div>
      ),
    },
    {
      key: "seller",
      label: "Vendor / Store",
      sortable: true,
      render: (row) => <span className="text-xs font-semibold text-ink">{row.seller}</span>,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (row) => <span className="text-sm font-bold text-coral">{row.price}</span>,
    },
    {
      key: "vetClearanceSubmitted",
      label: "Health / License Docs",
      align: "center",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            row.vetClearanceSubmitted
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
          }`}
        >
          {row.vetClearanceSubmitted ? (
            <>
              <ShieldCheck className="size-3.5" /> Vet Docs Verified
            </>
          ) : (
            <>
              <ShieldAlert className="size-3.5" /> Missing Certification
            </>
          )}
        </span>
      ),
    },
    {
      key: "submittedAt",
      label: "Submitted",
      align: "right",
      render: (row) => <span className="text-xs text-ink-muted">{row.submittedAt}</span>,
    },
  ];

  const actions = [
    {
      label: "Approve Listing",
      icon: <Check className="size-4" />,
      variant: "primary" as const,
      onClick: (row: ReviewListingRecord) => handleApprove(row),
    },
    {
      label: "Reject / Flag Listing",
      icon: <X className="size-4" />,
      variant: "danger" as const,
      onClick: (row: ReviewListingRecord) => handleReject(row),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Listing Review Queue</h2>
          <p className="text-sm text-ink-muted mt-1">
            Audit pet welfare verification, vendor licenses, breeder health certificates, and compliance.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between">
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-700 dark:text-emerald-400 hover:underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Awaiting Moderation"
            value={`${data.length} Listings`}
            trendText="Audit backlog < 4 hours"
            trendType="positive"
            icon={<Clock className="size-5 text-coral" />}
          />
          <StatsCard
            title="Animal Welfare Checks"
            value="3 Pet Listings"
            trendText="Health guarantees attached"
            trendType="positive"
            icon={<ShieldCheck className="size-5 text-coral" />}
          />
          <StatsCard
            title="Flagged / Missing Docs"
            value="1 Submission"
            trendText="Requires follow-up with vendor"
            trendType="negative"
            icon={<ShieldAlert className="size-5 text-coral" />}
          />
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <div className="rounded-xl border border-border-peach bg-card p-5 shadow-xs">
          <DynamicTable
            data={data}
            columns={columns}
            actions={actions}
            searchable
            searchPlaceholder="Search listing submissions or sellers..."
            emptyMessage="All vendor listings have been reviewed and moderated!"
            title="Pending Marketplace Submissions"
            hoverable
          />
        </div>
      </AnimatedContainer>
    </div>
  );
}
