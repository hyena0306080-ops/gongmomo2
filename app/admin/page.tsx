"use client";

import { useEffect, useState } from "react";

type Contest = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

export default function AdminPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchContests() {
    try {
      const res = await fetch("/api/contests", { cache: "no-store" });
      const data = await res.json();

      if (Array.isArray(data)) {
        setContests(data);
      } else {
        setContests([]);
      }
    } catch (e) {
      console.error("공모전 불러오기 실패", e);
      setContests([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteContest(id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    await fetch("/api/contests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchContests(); // 🔥 삭제 후 다시 불러오기
  }

  useEffect(() => {
    fetchContests();
  }, []);

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>관리자 페이지</h1>

      {contests.length === 0 && (
        <p>등록된 공모전이 없습니다</p>
      )}

      {contests.map((c) => (
        <div
          key={c.id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 10,
          }}
        >
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p>
            {c.startDate} ~ {c.endDate}
          </p>
          <button onClick={() => deleteContest(c.id)}>
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
