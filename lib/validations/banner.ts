import { z } from "zod";
import { BANNER_LIMITS } from "@/config/banner";

const bannerKeySchema = z
  .string()
  .trim()
  .min(2, "Key must be at least 2 characters")
  .max(BANNER_LIMITS.key, `Key must be at most ${BANNER_LIMITS.key} characters`)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens only (e.g. mega-menu)",
  );

export const bannerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(
      BANNER_LIMITS.name,
      `Name must be at most ${BANNER_LIMITS.name} characters`,
    ),
  key: bannerKeySchema,
  image: z.string().trim().min(1, "Image is required"),
  redirectUrl: z
    .string()
    .trim()
    .min(1, "Redirect link is required")
    .max(
      BANNER_LIMITS.redirectUrl,
      `Redirect link must be at most ${BANNER_LIMITS.redirectUrl} characters`,
    )
    .refine(
      (value) => {
        if (value.startsWith("/") || value.startsWith("whatsapp://")) {
          return true;
        }

        try {
          const url = new URL(value);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message:
          "Enter a valid URL, WhatsApp link, or site path (e.g. /contact)",
      },
    ),
  isActive: z.boolean(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
