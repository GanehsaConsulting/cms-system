import "dotenv/config";
import { readFileSync } from "node:fs";
import postgres from "postgres";

async function main() {
  const sqlText = readFileSync("drizzle/0004_media_scope.sql", "utf8");
  const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
  try {
    await sql.unsafe(sqlText);
    const folders = await sql.unsafe(
      "select scope, count(*)::int as n from cms.media_folders group by scope",
    );
    const files = await sql.unsafe(
      "select scope, count(*)::int as n from cms.media_files group by scope",
    );
    console.log("folders", folders);
    console.log("files", files);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
