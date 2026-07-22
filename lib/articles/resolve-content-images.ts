import { resolveImageAsset } from "@/lib/cloudinary/assets";
import { extractImageSourcesFromHtml } from "@/lib/media/html-images";

const ARTICLE_CONTENT_IMAGE_FOLDER = "cms-system/articles/content";

/** Upload inline `<img src>` data URLs to Cloudinary before persisting article HTML. */
export async function resolveArticleContentImages(html: string): Promise<string> {
  const trimmed = html.trim();
  if (!trimmed) {
    return html;
  }

  const sources = extractImageSourcesFromHtml(trimmed);
  if (sources.length === 0) {
    return html;
  }

  let resolvedHtml = trimmed;

  for (const source of sources) {
    const resolved = await resolveImageAsset(
      source,
      ARTICLE_CONTENT_IMAGE_FOLDER,
    );

    if (resolved !== source) {
      resolvedHtml = resolvedHtml.replaceAll(source, resolved);
    }
  }

  return resolvedHtml;
}
