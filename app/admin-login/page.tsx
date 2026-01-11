import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 관리자 페이지 보호
  if (pathname.startsWith("/admin")) {
    const isLoggedIn = request.cookies.get("admin_auth")?.value;

    if (isLoggedIn !== "true") {
      return NextResponse.redirect(
        new URL("/admin-login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
