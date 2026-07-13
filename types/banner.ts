export interface Banner {
  id: string;
  name: string;
  /** Unique lookup key for the public site (e.g. popup, mega-menu, homepage). */
  key: string;
  image: string;
  redirectUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BannerInput {
  name: string;
  key: string;
  image: string;
  redirectUrl: string;
  isActive: boolean;
}
