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

const lowStockRows: ItemsTableRow[] = [
  { id: 1, name: "Hypoallergenic Oatmeal Shampoo", image: "/Product/Monitor Item Image.png", qty: 4 },
  { id: 2, name: "Adjustable Reflective Puppy Harness", image: "/Product/Mouse Item Image.png", qty: 7 },
  { id: 3, name: "Dental Enzymatic Toothpaste Gel", image: "/Product/Monitor Item Image.png", qty: 9 },
  { id: 4, name: "Calming Anxiety Relief Vest (M)", image: "/Product/Mouse Item Image.png", qty: 11 },
];

export function TopSellingSection() {
  return (
    <AnimatedContainer delay={0.3}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ItemsTable title="Top Selling Items" rows={topSellingRows} />
        <ItemsTable title="Low Stock Items"   rows={lowStockRows}   />
      </div>
    </AnimatedContainer>
  );
}
