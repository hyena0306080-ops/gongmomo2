import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "data", "contests.json");

function read() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function write(data: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/* 학생/관리자 공통: 공모전 목록 */
export async function GET() {
  return NextResponse.json(read());
}

/* 관리자: 공모전 추가 */
export async function POST(req: Request) {
  const { title, period } = await req.json();

  const data = read();
  data.push({
    id: "c" + Date.now(),
    title,
    period,
  });

  write(data);
  return NextResponse.json({ success: true });
}

/* 관리자: 공모전 삭제 */
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const data = read().filter((c: any) => c.id !== id);
  write(data);
  return NextResponse.json({ success: true });
}
