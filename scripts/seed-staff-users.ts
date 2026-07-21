/**
 * Seed CMS staff users (admin + one viewer).
 *
 * Usage:
 *   npx tsx scripts/seed-staff-users.ts           # dry-run
 *   npx tsx scripts/seed-staff-users.ts --apply   # create/update
 *
 * All passwords: password123
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { auth } from "../lib/auth/auth";
import { getBrands } from "../lib/db/brands";
import { db } from "../lib/db/client";
import { user as authUserTable } from "../lib/db/schema";
import { createUser, setUserPassword, updateUser } from "../lib/db/users";
import type { UserRoleId } from "../config/user";

const SHARED_PASSWORD = "password123";

const STAFF: {
  name: string;
  emailLocal: string;
  role: UserRoleId;
  position: string;
}[] = [
  { name: "Irkif", emailLocal: "irkif", role: "admin", position: "Admin" },
  { name: "Erlin", emailLocal: "erlin", role: "admin", position: "Admin" },
  { name: "Aji", emailLocal: "aji", role: "admin", position: "Admin" },
  { name: "Guntur", emailLocal: "guntur", role: "admin", position: "Admin" },
  { name: "Ghevira", emailLocal: "ghevira", role: "admin", position: "Admin" },
  { name: "Nesya", emailLocal: "nesya", role: "admin", position: "Admin" },
  { name: "Chai", emailLocal: "chai", role: "admin", position: "Admin" },
  { name: "Guest", emailLocal: "guest", role: "viewer", position: "Viewer" },
  { name: "Ilal", emailLocal: "ilal", role: "admin", position: "Admin" },
];

async function findUserIdByEmail(email: string): Promise<string | null> {
  const [row] = await db
    .select({ id: authUserTable.id })
    .from(authUserTable)
    .where(eq(authUserTable.email, email))
    .limit(1);
  return row?.id ?? null;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const mode = apply ? "APPLY" : "DRY-RUN";
  const brands = await getBrands();
  const brandAccess = brands.map((brand) => brand.id);

  console.log(`[${mode}] password=${SHARED_PASSWORD}`);
  console.log(`[${mode}] brandAccess=${brandAccess.join(", ") || "(none)"}`);
  console.log("--- plan ---");
  for (const staff of STAFF) {
    const email = `${staff.emailLocal}@gbk.co.id`;
    const existingId = await findUserIdByEmail(email);
    console.log(
      `  ${existingId ? "update" : "create"}  ${staff.name.padEnd(10)} ${email}  (${staff.role})`,
    );
  }

  if (!apply) {
    console.log("\nDry-run only. Re-run with --apply to write users.");
    return;
  }

  // Warm Better Auth password hasher once.
  await auth.$context;

  let created = 0;
  let updated = 0;

  for (const staff of STAFF) {
    const email = `${staff.emailLocal}@gbk.co.id`;
    const existingId = await findUserIdByEmail(email);

    if (existingId) {
      await updateUser(existingId, {
        name: staff.name,
        email,
        position: staff.position,
        role: staff.role,
        status: "active",
        brandAccess,
        avatarUrl: "",
      });
      await setUserPassword(existingId, SHARED_PASSWORD);
      updated += 1;
      console.log(`  ✓ updated ${email}`);
      continue;
    }

    await createUser(
      {
        name: staff.name,
        email,
        position: staff.position,
        role: staff.role,
        status: "active",
        brandAccess,
        avatarUrl: "",
      },
      { password: SHARED_PASSWORD },
    );
    created += 1;
    console.log(`  ✓ created ${email}`);
  }

  console.log("\n--- result ---");
  console.log(`created=${created} updated=${updated}`);
  console.log(`password for all: ${SHARED_PASSWORD}`);
  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
