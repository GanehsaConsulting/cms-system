"use client";

import { CmsFormSectionIcon } from "@/components/shared/cms-form-section-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FORM_SECTION_ACCENT,
  type FormSectionAccent,
} from "@/config/form-ui";
import { InfoIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface CmsFormSectionHeadingProps {
  title: string;
  description?: string;
  /** Show description in an info tooltip instead of below the title. */
  descriptionAsTooltip?: boolean;
  accent?: FormSectionAccent;
  className?: string;
  /** Optional trailing content (e.g. score, chevron). */
  trailing?: React.ReactNode;
}

export function CmsFormSectionHeading({
  title,
  description,
  descriptionAsTooltip = false,
  accent = "plan",
  className,
  trailing,
}: CmsFormSectionHeadingProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-2">
        <CmsFormSectionIcon accent={accent} />
        <h2
          className={cn(
            "min-w-0 flex-1 font-semibold text-sm tracking-tight",
            FORM_SECTION_ACCENT[accent],
          )}
        >
          {title}
        </h2>
        {description && descriptionAsTooltip ? (
          <Tooltip>
            <TooltipTrigger
              type="button"
              className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`About ${title}`}
            >
              <InfoIcon className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[16rem] text-pretty">
              {description}
            </TooltipContent>
          </Tooltip>
        ) : null}
        {trailing}
      </div>
      {description && !descriptionAsTooltip ? (
        <p className="text-muted-foreground text-xs leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}
