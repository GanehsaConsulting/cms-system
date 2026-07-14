import {
  MEDIA_LIBRARY_ACCEPTED_EXTENSIONS,
  MEDIA_LIBRARY_ACCEPTED_TYPES,
  MEDIA_LIBRARY_MAX_FILE_SIZE_MB,
  MEDIA_LIBRARY_MAX_UPLOAD_BATCH,
} from "@/config/media-library";
import { classifyMediaUrl } from "@/lib/media/classify";

function getFileExtension(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase();
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
  if (
    file.type &&
    MEDIA_LIBRARY_ACCEPTED_TYPES.includes(
      file.type as (typeof MEDIA_LIBRARY_ACCEPTED_TYPES)[number],
    )
  ) {
    return true;
  }

  return getFileExtension(file) !== null;
}

export function getMediaFileSizeLimitBytes(): number {
  return MEDIA_LIBRARY_MAX_FILE_SIZE_MB * 1024 * 1024;
}

export function validateMediaUploadFile(file: File): string | null {
  if (!isAcceptedMediaFile(file)) {
    return "File type is not supported.";
  }

  if (file.size > getMediaFileSizeLimitBytes()) {
    return `Each file must be at most ${MEDIA_LIBRARY_MAX_FILE_SIZE_MB} MB.`;
  }

  return null;
}

export async function readMediaUploadFile(file: File): Promise<{
  url: string;
  filename: string;
  mimeType: string;
  kind: ReturnType<typeof classifyMediaUrl>["kind"];
  sizeBytes: number;
}> {
  const validationError = validateMediaUploadFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType =
    file.type ||
    classifyMediaUrl(file.name).mimeType ||
    "application/octet-stream";
  const url = `data:${mimeType};base64,${buffer.toString("base64")}`;
  const classified = classifyMediaUrl(url);

  return {
    url,
    filename: file.name.trim() || classified.filename,
    mimeType,
    kind: classified.kind,
    sizeBytes: file.size,
  };
}

export function normalizeUploadBatch(files: File[]): File[] {
  return files.slice(0, MEDIA_LIBRARY_MAX_UPLOAD_BATCH);
}
