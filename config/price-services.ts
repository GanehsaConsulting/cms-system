export const PRICE_SERVICE_SLUGS = [
  "virtual-office",
  "pendirian-pt",
  "pendirian-pt-pma",
  "pendirian-cv",
  "website-development",
] as const;

export type PriceServiceSlug = (typeof PRICE_SERVICE_SLUGS)[number];

export const PRICE_SERVICE_LABELS: Record<PriceServiceSlug, string> = {
  "virtual-office": "Virtual Office",
  "pendirian-pt": "Company Formation (PT)",
  "pendirian-pt-pma": "Foreign Investment (PT PMA)",
  "pendirian-cv": "Company Formation (CV)",
  "website-development": "Website Development",
};

export function getPriceServiceLabel(serviceSlug: string) {
  if (serviceSlug in PRICE_SERVICE_LABELS) {
    return PRICE_SERVICE_LABELS[serviceSlug as PriceServiceSlug];
  }

  return serviceSlug;
}
