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
  scope: z.enum(["shared", "brand", "personal"]).default("shared"),
});

export type MediaFolderFormValues = z.infer<typeof mediaFolderFormSchema>;

export function parseMediaFolderForm(formData: FormData) {
  const parentId = formData.get("parentId");
  const scopeRaw = String(formData.get("scope") ?? "shared");
  return {
    name: String(formData.get("name") ?? ""),
    parentId:
      typeof parentId === "string" && parentId.length > 0 ? parentId : null,
    scope:
      scopeRaw === "brand" || scopeRaw === "personal" || scopeRaw === "shared"
        ? scopeRaw
        : "shared",
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
