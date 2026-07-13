"use client";

import {
  ChecklistIcon,
  DollarSignIcon,
  EyeIcon,
  FileTextIcon,
  GlobeIcon,
  InfoIcon,
  ListIcon,
  MessageIcon,
  SparkleIcon,
  SquaresFourIcon,
  TagIcon,
  WarningIcon,
  type Icon,
} from "@/lib/icons";
import type { FormSectionAccent } from "@/config/form-ui";

export const CMS_FORM_SECTION_ICONS: Record<FormSectionAccent, Icon> = {
  plan: TagIcon,
  article: FileTextIcon,
  content: GlobeIcon,
  features: ChecklistIcon,
  checklist: ChecklistIcon,
  media: SquaresFourIcon,
  whatsapp: MessageIcon,
  pricing: DollarSignIcon,
  seo: SparkleIcon,
  stats: ListIcon,
  info: InfoIcon,
  publication: EyeIcon,
  danger: WarningIcon,
};
