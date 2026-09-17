import {
  ChartPie,
  FileText,
  List,
  Package,
  Users,
  User,
  Network,
  Headphones,
  Settings,
} from "lucide-react";
import { NavGroup } from "./types";

export const userNavItems: NavGroup[] = [
  {
    group: "Main Menu",
    items: [
      { name: "Overview", path: "/user", icon: ChartPie },
      { 
        name: "Reports", path: "/user/reports", icon: FileText,
        children: [{ name: "All Reports", path: "/user/reports/all" }] 
      },
      { 
        name: "Items", path: "/user/items", icon: List,
        children: [{ name: "All Items", path: "/user/items/all" }] 
      },
      { 
        name: "Inventory", path: "/user/inventory", icon: Package,
        children: [{ name: "Current Inventory", path: "/user/inventory/current" }] 
      },
      { 
        name: "Employees", path: "/user/employees", icon: Users,
        children: [{ name: "All Employees", path: "/user/employees/all" }] 
      },
      { name: "Customers", path: "/user/customers", icon: User },
      { 
        name: "Integrations", path: "/user/integrations", icon: Network,
        children: [{ name: "Active", path: "/user/integrations/active" }] 
      },
      { 
        name: "Help", path: "/user/help", icon: Headphones,
        children: [{ name: "Support Center", path: "/user/help/support" }] 
      },
      { name: "settings", path: "/user/settings", icon: Settings },
    ],
  },
];
