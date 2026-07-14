import { z } from "zod";

export const mediaLibraryFilenameSchema = z
  .string()
  .trim()
  .min(1, "File name is required")
  .max(255, "File name must be at most 255 characters")
  .refine((value) => !/[\\/]/.test(value), {
    message: "File name cannot contain slashes",
  });

export const mediaLibraryFileRenameSchema = z.object({
  filename: mediaLibraryFilenameSchema,
});

export function parseMediaLibraryFileRenameForm(formData: FormData) {
  return {
    filename: String(formData.get("filename") ?? ""),
  };
}

export const mediaLibraryFileIdsSchema = z
  .array(z.string().trim().min(1))
  .min(1, "Select at least one file");

export const mediaLibraryFileMoveSchema = z.object({
  fileIds: mediaLibraryFileIdsSchema,
  targetFolderId: z.string().trim().min(1, "Select a destination folder"),
});
