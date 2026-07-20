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
import {
  createMediaFolderAction,
  updateMediaFolderAction,
} from "@/lib/actions/media-folders";
import { notifyFromActionResult } from "@/lib/notify/action-toast";
import type { MediaFolder } from "@/types/media";

interface MediaLibraryFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "rename";
  folder?: MediaFolder | null;
  parentId?: string | null;
}

export function MediaLibraryFolderDialog({
  open,
  onOpenChange,
  mode,
  folder,
  parentId = null,
}: MediaLibraryFolderDialogProps) {
  const router = useRouter();
  const [name, setName] = useState(folder?.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isRename = mode === "rename";

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(folder?.name ?? "");
    setError(null);
  }, [folder, open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("name", name);

    if (!isRename) {
      formData.set("parentId", parentId ?? "");
    }

    startTransition(async () => {
      const result = isRename
        ? await updateMediaFolderAction(folder?.id ?? "", formData)
        : await createMediaFolderAction(formData);

      if (
        !notifyFromActionResult(
          result,
          isRename ? "Folder renamed." : "Folder created.",
        )
      ) {
        if (!result.success) {
          setError(result.error);
        }
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
            <CmsDialogTitle>
              {isRename ? "Rename folder" : "New folder"}
            </CmsDialogTitle>
            <CmsDialogDescription>
              {isRename
                ? "Update the folder name."
                : "Create a folder to organize pending uploads."}
            </CmsDialogDescription>
          </CmsDialogHeader>

          <CmsDialogBody>
            <div className="space-y-2">
              <Label htmlFor="media-folder-name">Folder name</Label>
              <Input
                id="media-folder-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Campaign assets"
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
            <Button type="submit" disabled={isPending || name.trim().length === 0}>
              {isRename ? "Save" : "Create"}
            </Button>
          </CmsDialogFooter>
        </form>
      </CmsDialogContent>
    </CmsDialog>
  );
}
