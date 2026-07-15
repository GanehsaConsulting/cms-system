import { redirect } from "next/navigation";
import { getCurrentCmsUser } from "@/lib/users/current";
import { canAccessCmsSettings } from "@/lib/users/permissions";

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentCmsUser();

  if (!canAccessCmsSettings(currentUser)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {children}
    </div>
  );
}
