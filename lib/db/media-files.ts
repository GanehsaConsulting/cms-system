import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getFolderById } from "@/lib/media/folders";
import { getMediaFolders } from "@/lib/db/media-folders";
import type { MediaKind, MediaLibraryFile } from "@/types/media";

const DATA_PATH = path.join(process.cwd(), "data/media-files.json");

async function readFiles(): Promise<MediaLibraryFile[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as MediaLibraryFile[];
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

async function writeFiles(files: MediaLibraryFile[]): Promise<void> {
  await writeFile(DATA_PATH, `${JSON.stringify(files, null, 2)}\n`, "utf-8");
}

export async function getMediaLibraryFiles(): Promise<MediaLibraryFile[]> {
  const files = await readFiles();
  return files.sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

export async function getMediaLibraryFilesByFolderId(
  folderId: string,
): Promise<MediaLibraryFile[]> {
  const files = await getMediaLibraryFiles();
  return files.filter((file) => file.folderId === folderId);
}

export async function getMediaLibraryFileById(
  id: string,
): Promise<MediaLibraryFile | null> {
  const files = await readFiles();
  return files.find((file) => file.id === id) ?? null;
}

function isFilenameUniqueInFolder(
  files: MediaLibraryFile[],
  folderId: string,
  filename: string,
  excludeId?: string,
): boolean {
  const normalized = filename.trim().toLowerCase();
  return !files.some(
    (file) =>
      file.folderId === folderId &&
      file.id !== excludeId &&
      file.filename.trim().toLowerCase() === normalized,
  );
}

export async function updateMediaLibraryFile(
  id: string,
  input: { filename: string },
): Promise<MediaLibraryFile> {
  const files = await readFiles();
  const index = files.findIndex((file) => file.id === id);

  if (index === -1) {
    throw new Error("File not found");
  }

  const filename = input.filename.trim();
  const current = files[index];

  if (
    !isFilenameUniqueInFolder(files, current.folderId, filename, id)
  ) {
    throw new Error("A file with this name already exists in this folder");
  }

  const updated: MediaLibraryFile = {
    ...current,
    filename,
    updatedAt: new Date().toISOString(),
  };

  files[index] = updated;
  await writeFiles(files);
  return updated;
}

export async function createMediaLibraryFiles(
  folderId: string,
  uploads: {
    url: string;
    filename: string;
    mimeType: string;
    kind: MediaKind;
    sizeBytes: number;
  }[],
): Promise<MediaLibraryFile[]> {
  const folders = await getMediaFolders();
  const folder = getFolderById(folders, folderId);

  if (!folder) {
    throw new Error("Folder not found");
  }

  if (uploads.length === 0) {
    throw new Error("No files to upload");
  }

  const files = await readFiles();
  const now = new Date().toISOString();
  const created = uploads.map((upload) => ({
    id: crypto.randomUUID(),
    folderId,
    url: upload.url,
    filename: upload.filename,
    mimeType: upload.mimeType,
    kind: upload.kind,
    sizeBytes: upload.sizeBytes,
    uploadedAt: now,
    updatedAt: now,
  }));

  files.push(...created);
  await writeFiles(files);
  return created;
}

export async function deleteMediaLibraryFile(id: string): Promise<void> {
  await deleteMediaLibraryFiles([id]);
}

export async function deleteMediaLibraryFiles(ids: string[]): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const idSet = new Set(ids);
  const files = await readFiles();
  const next = files.filter((file) => !idSet.has(file.id));
  const removedCount = files.length - next.length;

  if (removedCount === 0) {
    throw new Error("No files found");
  }

  await writeFiles(next);
  return removedCount;
}

export async function moveMediaLibraryFiles(
  ids: string[],
  targetFolderId: string,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const folders = await getMediaFolders();
  const targetFolder = getFolderById(folders, targetFolderId);

  if (!targetFolder) {
    throw new Error("Folder not found");
  }

  const files = await readFiles();
  const idSet = new Set(ids);
  const toMove = files.filter((file) => idSet.has(file.id));

  if (toMove.length === 0) {
    throw new Error("No files found");
  }

  for (const file of toMove) {
    if (file.folderId === targetFolderId) {
      continue;
    }

    if (
      !isFilenameUniqueInFolder(files, targetFolderId, file.filename, file.id)
    ) {
      throw new Error(
        `A file named "${file.filename}" already exists in the destination folder`,
      );
    }
  }

  const now = new Date().toISOString();
  const next = files.map((file) => {
    if (!idSet.has(file.id) || file.folderId === targetFolderId) {
      return file;
    }

    return {
      ...file,
      folderId: targetFolderId,
      updatedAt: now,
    };
  });

  await writeFiles(next);
  return toMove.filter((file) => file.folderId !== targetFolderId).length;
}

export async function deleteMediaLibraryFilesInFolders(
  folderIds: string[],
): Promise<number> {
  if (folderIds.length === 0) {
    return 0;
  }

  const files = await readFiles();
  const idSet = new Set(folderIds);
  const next = files.filter((file) => !idSet.has(file.folderId));
  const removedCount = files.length - next.length;

  if (removedCount > 0) {
    await writeFiles(next);
  }

  return removedCount;
}
