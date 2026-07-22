import { LIST_DEFAULT_PAGE_SIZE } from "@/config/list-table";
import type {
  ContentActivityKind,
  ContentActivityStatus,
} from "@/types/content-activity";

export const CONTENT_ACTIVITIES_LIST_PAGE_SIZE = LIST_DEFAULT_PAGE_SIZE;

export type ContentActivityKindFilter = "all" | ContentActivityKind;

export type ContentActivityStatusFilter = "all" | ContentActivityStatus;

export type ContentActivityShowTitleFilter = "all" | "shown" | "hidden";

export type ContentActivitiesListSort =
  | "display-desc"
  | "display-asc"
  | "updated-desc"
  | "updated-asc"
  | "title-asc"
  | "title-desc"
  | "clicks-desc";

export type ContentActivitiesTableSortColumn =
  | "title"
  | "display"
  | "updated"
  | "clicks";

export const CONTENT_ACTIVITIES_TABLE_SORT_MAP: Record<
  ContentActivitiesTableSortColumn,
  {
    asc: ContentActivitiesListSort;
    desc: ContentActivitiesListSort;
    default: ContentActivitiesListSort;
  }
> = {
  title: { asc: "title-asc", desc: "title-desc", default: "title-asc" },
  display: {
    asc: "display-asc",
    desc: "display-desc",
    default: "display-desc",
  },
  updated: {
    asc: "updated-asc",
    desc: "updated-desc",
    default: "updated-desc",
  },
  clicks: {
    asc: "clicks-desc",
    desc: "clicks-desc",
    default: "clicks-desc",
  },
};

export const CONTENT_ACTIVITY_KIND_TABS: {
  id: ContentActivityKindFilter;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "activity", label: "Activity" },
  { id: "promo", label: "Promo" },
];

export const CONTENT_ACTIVITY_STATUS_FILTERS: {
  id: ContentActivityStatusFilter;
  label: string;
}[] = [
  { id: "all", label: "All statuses" },
  { id: "draft", label: "Draft" },
  { id: "published", label: "Published" },
  { id: "archived", label: "Archived" },
];

export const CONTENT_ACTIVITY_SHOW_TITLE_FILTERS: {
  id: ContentActivityShowTitleFilter;
  label: string;
}[] = [
  { id: "all", label: "All titles" },
  { id: "shown", label: "Showing title" },
  { id: "hidden", label: "Hidden title" },
];

export const CONTENT_ACTIVITIES_LIST_SORT_OPTIONS: {
  id: ContentActivitiesListSort;
  label: string;
}[] = [
  { id: "display-desc", label: "Newest display date" },
  { id: "display-asc", label: "Oldest display date" },
  { id: "updated-desc", label: "Recently updated" },
  { id: "updated-asc", label: "Oldest updated" },
  { id: "title-asc", label: "Title A–Z" },
  { id: "title-desc", label: "Title Z–A" },
  { id: "clicks-desc", label: "Most clicked" },
];
