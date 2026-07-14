export interface Banner {
  id: string;
  name: string;
  /** Unique lookup key for the public site (e.g. popup, mega-menu, homepage). */
  key: string;
  /** One or more images — used as a carousel on the public site. */
  images: string[];
  redirectUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BannerInput {
  name: string;
  key: string;
  images: string[];
  redirectUrl: string;
  isActive: boolean;
}
