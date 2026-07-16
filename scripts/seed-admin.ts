/**
 * One-time bootstrap: create the first Super Admin.
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 *
 * Optional env overrides:
 *   SEED_ADMIN_USERNAME=rafly
 *   SEED_ADMIN_EMAIL=rafly@gbk.co.id
 *   SEED_ADMIN_PASSWORD='…strong password…'
 *   SEED_ADMIN_NAME='Rafly'
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { auth } from "../lib/auth/auth";
import { db } from "../lib/db/client";
import { account, user } from "../lib/db/schema";

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? "rafly";
  const email = (
    process.env.SEED_ADMIN_EMAIL ?? "rafly@gbk.co.id"
  ).toLowerCase();
  const name = process.env.SEED_ADMIN_NAME ?? "Rafly";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "P4ssw0rd";

  if (password.length < 8) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 8 characters");
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
    position: "SA",
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
