/** Public FE contract for banner slots (website + custom). */

export type BannerPlacementFillStatus =
  | "missing"
  | "empty"
  | "inactive"
  | "ready";

export interface BannerPlacementCatalogEntry {
  key: string;
  title: string;
  description: string;
  /** Website system slot that FE should always know about. */
  required: boolean;
  kind: "website" | "custom";
  status: BannerPlacementFillStatus;
  /** True only when active + has ≥1 image — safe to render. */
  ready: boolean;
  /** Relative public path; prefix with CMS origin + `/api/public`. */
  endpointPath: string;
}

export interface BannerPlacementCatalog {
  requiredKeys: string[];
  website: BannerPlacementCatalogEntry[];
  custom: BannerPlacementCatalogEntry[];
  summary: {
    requiredTotal: number;
    requiredReady: number;
    customTotal: number;
    customReady: number;
  };
}
