"use client";

import { UploadSimpleIcon } from "@/lib/icons";
import { ArticleFormGalleryRowItem } from "@/components/cms/articles/article-form-gallery-row-item";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface ArticleFormGalleryCarouselProps {
  images: string[];
  onRemove: (index: number) => void;
  uploadDisabled?: boolean;
  onDrop?: (event: React.DragEvent<HTMLElement>) => void;
  onRequestUpload?: () => void;
}

export function ArticleFormGalleryCarousel({
  images,
  onRemove,
  uploadDisabled = false,
  onDrop,
  onRequestUpload,
}: ArticleFormGalleryCarouselProps) {
  const { openPreview } = useCmsImagePreview();

  if (images.length === 0) {
    return (
      <button
        type="button"
        disabled={uploadDisabled}
        onClick={() => onRequestUpload?.()}
        onDrop={onDrop}
        onDragOver={(event) => event.preventDefault()}
        className={cn(
          RADIUS_DEEP,
          "flex min-h-24 w-full flex-col items-center justify-center gap-2 border border-border border-dashed bg-muted/25 px-4 py-6 text-center transition-colors hover:bg-muted/35",
          uploadDisabled && "cursor-not-allowed opacity-60",
        )}
      >
        <UploadSimpleIcon className="size-7 text-muted-foreground/60" />
        <p className="text-muted-foreground text-sm">No gallery images yet</p>
        <p className="text-muted-foreground text-xs">
          Use Upload, Library, or URL below — or drag images here
        </p>
      </button>
    );
  }

  return (
    <div
      className={cn(
        RADIUS_DEEP,
        "flex snap-x snap-mandatory gap-2 overflow-x-auto border border-border bg-muted/15 p-2",
      )}
    >
      {images.map((src, index) => (
        <ArticleFormGalleryRowItem
          key={`${src.slice(0, 48)}-${index}`}
          src={src}
          alt={`Gallery image ${index + 1}`}
          onPreview={() =>
            openPreview({
              images,
              index,
              title: "Gallery preview",
              description: "Preview gallery image before publishing.",
            })
          }
          onRemove={() => onRemove(index)}
        />
      ))}
    </div>
  );
}
