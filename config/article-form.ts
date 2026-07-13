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

export const GALLERY_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const GALLERY_ACCEPTED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
] as const;

export const GALLERY_INPUT_ID = "article-gallery-upload";

export const GALLERY_UPLOAD_HINT =
  "Optional. Upload up to 12 images (JPG, PNG, WebP). Max 2 MB each.";

/** Average adult reading speed for English copy. */
export const ARTICLE_READING_WPM = 200;

export const ARTICLE_SITE_BASE_URL = "https://yoursite.com/";

export const THUMBNAIL_UPLOAD_HINT =
  "Recommended size: 1200 × 675 px (16:9). Max 2 MB (JPG, PNG, WebP).";
