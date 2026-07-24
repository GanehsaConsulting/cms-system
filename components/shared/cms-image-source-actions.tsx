"use client";

import { Button } from "@/components/ui/button";
import { CMS_IMAGE_SOURCE_LABELS } from "@/config/cms-image-source";
import { cn } from "@/lib/utils";

interface CmsImageSourceActionsProps {
  disabled?: boolean;
  uploadLabel?: string;
  className?: string;
  onOpen: () => void;
}

/** Single Upload control — opens the shared image picker modal. */
export function CmsImageSourceActions({
  disabled = false,
  uploadLabel = CMS_IMAGE_SOURCE_LABELS.upload,
  className,
  onOpen,
}: CmsImageSourceActionsProps) {
  return (
    <div className={cn("flex min-w-0 flex-wrap gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onOpen}
      >
        {uploadLabel}
      </Button>
    </div>
  );
}
