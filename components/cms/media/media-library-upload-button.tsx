"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CmsAlert } from "@/components/shared/cms-alert";
import { MEDIA_LIBRARY_ACCEPT_ATTRIBUTE, MEDIA_LIBRARY_UPLOAD_HINT } from "@/config/media-library";
import {
  createMediaUploadSignaturesAction,
  saveMediaLibraryUploadsAction,
} from "@/lib/actions/media-files";
import { UploadSimpleIcon } from "@/lib/icons";
import { uploadFileToCloudinary } from "@/lib/media/direct-upload";
import {
  getMediaUploadMeta,
  normalizeUploadBatch,
  validateMediaUploadFile,
} from "@/lib/media/upload";
import {
  notifyError,
  notifyFromActionResult,
} from "@/lib/notify/action-toast";

interface MediaLibraryUploadButtonProps {
  folderId: string | null;
  disabled?: boolean;
}

export function MediaLibraryUploadButton({
  folderId,
  disabled = false,
}: MediaLibraryUploadButtonProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openPicker() {
    inputRef.current?.click();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (!fileList || !folderId) {
      return;
    }

    const batch = normalizeUploadBatch(Array.from(fileList));
    event.target.value = "";

    for (const file of batch) {
      const validationError = validateMediaUploadFile(file);
      if (validationError) {
        setError(validationError);
        notifyError(validationError);
        return;
      }
    }

    setError(null);
    startTransition(async () => {
      const metas = batch.map(getMediaUploadMeta);
      const signed = await createMediaUploadSignaturesAction(folderId, metas);
      if (!signed.success) {
        setError(signed.error);
        notifyError(signed.error);
        return;
      }

      try {
        const uploads = [];

        for (const file of batch) {
          const meta = getMediaUploadMeta(file);
          const uploaded = await uploadFileToCloudinary(file, signed.params);
          uploads.push({
            ...meta,
            url: uploaded.url,
            publicId: uploaded.publicId,
            sizeBytes: uploaded.sizeBytes,
          });
        }

        const result = await saveMediaLibraryUploadsAction(folderId, uploads);
        if (!notifyFromActionResult(result, "Files uploaded.")) {
          if (!result.success) {
            setError(result.error);
          }
          return;
        }

        router.refresh();
      } catch (uploadError) {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload files";
        setError(message);
        notifyError(message);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={MEDIA_LIBRARY_ACCEPT_ATTRIBUTE}
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        size="sm"
        className="h-8 gap-1.5"
        onClick={openPicker}
        disabled={disabled || !folderId || isPending}
        title={MEDIA_LIBRARY_UPLOAD_HINT}
      >
        <UploadSimpleIcon className="size-3.5" />
        Upload
      </Button>
      {error ? (
        <CmsAlert variant="error" size="sm" message={error} />
      ) : null}
    </div>
  );
}
