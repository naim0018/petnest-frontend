import type { Metadata } from "next";
import { Quicksand, Geist_Mono } from "next/font/google";
import "./global.css";
import StoreProvider from "@/store/StoreProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import QueryProvider from "@/providers/QueryProviders";
import GoogleTranslateScript from "@/components/common/GoogleTranslateScript";

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
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
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
          <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
            <GoogleTranslateScript />
          </ThemeProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
