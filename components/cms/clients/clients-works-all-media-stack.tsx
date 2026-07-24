"use client";

import Image from "next/image";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface ClientsWorksAllMediaStackProps {
  images: string[];
  title: string;
  /** Table thumb vs detail header. */
  size?: "sm" | "md";
  /** Fallback initial when there are no images. */
  fallbackLabel?: string;
  className?: string;
}

const MAX_VISIBLE = {
  sm: 3,
  md: 4,
} as const;

const TILE = {
  sm: "size-8",
  md: "size-10",
} as const;

const OVERLAP = {
  sm: "-ml-2",
  md: "-ml-2.5",
} as const;

export function ClientsWorksAllMediaStack({
  images,
  title,
  size = "sm",
  fallbackLabel = "?",
  className,
}: ClientsWorksAllMediaStackProps) {
  const { openPreview } = useCmsImagePreview();
  const visible = images.slice(0, MAX_VISIBLE[size]);
  const remaining = images.length - visible.length;

  if (visible.length === 0) {
    return (
      <div
        className={cn(
          RADIUS_DEEP,
          TILE[size],
          "relative flex shrink-0 items-center justify-center overflow-hidden bg-muted",
          className,
        )}
      >
        <span
          className={cn(
            "font-medium text-muted-foreground",
            size === "sm" ? "text-xs" : "text-sm",
          )}
        >
          {fallbackLabel.slice(0, 1).toUpperCase() || "?"}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Preview ${title} media`}
      onClick={(event) => {
        event.stopPropagation();
        openPreview({ images, title });
      }}
      className={cn(
        "flex shrink-0 items-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
    >
      {visible.map((url, index) => (
        <span
          key={url}
          className={cn(
            RADIUS_DEEP,
            TILE[size],
            "relative shrink-0 overflow-hidden bg-muted ring-2 ring-background",
            index > 0 && OVERLAP[size],
          )}
          style={{ zIndex: visible.length - index }}
        >
          <Image src={url} alt="" fill unoptimized className="object-cover" />
        </span>
      ))}
      {remaining > 0 ? (
        <span
          className={cn(
            RADIUS_DEEP,
            TILE[size],
            OVERLAP[size],
            "relative z-0 flex items-center justify-center bg-muted font-medium text-muted-foreground ring-2 ring-background",
            size === "sm" ? "text-[10px]" : "text-xs",
          )}
        >
          +{remaining}
        </span>
      ) : null}
    </button>
  );
}
