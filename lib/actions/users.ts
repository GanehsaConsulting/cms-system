"use server";

import { revalidatePath } from "next/cache";
import {
  createUser,
  deleteUser,
  setUserPassword,
  updateUser,
} from "@/lib/db/users";
import { revalidateMediaLibraryCache } from "@/lib/media/cache";
import { requireCmsSettingsAccess } from "@/lib/users/require-settings-access";
import {
  adminSetPasswordSchema,
  createUserFormSchema,
  parseAdminSetPasswordForm,
  parseUserForm,
  userFormSchema,
  userFormToInput,
} from "@/lib/validations/user";

function revalidateUserPaths() {
  revalidatePath("/settings/users");
  revalidateMediaLibraryCache();
}

export async function createUserAction(formData: FormData) {
  const access = await requireCmsSettingsAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = createUserFormSchema.safeParse(parseUserForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid user data",
    };
  }

  try {
    const { password, ...profile } = parsed.data;
    const created = await createUser(userFormToInput(profile), { password });
    revalidateUserPaths();
    return {
      success: true as const,
      user: created.user,
      username: created.username,
      password: created.password,
    };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

export async function updateUserAction(id: string, formData: FormData) {
  const access = await requireCmsSettingsAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = userFormSchema.safeParse(parseUserForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid user data",
    };
  }

  try {
    const user = await updateUser(id, userFormToInput(parsed.data));
    revalidateUserPaths();
    return { success: true as const, user };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

export async function deleteUserAction(id: string) {
  const access = await requireCmsSettingsAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  try {
    await deleteUser(id);
    revalidateUserPaths();
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}

export async function setUserPasswordAction(id: string, formData: FormData) {
  const access = await requireCmsSettingsAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = adminSetPasswordSchema.safeParse(
    parseAdminSetPasswordForm(formData),
  );

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid password",
    };
  }

  try {
    await setUserPassword(id, parsed.data.newPassword);
    revalidateUserPaths();
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to update password",
    };
  }
}
