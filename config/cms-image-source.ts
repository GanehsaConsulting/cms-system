/** Standard CMS image entry: one Upload control → shared picker modal. */

export const CMS_IMAGE_SOURCE_HINT =
  "Upload from device, pick Shared / In use media, or paste a URL.";

export const CMS_IMAGE_SOURCE_LABELS = {
  upload: "Upload",
  replace: "Replace",
  add: "Add",
  uploadFromDevice: "Choose files",
  fromLibrary: "From Files & Media",
  fromUrl: "From URL",
  /** @deprecated Use upload — Library/URL live in the picker modal. */
  library: "Library",
  /** @deprecated Use upload — Library/URL live in the picker modal. */
  url: "URL",
} as const;
