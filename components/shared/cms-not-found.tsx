import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassSurface } from "@/components/shared/glass-surface";
import { CMS_NAME } from "@/config/nav";
import { SquaresFourIcon } from "@/lib/icons";

interface CmsNotFoundProps {
  title?: string;
  description?: string;
}

export function CmsNotFound({
  title = "Page not found",
  description = "This page does not exist for the current brand, or the link is invalid.",
}: CmsNotFoundProps) {
  return (
    <GlassSurface className="flex flex-1 flex-col items-center justify-center p-12 text-center">
      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
        404
      </p>
      <h1 className="mt-2 font-semibold text-xl tracking-tight">{title}</h1>
      <p className="mt-2 max-w-md text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/" />}
        className="mt-6"
      >
        <SquaresFourIcon />
        Back to Dashboard
      </Button>
      <p className="mt-4 text-muted-foreground text-xs">{CMS_NAME}</p>
    </GlassSurface>
  );
}
