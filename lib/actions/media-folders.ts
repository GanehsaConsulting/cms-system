"use server";

import { revalidatePath } from "next/cache";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import { recordActivityEvent } from "@/lib/activity/record";
import {
  createMediaFolder,
  deleteMediaFolder,
  getMediaFolderById,
  moveMediaFolders,
  updateMediaFolder,
} from "@/lib/db/media-folders";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import {
  mediaFolderFormSchema,
  mediaFolderMoveSchema,
  parseMediaFolderForm,
} from "@/lib/validations/media-folder";

function revalidateMediaLibrary() {
  revalidatePath("/media");
}

export async function createMediaFolderAction(formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = mediaFolderFormSchema.safeParse(
    parseMediaFolderForm(formData),
  );

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid folder data",
    };
  }

  try {
    const folder = await createMediaFolder(parsed.data);
    const brand = await requireCmsActiveBrandId();
    if (brand.ok) {
      await recordActivityEvent({
        brandId: brand.brandId,
        entityType: "media",
        entityId: folder.id,
        action: "created",
        actor: access.user,
        entityTitle: folder.name,
        href: "/media",
      });
    }
    revalidateMediaLibrary();
    return { success: true as const, folder };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to create folder",
    };
  }
}

export async function updateMediaFolderAction(id: string, formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = mediaFolderFormSchema.pick({ name: true }).safeParse({
    name: String(formData.get("name") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid folder data",
    };
  }

  try {
    const folder = await updateMediaFolder(id, parsed.data);
    const brand = await requireCmsActiveBrandId();
    if (brand.ok) {
      await recordActivityEvent({
        brandId: brand.brandId,
        entityType: "media",
        entityId: id,
        action: "updated",
        actor: access.user,
        entityTitle: folder.name,
        href: "/media",
      });
    }
    revalidateMediaLibrary();
    return { success: true as const, folder };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to rename folder",
    };
  }
}

export async function deleteMediaFolderAction(id: string) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  try {
    const current = await getMediaFolderById(id);
    await deleteMediaFolder(id);
    const brand = await requireCmsActiveBrandId();
    if (brand.ok && current) {
      await recordActivityEvent({
        brandId: brand.brandId,
        entityType: "media",
        entityId: id,
        action: "deleted",
        actor: access.user,
        entityTitle: current.name,
        href: "/media",
      });
    }
    revalidateMediaLibrary();
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to delete folder",
    };
  }
}

export async function moveMediaFoldersAction(
  folderIds: string[],
  targetParentId: string | null,
) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = mediaFolderMoveSchema.safeParse({
    folderIds,
    targetParentId,
  });

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid move request",
    };
  }

  try {
    const movedCount = await moveMediaFolders(
      parsed.data.folderIds,
      parsed.data.targetParentId,
    );
    revalidateMediaLibrary();
    return { success: true as const, movedCount };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to move folders",
    };
  }
}
