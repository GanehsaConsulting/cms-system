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
import { assertCanAccessMediaScope } from "@/lib/media/scope";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import {
  mediaFolderFormSchema,
  mediaFolderMoveSchema,
  parseMediaFolderForm,
} from "@/lib/validations/media-folder";

function revalidateMediaLibrary() {
  revalidatePath("/media");
}

async function resolveActiveBrandId(): Promise<string | null> {
  const brand = await requireCmsActiveBrandId();
  return brand.ok ? brand.brandId : null;
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
    const activeBrandId = await resolveActiveBrandId();
    const folder = await createMediaFolder({
      ...parsed.data,
      brandId: parsed.data.scope === "brand" ? activeBrandId : null,
      ownerUserId: parsed.data.scope === "personal" ? access.user.id : null,
    });
    if (activeBrandId) {
      await recordActivityEvent({
        brandId: activeBrandId,
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
    const current = await getMediaFolderById(id);
    if (!current) {
      throw new Error("Folder not found");
    }
    const activeBrandId = await resolveActiveBrandId();
    assertCanAccessMediaScope(current, access.user, activeBrandId);

    const folder = await updateMediaFolder(id, parsed.data);
    if (activeBrandId) {
      await recordActivityEvent({
        brandId: activeBrandId,
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
    if (!current) {
      throw new Error("Folder not found");
    }
    const activeBrandId = await resolveActiveBrandId();
    assertCanAccessMediaScope(current, access.user, activeBrandId);

    await deleteMediaFolder(id);
    if (activeBrandId) {
      await recordActivityEvent({
        brandId: activeBrandId,
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
    const activeBrandId = await resolveActiveBrandId();
    for (const folderId of parsed.data.folderIds) {
      const folder = await getMediaFolderById(folderId);
      if (!folder) {
        throw new Error("Folder not found");
      }
      assertCanAccessMediaScope(folder, access.user, activeBrandId);
    }

    if (parsed.data.targetParentId) {
      const target = await getMediaFolderById(parsed.data.targetParentId);
      if (!target) {
        throw new Error("Destination folder not found");
      }
      assertCanAccessMediaScope(target, access.user, activeBrandId);
    }

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
