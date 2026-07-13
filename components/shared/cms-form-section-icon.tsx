"use client";

import { CMS_FORM_SECTION_ICONS } from "@/components/shared/cms-form-section-icons";
import {
  FORM_SECTION_ACCENT,
  type FormSectionAccent,
} from "@/config/form-ui";
import { cn } from "@/lib/utils";

interface CmsFormSectionIconProps {
  accent: FormSectionAccent;
  className?: string;
}

export function CmsFormSectionIcon({
  accent,
  className,
}: CmsFormSectionIconProps) {
  const Icon = CMS_FORM_SECTION_ICONS[accent];

  return (
    <Icon
      className={cn("size-3.5", FORM_SECTION_ACCENT[accent], className)}
      aria-hidden
    />
  );
}
