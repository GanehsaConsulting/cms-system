import {
  readArticleImageFile,
  validateArticleImageFile,
} from "@/lib/articles/gallery";

export { ARTICLE_IMAGE_ACCEPT_ATTRIBUTE } from "@/lib/articles/gallery";

/**
 * Prepares an inline editor image as a data URL for immediate preview.
 * Cloudinary upload happens when the article is saved.
 */
export async function uploadArticleEditorImage(
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal,
): Promise<string> {
  if (abortSignal?.aborted) {
    throw new Error("Upload cancelled");
  }

  const validationError = validateArticleImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  onProgress?.({ progress: 25 });

  const dataUrl = await readArticleImageFile(file);

  if (abortSignal?.aborted) {
    throw new Error("Upload cancelled");
  }

  onProgress?.({ progress: 100 });
  return dataUrl;
}
