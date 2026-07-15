import type { Metadata } from "next";
import { LoginView } from "@/components/auth/login-view";
import { CMS_NAME } from "@/config/nav";

export const metadata: Metadata = {
  title: `Sign In · ${CMS_NAME}`,
  description: "Sign in to manage your company profile content.",
};

export default function LoginPage() {
  return <LoginView />;
}
