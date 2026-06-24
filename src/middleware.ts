import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/onboarding", "/settings", "/workspace"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname, searchParams } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users to landing with auth dialog trigger
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("auth", "true");
    return NextResponse.redirect(url);
  }

  // Strip ?auth=true from URL once user is authenticated (clean URLs)
  if (token && searchParams.get("auth") === "true") {
    const url = request.nextUrl.clone();
    url.searchParams.delete("auth");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};