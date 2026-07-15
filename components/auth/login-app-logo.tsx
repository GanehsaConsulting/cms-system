import Image from "next/image";
import { SYSTEM_LOGO_SRC } from "@/config/system-brand";
import { GLASS_SURFACE } from "@/config/glass";
import { cn } from "@/lib/utils";

/** Matches login field glass treatment. */
const LOGIN_GLASS = cn(
  GLASS_SURFACE,
  "border-0 bg-background/20! shadow-none backdrop-blur-sm backdrop-saturate-150 dark:bg-background/50!",
);

export function LoginAppLogo() {
  return (
    <span
      className={cn(
        LOGIN_GLASS,
        "relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full p-2",
      )}
      aria-hidden
    >
      <Image
        src={SYSTEM_LOGO_SRC}
        alt=""
        width={72}
        height={72}
        priority
        className="size-full object-contain"
      />
    </span>
  );
}
