import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { user as authUserTable, account as authAccountTable } from "@/lib/db/schema";
import { slugify } from "@/lib/articles/slug";
import { normalizeUser } from "@/lib/users/normalize";
import type { User, UserInput } from "@/types/user";

function parseBrandAccess(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function buildUsernameBase(email: string): string {
  const localPart = email.split("@")[0] ?? "";
  const base = slugify(localPart).slice(0, 32);

  if (base.length >= 3) {
    return base;
  }

  // Ensure the username plugin constraints are satisfied.
  return (base || "user").padEnd(3, "0").slice(0, 32);
}

async function findUniqueUsername(base: string): Promise<string> {
  let candidate = base;

  for (let i = 0; i < 20; i++) {
    const existing = await db
      .select({ id: authUserTable.id })
      .from(authUserTable)
      .where(eq(authUserTable.username, candidate))
      .limit(1);

    if (existing.length === 0) {
      return candidate;
    }

    const suffix = String(i + 1);
    candidate = `${base}`.slice(0, 32 - suffix.length) + suffix;
  }

  throw new Error("Could not generate a unique username");
}

async function getUserByRowId(id: string): Promise<User | null> {
  const rows = await db
    .select({
      id: authUserTable.id,
      name: authUserTable.name,
      email: authUserTable.email,
      position: authUserTable.position,
      role: authUserTable.role,
      status: authUserTable.status,
      brandAccess: authUserTable.brandAccess,
      avatarUrl: authUserTable.image,
      createdAt: authUserTable.createdAt,
      updatedAt: authUserTable.updatedAt,
    })
    .from(authUserTable)
    .where(eq(authUserTable.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) {
    return null;
  }

  const user: User = normalizeUser({
    id: row.id,
    name: row.name,
    email: row.email,
    position: row.position,
    role: row.role,
    status: row.status,
    brandAccess: parseBrandAccess(row.brandAccess),
    avatarUrl: row.avatarUrl ?? "",
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });

  return user;
}

export async function getUsers(): Promise<User[]> {
  const rows = await db
    .select({
      id: authUserTable.id,
      name: authUserTable.name,
      email: authUserTable.email,
      position: authUserTable.position,
      role: authUserTable.role,
      status: authUserTable.status,
      brandAccess: authUserTable.brandAccess,
      avatarUrl: authUserTable.image,
      createdAt: authUserTable.createdAt,
      updatedAt: authUserTable.updatedAt,
    })
    .from(authUserTable);

  return rows
    .map((row) =>
      normalizeUser({
        id: row.id,
        name: row.name,
        email: row.email,
        position: row.position,
        role: row.role,
        status: row.status,
        brandAccess: parseBrandAccess(row.brandAccess),
        avatarUrl: row.avatarUrl ?? "",
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      }),
    )
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
    );
}

export async function getUserById(id: string): Promise<User | null> {
  return getUserByRowId(id);
}

export async function createUser(
  input: UserInput,
): Promise<{ user: User; username: string; password: string }> {
  const normalized = normalizeUser({
    id: "",
    createdAt: "",
    updatedAt: "",
    ...input,
  });

  const email = normalized.email.toLowerCase();

  const emailExisting = await db
    .select({ id: authUserTable.id })
    .from(authUserTable)
    .where(eq(authUserTable.email, email))
    .limit(1);

  if (emailExisting.length > 0) {
    throw new Error("A user with this email already exists");
  }

  const usernameBase = buildUsernameBase(email);
  const username = await findUniqueUsername(usernameBase);

  const password =
    process.env.NEW_USER_TEMP_PASSWORD ??
    `ChangeMe-${crypto.randomUUID().slice(0, 8)}!`;

  const ctx = await auth.$context;
  const passwordHash = await ctx.password.hash(password);

  const now = new Date();
  const userId = crypto.randomUUID();

  await db.insert(authUserTable).values({
    id: userId,
    name: normalized.name,
    email,
    emailVerified: true,
    image: normalized.avatarUrl,
    username,
    displayUsername: username,
    position: normalized.position,
    role: normalized.role,
    status: normalized.status,
    brandAccess: JSON.stringify(normalized.brandAccess),
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(authAccountTable).values({
    id: crypto.randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: passwordHash,
    createdAt: now,
    updatedAt: now,
  });

  const user = await getUserByRowId(userId);
  if (!user) {
    throw new Error("User was created but could not be loaded");
  }

  return { user, username, password };
}

export async function updateUser(id: string, input: UserInput): Promise<User> {
  const normalized = normalizeUser({
    id,
    createdAt: "",
    updatedAt: "",
    ...input,
  });

  const email = normalized.email.toLowerCase();

  const emailExisting = await db
    .select({ id: authUserTable.id })
    .from(authUserTable)
    .where(eq(authUserTable.email, email))
    .limit(2);

  if (emailExisting.some((row) => row.id !== id)) {
    throw new Error("A user with this email already exists");
  }

  const now = new Date();

  await db
    .update(authUserTable)
    .set({
      name: normalized.name,
      email,
      image: normalized.avatarUrl,
      position: normalized.position,
      role: normalized.role,
      status: normalized.status,
      brandAccess: JSON.stringify(normalized.brandAccess),
      updatedAt: now,
    })
    .where(eq(authUserTable.id, id));

  const user = await getUserByRowId(id);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function deleteUser(id: string): Promise<void> {
  const deleted = await db
    .delete(authUserTable)
    .where(eq(authUserTable.id, id))
    .returning({ id: authUserTable.id });

  if (deleted.length === 0) {
    throw new Error("User not found");
  }
}

/** Super Admin override — hash and write credential password for a user. */
export async function setUserPassword(
  userId: string,
  password: string,
): Promise<void> {
  const existing = await getUserByRowId(userId);
  if (!existing) {
    throw new Error("User not found");
  }

  const ctx = await auth.$context;
  const passwordHash = await ctx.password.hash(password);
  const now = new Date();

  const accounts = await db
    .select({ id: authAccountTable.id })
    .from(authAccountTable)
    .where(
      and(
        eq(authAccountTable.userId, userId),
        eq(authAccountTable.providerId, "credential"),
      ),
    )
    .limit(1);

  const account = accounts[0];

  if (account) {
    await db
      .update(authAccountTable)
      .set({
        password: passwordHash,
        updatedAt: now,
      })
      .where(eq(authAccountTable.id, account.id));
    return;
  }

  await db.insert(authAccountTable).values({
    id: crypto.randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: passwordHash,
    createdAt: now,
    updatedAt: now,
  });
}
