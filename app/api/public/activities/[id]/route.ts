import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getContentActivityById } from "@/lib/db/content-activities";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  if (!brandHasFeature(result.brand, "activities")) {
    return publicError("Activity not found", 404);
  }

  const { id } = await context.params;
  const activity = await getContentActivityById(result.brand.id, id);

  if (!activity || activity.status !== "published") {
    return publicError("Activity not found", 404);
  }

  return publicJson(activity);
}
