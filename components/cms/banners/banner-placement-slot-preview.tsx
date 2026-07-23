"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { cn } from "@/lib/utils";

interface BannerPlacementSlotPreviewProps {
  images: string[];
  className?: string;
  /** When empty, show the soft skeletal fill from the mock. */
  emptyClassName?: string;
  children?: ReactNode;
}

export function BannerPlacementSlotPreview({
  images,
  className,
  emptyClassName,
  children,
}: BannerPlacementSlotPreviewProps) {
  const { openPreview } = useCmsImagePreview();
  const [index, setIndex] = useState(0);
  const hasImages = images.length > 0;
  const safeIndex = hasImages ? index % images.length : 0;

  useEffect(() => {
    setIndex(0);
  }, [images]);

  useEffect(() => {
    if (images.length < 2) {
      return;
    }

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 2200);

    return () => window.clearInterval(id);
  }, [images]);

  if (!hasImages) {
    return (
      <div className={cn(emptyClassName, className)}>
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label="Preview placement images"
      onClick={() =>
        openPreview({
          images,
          index: safeIndex,
          title: "Placement preview",
        })
      }
      className={cn(
        "relative overflow-hidden bg-black/5 dark:bg-black/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Image
        src={images[safeIndex] ?? images[0]}
        alt=""
        fill
        unoptimized
        className="object-cover"
      />
      {images.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-1.5 flex items-center justify-center gap-1">
          {images.map((image, dotIndex) => (
            <span
              key={`${image.slice(0, 24)}-${dotIndex}`}
              className={cn(
                "size-1 rounded-full transition-opacity",
                dotIndex === safeIndex
                  ? "bg-white opacity-100"
                  : "bg-white/55 opacity-80",
              )}
            />
          ))}
        </div>
      ) : null}
    </button>
  );
}
