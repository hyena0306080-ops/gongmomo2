import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const CONTESTS_KEY = "contests";

/**
 * 공모전 목록 조회
 */
export async function GET() {
  try {
    const contests = (await kv.get<any[]>(CONTESTS_KEY)) || [];
    return NextResponse.json(contests);
  } catch (e) {
    return NextResponse.json({ error: "GET 실패" }, { status: 500 });
  }
}

/**
 * 공모전 추가
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, period } = body;

    if (!title || !period) {
      return NextResponse.json(
        { error: "title, period 필수" },
        { status: 400 }
      );
    }

    const contests = (await kv.get<any[]>(CONTESTS_KEY)) || [];

    const newContest = {
      id: Date.now().toString(), // ⭐ id 필수
      title,
      period,
    };

    contests.push(newContest);
    await kv.set(CONTESTS_KEY, contests);

    return NextResponse.json(newContest);
  } catch (e) {
    return NextResponse.json({ error: "POST 실패" }, { status: 500 });
  }
}

/**
 * 공모전 삭제 ⭐ 핵심
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id 없음" },
        { status: 400 }
      );
    }

    const contests = (await kv.get<any[]>(CONTESTS_KEY)) || [];

    const filtered = contests.filter((c) => c.id !== id);

    await kv.set(CONTESTS_KEY, filtered);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "DELETE 실패" }, { status: 500 });
  }
}
