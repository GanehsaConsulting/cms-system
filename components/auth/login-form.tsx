"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LoginAppLogo } from "@/components/auth/login-app-logo";
import { useAppearance } from "@/components/shared/appearance-provider";
import { Input } from "@/components/ui/input";
import { GLASS_SURFACE } from "@/config/glass";
import { CaretRightIcon, EyeIcon, EyeSlashIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const FIELD_SURFACE = cn(
  GLASS_SURFACE,
  "border-0 bg-background/20! shadow-none backdrop-blur-xl backdrop-saturate-250 dark:bg-background/50!",
);

const FIELD_CLASS = cn(
  FIELD_SURFACE,
  "h-7 w-full rounded-xl px-4 text-left text-[15px] text-foreground",
  "placeholder:text-muted-foreground/65!",
  "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-white/30",
);

const ENTER_BUTTON_CLASS = cn(
  FIELD_SURFACE,
  "flex size-7 shrink-0 items-center justify-center rounded-xl text-foreground",
  "transition-colors hover:bg-background/35",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
  "disabled:pointer-events-none disabled:opacity-50",
);

export function LoginForm() {
  const router = useRouter();
  const { resolvedDark } = useAppearance();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const showEnterButton = password.length > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName || !password) {
      setError("Enter your name and password to continue.");
      return;
    }

    startTransition(() => {
      router.push("/");
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex w-full max-w-70 flex-col items-center"
      noValidate
    >
      {/* Logo sits above the centered inputs without shifting their midpoint. */}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-5 -translate-x-1/2">
        <div className="pointer-events-auto">
          <LoginAppLogo />
        </div>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        <Input
          id="login-name"
          name="name"
          autoComplete="username"
          placeholder="Username"
          value={name}
          disabled={isPending}
          onChange={(event) => setName(event.target.value)}
          className={FIELD_CLASS}
          aria-label="Name"
        />

        <div className="flex w-full items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Input
              id="login-password"
              name="password"
              type={passwordVisible ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter Password"
              value={password}
              disabled={isPending}
              onChange={(event) => setPassword(event.target.value)}
              className={cn(FIELD_CLASS, "pr-9")}
              aria-label="Password"
            />
            <button
              type="button"
              disabled={isPending}
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              aria-pressed={passwordVisible}
              onClick={() => setPasswordVisible((visible) => !visible)}
              className={cn(
                "absolute top-1/2 right-1.5 flex size-5 -translate-y-1/2 items-center justify-center rounded-md",
                "text-muted-foreground transition-colors hover:text-foreground",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              {passwordVisible ? (
                <EyeSlashIcon className="size-3.5" />
              ) : (
                <EyeIcon className="size-3.5" />
              )}
            </button>
          </div>

          {showEnterButton ? (
            <button
              type="submit"
              disabled={isPending}
              aria-label="Sign in"
              className={ENTER_BUTTON_CLASS}
            >
              <CaretRightIcon className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p
          className={cn(
            "mt-3 text-center text-sm",
            resolvedDark ? "text-white/90" : "text-black/80",
          )}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
