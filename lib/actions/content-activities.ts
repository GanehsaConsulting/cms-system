"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toActionError } from "@/lib/actions/action-error";
import { getCurrentArticleAuthor } from "@/lib/articles/authors";
import { recordActivityEvent } from "@/lib/activity/record";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import {
  createContentActivity,
  deleteContentActivity,
  getContentActivityById,
  updateContentActivity,
  updateContentActivityStatus,
} from "@/lib/db/content-activities";
import { revalidateMediaLibraryCache } from "@/lib/media/cache";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import {
  contentActivityFormSchema,
  contentActivityFormToInput,
  parseContentActivityForm,
} from "@/lib/validations/content-activity";

function revalidateContentActivityPaths(id?: string) {
  revalidatePath("/");
  revalidatePath("/activities");
  if (id) {
    revalidatePath(`/activities/${id}/edit`);
  }
  revalidateMediaLibraryCache();
}

export async function createContentActivityAction(formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const parsed = contentActivityFormSchema.safeParse(
    parseContentActivityForm(formData),
  );

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid activity data",
    };
  }

  const author = await getCurrentArticleAuthor();
  if (!author) {
    return {
      success: false as const,
      error: "You must be signed in to save activities.",
    };
  }

  try {
    const item = await createContentActivity(
      brand.brandId,
      {
        ...contentActivityFormToInput(parsed.data),
        authorName: author.name,
      },
      { authorId: author.id },
    );
    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "content_activity",
      entityId: item.id,
      action: parsed.data.status === "published" ? "published" : "created",
      actor: access.user,
      entityTitle: item.title,
      href: `/activities/${item.id}/edit`,
    });
    revalidateContentActivityPaths(item.id);
    redirect(`/activities/${item.id}/edit`);
  } catch (error) {
    return toActionError(error, "Failed to save activity");
  }
}

export async function updateContentActivityAction(
  id: string,
  formData: FormData,
) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const parsed = contentActivityFormSchema.safeParse(
    parseContentActivityForm(formData),
  );

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid activity data",
    };
  }

  const author = await getCurrentArticleAuthor();
  if (!author) {
    return {
      success: false as const,
      error: "You must be signed in to save activities.",
    };
  }

  const current = await getContentActivityById(brand.brandId, id);
  if (!current) {
    return {
      success: false as const,
      error: "Activity not found",
    };
  }

  try {
    await updateContentActivity(
      brand.brandId,
      id,
      {
        ...contentActivityFormToInput(parsed.data),
        authorName: author.name,
      },
      { authorId: author.id },
    );

    const action =
      parsed.data.status === "published" && current.status !== "published"
        ? "published"
        : "updated";

    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "content_activity",
      entityId: id,
      action,
      actor: access.user,
      entityTitle: parsed.data.title.trim() || current.title,
      href: `/activities/${id}/edit`,
    });
    revalidateContentActivityPaths(id);
    return { success: true as const };
  } catch (error) {
    return toActionError(error, "Failed to update activity");
  }
}

export async function setContentActivityStatusAction(
  id: string,
  status: "draft" | "published" | "archived",
) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  try {
    const current = await getContentActivityById(brand.brandId, id);
    if (!current) {
      return { success: false as const, error: "Activity not found" };
    }

    await updateContentActivityStatus(brand.brandId, id, status);

    const action =
      status === "published" && current.status !== "published"
        ? "published"
        : "updated";

    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "content_activity",
      entityId: id,
      action,
      actor: access.user,
      entityTitle: current.title,
      href: `/activities/${id}/edit`,
    });
    revalidateContentActivityPaths(id);
    return { success: true as const };
  } catch (error) {
    return toActionError(error, "Failed to update activity status");
  }
}

export async function deleteContentActivityAction(id: string) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  try {
    const current = await getContentActivityById(brand.brandId, id);
    await deleteContentActivity(brand.brandId, id);
    if (current) {
      await recordActivityEvent({
        brandId: brand.brandId,
        entityType: "content_activity",
        entityId: id,
        action: "deleted",
        actor: access.user,
        entityTitle: current.title,
      });
    }
    revalidateContentActivityPaths();
    redirect("/activities");
  } catch (error) {
    return toActionError(error, "Failed to delete activity");
  }
}
