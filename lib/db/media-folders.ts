import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { deleteMediaLibraryFilesInFolders } from "@/lib/db/media-files";
import {
  canCreateChildFolder,
  canMoveFolderTo,
  getDescendantFolderIds,
  getFolderById,
  getNextFolderDepth,
  getRootSelectedFolderIds,
  isFolderNameUniqueAmongSiblings,
} from "@/lib/media/folders";
import {
  getMaxFolderDepthError,
  mediaFolderFormSchema,
} from "@/lib/validations/media-folder";
import type { MediaFolder } from "@/types/media";

const FOLDERS_PATH = path.join(process.cwd(), "data/media-folders.json");

async function readFolders(): Promise<MediaFolder[]> {
  try {
    const raw = await readFile(FOLDERS_PATH, "utf-8");
    return JSON.parse(raw) as MediaFolder[];
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }
    throw error;
  }
}

async function writeFolders(folders: MediaFolder[]): Promise<void> {
  await writeFile(FOLDERS_PATH, `${JSON.stringify(folders, null, 2)}\n`, "utf-8");
}

export async function getMediaFolders(): Promise<MediaFolder[]> {
  return readFolders();
}

export async function getMediaFolderById(id: string): Promise<MediaFolder | null> {
  const folders = await readFolders();
  return getFolderById(folders, id);
}

export async function createMediaFolder(input: {
  name: string;
  parentId: string | null;
}): Promise<MediaFolder> {
  const parsed = mediaFolderFormSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid folder data");
  }

  const folders = await readFolders();
  const parent = parsed.data.parentId
    ? getFolderById(folders, parsed.data.parentId)
    : null;

  if (parsed.data.parentId && !parent) {
    throw new Error("Parent folder not found");
  }

  if (!canCreateChildFolder(parent)) {
    throw new Error(getMaxFolderDepthError());
  }

  if (
    !isFolderNameUniqueAmongSiblings(
      folders,
      parsed.data.name,
      parsed.data.parentId,
    )
  ) {
    throw new Error("A folder with this name already exists here");
  }

  const now = new Date().toISOString();
  const folder: MediaFolder = {
    id: crypto.randomUUID(),
    name: parsed.data.name.trim(),
    parentId: parsed.data.parentId,
    depth: getNextFolderDepth(parent),
    createdAt: now,
    updatedAt: now,
  };

  folders.push(folder);
  await writeFolders(folders);
  return folder;
}

export async function updateMediaFolder(
  id: string,
  input: { name: string },
): Promise<MediaFolder> {
  const parsed = mediaFolderFormSchema.pick({ name: true }).safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid folder data");
  }

  const folders = await readFolders();
  const index = folders.findIndex((folder) => folder.id === id);

  if (index === -1) {
    throw new Error("Folder not found");
  }

  const current = folders[index];

  if (
    !isFolderNameUniqueAmongSiblings(
      folders,
      parsed.data.name,
      current.parentId,
      id,
    )
  ) {
    throw new Error("A folder with this name already exists here");
  }

  const updated: MediaFolder = {
    ...current,
    name: parsed.data.name.trim(),
    updatedAt: new Date().toISOString(),
  };

  folders[index] = updated;
  await writeFolders(folders);
  return updated;
}

export async function deleteMediaFolder(id: string): Promise<void> {
  const folders = await readFolders();
  const folder = getFolderById(folders, id);

  if (!folder) {
    throw new Error("Folder not found");
  }

  const idsToDelete = [id, ...getDescendantFolderIds(folders, id)];

  await deleteMediaLibraryFilesInFolders(idsToDelete);
  await writeFolders(folders.filter((item) => !idsToDelete.includes(item.id)));
}

export async function moveMediaFolders(
  ids: string[],
  targetParentId: string | null,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const folders = await readFolders();
  const rootIds = getRootSelectedFolderIds(folders, ids);

  if (rootIds.length === 0) {
    throw new Error("No folders found");
  }

  if (targetParentId) {
    const target = getFolderById(folders, targetParentId);
    if (!target) {
      throw new Error("Destination folder not found");
    }
  }

  const now = new Date().toISOString();
  const folderMap = new Map(folders.map((folder) => [folder.id, folder]));
  let movedCount = 0;

  for (const folderId of rootIds) {
    const folder = folderMap.get(folderId);
    if (!folder) {
      throw new Error("Folder not found");
    }

    if (folder.parentId === targetParentId) {
      continue;
    }

    const validation = canMoveFolderTo(folders, folderId, targetParentId);
    if (!validation.ok) {
      throw new Error(validation.error);
    }

    for (const otherId of rootIds) {
      if (otherId === folderId) {
        continue;
      }

      const other = folderMap.get(otherId);
      if (
        other &&
        other.parentId !== targetParentId &&
        other.name.trim().toLowerCase() === folder.name.trim().toLowerCase()
      ) {
        throw new Error(
          `Cannot move multiple folders named "${folder.name}" into the same destination`,
        );
      }
    }

    const nextDepth = getNextFolderDepth(
      targetParentId ? (folderMap.get(targetParentId) ?? null) : null,
    );
    const depthDelta = nextDepth - folder.depth;
    const affectedIds = [folderId, ...getDescendantFolderIds(folders, folderId)];

    for (const affectedId of affectedIds) {
      const current = folderMap.get(affectedId);
      if (!current) {
        continue;
      }

      const updated: MediaFolder = {
        ...current,
        parentId: affectedId === folderId ? targetParentId : current.parentId,
        depth: current.depth + depthDelta,
        updatedAt: now,
      };

      folderMap.set(affectedId, updated);
    }

    movedCount += 1;
  }

  if (movedCount === 0) {
    return 0;
  }

  await writeFolders([...folderMap.values()]);
  return movedCount;
}
