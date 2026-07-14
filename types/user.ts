import type { UserRoleId } from "@/config/user";

export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  position: string;
  role: UserRoleId;
  status: UserStatus;
  brandAccess: string[];
  /** Data URL or remote URL — empty when unset. */
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInput {
  name: string;
  email: string;
  position: string;
  role: UserRoleId;
  status: UserStatus;
  brandAccess: string[];
  avatarUrl: string;
}
