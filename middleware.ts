import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const url = request.nextUrl;

  // /admin으로 시작하는 경로는 전부 보호
  if (url.pathname.startsWith("/admin")) {
    const auth = request.cookies.get("admin_auth")?.value;

    // 비번이 설정 안 되어 있으면(배포 환경변수 누락) 접근 막기
    if (!adminPassword) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }

    // 쿠키가 없거나 비번이 다르면 로그인 페이지로
    if (auth !== adminPassword) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
