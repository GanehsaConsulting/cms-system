"use client";

import { CmsFormSectionIcon } from "@/components/shared/cms-form-section-icon";
import {
  FORM_SECTION_ACCENT,
  type FormSectionAccent,
} from "@/config/form-ui";
import { cn } from "@/lib/utils";

interface CmsFormSectionHeadingProps {
  title: string;
  description?: string;
  accent?: FormSectionAccent;
  className?: string;
  /** Optional trailing content (e.g. score, chevron). */
  trailing?: React.ReactNode;
}

export function CmsFormSectionHeading({
  title,
  description,
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
        {trailing}
      </div>
      {description ? (
        <p className="text-muted-foreground text-xs leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}
