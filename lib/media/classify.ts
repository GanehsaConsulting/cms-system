import type { MediaKind } from "@/types/media";
import {
  MEDIA_LIBRARY_ARCHIVE_EXTENSIONS,
  MEDIA_LIBRARY_AUDIO_EXTENSIONS,
  MEDIA_LIBRARY_DOCUMENT_EXTENSIONS,
  MEDIA_LIBRARY_IMAGE_EXTENSIONS,
  MEDIA_LIBRARY_VIDEO_EXTENSIONS,
} from "@/config/media-library";

const IMAGE_EXTENSIONS = new Set<string>(MEDIA_LIBRARY_IMAGE_EXTENSIONS);
const VIDEO_EXTENSIONS = new Set<string>(MEDIA_LIBRARY_VIDEO_EXTENSIONS);
const DOCUMENT_EXTENSIONS = new Set<string>(MEDIA_LIBRARY_DOCUMENT_EXTENSIONS);
const AUDIO_EXTENSIONS = new Set<string>(MEDIA_LIBRARY_AUDIO_EXTENSIONS);
const ARCHIVE_EXTENSIONS = new Set<string>(MEDIA_LIBRARY_ARCHIVE_EXTENSIONS);

function extensionFromPath(value: string): string | null {
  const basename = value.split("/").pop()?.split("?")[0]?.split("#")[0] ?? "";
  const parts = basename.split(".");
  if (parts.length < 2) {
    return null;
  }

  return parts.at(-1)?.toLowerCase() ?? null;
}

function kindFromMime(mime: string | null): MediaKind {
  if (!mime) {
    return "other";
  }

  if (mime.startsWith("image/")) {
    return "image";
  }

  if (mime.startsWith("video/")) {
    return "video";
  }

  if (
    mime.startsWith("application/pdf") ||
    mime.startsWith("application/msword") ||
    mime.startsWith("application/vnd.") ||
    mime.startsWith("application/rtf") ||
    mime.startsWith("text/")
  ) {
    return "document";
  }

  if (mime.startsWith("audio/")) {
    return "other";
  }

  if (
    mime.startsWith("application/zip") ||
    mime.includes("rar") ||
    mime.includes("7z")
  ) {
    return "other";
  }

  return "other";
}

function kindFromExtension(extension: string | null): MediaKind {
  if (!extension) {
    return "other";
  }

  if (IMAGE_EXTENSIONS.has(extension)) {
    return "image";
  }

  if (VIDEO_EXTENSIONS.has(extension)) {
    return "video";
  }

  if (DOCUMENT_EXTENSIONS.has(extension)) {
    return "document";
  }

  if (AUDIO_EXTENSIONS.has(extension) || ARCHIVE_EXTENSIONS.has(extension)) {
    return "other";
  }

  return "other";
}

function filenameFromDataUrl(mime: string | null): string {
  if (!mime) {
    return "inline-file";
  }

  const extension = mime.split("/")[1]?.split("+")[0] ?? "bin";
  return `inline.${extension}`;
}

export function classifyMediaUrl(url: string): {
  kind: MediaKind;
  mimeType: string | null;
  filename: string;
} {
  const trimmed = url.trim();

  if (!trimmed) {
    return {
      kind: "other",
      mimeType: null,
      filename: "unknown",
    };
  }

  if (trimmed.startsWith("data:")) {
    const mime = trimmed.match(/^data:([^;,]+)/)?.[1] ?? null;
    return {
      kind: kindFromMime(mime),
      mimeType: mime,
      filename: filenameFromDataUrl(mime),
    };
  }

  const extension = extensionFromPath(trimmed);
  const filename = trimmed.split("/").pop()?.split("?")[0]?.split("#")[0] ?? trimmed;

  return {
    kind: kindFromExtension(extension),
    mimeType: extension ? `${kindFromExtension(extension)}/${extension}` : null,
    filename,
  };
}

export function isRenderableMediaPreview(kind: MediaKind): boolean {
  return kind === "image";
}
