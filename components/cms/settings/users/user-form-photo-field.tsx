"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { SidebarProfileAvatar } from "@/components/cms/sidebar-profile-avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  GALLERY_ACCEPT_ATTRIBUTE,
  readGalleryImageFile,
} from "@/lib/articles/gallery";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";

interface UserFormPhotoFieldProps {
  value: string;
  nameFallback: string;
  disabled?: boolean;
  onChange: (avatarUrl: string) => void;
}

export function UserFormPhotoField({
  value,
  nameFallback,
  disabled = false,
  onChange,
}: UserFormPhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  async function setPhotoFile(file: File) {
    setLocalError(null);
    setIsReading(true);

    try {
      onChange(await readGalleryImageFile(file));
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
        {value ? (
          <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-muted">
            <Image
              src={value}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          </span>
        ) : (
          <SidebarProfileAvatar name={nameFallback} size="lg" />
        )}

        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept={GALLERY_ACCEPT_ATTRIBUTE}
            className="sr-only"
            disabled={disabled || isReading}
            onChange={handleInputChange}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-1.5"
              disabled={disabled || isReading}
              onClick={() => inputRef.current?.click()}
            >
              <UploadSimpleIcon className="size-3.5" />
              {value ? "Change photo" : "Upload photo"}
            </Button>
            {value ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={disabled || isReading}
                onClick={() => {
                  setLocalError(null);
                  onChange("");
                }}
              >
                <TrashIcon className="size-3.5" />
                Remove
              </Button>
            ) : null}
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            JPG, PNG, or WebP. Shown in the user list and profile areas.
          </p>
          {localError ? (
            <p className="text-destructive text-xs">{localError}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
