"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentArticleAuthor } from "@/lib/articles/authors";
import { isKnownArticleCategory } from "@/lib/articles/categories";
import {
  recordActivityEvent,
  resolveArticleActivityAction,
} from "@/lib/activity/record";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import {
  createArticle,
  deleteArticle,
  getArticleById,
  updateArticle,
} from "@/lib/db/articles";
import { getCustomCategories } from "@/lib/db/categories";
import { revalidateMediaLibraryCache } from "@/lib/media/cache";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import {
  articleFormSchema,
  articleFormToInput,
} from "@/lib/validations/article";
import type { ArticlePreviewData } from "@/types/article-preview";

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
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const parsed = articleFormSchema.safeParse(parseArticleForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid article data",
    };
  }

  const author = await getCurrentArticleAuthor();
  if (!author) {
    return {
      success: false as const,
      error: "You must be signed in to save articles.",
    };
  }

  const customCategories = await getCustomCategories(brand.brandId);

  if (!isKnownArticleCategory(parsed.data.category, customCategories)) {
    return {
      success: false as const,
      error: "Selected category is invalid",
    };
  }

  try {
    const article = await createArticle(
      brand.brandId,
      {
        ...articleFormToInput(parsed.data),
        authorName: author.name,
      },
      {
        authorId: author.id,
      },
    );
    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "article",
      entityId: article.id,
      action: resolveArticleActivityAction({
        nextStatus: parsed.data.status,
        isCreate: true,
      }),
      actor: access.user,
      entityTitle: article.title,
    });
    revalidatePath("/");
    revalidatePath("/articles");
    revalidateMediaLibraryCache();
    redirect(`/articles/${article.id}/edit`);
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to save article",
    };
  }
}

export async function updateArticleAction(id: string, formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const parsed = articleFormSchema.safeParse(parseArticleForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid article data",
    };
  }

  const author = await getCurrentArticleAuthor();
  if (!author) {
    return {
      success: false as const,
      error: "You must be signed in to save articles.",
    };
  }

  const current = await getArticleById(brand.brandId, id);
  if (!current) {
    return {
      success: false as const,
      error: "Article not found",
    };
  }

  const customCategories = await getCustomCategories(brand.brandId);

  if (!isKnownArticleCategory(parsed.data.category, customCategories)) {
    return {
      success: false as const,
      error: "Selected category is invalid",
    };
  }

  try {
    await updateArticle(
      brand.brandId,
      id,
      {
        ...articleFormToInput(parsed.data),
        authorName: author.name,
      },
      {
        authorId: author.id,
      },
    );
    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "article",
      entityId: id,
      action: resolveArticleActivityAction({
        previousStatus: current.status,
        nextStatus: parsed.data.status,
        isCreate: false,
      }),
      actor: access.user,
      entityTitle: parsed.data.title.trim() || current.title,
    });
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/articles/${id}/edit`);
    revalidateMediaLibraryCache();
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
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  try {
    const current = await getArticleById(brand.brandId, id);
    await deleteArticle(brand.brandId, id);
    if (current) {
      await recordActivityEvent({
        brandId: brand.brandId,
        entityType: "article",
        entityId: id,
        action: "deleted",
        actor: access.user,
        entityTitle: current.title,
      });
    }
    revalidatePath("/");
    revalidatePath("/articles");
    revalidateMediaLibraryCache();
    redirect("/articles");
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to delete article",
    };
  }
}

/** Lazy-load body HTML for list preview (list page omits `content`). */
export async function getArticlePreviewAction(id: string) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  try {
    const article = await getArticleById(brand.brandId, id);
    if (!article) {
      return { success: false as const, error: "Article not found" };
    }

    const preview: ArticlePreviewData = {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags,
      authorName: article.authorName,
      authorImage: article.authorImage,
      slug: article.slug,
      thumbnail: article.thumbnail,
    };

    return {
      success: true as const,
      preview,
      publishedAt: article.publishedAt ?? article.updatedAt,
    };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to load preview",
    };
  }
}
