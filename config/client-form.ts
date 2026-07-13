export const CLIENT_FORM_LIMITS = {
  name: 120,
  website: 300,
  description: 1000,
  logo: 0,
  maxTestimonials: 20,
  maxPhotos: 24,
  testimonialQuote: 800,
  testimonialAuthorName: 120,
  testimonialAuthorTitle: 120,
  photoCaption: 160,
  maxImageSizeMb: 2,
} as const;

export const CLIENT_LOGO_UPLOAD_HINT =
  "Optional. Square logo works best. Max 2 MB (JPG, PNG, WebP).";

export const CLIENT_GALLERY_UPLOAD_HINT =
  "Optional. Upload up to 24 photos (JPG, PNG, WebP). Max 2 MB each.";
