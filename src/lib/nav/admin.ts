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

export const adminNavItems: NavGroup[] = [
  {
    group: "Main Menu",
    items: [
      { name: "Overview", path: "/admin", icon: ChartPie },
      { 
        name: "Reports", path: "/admin/reports", icon: FileText,
        children: [{ name: "All Reports", path: "/admin/reports/all" }] 
      },
      { 
        name: "Items", path: "/admin/items", icon: List,
        children: [{ name: "All Items", path: "/admin/items/all" }] 
      },
      { 
        name: "Inventory", path: "/admin/inventory", icon: Package,
        children: [{ name: "Current Inventory", path: "/admin/inventory/current" }] 
      },
      { 
        name: "Employees", path: "/admin/employees", icon: Users,
        children: [{ name: "All Employees", path: "/admin/employees/all" }] 
      },
      { name: "Customers", path: "/admin/customers", icon: User },
      { 
        name: "Integrations", path: "/admin/integrations", icon: Network,
        children: [{ name: "Active", path: "/admin/integrations/active" }] 
      },
      { 
        name: "Help", path: "/admin/help", icon: Headphones,
        children: [{ name: "Support Center", path: "/admin/help/support" }] 
      },
      { name: "settings", path: "/admin/settings", icon: Settings },
    ],
  },
];
