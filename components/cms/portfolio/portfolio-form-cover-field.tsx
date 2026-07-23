"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PORTFOLIO_COVER_UPLOAD_HINT } from "@/config/portfolio-form";
import { RADIUS_DEEP } from "@/config/shape";
import {
  GALLERY_ACCEPT_ATTRIBUTE,
  readGalleryImageFile,
} from "@/lib/articles/gallery";
import type { PortfolioFormValues } from "@/lib/validations/portfolio";
import { cn } from "@/lib/utils";

interface PortfolioFormCoverFieldProps {
  control: Control<PortfolioFormValues>;
}

export function PortfolioFormCoverField({
  control,
}: PortfolioFormCoverFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const { openPreview } = useCmsImagePreview();

  return (
    <Controller
      control={control}
      name="coverImage"
      render={({ field }) => {
        async function setCoverFile(file: File) {
          setLocalError(null);
          setIsReading(true);

          try {
            field.onChange(await readGalleryImageFile(file));
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
            <Label htmlFor="coverImage">Cover image</Label>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {PORTFOLIO_COVER_UPLOAD_HINT}
            </p>
            <input
              ref={inputRef}
              id="coverImage"
              type="file"
              accept={GALLERY_ACCEPT_ATTRIBUTE}
              className="sr-only"
              disabled={isReading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) {
                  void setCoverFile(file);
                }
              }}
            />

            <div
              className={cn(
                RADIUS_DEEP,
                "flex items-center gap-3 bg-muted/50 p-3",
              )}
            >
              <div
                className={cn(
                  RADIUS_DEEP,
                  "relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden bg-background",
                )}
              >
                {field.value ? (
                  <button
                    type="button"
                    aria-label="Preview cover image"
                    className="absolute inset-0"
                    onClick={() =>
                      openPreview({
                        images: [field.value],
                        title: "Cover preview",
                      })
                    }
                  >
                    <Image
                      src={field.value}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ) : (
                  <UploadSimpleIcon className="size-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isReading}
                  onClick={() => inputRef.current?.click()}
                >
                  {field.value ? "Replace image" : "Upload image"}
                </Button>
                {field.value ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={isReading}
                    onClick={() => field.onChange("")}
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
      }}
    />
  );
}
