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

export const MEDIA_LIBRARY_IMAGE_EXTENSIONS = [
  "avif",
  "bmp",
  "gif",
  "heic",
  "heif",
  "ico",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "tif",
  "tiff",
  "webp",
] as const;

export const MEDIA_LIBRARY_VIDEO_EXTENSIONS = [
  "avi",
  "m4v",
  "mkv",
  "mov",
  "mp4",
  "ogv",
  "webm",
] as const;

export const MEDIA_LIBRARY_DOCUMENT_EXTENSIONS = [
  "csv",
  "doc",
  "docx",
  "odp",
  "ods",
  "odt",
  "pdf",
  "ppt",
  "pptx",
  "rtf",
  "txt",
  "xls",
  "xlsx",
] as const;

export const MEDIA_LIBRARY_AUDIO_EXTENSIONS = [
  "aac",
  "flac",
  "m4a",
  "mp3",
  "ogg",
  "wav",
] as const;

export const MEDIA_LIBRARY_ARCHIVE_EXTENSIONS = [
  "7z",
  "rar",
  "zip",
] as const;

export const MEDIA_LIBRARY_ACCEPTED_EXTENSIONS = [
  ...MEDIA_LIBRARY_IMAGE_EXTENSIONS,
  ...MEDIA_LIBRARY_VIDEO_EXTENSIONS,
  ...MEDIA_LIBRARY_DOCUMENT_EXTENSIONS,
  ...MEDIA_LIBRARY_AUDIO_EXTENSIONS,
  ...MEDIA_LIBRARY_ARCHIVE_EXTENSIONS,
] as const;

export const MEDIA_LIBRARY_ACCEPTED_TYPES = [
  "image/avif",
  "image/bmp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "video/avi",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
  "video/x-msvideo",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.presentation",
  "application/rtf",
  "text/plain",
  "text/csv",
  "text/rtf",
  "audio/aac",
  "audio/flac",
  "audio/m4a",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
  "application/zip",
  "application/x-7z-compressed",
  "application/vnd.rar",
  "application/x-rar-compressed",
] as const;

export const MEDIA_LIBRARY_FORMATS_LABEL =
  "images, videos, documents, audio, and archives";

export const MEDIA_LIBRARY_UPLOAD_HINT = `Upload ${MEDIA_LIBRARY_FORMATS_LABEL} (max ${MEDIA_LIBRARY_MAX_FILE_SIZE_MB} MB each).`;

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
