"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CmsDialog,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import { CaretLeftIcon, CaretRightIcon } from "@/lib/icons";
import { RADIUS_INNER } from "@/config/shape";
import { cn } from "@/lib/utils";

const galleryNavButtonClass = cn(
  "absolute top-1/2 -translate-y-1/2 border-0 bg-transparent shadow-none",
  "opacity-55 hover:bg-background/80 hover:opacity-100 hover:shadow-sm",
  "focus-visible:bg-background/80 focus-visible:opacity-100",
);

export interface CmsImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  index: number;
  onIndexChange: (index: number) => void;
  title?: string;
  description?: string;
}

export function CmsImagePreviewDialog({
  open,
  onOpenChange,
  images,
  index,
  onIndexChange,
  title,
  description = "Full-size preview.",
}: CmsImagePreviewDialogProps) {
  const hasMultiple = images.length > 1;
  const currentImage = images[index];
  const heading = (() => {
    if (title) {
      return hasMultiple ? `${title} · ${index + 1} / ${images.length}` : title;
    }
    return hasMultiple
      ? `Image preview ${index + 1} / ${images.length}`
      : "Image preview";
  })();

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
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent
        showCloseButton
        size="xl"
        className="flex max-h-[min(92svh,48rem)] flex-col"
      >
        <CmsDialogHeader>
          <CmsDialogTitle>{heading}</CmsDialogTitle>
          <CmsDialogDescription>{description}</CmsDialogDescription>
        </CmsDialogHeader>

        <div className="relative flex min-h-[min(60svh,28rem)] items-center justify-center bg-muted/20 p-4">
          <Image
            key={currentImage}
            src={currentImage}
            alt=""
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
          <div className="flex justify-center gap-1.5 border-(--separator) border-t px-4 py-3">
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
      </CmsDialogContent>
    </CmsDialog>
  );
}
