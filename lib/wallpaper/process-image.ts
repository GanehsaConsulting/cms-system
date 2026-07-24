import { prepareCmsImageDataUrl } from "@/lib/articles/prepare-image-data-url";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
/** Wallpaper stays slightly smaller than content uploads (localStorage quota). */
const WALLPAPER_MAX_EDGE_PX = 1920;

const ACCEPTED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export class WallpaperUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WallpaperUploadError";
  }
}

function assertAcceptedImageMime(mime: string): void {
  if (mime && !mime.startsWith("image/")) {
    throw new WallpaperUploadError("Link must point to an image file.");
  }

  if (mime && !ACCEPTED_MIME_TYPES.has(mime)) {
    throw new WallpaperUploadError("Format must be JPG, PNG, or WebP.");
  }
}

export function normalizeWallpaperUrl(input: string): string {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new WallpaperUploadError("Link cannot be empty.");
  }

  let url: URL;

  try {
    url = new URL(trimmed);
  } catch {
    throw new WallpaperUploadError("Invalid link.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new WallpaperUploadError("Link must start with http:// or https://");
  }

  return url.toString();
}

async function fetchWallpaperFile(url: string): Promise<File> {
  try {
    const response = await fetch(url, { mode: "cors" });

    if (!response.ok) {
      throw new WallpaperUploadError("Failed to download image from link.");
    }

    const blob = await response.blob();

    if (blob.size > MAX_FILE_SIZE_BYTES) {
      throw new WallpaperUploadError("Image must be at most 8 MB.");
    }

    assertAcceptedImageMime(blob.type);

    return new File([blob], "wallpaper", {
      type: blob.type || "image/jpeg",
    });
  } catch (error) {
    if (error instanceof WallpaperUploadError) {
      throw error;
    }

    throw new WallpaperUploadError(
      "Failed to load image from link. Make sure the link is public (JPG/PNG/WebP).",
    );
  }
}

export async function processWallpaperFile(file: File): Promise<string> {
  if (!ACCEPTED_MIME_TYPES.has(file.type)) {
    throw new WallpaperUploadError("Format must be JPG, PNG, or WebP.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new WallpaperUploadError("File must be at most 8 MB.");
  }

  try {
    return await prepareCmsImageDataUrl(file, {
      maxEdgePx: WALLPAPER_MAX_EDGE_PX,
    });
  } catch (error) {
    throw new WallpaperUploadError(
      error instanceof Error ? error.message : "Failed to process wallpaper.",
    );
  }
}

export async function processWallpaperFromUrl(input: string): Promise<string> {
  const url = normalizeWallpaperUrl(input);
  const file = await fetchWallpaperFile(url);
  return processWallpaperFile(file);
}
