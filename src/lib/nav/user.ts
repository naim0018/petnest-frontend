import {
  LayoutDashboard,
  Bookmark,
  History,
  Settings,
  Headphones,
} from "lucide-react";
import { NavGroup } from "./types";

export const userNavItems: NavGroup[] = [
  {
    group: "Dashboard",
    items: [
      { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
      { name: "Bookmarked Guides", path: "/user/bookmarks", icon: Bookmark },
      { name: "My Activity", path: "/user/activity", icon: History },
      { name: "Settings", path: "/user/settings", icon: Settings },
    ],
  },
  {
    group: "Explore PetNest",
    items: [
      { name: "Help & Support", path: "/user/help/support", icon: Headphones },
    ],
  },
];
