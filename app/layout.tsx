import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootBootstrapScript } from "@/components/shared/root-bootstrap-script";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DEFAULT_ACCENT_ID } from "@/config/accent-colors";
import { DEFAULT_WALLPAPER_ID } from "@/config/wallpapers";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CMS System",
  description: "CMS untuk mengelola konten website company profile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn("h-full antialiased", geistSans.variable, geistMono.variable)}
      data-accent={DEFAULT_ACCENT_ID}
      data-wallpaper={DEFAULT_WALLPAPER_ID}
      suppressHydrationWarning
    >
      <body className="flex h-svh flex-col overflow-hidden font-sans">
        <RootBootstrapScript />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <TooltipProvider>{children}</TooltipProvider>
        </div>
      </body>
    </html>
  );
}
