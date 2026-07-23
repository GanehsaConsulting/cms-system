"use client";

import { TagIcon } from "@/lib/icons";
import { LIST_TOOLBAR_BUTTON_CLASS } from "@/config/list-toolbar";
import { Button } from "@/components/ui/button";

interface PricesListManageCategoriesButtonProps {
  onClick: () => void;
}

export function PricesListManageCategoriesButton({
  onClick,
}: PricesListManageCategoriesButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={LIST_TOOLBAR_BUTTON_CLASS}
      onClick={onClick}
    >
      <TagIcon className="size-3.5 opacity-70" />
      Service Name
    </Button>
  );
}
