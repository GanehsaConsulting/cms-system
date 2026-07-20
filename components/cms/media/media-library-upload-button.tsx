"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MEDIA_LIBRARY_ACCEPT_ATTRIBUTE } from "@/config/media-library";
import { uploadMediaLibraryFilesAction } from "@/lib/actions/media-files";
import { UploadSimpleIcon } from "@/lib/icons";
import { notifyFromActionResult } from "@/lib/notify/action-toast";

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

    const formData = new FormData();
    for (const file of Array.from(fileList)) {
      formData.append("files", file);
    }

    setError(null);
    startTransition(async () => {
      const result = await uploadMediaLibraryFilesAction(folderId, formData);
      if (!notifyFromActionResult(result, "Files uploaded.")) {
        if (!result.success) {
          setError(result.error);
        }
        return;
      }

      router.refresh();
    });

    event.target.value = "";
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
      >
        <UploadSimpleIcon className="size-3.5" />
        Upload
      </Button>
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}
