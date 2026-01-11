"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const emptyForm = {
    studentId: "",
    department: "",
    name: "",
    phone: "",
    awards: "",
    role: "팀원",
    password: "",
    selectedContests: [] as string[],
  };

  const [form, setForm] = useState(emptyForm);
  const [lookup, setLookup] = useState({ studentId: "", password: "" });
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [contests, setContests] = useState<any[]>([]);

  /* ---------- 공모전 목록 ---------- */
  async function fetchContests() {
    const res = await fetch("/api/contests");
    setContests(await res.json());
  }

  /* ---------- 신청 현황 ---------- */
  async function fetchCounts() {
    const res = await fetch("/api/apply");
    const data = await res.json();

    const result: Record<string, number> = {};
    data.forEach((d: any) => {
      d.selectedContests?.forEach((cid: string) => {
        result[cid] = (result[cid] || 0) + 1;
      });
    });
    setCounts(result);
  }

  function toggleContest(id: string) {
    setForm((p) => ({
      ...p,
      selectedContests: p.selectedContests.includes(id)
        ? p.selectedContests.filter((c) => c !== id)
        : [...p.selectedContests, id],
    }));
  }

  /* ---------- 신규 신청 ---------- */
  async function submit() {
    const payload = {
      ...form,
      awards: form.awards.trim() === "" ? "없음" : form.awards,
    };

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 409) {
      alert("이미 해당 학번으로 신청되어 있습니다.");
      return;
    }

    alert("신청 완료");
    setForm(emptyForm);
    fetchCounts();
  }

  /* ---------- 내 신청 조회 ---------- */
  async function lookupMine() {
    const res = await fetch("/api/apply", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lookup),
    });

    if (!res.ok) {
      alert("학번 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    const data = await res.json();
    setForm({ ...data, password: lookup.password });
  }

  /* ---------- 수정 ---------- */
  async function updateMine() {
    await fetch("/api/apply", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        awards: form.awards.trim() === "" ? "없음" : form.awards,
      }),
    });
    alert("수정 완료");
    fetchCounts();
  }

  /* ---------- 취소 ---------- */
  async function cancelMine() {
    if (!confirm("정말 신청을 취소하시겠습니까?")) return;

    await fetch("/api/apply", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lookup),
    });

    alert("신청 취소됨");
    setForm(emptyForm);
    fetchCounts();
  }

  useEffect(() => {
    fetchContests();
    fetchCounts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">🏆 2026 공명 공모전 인원 매칭</h1>

      {/* ✅ 신청 현황 최상단 */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">📊 공모전 신청 현황</h2>
        {contests.map((c) => (
          <p key={c.id}>
            {c.title}: <b>{counts[c.id] || 0}명</b>
          </p>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 신청 / 수정 */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">📝 공모전 신청 / 수정</h2>

          {[
            ["학번", "studentId"],
            ["학과(부)", "department"],
            ["이름", "name"],
            ["전화번호", "phone"],
            ["수상 경력 (없으면 비워두세요)", "awards"],
            ["비밀번호", "password"],
          ].map(([label, key]) => (
            <input
              key={key}
              placeholder={label}
              type={key === "password" ? "password" : "text"}
              className="w-full border rounded px-3 py-2"
              value={(form as any)[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />
          ))}

          <div className="space-y-2">
            {contests.map((c) => (
              <label key={c.id} className="block">
                <input
                  type="checkbox"
                  checked={form.selectedContests.includes(c.id)}
                  onChange={() => toggleContest(c.id)}
                />
                {" "}{c.title}
                <span className="text-sm text-gray-500 ml-2">
                  ({c.period})
                </span>
              </label>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            ※ 비밀번호 입력 시 신청 내용 수정 및 취소 가능
          </p>

          <div className="flex gap-2">
            <button onClick={submit} className="flex-1 bg-black text-white py-2 rounded">
              신규 신청
            </button>
            <button onClick={updateMine} className="flex-1 bg-blue-600 text-white py-2 rounded">
              수정
            </button>
            <button onClick={cancelMine} className="flex-1 bg-red-600 text-white py-2 rounded">
              취소
            </button>
          </div>
        </div>

        {/* 조회 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🔑 내 신청 조회</h2>
          <input
            placeholder="학번"
            className="w-full border rounded px-3 py-2 mb-2"
            onChange={(e) => setLookup({ ...lookup, studentId: e.target.value })}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full border rounded px-3 py-2 mb-4"
            onChange={(e) => setLookup({ ...lookup, password: e.target.value })}
          />
          <button onClick={lookupMine} className="w-full bg-gray-800 text-white py-2 rounded">
            조회
          </button>
        </div>
      </div>
    </main>
  );
}
