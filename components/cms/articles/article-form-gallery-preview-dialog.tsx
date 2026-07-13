"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CaretLeftIcon, CaretRightIcon } from "@/lib/icons";
import { RADIUS_INNER } from "@/config/shape";
import { cn } from "@/lib/utils";

const galleryNavButtonClass = cn(
  "absolute top-1/2 -translate-y-1/2 border-0 bg-transparent shadow-none",
  "opacity-55 hover:bg-background/80 hover:opacity-100 hover:shadow-sm",
  "focus-visible:bg-background/80 focus-visible:opacity-100",
);

interface ArticleFormGalleryPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  index: number;
  onIndexChange: (index: number) => void;
}

export function ArticleFormGalleryPreviewDialog({
  open,
  onOpenChange,
  images,
  index,
  onIndexChange,
}: ArticleFormGalleryPreviewDialogProps) {
  const hasMultiple = images.length > 1;
  const currentImage = images[index];

  useEffect(() => {
    if (!open || images.length === 0) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onIndexChange(index === 0 ? images.length - 1 : index - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onIndexChange(index === images.length - 1 ? 0 : index + 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, images.length, index, onIndexChange]);

  if (!currentImage) {
    return null;
  }

  function goToPrevious() {
    onIndexChange(index === 0 ? images.length - 1 : index - 1);
  }

  function goToNext() {
    onIndexChange(index === images.length - 1 ? 0 : index + 1);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92svh,48rem)] w-[min(100vw-1.5rem,48rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none"
      >
        <DialogHeader className="shrink-0 border-[color:var(--separator)] border-b px-5 py-4">
          <DialogTitle>
            Gallery preview {index + 1} / {images.length}
          </DialogTitle>
          <DialogDescription>
            Preview gallery image before publishing.
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex min-h-[min(60svh,28rem)] items-center justify-center bg-muted/20 p-4">
          <Image
            key={currentImage}
            src={currentImage}
            alt={`Gallery image ${index + 1}`}
            width={1600}
            height={1200}
            unoptimized
            className={cn(
              RADIUS_INNER,
              "max-h-[min(60svh,28rem)] w-auto max-w-full object-contain",
            )}
          />

          {hasMultiple ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(galleryNavButtonClass, "left-3")}
                aria-label="Previous image"
                onClick={goToPrevious}
              >
                <CaretLeftIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(galleryNavButtonClass, "right-3")}
                aria-label="Next image"
                onClick={goToNext}
              >
                <CaretRightIcon />
              </Button>
            </>
          ) : null}
        </div>

        {hasMultiple ? (
          <div className="flex justify-center gap-1.5 border-[color:var(--separator)] border-t px-4 py-3">
            {images.map((src, imageIndex) => (
              <button
                key={`${src.slice(0, 48)}-${imageIndex}`}
                type="button"
                aria-label={`Go to image ${imageIndex + 1}`}
                aria-current={imageIndex === index}
                onClick={() => onIndexChange(imageIndex)}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  imageIndex === index
                    ? "bg-foreground"
                    : "bg-muted-foreground/40 hover:bg-muted-foreground/70",
                )}
              />
            ))}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
