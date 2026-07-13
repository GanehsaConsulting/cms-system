"use client";

import { useServerInsertedHTML } from "next/navigation";
import { createRootAppearanceBootstrapScript } from "@/lib/appearance/bootstrap-script";

const BOOTSTRAP_SCRIPT = createRootAppearanceBootstrapScript();

export function RootBootstrapScript() {
  useServerInsertedHTML(() => (
    <script
      id="cms-bootstrap"
      dangerouslySetInnerHTML={{ __html: BOOTSTRAP_SCRIPT }}
    />
  ));

  return null;
}
