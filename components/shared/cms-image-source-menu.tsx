"use client";

import {
  FolderOpenIcon,
  GlobeIcon,
  PlusIcon,
  UploadSimpleIcon,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CMS_IMAGE_SOURCE_LABELS } from "@/config/cms-image-source";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface CmsImageSourceMenuProps {
  disabled?: boolean;
  /** `tile` = dashed grid add cell; `button` = outline button trigger. */
  variant?: "tile" | "button";
  buttonLabel?: string;
  className?: string;
  onUpload: () => void;
  onLibrary: () => void;
  onUrl: () => void;
}

/** Compact menu for the three standard CMS image sources. */
export function CmsImageSourceMenu({
  disabled = false,
  variant = "tile",
  buttonLabel = CMS_IMAGE_SOURCE_LABELS.add,
  className,
  onUpload,
  onLibrary,
  onUrl,
}: CmsImageSourceMenuProps) {
  const trigger =
    variant === "button" ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        className={cn("gap-1.5", className)}
      />
    ) : (
      <button
        type="button"
        disabled={disabled}
        className={cn(
          RADIUS_DEEP,
          "flex aspect-4/3 w-full flex-col items-center justify-center gap-1 border border-dashed border-black/15 text-muted-foreground transition-colors",
          "hover:border-black/25 hover:bg-black/3 hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          "dark:border-white/18 dark:hover:border-white/28 dark:hover:bg-white/6",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
      />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} render={trigger}>
        {variant === "button" ? (
          <>
            <PlusIcon className="size-3.5" />
            {buttonLabel}
          </>
        ) : (
          <>
            <PlusIcon className="size-4" />
            <span className="text-[10px]">{CMS_IMAGE_SOURCE_LABELS.add}</span>
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        <DropdownMenuItem
          className="gap-2"
          onPointerDown={(event) => {
            // Open the file picker during the same gesture, before the menu unmounts.
            event.preventDefault();
            onUpload();
          }}
        >
          <UploadSimpleIcon className="size-3.5" />
          {CMS_IMAGE_SOURCE_LABELS.uploadFromDevice}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLibrary} className="gap-2">
          <FolderOpenIcon className="size-3.5" />
          {CMS_IMAGE_SOURCE_LABELS.fromLibrary}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onUrl} className="gap-2">
          <GlobeIcon className="size-3.5" />
          {CMS_IMAGE_SOURCE_LABELS.fromUrl}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
