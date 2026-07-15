"use client";

import { Button } from "@/components/ui/button";
import { PencilSimpleIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface DashboardEditWidgetsButtonProps {
  onClick: () => void;
  className?: string;
}

export function DashboardEditWidgetsButton({
  onClick,
  className,
}: DashboardEditWidgetsButtonProps) {
  return (
    <div className={cn("flex justify-end pt-1 pb-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 bg-background/20! rounded-xl backdrop-blur-sm backdrop-saturate-150"
        onClick={onClick}
      >
        <PencilSimpleIcon className="size-3" />
        Edit widgets
      </Button>
    </div>
  );
}
