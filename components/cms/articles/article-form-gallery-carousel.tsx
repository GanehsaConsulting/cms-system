"use client";

import { useEffect, useState } from "react";
import { UploadSimpleIcon } from "@/lib/icons";
import { ArticleFormGalleryPreviewDialog } from "@/components/cms/articles/article-form-gallery-preview-dialog";
import { ArticleFormGalleryRowItem } from "@/components/cms/articles/article-form-gallery-row-item";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface ArticleFormGalleryCarouselProps {
  images: string[];
  onRemove: (index: number) => void;
  uploadInputId: string;
  uploadDisabled?: boolean;
  onDrop?: (event: React.DragEvent<HTMLElement>) => void;
}

export function ArticleFormGalleryCarousel({
  images,
  onRemove,
  uploadInputId,
  uploadDisabled = false,
  onDrop,
}: ArticleFormGalleryCarouselProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    if (!previewOpen) {
      return;
    }

    if (images.length === 0) {
      setPreviewOpen(false);
      return;
    }

    if (previewIndex >= images.length) {
      setPreviewIndex(images.length - 1);
    }
  }, [images.length, previewIndex, previewOpen]);

  function openPreview(index: number) {
    setPreviewIndex(index);
    setPreviewOpen(true);
  }

  function handleRemove(index: number) {
    onRemove(index);
  }

  if (images.length === 0) {
    return (
      <label
        htmlFor={uploadInputId}
        onDrop={onDrop}
        onDragOver={(event) => event.preventDefault()}
        className={cn(
          RADIUS_DEEP,
          "flex min-h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 border border-border border-dashed bg-muted/25 px-4 py-6 text-center transition-colors hover:bg-muted/35",
          uploadDisabled && "cursor-not-allowed opacity-60",
        )}
      >
        <UploadSimpleIcon className="size-7 text-muted-foreground/60" />
        <p className="text-muted-foreground text-sm">No gallery images yet</p>
        <p className="text-muted-foreground text-xs">Click or drag images here</p>
      </label>
    );
  }

  return (
    <>
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
            onPreview={() => openPreview(index)}
            onRemove={() => handleRemove(index)}
          />
        ))}
      </div>

      <ArticleFormGalleryPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        images={images}
        index={previewIndex}
        onIndexChange={setPreviewIndex}
      />
    </>
  );
}
