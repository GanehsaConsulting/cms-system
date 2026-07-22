import {
  ARTICLE_FORM_LIMITS,
  ARTICLE_IMAGE_ACCEPTED_EXTENSIONS,
  ARTICLE_IMAGE_ACCEPTED_TYPES,
  ARTICLE_IMAGE_FORMATS_LABEL,
} from "@/config/article-form";

export const ARTICLE_IMAGE_ACCEPT_ATTRIBUTE = [
  ...ARTICLE_IMAGE_ACCEPTED_TYPES,
  ...ARTICLE_IMAGE_ACCEPTED_EXTENSIONS.map((extension) => `.${extension}`),
].join(",");

/** @deprecated Use ARTICLE_IMAGE_ACCEPT_ATTRIBUTE */
export const GALLERY_ACCEPT_ATTRIBUTE = ARTICLE_IMAGE_ACCEPT_ATTRIBUTE;

function getArticleImageExtension(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension) {
    return null;
  }

  return ARTICLE_IMAGE_ACCEPTED_EXTENSIONS.includes(
    extension as (typeof ARTICLE_IMAGE_ACCEPTED_EXTENSIONS)[number],
  )
    ? extension
    : null;
}

export function isArticleImageType(type: string) {
  return ARTICLE_IMAGE_ACCEPTED_TYPES.includes(
    type as (typeof ARTICLE_IMAGE_ACCEPTED_TYPES)[number],
  );
}

/** @deprecated Use isArticleImageFile */
export function isGalleryImageType(type: string) {
  return isArticleImageType(type);
}

export function isArticleImageFile(file: File): boolean {
  if (file.type && isArticleImageType(file.type)) {
    return true;
  }

  return getArticleImageExtension(file) !== null;
}

/** @deprecated Use isArticleImageFile */
export function isGalleryImageFile(file: File): boolean {
  return isArticleImageFile(file);
}

export function getArticleImageSizeLimitBytes() {
  return ARTICLE_FORM_LIMITS.maxGalleryImageSizeMb * 1024 * 1024;
}

export function validateArticleImageFile(file: File): string | null {
  if (!isArticleImageFile(file)) {
    return `Only ${ARTICLE_IMAGE_FORMATS_LABEL} images are allowed.`;
  }

  if (file.size > getArticleImageSizeLimitBytes()) {
    return `Each image must be at most ${ARTICLE_FORM_LIMITS.maxGalleryImageSizeMb} MB.`;
  }

  return null;
}

/** @deprecated Use validateArticleImageFile */
export function validateGalleryImageFile(file: File): string | null {
  return validateArticleImageFile(file);
}

export async function readArticleImageFile(file: File): Promise<string> {
  const validationError = validateArticleImageFile(file);
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

/** @deprecated Use readArticleImageFile */
export async function readGalleryImageFile(file: File): Promise<string> {
  return readArticleImageFile(file);
}
