import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const CONTESTS_KEY = "contests";

/**
 * 공모전 목록 조회
 */
export async function GET() {
  try {
    const contests = await kv.get(CONTESTS_KEY);

    // 🔥 무조건 배열만 반환
    if (!Array.isArray(contests)) {
      return NextResponse.json([]);
    }

    return NextResponse.json(contests);
  } catch (e) {
    console.error("GET /api/contests error:", e);
    return NextResponse.json([], { status: 200 });
  }
}

/**
 * 공모전 추가
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const contests = (await kv.get(CONTESTS_KEY)) as any[] | null;

    const newContest = {
      id: Date.now(),
      ...body,
    };

    const next = Array.isArray(contests)
      ? [...contests, newContest]
      : [newContest];

    await kv.set(CONTESTS_KEY, next);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/contests error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

/**
 * 공모전 삭제
 */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const contests = (await kv.get(CONTESTS_KEY)) as any[] | null;

    if (!Array.isArray(contests)) {
      return NextResponse.json({ ok: true });
    }

    const next = contests.filter((c) => c.id !== id);
    await kv.set(CONTESTS_KEY, next);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/contests error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
