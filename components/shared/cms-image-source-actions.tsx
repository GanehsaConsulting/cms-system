"use client";

import { Button } from "@/components/ui/button";
import { CMS_IMAGE_SOURCE_LABELS } from "@/config/cms-image-source";
import { cn } from "@/lib/utils";

interface CmsImageSourceActionsProps {
  disabled?: boolean;
  uploadLabel?: string;
  libraryLabel?: string;
  urlLabel?: string;
  className?: string;
  onUpload: () => void;
  onLibrary: () => void;
  onUrl: () => void;
}

/** Standard Upload · Library · URL action row for CMS image fields. */
export function CmsImageSourceActions({
  disabled = false,
  uploadLabel = CMS_IMAGE_SOURCE_LABELS.upload,
  libraryLabel = CMS_IMAGE_SOURCE_LABELS.library,
  urlLabel = CMS_IMAGE_SOURCE_LABELS.url,
  className,
  onUpload,
  onLibrary,
  onUrl,
}: CmsImageSourceActionsProps) {
  return (
    <div className={cn("flex min-w-0 flex-wrap gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onUpload}
      >
        {uploadLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onLibrary}
      >
        {libraryLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onUrl}
      >
        {urlLabel}
      </Button>
    </div>
  );
}
