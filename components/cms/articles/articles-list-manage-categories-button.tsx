"use client";

import { TagIcon } from "@/lib/icons";
import { LIST_TOOLBAR_BUTTON_CLASS } from "@/config/list-toolbar";
import { Button } from "@/components/ui/button";

interface ArticlesListManageCategoriesButtonProps {
  onClick: () => void;
}

export function ArticlesListManageCategoriesButton({
  onClick,
}: ArticlesListManageCategoriesButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={LIST_TOOLBAR_BUTTON_CLASS}
      onClick={onClick}
    >
      <TagIcon className="size-3.5 opacity-70" />
      Categories
    </Button>
  );
}
