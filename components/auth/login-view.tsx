"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useAppearance } from "@/components/shared/appearance-provider";
import { cn } from "@/lib/utils";

export function LoginView() {
  const { resolvedDark } = useAppearance();

  return (
    <main className="relative flex min-h-svh overflow-hidden">
      <div className="relative z-10 flex min-h-svh w-full items-center justify-center px-6">
        <LoginForm />
      </div>

      <p
        className={cn(
          "pointer-events-none absolute right-0 bottom-10 left-0 z-10 text-center text-[11px]",
          resolvedDark ? "text-white/55" : "text-black/45",
        )}
      >
        Enter your username and password to sign in
      </p>
    </main>
  );
}
