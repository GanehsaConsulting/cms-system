"use server";

import { revalidatePath } from "next/cache";
import {
  createMediaFolder,
  deleteMediaFolder,
  moveMediaFolders,
  updateMediaFolder,
} from "@/lib/db/media-folders";
import {
  parseMediaFolderForm,
  mediaFolderFormSchema,
  mediaFolderMoveSchema,
} from "@/lib/validations/media-folder";

function revalidateMediaLibrary() {
  revalidatePath("/media");
}

export async function createMediaFolderAction(formData: FormData) {
  const parsed = mediaFolderFormSchema.safeParse(parseMediaFolderForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid folder data",
    };
  }

  try {
    const folder = await createMediaFolder(parsed.data);
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
  try {
    await deleteMediaFolder(id);
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
