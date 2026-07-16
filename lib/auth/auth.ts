import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { db } from "@/lib/db/client";
import { authSchema } from "@/lib/db/schema";
import { getAppUrl, getAuthSecret, getEnv } from "@/lib/env";

const env = getEnv();
const isProd = env.NODE_ENV === "production";

/**
 * Company-grade session auth:
 * - Credentials hashed by Better Auth (scrypt)
 * - Opaque DB-backed sessions (revocable)
 * - httpOnly + Secure (+ SameSite) cookies via nextCookies
 * - Short session lifetime with sliding refresh
 * - Built-in rate limiting on auth endpoints
 */
export const auth = betterAuth({
  appName: "CMS System",
  baseURL: getAppUrl(),
  secret: getAuthSecret(),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Internal CMS — no public self-signup.
    disableSignUp: true,
  },
  user: {
    additionalFields: {
      position: {
        type: "string",
        required: false,
        defaultValue: "",
        input: false,
        returned: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "viewer",
        input: false,
        returned: true,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "active",
        input: false,
        returned: true,
      },
      brandAccess: {
        type: "string",
        required: false,
        defaultValue: "[]",
        input: false,
        returned: true,
      },
    },
  },
  session: {
    expiresIn: env.AUTH_SESSION_MAX_AGE,
    updateAge: env.AUTH_SESSION_UPDATE_AGE,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      // Bump when CMS auth fields change so stale cookie cache is dropped.
      version: "cms-user-fields-v1",
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
  },
  advanced: {
    useSecureCookies: isProd,
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"],
    },
  },
  trustedOrigins: [getAppUrl()],
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 32,
    }),
    nextCookies(),
  ],
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
