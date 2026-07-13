"use client";

import { PlusIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface BannersListCreateButtonProps {
  onClick: () => void;
}

export function BannersListCreateButton({
  onClick,
}: BannersListCreateButtonProps) {
  return (
    <Button type="button" className="h-8 gap-1.5" onClick={onClick}>
      <PlusIcon className="size-3.5" />
      Create Banner
    </Button>
  );
}
