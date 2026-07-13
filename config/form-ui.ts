/** Visual accents for CMS CRUD form sections — keep labels scannable. */

export const FORM_SECTION_ACCENT = {
  plan: "text-primary",
  article: "text-primary",
  content: "text-chart-1",
  features: "text-chart-1",
  checklist: "text-chart-1",
  media: "text-chart-2",
  whatsapp: "text-chart-2",
  pricing: "text-chart-3",
  seo: "text-chart-3",
  stats: "text-foreground",
  info: "text-foreground",
  publication: "text-primary",
  danger: "text-destructive",
} as const;

export type FormSectionAccent = keyof typeof FORM_SECTION_ACCENT;

export const FORM_SECTION_BORDER = {
  plan: "border-primary/25",
  article: "border-primary/25",
  content: "border-chart-1/25",
  features: "border-chart-1/25",
  checklist: "border-chart-1/25",
  media: "border-chart-2/25",
  whatsapp: "border-chart-2/25",
  pricing: "border-chart-3/25",
  seo: "border-chart-3/25",
  stats: "border-border",
  info: "border-border",
  publication: "border-primary/25",
  danger: "border-destructive/35",
} as const;

export const FORM_SECTION_SURFACE = {
  plan: "bg-muted/60",
  article: "bg-muted/60",
  content: "bg-muted/60",
  features: "bg-muted/60",
  checklist: "bg-muted/60",
  media: "bg-muted/60",
  whatsapp: "bg-muted/60",
  pricing: "bg-muted/60",
  seo: "bg-muted/60",
  stats: "bg-muted/60",
  info: "bg-muted/60",
  publication: "bg-muted/60",
  danger: "bg-destructive/10",
} as const;
