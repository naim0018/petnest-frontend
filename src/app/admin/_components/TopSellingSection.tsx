"use client";

import React from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { ItemsTable, ItemsTableRow } from "@/components/common/ItemsTable";

const topSellingRows: ItemsTableRow[] = [
  { id: 1, name: "Organic Salmon Kibble (5kg)", image: "/Product/Mouse Item Image.png", qty: 142 },
  { id: 2, name: "Orthopedic Memory Foam Pet Bed", image: "/Product/Monitor Item Image.png", qty: 98 },
  { id: 3, name: "Natural Feather Interactive Wand", image: "/Product/Mouse Item Image.png", qty: 84 },
  { id: 4, name: "Probiotic Digestive Chew Treats", image: "/Product/Monitor Item Image.png", qty: 65 },
];

const mostReadGuideRows: ItemsTableRow[] = [
  { id: 1, name: "Seasonal & Weather Care for Budgies", image: "", qty: 4820 },
  { id: 2, name: "Complete Guide to Budgie Mutations", image: "", qty: 3950 },
  { id: 3, name: "Cold & Draft Problems in Budgies: First Aid", image: "", qty: 3210 },
  { id: 4, name: "Taming & Training Baby Birds (Hand Feeding)", image: "", qty: 2780 },
];

const topUsersRows: ItemsTableRow[] = [
  { id: 1, name: "Alex Morgan (Admin)", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80", qty: 142 },
  { id: 2, name: "Dr. Sarah Jenkins (Vet Author)", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&h=100&q=80", qty: 118 },
  { id: 3, name: "Robert Willow (Breeder)", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", qty: 94 },
  { id: 4, name: "Sophia Martinez (Pet Parent)", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80", qty: 76 },
];

export function TopSellingSection() {
  return (
    <AnimatedContainer delay={0.3}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Column 1: Top Selling Items */}
        <ItemsTable
          title="Top Selling Items"
          rows={topSellingRows}
          colLabel="Qty"
        />

        {/* Column 2: Most Read Care Guides */}
        <ItemsTable
          title="Most Read Care Guides"
          rows={mostReadGuideRows}
          colLabel="Reads"
        />

        {/* Column 3: Top Users by Most Visit */}
        <ItemsTable
          title="Top Users by Most Visit"
          rows={topUsersRows}
          colLabel="Visits"
        />
      </div>
    </AnimatedContainer>
  );
}
