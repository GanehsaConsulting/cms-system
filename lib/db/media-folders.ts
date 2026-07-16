import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { deleteMediaLibraryFilesInFolders } from "@/lib/db/media-files";
import { mediaFolders } from "@/lib/db/schema";
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

function rowToFolder(row: typeof mediaFolders.$inferSelect): MediaFolder {
  return {
    id: row.id,
    name: row.name,
    parentId: row.parentId,
    depth: row.depth,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getMediaFolders(): Promise<MediaFolder[]> {
  const rows = await db
    .select()
    .from(mediaFolders)
    .orderBy(asc(mediaFolders.name));
  return rows.map(rowToFolder);
}

export async function getMediaFolderById(
  id: string,
): Promise<MediaFolder | null> {
  const rows = await db
    .select()
    .from(mediaFolders)
    .where(eq(mediaFolders.id, id))
    .limit(1);
  return rows[0] ? rowToFolder(rows[0]) : null;
}

export async function createMediaFolder(input: {
  name: string;
  parentId: string | null;
}): Promise<MediaFolder> {
  const parsed = mediaFolderFormSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid folder data");
  }

  const folders = await getMediaFolders();
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

  const now = new Date();
  const [row] = await db
    .insert(mediaFolders)
    .values({
      id: crypto.randomUUID(),
      name: parsed.data.name.trim(),
      parentId: parsed.data.parentId,
      depth: getNextFolderDepth(parent),
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return rowToFolder(row);
}

export async function updateMediaFolder(
  id: string,
  input: { name: string },
): Promise<MediaFolder> {
  const parsed = mediaFolderFormSchema.pick({ name: true }).safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid folder data");
  }

  const folders = await getMediaFolders();
  const current = getFolderById(folders, id);
  if (!current) {
    throw new Error("Folder not found");
  }

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

  const [row] = await db
    .update(mediaFolders)
    .set({
      name: parsed.data.name.trim(),
      updatedAt: new Date(),
    })
    .where(eq(mediaFolders.id, id))
    .returning();

  return rowToFolder(row);
}

export async function deleteMediaFolder(id: string): Promise<void> {
  const folders = await getMediaFolders();
  const folder = getFolderById(folders, id);

  if (!folder) {
    throw new Error("Folder not found");
  }

  const idsToDelete = [id, ...getDescendantFolderIds(folders, id)];
  await deleteMediaLibraryFilesInFolders(idsToDelete);
  await db.delete(mediaFolders).where(inArray(mediaFolders.id, idsToDelete));
}

export async function moveMediaFolders(
  ids: string[],
  targetParentId: string | null,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const folders = await getMediaFolders();
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

  const now = new Date();
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
    const affectedIds = [
      folderId,
      ...getDescendantFolderIds(folders, folderId),
    ];

    for (const affectedId of affectedIds) {
      const current = folderMap.get(affectedId);
      if (!current) {
        continue;
      }

      folderMap.set(affectedId, {
        ...current,
        parentId: affectedId === folderId ? targetParentId : current.parentId,
        depth: current.depth + depthDelta,
        updatedAt: now.toISOString(),
      });
    }

    movedCount += 1;
  }

  if (movedCount === 0) {
    return 0;
  }

  for (const folder of folderMap.values()) {
    await db
      .update(mediaFolders)
      .set({
        parentId: folder.parentId,
        depth: folder.depth,
        updatedAt: new Date(folder.updatedAt),
      })
      .where(eq(mediaFolders.id, folder.id));
  }

  return movedCount;
}
