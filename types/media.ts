export type MediaSource =
  | "article"
  | "banner"
  | "client"
  | "portfolio"
  | "brand"
  | "user";

export type MediaKind = "image" | "video" | "document" | "other";

export type MediaTypeFilter = "all" | "image" | "video" | "document" | "other";

export type MediaViewMode = "table" | "grid";

export type MediaLibrarySection = "library" | "in-use";

export interface MediaFolder {
  id: string;
  name: string;
  parentId: string | null;
  depth: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaLibraryFile {
  id: string;
  folderId: string;
  url: string;
  filename: string;
  mimeType: string;
  kind: MediaKind;
  sizeBytes: number;
  uploadedAt: string;
  updatedAt: string;
}

export interface MediaUsage {
  source: MediaSource;
  sourceLabel: string;
  entityId: string;
  entityTitle: string;
  fieldPath: string;
  caption?: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  kind: MediaKind;
  mimeType: string | null;
  filename: string;
  usages: MediaUsage[];
  updatedAt: string;
}

export interface MediaLibrarySnapshot {
  articles: import("@/types/article").Article[];
  banners: import("@/types/banner").Banner[];
  clients: import("@/types/client").Client[];
  portfolio: import("@/types/portfolio").Portfolio[];
  brands: import("@/types/brand").Brand[];
  users: import("@/types/user").User[];
}
