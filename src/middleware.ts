// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/onboarding", "/settings", "/workspace"];

export function middleware(request: NextRequest) {
  // Pull the httpOnly access token from the request headers
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    
    // Instead of completely throwing them off, we keep them on their path
    // and flag the URL so layout.tsx opens the dialog automatically.
    if (!url.searchParams.has("auth")) {
      url.searchParams.set("auth", "true");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};