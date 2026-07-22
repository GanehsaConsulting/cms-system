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
import { getMediaFolders } from "@/lib/db/media-folders";
import { getFolderById } from "@/lib/media/folders";
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

async function assertMediaFolderExists(folderId: string) {
  const folders = await getMediaFolders();
  if (!getFolderById(folders, folderId)) {
    throw new Error("Folder not found");
  }
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
    await assertMediaFolderExists(folderId);
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
    const created = await createMediaLibraryFiles(folderId, batch);
    const brand = await requireCmsActiveBrandId();
    if (brand.ok) {
      const label =
        created.length === 1
          ? created[0]?.filename ?? "File"
          : `${created.length} files`;
      await recordActivityEvent({
        brandId: brand.brandId,
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
    await deleteMediaLibraryFile(id);
    const brand = await requireCmsActiveBrandId();
    if (brand.ok && current) {
      await recordActivityEvent({
        brandId: brand.brandId,
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
    const removedCount = await deleteMediaLibraryFiles(parsed.data);
    const brand = await requireCmsActiveBrandId();
    if (brand.ok && removedCount > 0) {
      await recordActivityEvent({
        brandId: brand.brandId,
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
    const movedCount = await moveMediaLibraryFiles(
      parsed.data.fileIds,
      parsed.data.targetFolderId,
    );
    const brand = await requireCmsActiveBrandId();
    if (brand.ok && movedCount > 0) {
      await recordActivityEvent({
        brandId: brand.brandId,
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
    const file = await updateMediaLibraryFile(id, parsed.data);
    const brand = await requireCmsActiveBrandId();
    if (brand.ok) {
      await recordActivityEvent({
        brandId: brand.brandId,
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
