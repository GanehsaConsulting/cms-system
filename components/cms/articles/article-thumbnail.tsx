"use client";

import Image from "next/image";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { RADIUS_DEEP } from "@/config/shape";
import { getArticleThumbnailGradient } from "@/lib/articles/list";
import { cn } from "@/lib/utils";

interface ArticleThumbnailProps {
  articleId: string;
  title: string;
  /** Real thumbnail URL when available — falls back to letter placeholder. */
  src?: string | null;
  size?: "sm" | "md";
  className?: string;
}

const sizeClasses = {
  sm: "size-10 text-[10px]",
  md: "h-36 w-full text-sm",
} as const;

export function ArticleThumbnail({
  articleId,
  title,
  src,
  size = "sm",
  className,
}: ArticleThumbnailProps) {
  const { openPreview } = useCmsImagePreview();
  const imageSrc = src?.trim() || "";
  const initial = title.trim().charAt(0).toUpperCase() || "A";

  if (imageSrc) {
    return (
      <button
        type="button"
        aria-label="Preview thumbnail"
        onClick={(event) => {
          event.stopPropagation();
          openPreview({
            images: [imageSrc],
            title: "Thumbnail preview",
          });
        }}
        className={cn(
          RADIUS_DEEP,
          "relative shrink-0 overflow-hidden bg-muted shadow-sm transition-opacity hover:opacity-90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          sizeClasses[size],
          className,
        )}
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes={
            size === "sm" ? "40px" : "(max-width: 768px) 100vw, 288px"
          }
          className="object-cover"
          unoptimized={
            !imageSrc.includes("res.cloudinary.com") &&
            !imageSrc.startsWith("/")
          }
        />
      </button>
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        RADIUS_DEEP,
        "flex shrink-0 items-center justify-center bg-linear-to-br font-semibold text-white shadow-sm",
        getArticleThumbnailGradient(articleId),
        sizeClasses[size],
        className,
      )}
    >
      {initial}
    </div>
  );
}
