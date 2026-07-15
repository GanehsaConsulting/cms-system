import { WallpaperBootLayer } from "@/components/shared/wallpaper-boot-layer";
import { createRootAppearanceBootstrapScript } from "@/lib/appearance/bootstrap-script";

const BOOTSTRAP_SCRIPT = createRootAppearanceBootstrapScript();

/** Boot wallpaper DOM + blocking script so appearance matches localStorage before paint. */
export function RootAppearanceBootstrap() {
  return (
    <>
      <WallpaperBootLayer />
      <script
        id="cms-bootstrap"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: blocking localStorage sync before paint
        dangerouslySetInnerHTML={{ __html: BOOTSTRAP_SCRIPT }}
      />
    </>
  );
}
