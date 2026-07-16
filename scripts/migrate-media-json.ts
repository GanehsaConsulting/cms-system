/**
 * Import legacy media JSON into Postgres.
 *
 * Usage:
 *   npx tsx scripts/migrate-media-json.ts
 *
 * Note: existing data-URL blobs are stored as-is; re-upload via CMS to move to Cloudinary.
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db } from "../lib/db/client";
import { mediaFiles, mediaFolders } from "../lib/db/schema";
import type { MediaFolder, MediaLibraryFile } from "../types/media";

async function readJson<T>(relativePath: string): Promise<T[]> {
  try {
    const raw = await readFile(path.join(process.cwd(), relativePath), "utf-8");
    return JSON.parse(raw) as T[];
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

async function main() {
  const folders = await readJson<MediaFolder>("data/media-folders.json");
  const files = await readJson<MediaLibraryFile>("data/media-files.json");

  let foldersInserted = 0;
  let filesInserted = 0;

  // Insert shallowest folders first so parents exist before children.
  const sortedFolders = [...folders].sort((a, b) => a.depth - b.depth);

  for (const folder of sortedFolders) {
    const existing = await db
      .select({ id: mediaFolders.id })
      .from(mediaFolders)
      .where(eq(mediaFolders.id, folder.id))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(mediaFolders).values({
      id: folder.id,
      name: folder.name,
      parentId: folder.parentId,
      depth: folder.depth,
      createdAt: new Date(folder.createdAt),
      updatedAt: new Date(folder.updatedAt),
    });
    foldersInserted += 1;
  }

  for (const file of files) {
    const existing = await db
      .select({ id: mediaFiles.id })
      .from(mediaFiles)
      .where(eq(mediaFiles.id, file.id))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(mediaFiles).values({
      id: file.id,
      folderId: file.folderId,
      url: file.url,
      publicId: null,
      filename: file.filename,
      mimeType: file.mimeType,
      kind: file.kind,
      sizeBytes: file.sizeBytes,
      uploadedAt: new Date(file.uploadedAt),
      updatedAt: new Date(file.updatedAt),
    });
    filesInserted += 1;
  }

  console.log(
    `Media migrate done. folders=${foldersInserted} files=${filesInserted}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
