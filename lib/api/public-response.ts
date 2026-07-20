import { NextResponse } from "next/server";

const CORS_HEADERS: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export function publicCorsHeaders(): HeadersInit {
  return CORS_HEADERS;
}

export function publicOptionsResponse(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export function publicJson<T>(
  data: T,
  init?: { status?: number; headers?: HeadersInit },
): NextResponse {
  return NextResponse.json(
    { data },
    {
      status: init?.status ?? 200,
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        ...init?.headers,
      },
    },
  );
}

export function publicError(
  message: string,
  status: number,
): NextResponse {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: CORS_HEADERS,
    },
  );
}
