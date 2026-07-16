/**
 * One-time bootstrap: create the first Super Admin.
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 *
 * Optional env overrides:
 *   SEED_ADMIN_USERNAME=admin
 *   SEED_ADMIN_EMAIL=admin@company.local
 *   SEED_ADMIN_PASSWORD='…strong password…'
 *   SEED_ADMIN_NAME='CMS Admin'
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { auth } from "../lib/auth/auth";
import { db } from "../lib/db/client";
import { account, user } from "../lib/db/schema";

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const email = (
    process.env.SEED_ADMIN_EMAIL ?? "admin@company.local"
  ).toLowerCase();
  const name = process.env.SEED_ADMIN_NAME ?? "CMS Admin";
  const password =
    process.env.SEED_ADMIN_PASSWORD ??
    `ChangeMe-${crypto.randomUUID().slice(0, 8)}!`;

  if (password.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters");
  }

  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Admin already exists for ${email} — skipping.`);
    return;
  }

  const ctx = await auth.$context;
  const passwordHash = await ctx.password.hash(password);
  const userId = crypto.randomUUID();
  const now = new Date();

  await db.insert(user).values({
    id: userId,
    name,
    email,
    emailVerified: true,
    username,
    displayUsername: username,
    position: "Administrator",
    role: "super-admin",
    status: "active",
    brandAccess: "[]",
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(account).values({
    id: crypto.randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: passwordHash,
    createdAt: now,
    updatedAt: now,
  });

  console.log("Super Admin created.");
  console.log(`  username: ${username}`);
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}`);
  console.log("Change this password after first login.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
