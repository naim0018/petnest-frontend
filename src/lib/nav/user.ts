import {
  LayoutDashboard,
  BookOpen,
  Heart,
  History,
  Bell,
  Settings,
  Headphones,
  PawPrint,
} from "lucide-react";
import { NavGroup } from "./types";

export const userNavItems: NavGroup[] = [
  {
    group: "Dashboard",
    items: [
      { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
      { name: "Pet Guides", path: "/guides", icon: BookOpen },
      { name: "My Favorites", path: "/user/profile", icon: Heart },
      { name: "My Activity", path: "/user/dashboard", icon: History },
      { name: "Notifications", path: "/user/profile", icon: Bell },
      { name: "Settings", path: "/user/settings", icon: Settings },
    ],
  },
  {
    group: "Explore PetNest",
    items: [
      { name: "Adopt a Pet", path: "/adoption", icon: PawPrint },
      { name: "Help & Support", path: "/user/help/support", icon: Headphones },
    ],
  },
];
