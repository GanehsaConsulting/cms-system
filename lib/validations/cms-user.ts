import { z } from "zod";

export const cmsProfileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(120, "Email must be at most 120 characters"),
  avatarUrl: z.string(),
});

export type CmsProfileFormValues = z.infer<typeof cmsProfileFormSchema>;

export const cmsPasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .max(128, "Password is too long"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(128, "Password is too long"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });

export type CmsPasswordFormValues = z.infer<typeof cmsPasswordFormSchema>;
