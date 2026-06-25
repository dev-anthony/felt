// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Let the client-side context (UserProvider) safely handle validation and route guards.
  // This completely eliminates Next.js Edge code trying to read cross-domain HTTP-Only cookies.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};