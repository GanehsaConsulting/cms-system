"use client";

import Image from "next/image";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { RADIUS_DEEP, RADIUS_INNER } from "@/config/shape";
import { cn } from "@/lib/utils";

interface ContentActivityDetailCoverProps {
  images: string[];
}

export function ContentActivityDetailCover({
  images,
}: ContentActivityDetailCoverProps) {
  const { openPreview } = useCmsImagePreview();

  if (images.length === 0) {
    return null;
  }

  const [cover, ...rest] = images;

  return (
    <div className="space-y-2">
      <button
        type="button"
        aria-label="Preview cover image"
        onClick={() =>
          openPreview({
            images,
            index: 0,
            title: "Activity images",
          })
        }
        className={cn(
          RADIUS_INNER,
          "relative h-36 w-full overflow-hidden bg-muted shadow-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        )}
      >
        <Image
          src={cover}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 288px"
          className="object-cover"
          unoptimized
        />
      </button>

      {rest.length > 0 ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          {rest.slice(0, 4).map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Preview image ${index + 2}`}
              onClick={() =>
                openPreview({
                  images,
                  index: index + 1,
                  title: "Activity images",
                })
              }
              className={cn(
                RADIUS_DEEP,
                "relative size-14 shrink-0 overflow-hidden bg-muted",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
          {rest.length > 4 ? (
            <button
              type="button"
              onClick={() =>
                openPreview({
                  images,
                  index: 5,
                  title: "Activity images",
                })
              }
              className="shrink-0 text-muted-foreground text-xs tabular-nums hover:text-foreground"
            >
              +{rest.length - 4}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
