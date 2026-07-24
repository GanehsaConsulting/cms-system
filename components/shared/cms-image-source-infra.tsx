"use client";

import { CmsImagePickerDialog } from "@/components/shared/cms-image-picker-dialog";
import type { CmsImageSourceApi } from "@/hooks/use-cms-image-source";

interface CmsImageSourceInfraProps {
  source: CmsImageSourceApi;
}

/** Hidden file input + library/URL picker dialog — mount once per image field. */
export function CmsImageSourceInfra({ source }: CmsImageSourceInfraProps) {
  return (
    <>
      <input
        ref={source.inputRef}
        id={source.inputId}
        type="file"
        accept={source.accept}
        multiple={source.allowMultiple}
        className="sr-only"
        disabled={source.busy}
        onChange={source.handleInputChange}
      />
      <CmsImagePickerDialog
        open={source.pickerOpen}
        onOpenChange={source.setPickerOpen}
        existingUrls={source.pickerExistingUrls}
        maxSelectable={Math.max(source.maxSelectable, 0)}
        initialTab={source.pickerTab}
        onAdd={source.addUrls}
      />
    </>
  );
}
