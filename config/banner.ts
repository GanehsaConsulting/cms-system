import { CMS_IMAGE_SOURCE_HINT } from "@/config/cms-image-source";

export const BANNER_LIMITS = {
  name: 80,
  key: 64,
  redirectUrl: 500,
  maxImages: 8,
} as const;

export const BANNER_IMAGE_UPLOAD_HINT = `${CMS_IMAGE_SOURCE_HINT} Multiple images become a carousel.`;

