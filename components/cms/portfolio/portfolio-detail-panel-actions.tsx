"use client";

import Link from "next/link";
import { PencilSimpleIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import type { Portfolio } from "@/types/portfolio";

interface PortfolioDetailPanelActionsProps {
  item: Portfolio;
}

export function PortfolioDetailPanelActions({
  item,
}: PortfolioDetailPanelActionsProps) {
  return (
    <div className="shrink-0 border-(--separator) border-t p-3">
      <Button
        nativeButton={false}
        render={<Link href={`/clients/portfolio/${item.id}/edit`} />}
        className="h-8 w-full gap-1.5"
      >
        <PencilSimpleIcon className="size-3.5" />
        Edit work
      </Button>
    </div>
  );
}
