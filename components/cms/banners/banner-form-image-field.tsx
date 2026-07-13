"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BANNER_IMAGE_UPLOAD_HINT } from "@/config/banner";
import { RADIUS_DEEP } from "@/config/shape";
import {
  GALLERY_ACCEPT_ATTRIBUTE,
  readGalleryImageFile,
} from "@/lib/articles/gallery";
import { cn } from "@/lib/utils";

interface BannerFormImageFieldProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function BannerFormImageField({
  value,
  disabled = false,
  onChange,
}: BannerFormImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  async function setImageFile(file: File) {
    setLocalError(null);
    setIsReading(true);

    try {
      onChange(await readGalleryImageFile(file));
    } catch (uploadError) {
      setLocalError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload image.",
      );
    } finally {
      setIsReading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="banner-image">Image</Label>
      <p className="text-muted-foreground text-[11px] leading-relaxed">
        {BANNER_IMAGE_UPLOAD_HINT}
      </p>
      <input
        ref={inputRef}
        id="banner-image"
        type="file"
        accept={GALLERY_ACCEPT_ATTRIBUTE}
        className="sr-only"
        disabled={disabled || isReading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) {
            void setImageFile(file);
          }
        }}
      />

      <div
        className={cn(RADIUS_DEEP, "flex items-center gap-3 bg-muted/50 p-3")}
      >
        <div
          className={cn(
            RADIUS_DEEP,
            "relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden bg-background",
          )}
        >
          {value ? (
            <Image
              src={value}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <UploadSimpleIcon className="size-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isReading}
            onClick={() => inputRef.current?.click()}
          >
            {value ? "Replace image" : "Upload image"}
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={disabled || isReading}
              onClick={() => onChange("")}
            >
              <TrashIcon className="size-3.5" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      {localError ? (
        <p className="text-destructive text-xs">{localError}</p>
      ) : null}
    </div>
  );
}
