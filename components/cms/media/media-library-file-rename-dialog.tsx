"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogFooter,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DIALOG_FORM_CLASS } from "@/config/dialog";
import { renameMediaLibraryFileAction } from "@/lib/actions/media-files";
import type { MediaLibraryFile } from "@/types/media";

interface MediaLibraryFileRenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: MediaLibraryFile | null;
}

export function MediaLibraryFileRenameDialog({
  open,
  onOpenChange,
  file,
}: MediaLibraryFileRenameDialogProps) {
  const router = useRouter();
  const [filename, setFilename] = useState(file?.filename ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      return;
    }

    setFilename(file?.filename ?? "");
    setError(null);
  }, [file, open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      return;
    }

    setError(null);

    const formData = new FormData();
    formData.set("filename", filename);

    startTransition(async () => {
      const result = await renameMediaLibraryFileAction(file.id, formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent size="sm">
        <form className={DIALOG_FORM_CLASS} onSubmit={handleSubmit}>
          <CmsDialogHeader>
            <CmsDialogTitle>Rename file</CmsDialogTitle>
            <CmsDialogDescription>
              Update the display name for this file in your library.
            </CmsDialogDescription>
          </CmsDialogHeader>

          <CmsDialogBody>
            <div className="space-y-2">
              <Label htmlFor="media-file-name">File name</Label>
              <Input
                id="media-file-name"
                value={filename}
                onChange={(event) => setFilename(event.target.value)}
                placeholder="hero-banner.jpg"
                autoFocus
                disabled={isPending}
              />
              {error ? (
                <p className="text-destructive text-sm">{error}</p>
              ) : null}
            </div>
          </CmsDialogBody>

          <CmsDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || filename.trim().length === 0}
            >
              Save
            </Button>
          </CmsDialogFooter>
        </form>
      </CmsDialogContent>
    </CmsDialog>
  );
}
