"use client";

import { useRouter } from "next/navigation";
import { DotsThreeIcon } from "@/lib/icons";
import {
  LIST_TOOLBAR_CONTROL_HEIGHT,
  LIST_TOOLBAR_CONTROL_SURFACE,
} from "@/config/list-toolbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ArticlesListOptionsMenu() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className={cn(
              LIST_TOOLBAR_CONTROL_HEIGHT,
              LIST_TOOLBAR_CONTROL_SURFACE,
              "size-9",
            )}
            aria-label="More options"
          />
        }
      >
        <DotsThreeIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => router.refresh()}>
          Refresh list
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Export CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
