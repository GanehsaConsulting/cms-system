"use client";

import { CmsFormSectionIcon } from "@/components/shared/cms-form-section-icon";
import {
  FORM_SECTION_ACCENT,
  type FormSectionAccent,
} from "@/config/form-ui";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface CmsFormFieldGroupProps {
  title: string;
  description?: string;
  accent?: FormSectionAccent;
  children: React.ReactNode;
  className?: string;
}

export function CmsFormFieldGroup({
  title,
  description,
  accent = "content",
  children,
  className,
}: CmsFormFieldGroupProps) {
  return (
    <section
      className={cn(RADIUS_DEEP, "space-y-3 bg-muted/50 p-3.5", className)}
    >
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <CmsFormSectionIcon accent={accent} />
          <h3
            className={cn(
              "font-semibold text-xs uppercase tracking-wide",
              FORM_SECTION_ACCENT[accent],
            )}
          >
            {title}
          </h3>
        </div>
        {description ? (
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
