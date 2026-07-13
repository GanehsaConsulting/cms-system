import { cookies } from "next/headers";
import { AppThemeProvider } from "@/components/providers/app-theme-provider";
import { readServerAppearance } from "@/lib/appearance/cookies";

interface RootLayoutBodyProps {
  children: React.ReactNode;
}

export async function RootLayoutBody({ children }: RootLayoutBodyProps) {
  const cookieStore = await cookies();
  const appearance = readServerAppearance(cookieStore);

  return (
    <AppThemeProvider initialAppearance={appearance}>{children}</AppThemeProvider>
  );
}
