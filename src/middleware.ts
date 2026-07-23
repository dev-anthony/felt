// src/middleware.ts
import { NextResponse } from "next/server";

// No request inspection is needed: auth is validated client-side by UserProvider,
// so the middleware only exists to let matched routes through untouched.
export function middleware() {
  // Let the client-side context (UserProvider) safely handle validation and route guards.
  // This completely eliminates Next.js Edge code trying to read cross-domain HTTP-Only cookies.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};