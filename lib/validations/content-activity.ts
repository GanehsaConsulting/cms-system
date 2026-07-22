import { z } from "zod";
import { CONTENT_ACTIVITY_FORM_LIMITS } from "@/config/content-activity-form";
import { fromDatetimeLocalValue } from "@/lib/articles/schedule";
import type { ContentActivityInput } from "@/types/content-activity";

export const contentActivityStatusSchema = z.enum([
  "draft",
  "published",
  "archived",
]);

export const contentActivityKindSchema = z.enum(["activity", "promo"]);

export const contentActivityFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(
        CONTENT_ACTIVITY_FORM_LIMITS.title,
        `Title must be at most ${CONTENT_ACTIVITY_FORM_LIMITS.title} characters`,
      ),
    excerpt: z
      .string()
      .trim()
      .max(
        CONTENT_ACTIVITY_FORM_LIMITS.excerpt,
        `Excerpt must be at most ${CONTENT_ACTIVITY_FORM_LIMITS.excerpt} characters`,
      ),
    content: z.string().trim().min(1, "Description is required"),
    displayAt: z.string().trim().min(1, "Display date is required"),
    showTitle: z.boolean(),
    kind: contentActivityKindSchema,
    linkUrl: z
      .string()
      .trim()
      .max(
        CONTENT_ACTIVITY_FORM_LIMITS.linkUrl,
        `Link must be at most ${CONTENT_ACTIVITY_FORM_LIMITS.linkUrl} characters`,
      ),
    status: contentActivityStatusSchema,
    images: z
      .array(z.string().trim().min(1))
      .max(
        CONTENT_ACTIVITY_FORM_LIMITS.maxImages,
        `You can upload at most ${CONTENT_ACTIVITY_FORM_LIMITS.maxImages} images`,
      ),
    authorName: z.string().trim().min(1, "Author is required"),
  })
  .superRefine((values, context) => {
    if (values.showTitle && !values.linkUrl.trim()) {
      context.addIssue({
        code: "custom",
        message:
          values.kind === "promo"
            ? "Promo link is required when title is shown"
            : "Instagram URL is required when title is shown",
        path: ["linkUrl"],
      });
    }

    if (values.status === "published" && values.images.length === 0) {
      context.addIssue({
        code: "custom",
        message: "At least one image is required to publish",
        path: ["images"],
      });
    }

    const parsedDate = fromDatetimeLocalValue(values.displayAt);
    if (!parsedDate) {
      context.addIssue({
        code: "custom",
        message: "Display date is invalid",
        path: ["displayAt"],
      });
    }
  });

export type ContentActivityFormValues = z.infer<typeof contentActivityFormSchema>;

export function parseContentActivityForm(formData: FormData) {
  let images: string[] = [];

  try {
    const parsed = JSON.parse(String(formData.get("images") ?? "[]")) as unknown;
    images = Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    images = [];
  }

  return {
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    displayAt: String(formData.get("displayAt") ?? ""),
    showTitle: String(formData.get("showTitle") ?? "false") === "true",
    kind: String(formData.get("kind") ?? "activity"),
    linkUrl: String(formData.get("linkUrl") ?? ""),
    status: String(formData.get("status") ?? "draft"),
    images,
    authorName: String(formData.get("authorName") ?? ""),
  };
}

export function contentActivityFormToInput(
  values: ContentActivityFormValues,
): ContentActivityInput {
  const displayAt = fromDatetimeLocalValue(values.displayAt);
  if (!displayAt) {
    throw new Error("Display date is invalid");
  }

  return {
    title: values.title,
    excerpt: values.excerpt,
    content: values.content,
    displayAt,
    showTitle: values.showTitle,
    kind: values.kind,
    linkUrl: values.linkUrl,
    status: values.status,
    images: values.images,
    authorName: values.authorName,
  };
}
