export type ContentActivityStatus = "draft" | "published" | "archived";

export type ContentActivityKind = "activity" | "promo";

export interface ContentActivity {
  id: string;
  brandId: string;
  title: string;
  excerpt: string;
  content: string;
  displayAt: string;
  showTitle: boolean;
  kind: ContentActivityKind;
  linkUrl: string;
  status: ContentActivityStatus;
  images: string[];
  authorName: string;
  authorId: string | null;
  authorImage?: string | null;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
  /** Set when the activity is in Trash (soft-deleted). */
  deletedAt?: string | null;
}

export interface ContentActivityInput {
  title: string;
  excerpt: string;
  content: string;
  displayAt: string;
  showTitle: boolean;
  kind: ContentActivityKind;
  linkUrl: string;
  status: ContentActivityStatus;
  images: string[];
  authorName: string;
}
