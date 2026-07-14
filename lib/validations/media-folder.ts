import { MEDIA_LIBRARY_MAX_FOLDER_DEPTH } from "@/config/media-library";
import { z } from "zod";

export const mediaFolderNameSchema = z
  .string()
  .trim()
  .min(1, "Folder name is required")
  .max(64, "Folder name must be at most 64 characters");

export const mediaFolderFormSchema = z.object({
  name: mediaFolderNameSchema,
  parentId: z.string().trim().nullable(),
});

export type MediaFolderFormValues = z.infer<typeof mediaFolderFormSchema>;

export function parseMediaFolderForm(formData: FormData) {
  const parentId = formData.get("parentId");
  return {
    name: String(formData.get("name") ?? ""),
    parentId:
      typeof parentId === "string" && parentId.length > 0 ? parentId : null,
  };
}

export function getMaxFolderDepthError(): string {
  return `Maximum folder depth is ${MEDIA_LIBRARY_MAX_FOLDER_DEPTH} levels.`;
}

export const mediaFolderIdsSchema = z
  .array(z.string().trim().min(1))
  .min(1, "Select at least one folder");

export const mediaFolderMoveSchema = z.object({
  folderIds: mediaFolderIdsSchema,
  targetParentId: z.string().trim().min(1).nullable(),
});
