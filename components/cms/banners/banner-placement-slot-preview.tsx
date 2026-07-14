"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
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
    <div
      className={cn(
        "relative overflow-hidden bg-black/5 dark:bg-black/30",
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
        <div className="absolute inset-x-0 bottom-1.5 flex items-center justify-center gap-1">
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
    </div>
  );
}
