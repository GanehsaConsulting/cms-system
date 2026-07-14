import { z } from "zod";
import {
  USER_FORM_LIMITS,
} from "@/config/user";
import type { UserInput } from "@/types/user";

export const userFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(USER_FORM_LIMITS.name),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(USER_FORM_LIMITS.email),
  position: z.string().trim().max(USER_FORM_LIMITS.position),
  role: z.enum(["super-admin", "admin", "viewer"], {
    message: "Select a valid role",
  }),
  status: z.enum(["active", "inactive"]),
  brandAccess: z
    .array(z.string().trim().min(1))
    .min(1, "Select at least one brand"),
  avatarUrl: z.string(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export function userFormToInput(values: UserFormValues): UserInput {
  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    position: values.position.trim(),
    role: values.role as UserInput["role"],
    status: values.status,
    brandAccess: values.brandAccess,
    avatarUrl: values.avatarUrl.trim(),
  };
}

function parseBrandAccess(value: FormDataEntryValue | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(String(value)) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function parseUserForm(formData: FormData): unknown {
  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    position: String(formData.get("position") ?? ""),
    role: String(formData.get("role") ?? "viewer"),
    status: String(formData.get("status") ?? "active"),
    brandAccess: parseBrandAccess(formData.get("brandAccess")),
    avatarUrl: String(formData.get("avatarUrl") ?? ""),
  };
}
