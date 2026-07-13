"use client";

import Image from "next/image";
import { TrashIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface ArticleFormGalleryRowItemProps {
  src: string;
  alt: string;
  onPreview: () => void;
  onRemove: () => void;
}

export function ArticleFormGalleryRowItem({
  src,
  alt,
  onPreview,
  onRemove,
}: ArticleFormGalleryRowItemProps) {
  return (
    <div
      className={cn(
        RADIUS_DEEP,
        "group relative size-24 shrink-0 snap-start overflow-hidden border border-border bg-muted/25",
      )}
    >
      <button
        type="button"
        onClick={onPreview}
        className="relative block size-24 cursor-zoom-in"
        aria-label={`Preview ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className="object-cover transition-opacity hover:opacity-90"
          sizes="96px"
        />
      </button>
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        className="absolute top-1 right-1 z-10 size-6 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        aria-label={`Remove ${alt}`}
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
      >
        <TrashIcon className="size-3" />
      </Button>
    </div>
  );
}
