import { and, asc, eq, inArray, isNotNull, isNull, or, SQL } from "drizzle-orm";
import { db } from "@/lib/db/client";
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
  buildMediaScopeContext,
  isMediaLibraryScope,
  mediaScopeMatches,
  type MediaScopeContext,
} from "@/lib/media/scope";
import {
  getMaxFolderDepthError,
  mediaFolderFormSchema,
} from "@/lib/validations/media-folder";
import type { MediaFolder, MediaLibraryScope } from "@/types/media";

function rowToFolder(row: typeof mediaFolders.$inferSelect): MediaFolder {
  const scope = isMediaLibraryScope(row.scope) ? row.scope : "shared";
  return {
    id: row.id,
    name: row.name,
    parentId: row.parentId,
    depth: row.depth,
    scope,
    brandId: row.brandId,
    ownerUserId: row.ownerUserId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    deletedAt: row.deletedAt ? row.deletedAt.toISOString() : null,
  };
}

function scopeWhere(context: MediaScopeContext): SQL {
  if (context.scope === "shared") {
    return and(
      eq(mediaFolders.scope, "shared"),
      isNull(mediaFolders.brandId),
      isNull(mediaFolders.ownerUserId),
    )!;
  }

  if (context.scope === "brand") {
    return and(
      eq(mediaFolders.scope, "brand"),
      eq(mediaFolders.brandId, context.brandId!),
      isNull(mediaFolders.ownerUserId),
    )!;
  }

  return and(
    eq(mediaFolders.scope, "personal"),
    eq(mediaFolders.ownerUserId, context.ownerUserId!),
    isNull(mediaFolders.brandId),
  )!;
}

function activeScopeWhere(context: MediaScopeContext): SQL {
  return and(scopeWhere(context), isNull(mediaFolders.deletedAt))!;
}

function trashVisibilityWhere(input: {
  brandId: string | null;
  ownerUserId: string | null;
}): SQL {
  const visibility: SQL[] = [
    and(
      eq(mediaFolders.scope, "shared"),
      isNull(mediaFolders.brandId),
      isNull(mediaFolders.ownerUserId),
    )!,
  ];

  if (input.brandId) {
    visibility.push(
      and(
        eq(mediaFolders.scope, "brand"),
        eq(mediaFolders.brandId, input.brandId),
      )!,
    );
  }

  if (input.ownerUserId) {
    visibility.push(
      and(
        eq(mediaFolders.scope, "personal"),
        eq(mediaFolders.ownerUserId, input.ownerUserId),
      )!,
    );
  }

  return and(isNotNull(mediaFolders.deletedAt), or(...visibility))!;
}

export async function getMediaFolders(
  context?: MediaScopeContext,
): Promise<MediaFolder[]> {
  const rows = context
    ? await db
        .select()
        .from(mediaFolders)
        .where(activeScopeWhere(context))
        .orderBy(asc(mediaFolders.name))
    : await db
        .select()
        .from(mediaFolders)
        .where(isNull(mediaFolders.deletedAt))
        .orderBy(asc(mediaFolders.name));

  return rows.map(rowToFolder);
}

export async function getTrashedMediaFolders(input: {
  brandId: string | null;
  ownerUserId: string | null;
}): Promise<MediaFolder[]> {
  const rows = await db
    .select()
    .from(mediaFolders)
    .where(trashVisibilityWhere(input))
    .orderBy(asc(mediaFolders.name));

  return rows.map(rowToFolder);
}

export async function getMediaFolderById(
  id: string,
  options?: { includeDeleted?: boolean },
): Promise<MediaFolder | null> {
  const rows = await db
    .select()
    .from(mediaFolders)
    .where(
      options?.includeDeleted
        ? eq(mediaFolders.id, id)
        : and(eq(mediaFolders.id, id), isNull(mediaFolders.deletedAt)),
    )
    .limit(1);
  return rows[0] ? rowToFolder(rows[0]) : null;
}

export async function createMediaFolder(input: {
  name: string;
  parentId: string | null;
  scope: MediaLibraryScope;
  brandId?: string | null;
  ownerUserId?: string | null;
}): Promise<MediaFolder> {
  const parsed = mediaFolderFormSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid folder data");
  }

  let scopeContext = buildMediaScopeContext({
    scope: input.scope,
    brandId: input.brandId,
    ownerUserId: input.ownerUserId,
  });

  if (parsed.data.parentId) {
    const parent = await getMediaFolderById(parsed.data.parentId);
    if (!parent) {
      throw new Error("Parent folder not found");
    }
    scopeContext = {
      scope: parent.scope,
      brandId: parent.brandId,
      ownerUserId: parent.ownerUserId,
    };
  }

  const folders = await getMediaFolders(scopeContext);
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
      scope: scopeContext.scope,
      brandId: scopeContext.brandId,
      ownerUserId: scopeContext.ownerUserId,
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

  const current = await getMediaFolderById(id);
  if (!current) {
    throw new Error("Folder not found");
  }

  const folders = await getMediaFolders({
    scope: current.scope,
    brandId: current.brandId,
    ownerUserId: current.ownerUserId,
  });

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
    .where(and(eq(mediaFolders.id, id), isNull(mediaFolders.deletedAt)))
    .returning();

  return rowToFolder(row);
}

/** Soft-delete folder + descendants + files inside. */
export async function softDeleteMediaFolder(id: string): Promise<void> {
  const folder = await getMediaFolderById(id);
  if (!folder) {
    throw new Error("Folder not found");
  }

  const folders = await getMediaFolders({
    scope: folder.scope,
    brandId: folder.brandId,
    ownerUserId: folder.ownerUserId,
  });

  const idsToDelete = [id, ...getDescendantFolderIds(folders, id)];
  const now = new Date();

  const { softDeleteMediaLibraryFilesInFolders } = await import(
    "@/lib/db/media-files"
  );
  await softDeleteMediaLibraryFilesInFolders(idsToDelete);
  await db
    .update(mediaFolders)
    .set({ deletedAt: now, updatedAt: now })
    .where(
      and(
        inArray(mediaFolders.id, idsToDelete),
        isNull(mediaFolders.deletedAt),
      ),
    );
}

export async function restoreMediaFolder(id: string): Promise<void> {
  const folder = await getMediaFolderById(id, { includeDeleted: true });
  if (!folder?.deletedAt) {
    throw new Error("Folder not found in Trash");
  }

  if (folder.parentId) {
    const parent = await getMediaFolderById(folder.parentId, {
      includeDeleted: true,
    });
    if (parent?.deletedAt) {
      await restoreMediaFolder(parent.id);
    }
  }

  const now = new Date();

  const allFolders = await db
    .select()
    .from(mediaFolders)
    .where(
      and(
        eq(mediaFolders.scope, folder.scope),
        folder.brandId
          ? eq(mediaFolders.brandId, folder.brandId)
          : isNull(mediaFolders.brandId),
        folder.ownerUserId
          ? eq(mediaFolders.ownerUserId, folder.ownerUserId)
          : isNull(mediaFolders.ownerUserId),
      ),
    );

  const folderList = allFolders.map(rowToFolder);
  const descendantIds = getDescendantFolderIds(folderList, id);
  const idsToRestore = [id, ...descendantIds];

  await db
    .update(mediaFolders)
    .set({ deletedAt: null, updatedAt: now })
    .where(
      and(
        inArray(mediaFolders.id, idsToRestore),
        isNotNull(mediaFolders.deletedAt),
      ),
    );

  const { restoreMediaLibraryFilesInFolders } = await import(
    "@/lib/db/media-files"
  );
  await restoreMediaLibraryFilesInFolders(idsToRestore);
}

export async function purgeMediaFolder(id: string): Promise<void> {
  const folder = await getMediaFolderById(id, { includeDeleted: true });
  if (!folder?.deletedAt) {
    throw new Error("Folder not found in Trash");
  }

  const allFolders = await db
    .select()
    .from(mediaFolders)
    .where(
      and(
        eq(mediaFolders.scope, folder.scope),
        folder.brandId
          ? eq(mediaFolders.brandId, folder.brandId)
          : isNull(mediaFolders.brandId),
        folder.ownerUserId
          ? eq(mediaFolders.ownerUserId, folder.ownerUserId)
          : isNull(mediaFolders.ownerUserId),
        isNotNull(mediaFolders.deletedAt),
      ),
    );

  const folderList = allFolders.map(rowToFolder);
  const descendantIds = getDescendantFolderIds(folderList, id).filter((fid) =>
    folderList.some((f) => f.id === fid && f.deletedAt),
  );
  const idsToDelete = [id, ...descendantIds];

  const { purgeMediaLibraryFilesInFolders } = await import(
    "@/lib/db/media-files"
  );
  await purgeMediaLibraryFilesInFolders(idsToDelete);
  await db.delete(mediaFolders).where(inArray(mediaFolders.id, idsToDelete));
}

/** Soft-delete for CMS — hard delete only via purge from Trash. */
export async function deleteMediaFolder(id: string): Promise<void> {
  await softDeleteMediaFolder(id);
}

export async function purgeAllTrashedMediaFolders(input: {
  brandId: string | null;
  ownerUserId: string | null;
}): Promise<number> {
  const folders = await getTrashedMediaFolders(input);
  const trashedIds = new Set(folders.map((f) => f.id));
  const roots = folders.filter(
    (f) => !f.parentId || !trashedIds.has(f.parentId),
  );

  let count = 0;
  for (const folder of roots) {
    await purgeMediaFolder(folder.id);
    count += 1;
  }
  return count;
}

export async function moveMediaFolders(
  ids: string[],
  targetParentId: string | null,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const first = await getMediaFolderById(ids[0]!);
  if (!first) {
    throw new Error("No folders found");
  }

  const scopeContext: MediaScopeContext = {
    scope: first.scope,
    brandId: first.brandId,
    ownerUserId: first.ownerUserId,
  };

  const folders = await getMediaFolders(scopeContext);
  const rootIds = getRootSelectedFolderIds(folders, ids);

  if (rootIds.length === 0) {
    throw new Error("No folders found");
  }

  for (const folderId of rootIds) {
    const folder = getFolderById(folders, folderId);
    if (!folder || !mediaScopeMatches(folder, scopeContext)) {
      throw new Error("Folders must stay within the same library scope");
    }
  }

  if (targetParentId) {
    const target = getFolderById(folders, targetParentId);
    if (!target) {
      throw new Error("Destination folder not found");
    }
    if (!mediaScopeMatches(target, scopeContext)) {
      throw new Error("Cannot move folders across library scopes");
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
