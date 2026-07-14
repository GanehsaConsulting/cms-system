import {
  DollarSignIcon,
  FileTextIcon,
  type Icon,
  Person2Icon,
  PhotoIcon,
} from "@/lib/icons";

export interface DashboardQuickAction {
  id: string;
  label: string;
  href: string;
  icon: Icon;
  /** Tinted tile surface — same treatment as Total articles, own hue. */
  surface: string;
}

function tintedSurface(from: string, to: string, glowRgb: string) {
  return [
    "border-0 bg-linear-to-br",
    from,
    to,
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_4px_14px_rgb(" +
      glowRgb +
      "/0.24)]",
  ].join(" ");
}

export const DASHBOARD_QUICK_ACTIONS: DashboardQuickAction[] = [
  {
    id: "article",
    label: "Create Article",
    href: "/articles/new",
    icon: FileTextIcon,
    surface: tintedSurface("from-[#FF5A7A]", "to-[#FF2D55]", "255 45 85"),
  },
  {
    id: "price",
    label: "Add Price",
    href: "/prices/new",
    icon: DollarSignIcon,
    surface: tintedSurface("from-[#64E286]", "to-[#30D158]", "48 209 88"),
  },
  {
    id: "client",
    label: "New Client",
    href: "/clients/new",
    icon: Person2Icon,
    surface: tintedSurface("from-[#FFB340]", "to-[#FF9500]", "255 149 0"),
  },
  {
    id: "banner",
    label: "Manage Banners",
    href: "/banners",
    icon: PhotoIcon,
    surface: tintedSurface("from-[#C77DFF]", "to-[#AF52DE]", "175 82 222"),
  },
];

export const DASHBOARD_RECENT_ARTICLES_LIMIT = 12;

export const DASHBOARD_RECENT_ACTIVITY_LIMIT = 12;

export const DASHBOARD_DRAFTS_ATTENTION_LIMIT = 12;

/** Max height for scrollable recent lists — keeps widgets compact. */
export const DASHBOARD_RECENT_LIST_MAX_HEIGHT = "max-h-40";

/** Fixed widget height shell for recent lists. */
export const DASHBOARD_RECENT_WIDGET_HEIGHT = "h-[15.5rem]";

/** Compact height for small bento tiles (stats / focus). */
export const DASHBOARD_BENTO_TILE_HEIGHT = "min-h-[7.5rem] h-[7.5rem]";

/** Compact height for medium bento tiles (browse / focus). */
export const DASHBOARD_BENTO_MEDIUM_HEIGHT = "min-h-[10.5rem] h-[10.5rem]";

/** macOS-style widget corner radius (~22px). */
export const DASHBOARD_WIDGET_RADIUS = "rounded-[1.25rem]";

/** Spacing between widgets — matched by edge inset for even rhythm.
 *  Inset must exceed widget shadow blur so shadows aren't clipped by
 *  the sidebar / scroll overflow edge. */
export const DASHBOARD_WIDGET_GAP = "gap-2.5";
export const DASHBOARD_WIDGET_INSET = "p-4";

export const DASHBOARD_WIDGET_IDS = [
  "greeting",
  "quick-actions",
  "content-health",
  "article-stats",
  "recent-articles",
  "drafts-attention",
  "recent-activity",
  "articles-focus",
  "browse",
] as const;

export type DashboardWidgetId = (typeof DASHBOARD_WIDGET_IDS)[number];

export interface DashboardWidgetOption {
  id: DashboardWidgetId;
  label: string;
  description: string;
}

export const DASHBOARD_WIDGET_OPTIONS: DashboardWidgetOption[] = [
  {
    id: "greeting",
    label: "Greeting",
    description: "Welcome message and clock",
  },
  {
    id: "quick-actions",
    label: "Quick actions",
    description: "Create shortcuts",
  },
  {
    id: "content-health",
    label: "Content health",
    description: "Clients, prices, banners, media",
  },
  {
    id: "article-stats",
    label: "Article stats",
    description: "Total, published, and drafts",
  },
  {
    id: "recent-articles",
    label: "Recent articles",
    description: "Latest article updates",
  },
  {
    id: "drafts-attention",
    label: "Drafts needing attention",
    description: "Oldest unfinished drafts",
  },
  {
    id: "recent-activity",
    label: "Recent activity",
    description: "Updates across modules",
  },
  {
    id: "articles-focus",
    label: "Publish readiness",
    description: "Article completion overview",
  },
  {
    id: "browse",
    label: "Browse",
    description: "Shortcuts to main sections",
  },
];

export function createDefaultDashboardWidgetVisibility(): Record<
  DashboardWidgetId,
  boolean
> {
  return Object.fromEntries(
    DASHBOARD_WIDGET_IDS.map((id) => [id, true]),
  ) as Record<DashboardWidgetId, boolean>;
}

export function getTimeOfDayGreeting(date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function formatDashboardDate(date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDashboardTime(date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDashboardSeconds(date = new Date()): string {
  return String(date.getSeconds()).padStart(2, "0");
}
