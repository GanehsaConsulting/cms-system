/** Character limits aligned with the article editor UI. */
export const ARTICLE_FORM_LIMITS = {
  title: 150,
  slug: 150,
  excerpt: 160,
  metaTitle: 60,
  metaDescription: 160,
  categoryLabel: 40,
  maxTags: 10,
  maxGalleryImages: 12,
  maxGalleryImageSizeMb: 2,
} as const;

/** Article thumbnail, gallery, and rich-text inline images. */
export const ARTICLE_IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/avif",
  "image/gif",
] as const;

export const ARTICLE_IMAGE_ACCEPTED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "heif",
  "avif",
  "gif",
] as const;

export const ARTICLE_IMAGE_FORMATS_LABEL =
  "JPG, PNG, WebP, HEIC, HEIF, AVIF, and GIF";

/** @deprecated Use ARTICLE_IMAGE_ACCEPTED_TYPES */
export const GALLERY_ACCEPTED_TYPES = ARTICLE_IMAGE_ACCEPTED_TYPES;

/** @deprecated Use ARTICLE_IMAGE_ACCEPTED_EXTENSIONS */
export const GALLERY_ACCEPTED_EXTENSIONS = ARTICLE_IMAGE_ACCEPTED_EXTENSIONS;

export const GALLERY_INPUT_ID = "article-gallery-upload";

export const GALLERY_UPLOAD_HINT = `Optional. Up to 12 images (${ARTICLE_IMAGE_FORMATS_LABEL}). Upload from device, Library, or URL.`;

/** Average adult reading speed for English copy. */
export const ARTICLE_READING_WPM = 200;

export const ARTICLE_SITE_BASE_URL = "https://yoursite.com/";

export const THUMBNAIL_UPLOAD_HINT = `Recommended size: 1200 × 675 px (16:9). Upload from device, Library, or URL.`;
