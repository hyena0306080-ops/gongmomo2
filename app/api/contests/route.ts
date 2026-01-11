import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const CONTESTS_KEY = "contests";

/** 공모전 목록 조회 */
export async function GET() {
  try {
    const contests = await kv.get(CONTESTS_KEY);
    return NextResponse.json(contests ?? []);
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}

/** 공모전 삭제 */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const contests = (await kv.get<any[]>(CONTESTS_KEY)) ?? [];

    const filtered = contests.filter(
      (contest) => contest.id !== id
    );

    await kv.set(CONTESTS_KEY, filtered);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "delete failed" },
      { status: 500 }
    );
  }
}
