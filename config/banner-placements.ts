export type BannerPlacementMock =
  | "homepage"
  | "popup"
  | "mega-menu"
  | "bottom";

export interface BannerPlacement {
  id: string;
  /** Matches Banner.key for lookup on the public site. */
  key: string;
  title: string;
  description: string;
  mock: BannerPlacementMock;
}

export const BANNER_PLACEMENTS: BannerPlacement[] = [
  {
    id: "homepage",
    key: "homepage",
    title: "Homepage Hero",
    description: "Shown on the homepage at the top section.",
    mock: "homepage",
  },
  {
    id: "popup",
    key: "popup",
    title: "Popup Banner",
    description: "Shown as a popup on the website.",
    mock: "popup",
  },
  {
    id: "mega-menu",
    key: "mega-menu",
    title: "Mega Menu Banner",
    description: "Shown inside the mega menu.",
    mock: "mega-menu",
  },
  {
    id: "bottom",
    key: "bottom",
    title: "Bottom Banner / Sticky",
    description: "Shown at the bottom of the page (sticky).",
    mock: "bottom",
  },
];

/** Fixed placement keys used by the CMS and public by-key API. */
export const BANNER_PLACEMENT_KEYS = BANNER_PLACEMENTS.map(
  (placement) => placement.key,
);

export function getBannerPlacementByKey(key: string) {
  return BANNER_PLACEMENTS.find((placement) => placement.key === key) ?? null;
}
