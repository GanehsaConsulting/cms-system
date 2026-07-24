"use client";

import {
  FolderOpenIcon,
  GlobeIcon,
  PlusIcon,
  UploadSimpleIcon,
} from "@/lib/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface BannerFormImageAddMenuProps {
  disabled?: boolean;
  onUpload: () => void;
  onLibrary: () => void;
  onUrl: () => void;
}

export function BannerFormImageAddMenu({
  disabled = false,
  onUpload,
  onLibrary,
  onUrl,
}: BannerFormImageAddMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        render={
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
            )}
          />
        }
      >
        <PlusIcon className="size-4" />
        <span className="text-[10px]">Add</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        <DropdownMenuItem onClick={onUpload} className="gap-2">
          <UploadSimpleIcon className="size-3.5" />
          Upload from device
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLibrary} className="gap-2">
          <FolderOpenIcon className="size-3.5" />
          From Files & Media
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onUrl} className="gap-2">
          <GlobeIcon className="size-3.5" />
          From URL
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
