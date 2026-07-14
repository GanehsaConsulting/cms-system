import { MEDIA_LIBRARY_MAX_FOLDER_DEPTH } from "@/config/media-library";
import type { MediaFolder } from "@/types/media";

export interface MediaFolderTreeNode extends MediaFolder {
  children: MediaFolderTreeNode[];
}

export function getFolderById(
  folders: MediaFolder[],
  folderId: string,
): MediaFolder | null {
  return folders.find((folder) => folder.id === folderId) ?? null;
}

export function getChildFolders(
  folders: MediaFolder[],
  parentId: string | null,
): MediaFolder[] {
  return folders
    .filter((folder) => folder.parentId === parentId)
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function buildMediaFolderTree(folders: MediaFolder[]): MediaFolderTreeNode[] {
  const nodeMap = new Map<string, MediaFolderTreeNode>();

  for (const folder of folders) {
    nodeMap.set(folder.id, { ...folder, children: [] });
  }

  const roots: MediaFolderTreeNode[] = [];

  for (const folder of folders) {
    const node = nodeMap.get(folder.id);
    if (!node) {
      continue;
    }

    if (folder.parentId) {
      const parent = nodeMap.get(folder.parentId);
      if (parent) {
        parent.children.push(node);
        continue;
      }
    }

    roots.push(node);
  }

  function sortTree(nodes: MediaFolderTreeNode[]): MediaFolderTreeNode[] {
    return nodes
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((node) => ({
        ...node,
        children: sortTree(node.children),
      }));
  }

  return sortTree(roots);
}

export function getFolderPath(
  folders: MediaFolder[],
  folderId: string,
): MediaFolder[] {
  const path: MediaFolder[] = [];
  let current = getFolderById(folders, folderId);

  while (current) {
    path.unshift(current);
    current = current.parentId
      ? getFolderById(folders, current.parentId)
      : null;
  }

  return path;
}

export function isFolderNameUniqueAmongSiblings(
  folders: MediaFolder[],
  name: string,
  parentId: string | null,
  excludeId?: string,
): boolean {
  const normalized = name.trim().toLowerCase();
  return !folders.some(
    (folder) =>
      folder.parentId === parentId &&
      folder.id !== excludeId &&
      folder.name.trim().toLowerCase() === normalized,
  );
}

export function getDescendantFolderIds(
  folders: MediaFolder[],
  folderId: string,
): string[] {
  const descendants: string[] = [];

  function walk(parentId: string) {
    for (const child of getChildFolders(folders, parentId)) {
      descendants.push(child.id);
      walk(child.id);
    }
  }

  walk(folderId);
  return descendants;
}

export function getFolderDeleteImpact(
  folderId: string,
  folders: MediaFolder[],
  files: { folderId: string }[],
) {
  const folder = getFolderById(folders, folderId);
  if (!folder) {
    return {
      folder: null,
      descendantFolders: [] as MediaFolder[],
      fileCount: 0,
    };
  }

  const descendantIds = getDescendantFolderIds(folders, folderId);
  const descendantFolders = descendantIds
    .map((id) => getFolderById(folders, id))
    .filter((item): item is MediaFolder => item !== null)
    .sort(
      (left, right) =>
        left.depth - right.depth || left.name.localeCompare(right.name),
    );

  const folderIds = [folderId, ...descendantIds];
  const fileCount = files.filter((file) =>
    folderIds.includes(file.folderId),
  ).length;

  return {
    folder,
    descendantFolders,
    fileCount,
  };
}

export function getSubtreeMaxDepth(
  folders: MediaFolder[],
  folderId: string,
): number {
  const folder = getFolderById(folders, folderId);
  if (!folder) {
    return 0;
  }

  const children = getChildFolders(folders, folderId);
  if (children.length === 0) {
    return folder.depth;
  }

  return Math.max(
    ...children.map((child) => getSubtreeMaxDepth(folders, child.id)),
  );
}

export function canCreateChildFolder(
  parent: MediaFolder | null,
): boolean {
  const nextDepth = parent ? parent.depth + 1 : 1;
  return nextDepth <= MEDIA_LIBRARY_MAX_FOLDER_DEPTH;
}

export function getNextFolderDepth(parent: MediaFolder | null): number {
  return parent ? parent.depth + 1 : 1;
}

export function getFolderTreeSizeBytes(
  folderId: string,
  folders: MediaFolder[],
  files: { folderId: string; sizeBytes: number }[],
): number {
  const folderIds = [folderId, ...getDescendantFolderIds(folders, folderId)];
  return files
    .filter((file) => folderIds.includes(file.folderId))
    .reduce((total, file) => total + file.sizeBytes, 0);
}

export function filterMediaFoldersBySearch(
  folders: MediaFolder[],
  query: string,
): MediaFolder[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return folders;
  }

  return folders.filter((folder) =>
    folder.name.toLowerCase().includes(normalized),
  );
}

/** Keep only roots when parent + child are both selected. */
export function getRootSelectedFolderIds(
  folders: MediaFolder[],
  selectedIds: string[],
): string[] {
  const selected = new Set(selectedIds);

  return selectedIds.filter((id) => {
    const path = getFolderPath(folders, id);
    return path.slice(0, -1).every((ancestor) => !selected.has(ancestor.id));
  });
}

export function getBlockedMoveFolderIds(
  folders: MediaFolder[],
  folderIds: string[],
): Set<string> {
  const blocked = new Set<string>();

  for (const id of folderIds) {
    blocked.add(id);
    for (const descendantId of getDescendantFolderIds(folders, id)) {
      blocked.add(descendantId);
    }
  }

  return blocked;
}

export function getSubtreeDepthSpan(
  folders: MediaFolder[],
  folderId: string,
): number {
  const folder = getFolderById(folders, folderId);
  if (!folder) {
    return 0;
  }

  return getSubtreeMaxDepth(folders, folderId) - folder.depth;
}

export function canMoveFolderTo(
  folders: MediaFolder[],
  folderId: string,
  targetParentId: string | null,
): { ok: true } | { ok: false; error: string } {
  const folder = getFolderById(folders, folderId);
  if (!folder) {
    return { ok: false, error: "Folder not found" };
  }

  if (folder.parentId === targetParentId) {
    return { ok: true };
  }

  if (targetParentId === folderId) {
    return { ok: false, error: "A folder cannot be moved into itself" };
  }

  const targetParent = targetParentId
    ? getFolderById(folders, targetParentId)
    : null;

  if (targetParentId && !targetParent) {
    return { ok: false, error: "Destination folder not found" };
  }

  const blocked = getBlockedMoveFolderIds(folders, [folderId]);
  if (targetParentId && blocked.has(targetParentId)) {
    return {
      ok: false,
      error: "A folder cannot be moved into one of its subfolders",
    };
  }

  const nextDepth = getNextFolderDepth(targetParent);
  const span = getSubtreeDepthSpan(folders, folderId);

  if (nextDepth + span > MEDIA_LIBRARY_MAX_FOLDER_DEPTH) {
    return {
      ok: false,
      error: `Moving this folder would exceed the maximum depth of ${MEDIA_LIBRARY_MAX_FOLDER_DEPTH} levels.`,
    };
  }

  if (
    !isFolderNameUniqueAmongSiblings(
      folders,
      folder.name,
      targetParentId,
      folderId,
    )
  ) {
    return {
      ok: false,
      error: `A folder named "${folder.name}" already exists in the destination`,
    };
  }

  return { ok: true };
}
