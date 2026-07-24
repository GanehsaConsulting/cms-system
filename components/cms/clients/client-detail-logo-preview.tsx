"use client";

import Image from "next/image";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { RADIUS_INNER } from "@/config/shape";
import { cn } from "@/lib/utils";

interface ClientDetailLogoPreviewProps {
  logo: string;
  title: string;
}

export function ClientDetailLogoPreview({
  logo,
  title,
}: ClientDetailLogoPreviewProps) {
  const { openPreview } = useCmsImagePreview();

  return (
    <button
      type="button"
      aria-label="Preview logo"
      onClick={() =>
        openPreview({
          images: [logo],
          title,
        })
      }
      className={cn(
        RADIUS_INNER,
        "relative h-16 w-full overflow-hidden bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      )}
    >
      <Image
        src={logo}
        alt=""
        fill
        sizes="140px"
        className="object-contain p-2"
        unoptimized
      />
    </button>
  );
}
