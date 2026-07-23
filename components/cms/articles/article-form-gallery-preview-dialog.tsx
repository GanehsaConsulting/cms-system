"use client";

import { CmsImagePreviewDialog } from "@/components/shared/cms-image-preview-dialog";

interface ArticleFormGalleryPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  index: number;
  onIndexChange: (index: number) => void;
}

/** @deprecated Prefer `useCmsImagePreview` — kept for local controlled usage. */
export function ArticleFormGalleryPreviewDialog({
  open,
  onOpenChange,
  images,
  index,
  onIndexChange,
}: ArticleFormGalleryPreviewDialogProps) {
  return (
    <CmsImagePreviewDialog
      open={open}
      onOpenChange={onOpenChange}
      images={images}
      index={index}
      onIndexChange={onIndexChange}
      title={
        images.length > 1
          ? `Gallery preview ${index + 1} / ${images.length}`
          : "Gallery preview"
      }
      description="Preview gallery image before publishing."
    />
  );
}
