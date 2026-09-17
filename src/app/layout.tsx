import type { Metadata } from "next";
import { Quicksand, Geist_Mono } from "next/font/google";
import "./global.css";
import StoreProvider from "@/store/StoreProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "sonner";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetNest - Pet Community, Adoption & Care Platform",
  description: "Connect with pet lovers, discover guides, adopt pets, and explore pet care marketplace.",
  icons: {
    icon: "/basekitfavicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${geistMono.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans"
        suppressHydrationWarning
      >
        <StoreProvider>
          <ThemeProvider>
            {children}
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
