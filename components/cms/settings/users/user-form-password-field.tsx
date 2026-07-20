"use client";

import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { USER_PASSWORD_LIMITS, generateUserPassword } from "@/lib/users/password";

interface UserFormPasswordFieldProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function UserFormPasswordField({
  value,
  disabled = false,
  onChange,
}: UserFormPasswordFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="user-password">Password</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={disabled}
          onClick={() => onChange(generateUserPassword())}
        >
          Generate password
        </Button>
      </div>
      <PasswordInput
        id="user-password"
        autoComplete="new-password"
        value={value}
        maxLength={USER_PASSWORD_LIMITS.max}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="text-muted-foreground text-xs">
        At least {USER_PASSWORD_LIMITS.min} characters. Share this with the user
        after creating the account.
      </p>
    </div>
  );
}
