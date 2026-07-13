import { CmsShell } from "@/components/cms/cms-shell";
import { RootLayoutBody } from "@/components/shared/root-layout-body";

export default function CmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayoutBody>
      <CmsShell>{children}</CmsShell>
    </RootLayoutBody>
  );
}
