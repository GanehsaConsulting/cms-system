import { and, desc, eq, inArray, ne } from "drizzle-orm";
import {
  resolveImageAsset,
  tryDeleteCloudinaryUrl,
} from "@/lib/cloudinary/assets";
import { db } from "@/lib/db/client";
import { getMediaFolders } from "@/lib/db/media-folders";
import { mediaFiles } from "@/lib/db/schema";
import { getFolderById } from "@/lib/media/folders";
import type { MediaKind, MediaLibraryFile } from "@/types/media";

function rowToFile(row: typeof mediaFiles.$inferSelect): MediaLibraryFile {
  return {
    id: row.id,
    folderId: row.folderId,
    url: row.url,
    filename: row.filename,
    mimeType: row.mimeType,
    kind: row.kind as MediaKind,
    sizeBytes: row.sizeBytes,
    uploadedAt: row.uploadedAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function isFilenameUniqueInFolder(
  folderId: string,
  filename: string,
  excludeId?: string,
): Promise<boolean> {
  const normalized = filename.trim().toLowerCase();
  const rows = await db
    .select({ id: mediaFiles.id, filename: mediaFiles.filename })
    .from(mediaFiles)
    .where(eq(mediaFiles.folderId, folderId));

  return !rows.some(
    (file) =>
      file.id !== excludeId &&
      file.filename.trim().toLowerCase() === normalized,
  );
}

export async function getMediaLibraryFiles(): Promise<MediaLibraryFile[]> {
  const rows = await db
    .select()
    .from(mediaFiles)
    .orderBy(desc(mediaFiles.updatedAt));
  return rows.map(rowToFile);
}

export async function getMediaLibraryFilesByFolderId(
  folderId: string,
): Promise<MediaLibraryFile[]> {
  const rows = await db
    .select()
    .from(mediaFiles)
    .where(eq(mediaFiles.folderId, folderId))
    .orderBy(desc(mediaFiles.updatedAt));
  return rows.map(rowToFile);
}

export async function getMediaLibraryFileById(
  id: string,
): Promise<MediaLibraryFile | null> {
  const rows = await db
    .select()
    .from(mediaFiles)
    .where(eq(mediaFiles.id, id))
    .limit(1);
  return rows[0] ? rowToFile(rows[0]) : null;
}

export async function updateMediaLibraryFile(
  id: string,
  input: { filename: string },
): Promise<MediaLibraryFile> {
  const current = await getMediaLibraryFileById(id);
  if (!current) {
    throw new Error("File not found");
  }

  const filename = input.filename.trim();
  if (!(await isFilenameUniqueInFolder(current.folderId, filename, id))) {
    throw new Error("A file with this name already exists in this folder");
  }

  const [row] = await db
    .update(mediaFiles)
    .set({
      filename,
      updatedAt: new Date(),
    })
    .where(eq(mediaFiles.id, id))
    .returning();

  return rowToFile(row);
}

export async function createMediaLibraryFiles(
  folderId: string,
  uploads: {
    url: string;
    publicId?: string | null;
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

  const expectedFolderPrefix = `cms-system/media/${folderId}`;
  const now = new Date();
  const createdRows = [];

  for (const upload of uploads) {
    let url = upload.url.trim();
    let publicId = upload.publicId?.trim() || null;

    const alreadyHosted =
      url.startsWith("https://") || url.startsWith("http://");

    if (alreadyHosted) {
      if (publicId && !publicId.startsWith(expectedFolderPrefix)) {
        throw new Error("Uploaded file is not in the expected Cloudinary folder");
      }
    } else {
      const resourceType =
        upload.kind === "video"
          ? "video"
          : upload.kind === "image"
            ? "image"
            : "auto";
      url = await resolveImageAsset(url, expectedFolderPrefix, resourceType);
    }

    const [row] = await db
      .insert(mediaFiles)
      .values({
        id: crypto.randomUUID(),
        folderId,
        url,
        publicId,
        filename: upload.filename,
        mimeType: upload.mimeType,
        kind: upload.kind,
        sizeBytes: upload.sizeBytes,
        uploadedAt: now,
        updatedAt: now,
      })
      .returning();

    createdRows.push(row);
  }

  return createdRows.map(rowToFile);
}

export async function deleteMediaLibraryFile(id: string): Promise<void> {
  await deleteMediaLibraryFiles([id]);
}

export async function deleteMediaLibraryFiles(ids: string[]): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const existing = await db
    .select()
    .from(mediaFiles)
    .where(inArray(mediaFiles.id, ids));

  if (existing.length === 0) {
    throw new Error("No files found");
  }

  await Promise.all(existing.map((file) => tryDeleteCloudinaryUrl(file.url)));
  await db.delete(mediaFiles).where(inArray(mediaFiles.id, ids));
  return existing.length;
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

  const toMove = await db
    .select()
    .from(mediaFiles)
    .where(inArray(mediaFiles.id, ids));

  if (toMove.length === 0) {
    throw new Error("No files found");
  }

  for (const file of toMove) {
    if (file.folderId === targetFolderId) {
      continue;
    }

    if (
      !(await isFilenameUniqueInFolder(targetFolderId, file.filename, file.id))
    ) {
      throw new Error(
        `A file named "${file.filename}" already exists in the destination folder`,
      );
    }
  }

  const now = new Date();
  let movedCount = 0;

  for (const file of toMove) {
    if (file.folderId === targetFolderId) {
      continue;
    }

    await db
      .update(mediaFiles)
      .set({
        folderId: targetFolderId,
        updatedAt: now,
      })
      .where(
        and(
          eq(mediaFiles.id, file.id),
          ne(mediaFiles.folderId, targetFolderId),
        ),
      );
    movedCount += 1;
  }

  return movedCount;
}

export async function deleteMediaLibraryFilesInFolders(
  folderIds: string[],
): Promise<number> {
  if (folderIds.length === 0) {
    return 0;
  }

  const existing = await db
    .select()
    .from(mediaFiles)
    .where(inArray(mediaFiles.folderId, folderIds));

  if (existing.length === 0) {
    return 0;
  }

  await Promise.all(existing.map((file) => tryDeleteCloudinaryUrl(file.url)));
  await db.delete(mediaFiles).where(inArray(mediaFiles.folderId, folderIds));

  return existing.length;
}
