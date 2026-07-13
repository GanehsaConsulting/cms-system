"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "@/lib/icons";

interface PriceFormFieldHintProps {
  label: string;
  children: string;
}

export function PriceFormFieldHint({
  label,
  children,
}: PriceFormFieldHintProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        aria-label={label}
      >
        <InfoIcon className="size-3.5" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[16rem] text-pretty">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}
