import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return new NextResponse("ADMIN_PASSWORD not set", { status: 500 });
  }

  if (password === adminPassword) {
    const res = NextResponse.json({ ok: true });

    // 쿠키로 인증 유지
    res.cookies.set("admin_auth", password, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30일
    });

    return res;
  }

  return new NextResponse("Unauthorized", { status: 401 });
}
