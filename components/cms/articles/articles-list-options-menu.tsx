"use client";

import { useRouter } from "next/navigation";
import { DotsThreeIcon } from "@/lib/icons";
import { LIST_TOOLBAR_ICON_BUTTON_CLASS } from "@/config/list-toolbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function ArticlesListOptionsMenu() {

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={LIST_TOOLBAR_ICON_BUTTON_CLASS}
            aria-label="More options"

          />
        }
      >
        <DotsThreeIcon className="size-4 opacity-70" />
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
