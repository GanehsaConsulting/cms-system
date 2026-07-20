"use client";

import { useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { SidebarProfileAvatar } from "@/components/cms/sidebar-profile-avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  GALLERY_ACCEPT_ATTRIBUTE,
  readGalleryImageFile,
} from "@/lib/articles/gallery";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";
import type { CmsProfileFormValues } from "@/lib/validations/cms-user";

interface SidebarProfilePhotoFieldProps {
  control: Control<CmsProfileFormValues>;
  nameFallback: string;
}

export function SidebarProfilePhotoField({
  control,
  nameFallback,
}: SidebarProfilePhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const watchedName = useWatch({ control, name: "name" });
  const displayName = watchedName.trim() || nameFallback;

  return (
    <Controller
      control={control}
      name="avatarUrl"
      render={({ field }) => {
        const avatarUrl = field.value;

        async function setPhotoFile(file: File) {
          setLocalError(null);
          setIsReading(true);

          try {
            field.onChange(await readGalleryImageFile(file));
          } catch (uploadError) {
            setLocalError(
              uploadError instanceof Error
                ? uploadError.message
                : "Failed to upload photo.",
            );
          } finally {
            setIsReading(false);
          }
        }

        function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
          const file = event.target.files?.[0];
          event.target.value = "";

          if (!file) {
            return;
          }

          void setPhotoFile(file);
        }

        return (
          <div className="space-y-3">
            <Label>Profile photo</Label>
            <div className="flex items-center gap-3">
              <SidebarProfileAvatar
                name={displayName}
                avatarUrl={avatarUrl || undefined}
                size="lg"
              />

              <div className="min-w-0 flex-1 space-y-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept={GALLERY_ACCEPT_ATTRIBUTE}
                  className="sr-only"
                  onChange={handleInputChange}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="gap-1.5"
                    disabled={isReading}
                    onClick={() => inputRef.current?.click()}
                  >
                    <UploadSimpleIcon className="size-3.5" />
                    {avatarUrl ? "Change photo" : "Upload photo"}
                  </Button>
                  {avatarUrl ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      disabled={isReading}
                      onClick={() => {
                        setLocalError(null);
                        field.onChange("");
                      }}
                    >
                      <TrashIcon className="size-3.5" />
                      Remove
                    </Button>
                  ) : null}
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  JPG, PNG, or WebP. Shown in the sidebar and profile dialog.
                </p>
                {localError ? (
                  <p className="text-destructive text-xs">{localError}</p>
                ) : null}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
