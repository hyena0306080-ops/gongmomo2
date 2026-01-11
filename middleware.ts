import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ API 요청은 건드리지 않음
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // ✅ 관리자 로그인 페이지는 무조건 허용
  if (pathname === "/admin-login") {
    return NextResponse.next();
  }

  // ✅ 관리자 페이지 보호
  if (pathname.startsWith("/admin")) {
    const adminAuth = request.cookies.get("admin_auth")?.value;

    if (!adminAuth) {
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
