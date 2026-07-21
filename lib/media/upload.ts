import {
  MEDIA_LIBRARY_ACCEPTED_EXTENSIONS,
  MEDIA_LIBRARY_ACCEPTED_TYPES,
  MEDIA_LIBRARY_MAX_FILE_SIZE_MB,
  MEDIA_LIBRARY_MAX_UPLOAD_BATCH,
} from "@/config/media-library";
import { classifyMediaUrl } from "@/lib/media/classify";
import type { MediaUploadMeta } from "@/types/media-upload";

function getFileExtension(filename: string): string | null {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension) {
    return null;
  }

  return MEDIA_LIBRARY_ACCEPTED_EXTENSIONS.includes(
    extension as (typeof MEDIA_LIBRARY_ACCEPTED_EXTENSIONS)[number],
  )
    ? extension
    : null;
}

export function isAcceptedMediaFile(file: File): boolean {
  return isAcceptedMediaUpload({
    filename: file.name,
    mimeType: file.type,
  });
}

export function isAcceptedMediaUpload(input: {
  filename: string;
  mimeType: string;
}): boolean {
  if (
    input.mimeType &&
    MEDIA_LIBRARY_ACCEPTED_TYPES.includes(
      input.mimeType as (typeof MEDIA_LIBRARY_ACCEPTED_TYPES)[number],
    )
  ) {
    return true;
  }

  return getFileExtension(input.filename) !== null;
}

export function getMediaFileSizeLimitBytes(): number {
  return MEDIA_LIBRARY_MAX_FILE_SIZE_MB * 1024 * 1024;
}

export function validateMediaUploadFile(file: File): string | null {
  return validateMediaUploadMeta({
    filename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  });
}

/** Server-side mirror of {@link validateMediaUploadFile} for metadata-only checks. */
export function validateMediaUploadMeta(input: {
  filename: string;
  mimeType: string;
  sizeBytes: number;
}): string | null {
  if (
    !isAcceptedMediaUpload({
      filename: input.filename,
      mimeType: input.mimeType,
    })
  ) {
    return "File type is not supported.";
  }

  if (input.sizeBytes > getMediaFileSizeLimitBytes()) {
    return `Each file must be at most ${MEDIA_LIBRARY_MAX_FILE_SIZE_MB} MB.`;
  }

  return null;
}

export function getMediaUploadMeta(file: File): MediaUploadMeta {
  const classified = classifyMediaUrl(file.name);
  const mimeType =
    file.type || classified.mimeType || "application/octet-stream";

  return {
    filename: file.name.trim() || classified.filename,
    mimeType,
    sizeBytes: file.size,
    kind: classified.kind,
  };
}

export function normalizeUploadBatch<T>(files: T[]): T[] {
  return files.slice(0, MEDIA_LIBRARY_MAX_UPLOAD_BATCH);
}
