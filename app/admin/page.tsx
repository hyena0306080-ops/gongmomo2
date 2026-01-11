
"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [contests, setContests] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");

  /* ---------- 데이터 불러오기 ---------- */
  async function loadAll() {
    const c = await fetch("/api/contests").then((r) => r.json());
    const a = await fetch("/api/apply").then((r) => r.json());
    setContests(c);
    setApplications(a);
  }

  useEffect(() => {
    loadAll();
  }, []);

  /* ---------- 공모전 추가 ---------- */
  async function addContest() {
    if (!title || !period) {
      alert("공모전 제목과 모집 기간을 입력하세요.");
      return;
    }

    await fetch("/api/contests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, period }),
    });

    setTitle("");
    setPeriod("");
    loadAll();
  }

  /* ---------- 공모전 삭제 ---------- */
  async function deleteContest(id: string) {
    if (!confirm("정말 이 공모전을 삭제하시겠습니까?")) return;

    await fetch("/api/contests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadAll();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">⚙️ 관리자 페이지</h1>

      {/* ---------- 공모전 추가 ---------- */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">➕ 공모전 추가</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="공모전 제목"
            className="border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="모집 기간 (예: 2026.03.01 ~ 04.15)"
            className="border rounded px-3 py-2"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
          <button
            onClick={addContest}
            className="bg-blue-600 text-white rounded px-4 py-2"
          >
            추가
          </button>
        </div>
      </div>

      {/* ---------- 공모전별 신청 현황 ---------- */}
      <div className="space-y-8">
        {contests.map((contest) => {
          const related = applications.filter((a) =>
            a.selectedContests?.includes(contest.id)
          );

          return (
            <div
              key={contest.id}
              className="bg-white rounded-xl shadow p-6"
            >
              {/* 공모전 정보 */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {contest.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    모집 기간: {contest.period}
                  </p>
                  <p className="mt-1">
                    신청 인원: <b>{related.length}명</b>
                  </p>
                </div>
                <button
                  onClick={() => deleteContest(contest.id)}
                  className="text-red-600 text-sm"
                >
                  삭제
                </button>
              </div>

              {/* 신청자 테이블 */}
              {related.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-t">
                    <thead>
                      <tr className="text-left bg-gray-50">
                        <th className="py-2 px-2">이름</th>
                        <th className="px-2">학번</th>
                        <th className="px-2">학과</th>
                        <th className="px-2">전화번호</th>
                        <th className="px-2">수상 경력</th>
                      </tr>
                    </thead>
                    <tbody>
                      {related.map((a) => (
                        <tr key={a.id} className="border-t">
                          <td className="py-2 px-2">{a.name}</td>
                          <td className="px-2">{a.studentId}</td>
                          <td className="px-2">{a.department}</td>
                          <td className="px-2">{a.phone}</td>
                          <td className="px-2">{a.awards}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  아직 신청한 학생이 없습니다.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
