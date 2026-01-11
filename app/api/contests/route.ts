import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const CONTESTS_KEY = "contests";

/**
 * 공모전 목록 조회
 */
export async function GET() {
  try {
    const contests = (await kv.get(CONTESTS_KEY)) || [];
    return NextResponse.json(contests);
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}

/**
 * 공모전 추가
 * body: { title: string, period: string }
 */
export async function POST(req: Request) {
  try {
    const { title, period } = await req.json();

    if (!title || !period) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const contests: any[] = (await kv.get(CONTESTS_KEY)) || [];

    const newContest = {
      id: Date.now().toString(),
      title,
      period,
    };

    contests.push(newContest);
    await kv.set(CONTESTS_KEY, contests);

    return NextResponse.json(newContest);
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

/**
 * 공모전 삭제
 * query: ?id=공모전ID
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "no id" }, { status: 400 });
    }

    const contests: any[] = (await kv.get(CONTESTS_KEY)) || [];

    const filtered = contests.filter((c) => c.id !== id);

    await kv.set(CONTESTS_KEY, filtered);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }
}
