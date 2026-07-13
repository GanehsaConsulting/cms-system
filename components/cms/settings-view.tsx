import { GlassSurface } from "@/components/shared/glass-surface";
import { OpenAppearanceButton } from "@/components/cms/open-appearance-button";

export function SettingsView() {
  return (
    <GlassSurface className="space-y-4 p-5">
      <div>
        <p className="font-medium text-sm">Pengaturan CMS</p>
        <p className="mt-1 text-muted-foreground text-sm">
          Area ini untuk preferensi aplikasi. Kontrol tampilan visual ada di
          Appearance.
        </p>
      </div>
      <OpenAppearanceButton />
    </GlassSurface>
  );
}
