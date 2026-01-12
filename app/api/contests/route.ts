import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const KEY = "contests";

/**
 * 공모전 목록 조회 (학생/관리자 공용)
 */
export async function GET() {
  const contests = (await kv.get<any[]>(KEY)) || [];
  return NextResponse.json(contests);
}

/**
 * 공모전 추가 (관리자)
 */
export async function POST(req: Request) {
  const body = await req.json();
  const { title, period } = body;

  if (!title || !period) {
    return NextResponse.json({ error: "invalid data" }, { status: 400 });
  }

  const contests = (await kv.get<any[]>(KEY)) || [];

  const newContest = {
    id: Date.now().toString(),
    title,
    period,
  };

  contests.push(newContest);
  await kv.set(KEY, contests);

  return NextResponse.json(newContest);
}

/**
 * 공모전 삭제 (관리자)
 */
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "no id" }, { status: 400 });
  }

  const contests = (await kv.get<any[]>(KEY)) || [];
  const filtered = contests.filter((c) => c.id !== id);

  await kv.set(KEY, filtered);

  return NextResponse.json({ success: true });
}
