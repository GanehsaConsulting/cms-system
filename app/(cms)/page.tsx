import { FileTextIcon } from "@/lib/icons";
import Link from "next/link";
import { CmsPageShell } from "@/components/shared/cms-page-shell";
import { GlassSurface } from "@/components/shared/glass-surface";
import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/shared/stat-tile";
import { Button } from "@/components/ui/button";
import { RADIUS_ICON_WELL } from "@/config/shape";
import { GRID_GAP, STACK_GAP } from "@/config/spacing";
import { WIDGET_TILE_STYLES } from "@/config/widget-tiles";
import { getArticles } from "@/lib/db/articles";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const articles = await getArticles();
  const publishedCount = articles.filter(
    (article) => article.status === "published",
  ).length;
  const draftCount = articles.filter(
    (article) => article.status === "draft",
  ).length;

  return (
    <CmsPageShell
      contentClassName={STACK_GAP}
      header={
        <PageHeader
          title="Dashboard"
          description="Ringkasan konten company profile"
        />
      }
    >
      <div className={cn("grid sm:grid-cols-2", GRID_GAP)}>
        <StatTile
          label="Total Artikel"
          value={articles.length}
          description="Semua artikel di CMS"
          icon={FileTextIcon}
          style={WIDGET_TILE_STYLES.primary}
        />
        <StatTile
          label="Published"
          value={publishedCount}
          description={`${draftCount} masih draft`}
          icon={FileTextIcon}
          style={WIDGET_TILE_STYLES.accent}
        />
      </div>

      <GlassSurface className="p-5 text-card-foreground">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              RADIUS_ICON_WELL,
              "flex size-10 items-center justify-center bg-primary/15 text-primary",
            )}
          >
            <FileTextIcon className="size-5" />
          </div>
          <div>
            <p className="font-medium text-sm">Kelola Artikel</p>
            <p className="text-muted-foreground text-sm">
              Buat, edit, dan publikasikan artikel company profile.
            </p>
          </div>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/articles" />}
          className="mt-4"
          variant="outline"
        >
          Lihat semua artikel
        </Button>
      </GlassSurface>
    </CmsPageShell>
  );
}
