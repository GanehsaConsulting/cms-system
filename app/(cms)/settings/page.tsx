import { SettingsView } from "@/components/cms/settings-view";
import { CmsPageShell } from "@/components/shared/cms-page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { STACK_GAP } from "@/config/spacing";

export default function SettingsPage() {
  return (
    <CmsPageShell
      contentClassName={STACK_GAP}
      header={
        <PageHeader
          title="Pengaturan"
          description="Preferensi dan konfigurasi CMS"
        />
      }
    >
      <SettingsView />
    </CmsPageShell>
  );
}
