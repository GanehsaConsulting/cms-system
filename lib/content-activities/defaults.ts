import { toDatetimeLocalValue } from "@/lib/articles/schedule";
import type { ContentActivity } from "@/types/content-activity";
import type { ContentActivityFormValues } from "@/lib/validations/content-activity";

export function createEmptyContentActivityInput(
  authorName: string,
): ContentActivityFormValues {
  return {
    title: "",
    excerpt: "",
    content: "",
    displayAt: toDatetimeLocalValue(new Date().toISOString()) ?? "",
    showTitle: false,
    kind: "activity",
    linkUrl: "",
    status: "draft",
    images: [],
    authorName,
  };
}

export function contentActivityToFormInput(
  item: ContentActivity,
): ContentActivityFormValues {
  return {
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    displayAt: toDatetimeLocalValue(item.displayAt) ?? "",
    showTitle: item.showTitle,
    kind: item.kind,
    linkUrl: item.linkUrl,
    status: item.status,
    images: item.images,
    authorName: item.authorName,
  };
}
