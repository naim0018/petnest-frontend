import {
  LayoutDashboard,
  User,
  Settings,
  Headphones,
  Compass,
  PawPrint,
} from "lucide-react";
import { NavGroup } from "./types";

export const userNavItems: NavGroup[] = [
  {
    group: "Dashboard",
    items: [
      { name: "Overview", path: "/user/dashboard", icon: LayoutDashboard },
      { 
        name: "Help & Support", path: "/user/help/support", icon: Headphones,
      },
    ],
  },
  {
    group: "Explore PetNest",
    items: [
      { name: "Care Guides", path: "/guides", icon: Compass },
      { name: "Adopt a Pet", path: "/adoption", icon: PawPrint },
    ],
  },
  {
    group: "Settings",
    items: [
      { name: "My Profile", path: "/user/profile", icon: User },
      { name: "Settings", path: "/user/settings", icon: Settings },
    ],
  },
];
