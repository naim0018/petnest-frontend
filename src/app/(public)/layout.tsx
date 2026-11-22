import React from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-clip">
      <PublicNavbar />
      <main className="flex-1 w-full max-w-full">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
