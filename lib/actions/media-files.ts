"use server";

import { revalidatePath } from "next/cache";
import {
  createMediaLibraryFiles,
  deleteMediaLibraryFile,
  deleteMediaLibraryFiles,
  moveMediaLibraryFiles,
  updateMediaLibraryFile,
} from "@/lib/db/media-files";
import {
  mediaLibraryFileMoveSchema,
  mediaLibraryFileIdsSchema,
  mediaLibraryFileRenameSchema,
  parseMediaLibraryFileRenameForm,
} from "@/lib/validations/media-file";
import {
  normalizeUploadBatch,
  readMediaUploadFile,
  validateMediaUploadFile,
} from "@/lib/media/upload";

function revalidateMediaLibrary() {
  revalidatePath("/media");
}

export async function uploadMediaLibraryFilesAction(
  folderId: string,
  formData: FormData,
) {
  const entries = formData.getAll("files");
  const files = entries.filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return {
      success: false as const,
      error: "No files selected",
    };
  }

  const batch = normalizeUploadBatch(files);

  try {
    const uploads = [];

    for (const file of batch) {
      const validationError = validateMediaUploadFile(file);
      if (validationError) {
        return { success: false as const, error: validationError };
      }

      uploads.push(await readMediaUploadFile(file));
    }

    const created = await createMediaLibraryFiles(folderId, uploads);
    revalidateMediaLibrary();
    return { success: true as const, files: created };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to upload files",
    };
  }
}

export async function deleteMediaLibraryFileAction(id: string) {
  try {
    await deleteMediaLibraryFile(id);
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
  const parsed = mediaLibraryFileIdsSchema.safeParse(ids);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid file selection",
    };
  }

  try {
    const removedCount = await deleteMediaLibraryFiles(parsed.data);
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
    revalidateMediaLibrary();
    return { success: true as const, movedCount };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to move files",
    };
  }
}

export async function renameMediaLibraryFileAction(id: string, formData: FormData) {
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
    revalidateMediaLibrary();
    return { success: true as const, file };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to rename file",
    };
  }
}
