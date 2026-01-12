import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "contests.json");

function readData() {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeData(data: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ✅ 공모전 목록 조회
export async function GET() {
  return NextResponse.json(readData());
}

// ✅ 공모전 추가
export async function POST(req: Request) {
  const body = await req.json();
  const data = readData();

  data.push({
    id: Date.now(),
    title: body.title,
    description: body.description,
    startDate: body.startDate,
    endDate: body.endDate,
  });

  writeData(data);
  return NextResponse.json({ success: true });
}

// ✅ 공모전 삭제
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const data = readData();

  const filtered = data.filter((c) => c.id !== id);
  writeData(filtered);

  return NextResponse.json({ success: true });
}
