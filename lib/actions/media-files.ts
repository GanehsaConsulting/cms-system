"use server";

import { revalidatePath } from "next/cache";
import { createSignedMediaUploadParams } from "@/lib/cloudinary/sign-upload";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import { recordActivityEvent } from "@/lib/activity/record";
import {
  createMediaLibraryFiles,
  deleteMediaLibraryFile,
  deleteMediaLibraryFiles,
  getMediaLibraryFileById,
  moveMediaLibraryFiles,
  updateMediaLibraryFile,
} from "@/lib/db/media-files";
import { getMediaFolderById } from "@/lib/db/media-folders";
import { assertCanAccessMediaScope } from "@/lib/media/scope";
import {
  normalizeUploadBatch,
  validateMediaUploadMeta,
} from "@/lib/media/upload";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import {
  mediaLibraryFileIdsSchema,
  mediaLibraryFileMoveSchema,
  mediaLibraryFileRenameSchema,
  parseMediaLibraryFileRenameForm,
} from "@/lib/validations/media-file";
import {
  mediaCloudinaryUploadBatchSchema,
  mediaUploadMetaBatchSchema,
} from "@/lib/validations/media-upload";

function revalidateMediaLibrary() {
  revalidatePath("/media");
}

async function resolveActiveBrandId(): Promise<string | null> {
  const brand = await requireCmsActiveBrandId();
  return brand.ok ? brand.brandId : null;
}

async function assertMediaFolderAccess(
  folderId: string,
  user: { id: string },
  activeBrandId: string | null,
) {
  const folder = await getMediaFolderById(folderId);
  if (!folder) {
    throw new Error("Folder not found");
  }
  assertCanAccessMediaScope(folder, user, activeBrandId);
  return folder;
}

/** Issue signed Cloudinary upload params after validating file metadata. */
export async function createMediaUploadSignaturesAction(
  folderId: string,
  metas: unknown,
) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = mediaUploadMetaBatchSchema.safeParse(metas);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid upload request",
    };
  }

  const batch = normalizeUploadBatch(parsed.data);

  for (const meta of batch) {
    const validationError = validateMediaUploadMeta(meta);
    if (validationError) {
      return { success: false as const, error: validationError };
    }
  }

  try {
    const activeBrandId = await resolveActiveBrandId();
    await assertMediaFolderAccess(folderId, access.user, activeBrandId);
    const params = createSignedMediaUploadParams(folderId);
    return { success: true as const, params };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to prepare media upload",
    };
  }
}

/** Persist Cloudinary upload results into the media library DB. */
export async function saveMediaLibraryUploadsAction(
  folderId: string,
  uploads: unknown,
) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = mediaCloudinaryUploadBatchSchema.safeParse(uploads);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid upload result",
    };
  }

  const batch = normalizeUploadBatch(parsed.data);
  const expectedFolderPrefix = `cms-system/media/${folderId}`;

  for (const upload of batch) {
    const validationError = validateMediaUploadMeta(upload);
    if (validationError) {
      return { success: false as const, error: validationError };
    }

    if (!upload.publicId.startsWith(expectedFolderPrefix)) {
      return {
        success: false as const,
        error: "Uploaded file is not in the expected Cloudinary folder",
      };
    }

    if (!upload.url.includes("res.cloudinary.com")) {
      return {
        success: false as const,
        error: "Uploaded file URL is not a Cloudinary asset",
      };
    }
  }

  try {
    const activeBrandId = await resolveActiveBrandId();
    await assertMediaFolderAccess(folderId, access.user, activeBrandId);
    const created = await createMediaLibraryFiles(folderId, batch);
    if (activeBrandId) {
      const label =
        created.length === 1
          ? created[0]?.filename ?? "File"
          : `${created.length} files`;
      await recordActivityEvent({
        brandId: activeBrandId,
        entityType: "media",
        entityId: created[0]?.id ?? folderId,
        action: "created",
        actor: access.user,
        entityTitle: label,
        href: "/media",
      });
    }
    revalidateMediaLibrary();
    return { success: true as const, files: created };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to save files",
    };
  }
}

export async function deleteMediaLibraryFileAction(id: string) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  try {
    const current = await getMediaLibraryFileById(id);
    if (!current) {
      throw new Error("File not found");
    }
    const activeBrandId = await resolveActiveBrandId();
    assertCanAccessMediaScope(current, access.user, activeBrandId);

    await deleteMediaLibraryFile(id);
    if (activeBrandId) {
      await recordActivityEvent({
        brandId: activeBrandId,
        entityType: "media",
        entityId: id,
        action: "deleted",
        actor: access.user,
        entityTitle: current.filename,
        href: "/media",
      });
    }
    revalidateMediaLibrary();
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to delete file",
    };
  }
}

export async function deleteMediaLibraryFilesAction(ids: string[]) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = mediaLibraryFileIdsSchema.safeParse(ids);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid file selection",
    };
  }

  try {
    const activeBrandId = await resolveActiveBrandId();
    for (const id of parsed.data) {
      const file = await getMediaLibraryFileById(id);
      if (!file) {
        throw new Error("File not found");
      }
      assertCanAccessMediaScope(file, access.user, activeBrandId);
    }

    const removedCount = await deleteMediaLibraryFiles(parsed.data);
    if (activeBrandId && removedCount > 0) {
      await recordActivityEvent({
        brandId: activeBrandId,
        entityType: "media",
        entityId: parsed.data[0] ?? "batch",
        action: "deleted",
        actor: access.user,
        entityTitle:
          removedCount === 1 ? "1 file" : `${removedCount} files`,
        href: "/media",
      });
    }
    revalidateMediaLibrary();
    return { success: true as const, removedCount };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to delete files",
    };
  }
}

export async function moveMediaLibraryFilesAction(
  fileIds: string[],
  targetFolderId: string,
) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = mediaLibraryFileMoveSchema.safeParse({
    fileIds,
    targetFolderId,
  });

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid move request",
    };
  }

  try {
    const activeBrandId = await resolveActiveBrandId();
    for (const id of parsed.data.fileIds) {
      const file = await getMediaLibraryFileById(id);
      if (!file) {
        throw new Error("File not found");
      }
      assertCanAccessMediaScope(file, access.user, activeBrandId);
    }
    await assertMediaFolderAccess(
      parsed.data.targetFolderId,
      access.user,
      activeBrandId,
    );

    const movedCount = await moveMediaLibraryFiles(
      parsed.data.fileIds,
      parsed.data.targetFolderId,
    );
    if (activeBrandId && movedCount > 0) {
      await recordActivityEvent({
        brandId: activeBrandId,
        entityType: "media",
        entityId: parsed.data.fileIds[0] ?? "batch",
        action: "updated",
        actor: access.user,
        entityTitle:
          movedCount === 1 ? "1 file moved" : `${movedCount} files moved`,
        href: "/media",
      });
    }
    revalidateMediaLibrary();
    return { success: true as const, movedCount };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to move files",
    };
  }
}

export async function renameMediaLibraryFileAction(
  id: string,
  formData: FormData,
) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = mediaLibraryFileRenameSchema.safeParse(
    parseMediaLibraryFileRenameForm(formData),
  );

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid file name",
    };
  }

  try {
    const current = await getMediaLibraryFileById(id);
    if (!current) {
      throw new Error("File not found");
    }
    const activeBrandId = await resolveActiveBrandId();
    assertCanAccessMediaScope(current, access.user, activeBrandId);

    const file = await updateMediaLibraryFile(id, parsed.data);
    if (activeBrandId) {
      await recordActivityEvent({
        brandId: activeBrandId,
        entityType: "media",
        entityId: id,
        action: "updated",
        actor: access.user,
        entityTitle: file.filename,
        href: "/media",
      });
    }
    revalidateMediaLibrary();
    return { success: true as const, file };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to rename file",
    };
  }
}
