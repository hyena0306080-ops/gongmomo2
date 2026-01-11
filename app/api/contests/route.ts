import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const CONTESTS_KEY = "contests";

/**
 * 공모전 목록 조회 (학생/관리자 공용)
 */
export async function GET() {
  const contests = (await kv.get(CONTESTS_KEY)) || [];
  return NextResponse.json(contests);
}

/**
 * 공모전 추가 (관리자)
 * body: { title: string, period: string }
 */
export async function POST(req: Request) {
  try {
    const { title, period } = await req.json();

    if (!title || !period) {
      return NextResponse.json(
        { error: "제목과 모집기간은 필수입니다." },
        { status: 400 }
      );
    }

    const contests: any[] = (await kv.get(CONTESTS_KEY)) || [];

    const newContest = {
      id: Date.now(), // 고유 ID
      title,
      period,
    };

    contests.push(newContest);

    await kv.set(CONTESTS_KEY, contests);

    return NextResponse.json(newContest);
  } catch (e) {
    return NextResponse.json({ error: "추가 실패" }, { status: 500 });
  }
}

/**
 * 공모전 삭제 (관리자)
 * body: { id: number }
 */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "삭제할 공모전 ID가 없습니다." },
        { status: 400 }
      );
    }

    const contests: any[] = (await kv.get(CONTESTS_KEY)) || [];

    const filtered = contests.filter((c) => c.id !== id);

    await kv.set(CONTESTS_KEY, filtered);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
