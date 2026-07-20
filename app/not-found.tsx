import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CMS_NAME } from "@/config/nav";

export default function RootNotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
        404
      </p>
      <h1 className="font-semibold text-xl tracking-tight">Page not found</h1>
      <p className="max-w-md text-muted-foreground text-sm">
        This page does not exist, or you do not have access to it.
      </p>
      <Button nativeButton={false} render={<Link href="/" />} className="mt-2">
        Back to Dashboard
      </Button>
      <p className="text-muted-foreground text-xs">{CMS_NAME}</p>
    </main>
  );
}
