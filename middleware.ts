import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 관리자 페이지 접근 시
  if (pathname.startsWith("/admin")) {
    const auth = request.cookies.get("admin_auth");

    // 로그인 안 했으면 무조건 로그인 페이지로
    if (!auth || auth.value !== "true") {
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
