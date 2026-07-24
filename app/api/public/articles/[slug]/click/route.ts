import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { incrementArticleClick } from "@/lib/db/articles";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  if (!brandHasFeature(result.brand, "articles")) {
    return publicError("Article not found", 404);
  }

  const { slug } = await context.params;

  try {
    const clickCount = await incrementArticleClick(
      result.brand.id,
      decodeURIComponent(slug),
    );
    return publicJson({ slug: decodeURIComponent(slug), clickCount });
  } catch {
    return publicError("Article not found", 404);
  }
}
