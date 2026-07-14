"use server";

import { revalidatePath } from "next/cache";
import {
  createUser,
  deleteUser,
  updateUser,
} from "@/lib/db/users";
import {
  parseUserForm,
  userFormSchema,
  userFormToInput,
} from "@/lib/validations/user";

function revalidateUserPaths() {
  revalidatePath("/settings/users");
}

export async function createUserAction(formData: FormData) {
  const parsed = userFormSchema.safeParse(parseUserForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid user data",
    };
  }

  try {
    const user = await createUser(userFormToInput(parsed.data));
    revalidateUserPaths();
    return { success: true as const, user };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

export async function updateUserAction(id: string, formData: FormData) {
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
