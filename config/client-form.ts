import { CMS_IMAGE_SOURCE_HINT } from "@/config/cms-image-source";

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

export const CLIENT_LOGO_UPLOAD_HINT = `Optional. Square logo works best. ${CMS_IMAGE_SOURCE_HINT}`;

export const CLIENT_GALLERY_UPLOAD_HINT = `Optional. Up to 24 photos. ${CMS_IMAGE_SOURCE_HINT}`;
