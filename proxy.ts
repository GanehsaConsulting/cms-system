import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth", "/api/public", "/api/cron"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/**
 * Next.js 16 Proxy (formerly middleware) — runs on Node.js before the request
 * completes. Cookie presence only; full session checks stay in Server Components.
 *
 * Public API (`/api/public`) and cron (`/api/cron`) skip session gates —
 * those routes enforce their own brand / secret checks.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/wallpapers") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png" ||
    pathname === "/apple-icon.png" ||
    pathname === "/system-logo.png"
  ) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  const isPublic = isPublicPath(pathname);

  if (!sessionCookie && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (sessionCookie && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|sw\\.js|favicon\\.ico|icon\\.png|apple-icon\\.png|system-logo\\.png|wallpapers/|api/public/|api/cron/).*)",
  ],
};
