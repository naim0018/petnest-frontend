import {
  LayoutDashboard,
  PawPrint,
  BookOpen,
  Store,
  Users,
  BarChart3,
} from "lucide-react";
import { NavGroup } from "./types";

export const adminNavItems: NavGroup[] = [
  {
    group: "Dashboard",
    items: [
      {
        name: "Overview",
        path: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "Pet Catalog",
    items: [
      {
        name: "Pet Catalog",
        path: "/admin/pet-catalog",
        icon: PawPrint,
      },
    ],
  },
  {
    group: "Guides & Content",
    items: [
      {
        name: "Guides",
        path: "/admin/guides",
        icon: BookOpen,
        children: [
          { name: "Overview", path: "/admin/guides" },
          { name: "All Guides", path: "/admin/guides/all" },
          { name: "Categories", path: "/admin/guides/categories" },
          { name: "Create Guide", path: "/admin/guides/create" },
          { name: "Review Queue", path: "/admin/guides/review-queue" },
          { name: "Authors", path: "/admin/guides/authors" },
        ],
      },
    ],
  },
  {
    group: "Marketplace",
    items: [
      {
        name: "Marketplace",
        path: "/admin/marketplace",
        icon: Store,
        children: [
          { name: "Overview", path: "/admin/marketplace" },
          { name: "Listings", path: "/admin/marketplace/listings" },
          { name: "Create Listing", path: "/admin/marketplace/create" },
          { name: "Review Listing", path: "/admin/marketplace/review" },
          { name: "Stores", path: "/admin/marketplace/stores" },
          { name: "Customer Reviews", path: "/admin/marketplace/reviews" },
        ],
      },
    ],
  },
  {
    group: "Administration",
    items: [
      {
        name: "Users",
        path: "/admin/users",
        icon: Users,
        children: [
          { name: "All Users", path: "/admin/users/all" },
          { name: "Verification Requests", path: "/admin/users/verification" },
          { name: "Roles & Permissions", path: "/admin/users/roles" },
        ],
      },
      {
        name: "Analytics",
        path: "/admin/analytics",
        icon: BarChart3,
        children: [
          { name: "Platform Analytics", path: "/admin/analytics/platform" },
          { name: "Guide Analytics", path: "/admin/analytics/guides" },
          { name: "Marketplace Analytics", path: "/admin/analytics/marketplace" },
        ],
      },
    ],
  },
];
