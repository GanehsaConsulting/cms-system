import type { MediaTypeFilter, MediaViewMode } from "@/types/media";

export const MEDIA_LIBRARY_PAGE_TITLE = "Files & Media";

export const MEDIA_LIBRARY_PAGE_DESCRIPTION =
  "Organize pending uploads in folders, or browse files already used across CMS modules.";

export const MEDIA_LIBRARY_SECTIONS: {
  id: import("@/types/media").MediaLibrarySection;
  label: string;
}[] = [
  { id: "library", label: "Library" },
  { id: "in-use", label: "In use" },
];

/** Virtual id for the flat all-files view in the library sidebar. */
export const MEDIA_LIBRARY_ALL_FILES_ID = "__all__";

export const MEDIA_LIBRARY_MAX_FOLDER_DEPTH = 5;

export const MEDIA_LIBRARY_MAX_FILE_SIZE_MB = 5;

export const MEDIA_LIBRARY_MAX_UPLOAD_BATCH = 20;

export const MEDIA_LIBRARY_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "application/pdf",
] as const;

export const MEDIA_LIBRARY_ACCEPTED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "svg",
  "mp4",
  "webm",
  "pdf",
] as const;

export const MEDIA_LIBRARY_ACCEPT_ATTRIBUTE = [
  ...MEDIA_LIBRARY_ACCEPTED_TYPES,
  ...MEDIA_LIBRARY_ACCEPTED_EXTENSIONS.map((extension) => `.${extension}`),
].join(",");

export const MEDIA_LIBRARY_TYPE_FILTERS: {
  id: MediaTypeFilter;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "image", label: "Images" },
  { id: "video", label: "Videos" },
  { id: "document", label: "Documents" },
  { id: "other", label: "Other" },
];

export const MEDIA_LIBRARY_VIEW_MODES: {
  id: MediaViewMode;
  label: string;
}[] = [
  { id: "table", label: "Table" },
  { id: "grid", label: "Grid" },
];

export const MEDIA_LIBRARY_DEFAULT_VIEW: MediaViewMode = "grid";

/** In-use assets grid — filter first, then paginate. */
export const MEDIA_LIBRARY_IN_USE_PAGE_SIZE = 36;

export const MEDIA_LIBRARY_IN_USE_PAGE_SIZE_OPTIONS = [24, 36, 48] as const;

/** Default 5 columns on xl+; scales down on smaller viewports. */
export const MEDIA_LIBRARY_GRID_CLASS =
  "grid grid-cols-2 gap-3 p-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

/** macOS-style folder icon grid — Finder icon view proportions. */
export const MEDIA_LIBRARY_FOLDER_GRID_CLASS =
  "grid grid-cols-3 gap-x-2 gap-y-4 p-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8";

export const MEDIA_SOURCE_LABELS = {
  article: "Article",
  banner: "Banner",
  client: "Client",
  portfolio: "Portfolio",
  brand: "Brand",
  user: "User",
} as const;
