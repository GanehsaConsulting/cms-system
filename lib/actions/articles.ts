"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isKnownArticleCategory } from "@/lib/articles/categories";
import { createArticle, deleteArticle, updateArticle } from "@/lib/db/articles";
import { getCustomCategories } from "@/lib/db/categories";
import {
  articleFormSchema,
  articleFormToInput,
} from "@/lib/validations/article";

function parseTags(value: FormDataEntryValue | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(String(value)) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === "string")
      : [];
  } catch {
    return [];
  }
}

function parseGallery(value: FormDataEntryValue | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(String(value)) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function parseArticleForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    status: String(formData.get("status") ?? "draft"),
    scheduledAt: String(formData.get("scheduledAt") ?? ""),
    authorName: String(formData.get("authorName") ?? ""),
    category: String(formData.get("category") ?? "general"),
    tags: parseTags(formData.get("tags")),
    metaTitle: String(formData.get("metaTitle") ?? ""),
    metaDescription: String(formData.get("metaDescription") ?? ""),
    highlighted: formData.get("highlighted") === "true",
    thumbnail: String(formData.get("thumbnail") ?? ""),
    gallery: parseGallery(formData.get("gallery")),
  };
}

export async function createArticleAction(formData: FormData) {
  const parsed = articleFormSchema.safeParse(parseArticleForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid article data",
    };
  }

  const customCategories = await getCustomCategories();

  if (!isKnownArticleCategory(parsed.data.category, customCategories)) {
    return {
      success: false as const,
      error: "Selected category is invalid",
    };
  }

  try {
    const article = await createArticle(articleFormToInput(parsed.data));
    revalidatePath("/");
    revalidatePath("/articles");
    redirect(`/articles/${article.id}/edit`);
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to save article",
    };
  }
}

export async function updateArticleAction(id: string, formData: FormData) {
  const parsed = articleFormSchema.safeParse(parseArticleForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid article data",
    };
  }

  const customCategories = await getCustomCategories();

  if (!isKnownArticleCategory(parsed.data.category, customCategories)) {
    return {
      success: false as const,
      error: "Selected category is invalid",
    };
  }

  try {
    await updateArticle(id, articleFormToInput(parsed.data));
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/articles/${id}/edit`);
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to update article",
    };
  }
}

export async function deleteArticleAction(id: string) {
  try {
    await deleteArticle(id);
    revalidatePath("/");
    revalidatePath("/articles");
    redirect("/articles");
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to delete article",
    };
  }
}
