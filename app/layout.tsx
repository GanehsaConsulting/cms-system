import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { AppThemeProvider } from "@/components/providers/app-theme-provider";
import { RootAppearanceBootstrap } from "@/components/shared/root-appearance-bootstrap";
import { WallpaperBackground } from "@/components/shared/wallpaper-background";
import { WallpaperProvider } from "@/components/shared/wallpaper-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DEFAULT_ACCENT_ID } from "@/config/accent-colors";
import { DEFAULT_APP_ICON_STYLE } from "@/config/app-icon-styles";
import { CMS_NAME } from "@/config/nav";
import { SYSTEM_LOGO_SRC } from "@/config/system-brand";
import { DEFAULT_WALLPAPER_ID } from "@/config/wallpapers";
import { readServerAppearance } from "@/lib/appearance/cookies";
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
  title: CMS_NAME,
  description: "CMS untuk mengelola konten website company profile",
  icons: {
    icon: [{ url: SYSTEM_LOGO_SRC, type: "image/png", sizes: "any" }],
    apple: [{ url: SYSTEM_LOGO_SRC, type: "image/png" }],
    shortcut: SYSTEM_LOGO_SRC,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const appearance = readServerAppearance(cookieStore);

  return (
    <html
      lang="id"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
      )}
      data-accent={DEFAULT_ACCENT_ID}
      data-app-icon={DEFAULT_APP_ICON_STYLE}
      data-wallpaper={DEFAULT_WALLPAPER_ID}
      suppressHydrationWarning
    >
      <body className="flex h-svh flex-col overflow-hidden font-sans">
        <RootAppearanceBootstrap />
        <AppThemeProvider initialAppearance={appearance}>
          <WallpaperProvider>
            <WallpaperBackground />
            <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
              <TooltipProvider>{children}</TooltipProvider>
            </div>
            <Toaster />
          </WallpaperProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
