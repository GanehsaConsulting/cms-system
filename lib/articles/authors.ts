import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema";
import { getCurrentCmsUser } from "@/lib/users/current";

export interface ArticleAuthorOption {
  id: string;
  name: string;
  image: string | null;
}

/** Active CMS users who can be selected as article authors. */
export async function getArticleAuthorOptions(): Promise<
  ArticleAuthorOption[]
> {
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
    })
    .from(user)
    .where(and(eq(user.status, "active")))
    .orderBy(asc(user.name));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    image: row.image,
  }));
}

/** Signed-in CMS user as the fixed article author. */
export async function getCurrentArticleAuthor(): Promise<ArticleAuthorOption | null> {
  const currentUser = await getCurrentCmsUser();

  if (!currentUser) {
    return null;
  }

  return {
    id: currentUser.id,
    name: currentUser.name,
    image: currentUser.avatarUrl.trim() || null,
  };
}

export async function findArticleAuthorByName(
  name: string,
): Promise<ArticleAuthorOption | null> {
  const trimmed = name.trim();
  if (!trimmed) {
    return null;
  }

  const authors = await getArticleAuthorOptions();
  return (
    authors.find(
      (author) => author.name.toLowerCase() === trimmed.toLowerCase(),
    ) ?? null
  );
}
