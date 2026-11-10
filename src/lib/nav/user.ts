import {
  LayoutDashboard,
  Settings,
  Headphones,
  Compass,
  PawPrint,
} from "lucide-react";
import { NavGroup } from "./types";

export const userNavItems: NavGroup[] = [
  {
    group: "My Account",
    items: [
      { name: "Dashboard Overview", path: "/user", icon: LayoutDashboard },
      { name: "Account Settings", path: "/user/settings", icon: Settings },
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
];
