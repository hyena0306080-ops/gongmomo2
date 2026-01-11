import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const filePath = path.join(process.cwd(), "data", "applications.json");

function readData(): any[] {
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

function hash(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

function withoutPassword(item: any) {
  const { password, ...rest } = item;
  return rest;
}

/** 전체 조회 (현황용) */
export async function GET() {
  return NextResponse.json(readData().map(withoutPassword));
}

/** 신규 신청 */
export async function POST(req: Request) {
  const body = await req.json();
  const data = readData();

  // 🔒 같은 학번 중복 신청 차단
  if (data.some((d) => d.studentId === body.studentId)) {
    return NextResponse.json(
      { error: "DUPLICATE_STUDENT" },
      { status: 409 }
    );
  }

  data.push({
    id: Date.now(),
    studentId: body.studentId,
    department: body.department,
    name: body.name,
    phone: body.phone,
    awards: body.awards,
    role: body.role,
    selectedContests: body.selectedContests,
    password: hash(body.password),
    createdAt: new Date().toISOString(),
  });

  writeData(data);
  return NextResponse.json({ success: true });
}

/** 비밀번호로 내 신청 조회 */
export async function PUT(req: Request) {
  const { studentId, password } = await req.json();
  const data = readData();

  const found = data.find(
    (d) =>
      d.studentId === studentId &&
      d.password === hash(password)
  );

  if (!found) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(withoutPassword(found));
}

/** 수정 */
export async function PATCH(req: Request) {
  const body = await req.json();
  const data = readData();

  const idx = data.findIndex(
    (d) =>
      d.studentId === body.studentId &&
      d.password === hash(body.password)
  );

  if (idx === -1) {
    return NextResponse.json({ error: "INVALID" }, { status: 403 });
  }

  data[idx] = {
    ...data[idx],
    department: body.department,
    phone: body.phone,
    awards: body.awards,
    role: body.role,
    selectedContests: body.selectedContests,
  };

  writeData(data);
  return NextResponse.json({ success: true });
}

/** 전체 취소 */
export async function DELETE(req: Request) {
  const { studentId, password } = await req.json();
  const data = readData();

  const filtered = data.filter(
    (d) =>
      !(
        d.studentId === studentId &&
        d.password === hash(password)
      )
  );

  if (filtered.length === data.length) {
    return NextResponse.json({ error: "INVALID" }, { status: 403 });
  }

  writeData(filtered);
  return NextResponse.json({ success: true });
}
