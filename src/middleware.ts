import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const profileComplete = request.cookies.get("profile_complete");
  const { pathname } = request.nextUrl;

  const isPublic =
    pathname === "/onboarding" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico";

  if (!profileComplete && !isPublic) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
