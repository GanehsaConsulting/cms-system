import { z } from "zod";
import { ARTICLE_AUTHORS } from "@/config/article-authors";
import { ARTICLE_FORM_LIMITS } from "@/config/article-form";
import { slugifyArticleTitle } from "@/lib/articles/slug";
import type { ArticleInput } from "@/types/article";

export const articleStatusSchema = z.enum(["draft", "published", "archived"]);

export const articleAuthorSchema = z.enum(ARTICLE_AUTHORS);

export const articleCategorySchema = z
  .string()
  .trim()
  .min(1, "Category is required")
  .max(
    ARTICLE_FORM_LIMITS.categoryLabel,
    `Category must be at most ${ARTICLE_FORM_LIMITS.categoryLabel} characters`,
  );

/** Form fields — slug is derived from title, not validated separately. */
export const articleFormSchema = z.object({
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
        value !== "<p></p>" && value.replace(/<[^>]*>/g, "").trim().length > 0,
      "Article content is required",
    ),
  status: articleStatusSchema,
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
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

export function articleFormToInput(values: ArticleFormValues): ArticleInput {
  return {
    ...values,
    slug: slugifyArticleTitle(values.title, ARTICLE_FORM_LIMITS.slug),
  };
}