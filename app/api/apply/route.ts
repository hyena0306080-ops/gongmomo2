import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "contests.json");

function readContests(): any[] {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeContests(data: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/** 공모전 목록 조회 (학생/관리자 공용) */
export async function GET() {
  return NextResponse.json(readContests());
}

/** 공모전 추가 (관리자) */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const contests = readContests();

    const newContest = {
      id: Date.now(),
      title: body.title,
      description: body.description,
      startDate: body.startDate,
      endDate: body.endDate,
      createdAt: new Date().toISOString(),
    };

    contests.push(newContest);
    writeContests(contests);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "FAILED_TO_CREATE" },
      { status: 500 }
    );
  }
}

/** 공모전 삭제 (관리자) */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const contests = readContests();

    const filtered = contests.filter(
      (c) => c.id !== id
    );

    writeContests(filtered);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "FAILED_TO_DELETE" },
      { status: 500 }
    );
  }
}
