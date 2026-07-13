import {
  ARTICLE_FORM_LIMITS,
  GALLERY_ACCEPTED_EXTENSIONS,
  GALLERY_ACCEPTED_TYPES,
} from "@/config/article-form";

export const GALLERY_ACCEPT_ATTRIBUTE = [
  ...GALLERY_ACCEPTED_TYPES,
  ...GALLERY_ACCEPTED_EXTENSIONS.map((extension) => `.${extension}`),
].join(",");

function getGalleryFileExtension(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension) {
    return null;
  }

  return GALLERY_ACCEPTED_EXTENSIONS.includes(
    extension as (typeof GALLERY_ACCEPTED_EXTENSIONS)[number],
  )
    ? extension
    : null;
}

export function isGalleryImageType(type: string) {
  return GALLERY_ACCEPTED_TYPES.includes(
    type as (typeof GALLERY_ACCEPTED_TYPES)[number],
  );
}

export function isGalleryImageFile(file: File): boolean {
  if (file.type && isGalleryImageType(file.type)) {
    return true;
  }

  return getGalleryFileExtension(file) !== null;
}

export function getGalleryImageSizeLimitBytes() {
  return ARTICLE_FORM_LIMITS.maxGalleryImageSizeMb * 1024 * 1024;
}

export function validateGalleryImageFile(file: File): string | null {
  if (!isGalleryImageFile(file)) {
    return "Only JPG, PNG, and WebP images are allowed.";
  }

  if (file.size > getGalleryImageSizeLimitBytes()) {
    return `Each image must be at most ${ARTICLE_FORM_LIMITS.maxGalleryImageSizeMb} MB.`;
  }

  return null;
}

export async function readGalleryImageFile(file: File): Promise<string> {
  const validationError = validateGalleryImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to read image file."));
        return;
      }

      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}
