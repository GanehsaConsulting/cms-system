import { z } from "zod";
import { ARTICLE_FORM_LIMITS } from "@/config/article-form";
import {
  fromDatetimeLocalValue,
  isFutureDatetimeLocal,
} from "@/lib/articles/schedule";
import { slugifyArticleTitle } from "@/lib/articles/slug";
import type { ArticleInput } from "@/types/article";

export const articleStatusSchema = z.enum([
  "draft",
  "scheduled",
  "published",
  "archived",
]);

export const articleAuthorSchema = z
  .string()
  .trim()
  .min(1, "Author is required")
  .max(80, "Author name must be at most 80 characters");

export const articleCategorySchema = z
  .string()
  .trim()
  .min(1, "Category is required")
  .max(
    ARTICLE_FORM_LIMITS.categoryLabel,
    `Category must be at most ${ARTICLE_FORM_LIMITS.categoryLabel} characters`,
  );

/** Form fields — slug is derived from title, not validated separately. */
export const articleFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(
        ARTICLE_FORM_LIMITS.title,
        `Title must be at most ${ARTICLE_FORM_LIMITS.title} characters`,
      ),
    excerpt: z
      .string()
      .trim()
      .max(
        ARTICLE_FORM_LIMITS.excerpt,
        `Excerpt must be at most ${ARTICLE_FORM_LIMITS.excerpt} characters`,
      ),
    content: z
      .string()
      .trim()
      .refine(
        (value) =>
          value !== "<p></p>" &&
          value.replace(/<[^>]*>/g, "").trim().length > 0,
        "Article content is required",
      ),
    status: articleStatusSchema,
    /** datetime-local value when status is scheduled; otherwise "". */
    scheduledAt: z.string(),
    authorName: articleAuthorSchema,
    category: articleCategorySchema,
    tags: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Tags cannot be empty")
          .max(30, "Each tag must be at most 30 characters"),
      )
      .max(
        ARTICLE_FORM_LIMITS.maxTags,
        `You can add up to ${ARTICLE_FORM_LIMITS.maxTags} tags`,
      ),
    metaTitle: z
      .string()
      .trim()
      .max(
        ARTICLE_FORM_LIMITS.metaTitle,
        `Meta title must be at most ${ARTICLE_FORM_LIMITS.metaTitle} characters`,
      ),
    metaDescription: z
      .string()
      .trim()
      .max(
        ARTICLE_FORM_LIMITS.metaDescription,
        `Meta description must be at most ${ARTICLE_FORM_LIMITS.metaDescription} characters`,
      ),
    highlighted: z.boolean(),
    thumbnail: z.string(),
    gallery: z
      .array(z.string())
      .max(
        ARTICLE_FORM_LIMITS.maxGalleryImages,
        `You can upload up to ${ARTICLE_FORM_LIMITS.maxGalleryImages} images`,
      ),
  })
  .superRefine((data, ctx) => {
    if (data.status !== "scheduled") {
      return;
    }

    if (!data.scheduledAt.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["scheduledAt"],
        message: "Schedule date and time are required",
      });
      return;
    }

    if (Number.isNaN(new Date(data.scheduledAt).getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["scheduledAt"],
        message: "Enter a valid schedule date and time",
      });
      return;
    }

    if (!isFutureDatetimeLocal(data.scheduledAt)) {
      ctx.addIssue({
        code: "custom",
        path: ["scheduledAt"],
        message: "Schedule date must be in the future",
      });
    }
  });

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

export function articleFormToInput(values: ArticleFormValues): ArticleInput {
  const { scheduledAt, ...rest } = values;

  return {
    ...rest,
    slug: slugifyArticleTitle(values.title, ARTICLE_FORM_LIMITS.slug),
    publishedAt:
      values.status === "scheduled"
        ? fromDatetimeLocalValue(scheduledAt)
        : null,
  };
}
