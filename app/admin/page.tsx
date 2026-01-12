"use client";

import { useEffect, useState } from "react";

type Contest = {
  id: number;
  title: string;
  startDate?: string;
  endDate?: string;
};

export default function AdminPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 공모전 목록 불러오기
  const fetchContests = async () => {
    try {
      const res = await fetch("/api/contests");

      if (!res.ok) {
        throw new Error("공모전 불러오기 실패");
      }

      const data = await res.json();

      // ⭐ 핵심: 배열 아닐 경우 방어
      if (Array.isArray(data)) {
        setContests(data);
      } else {
        setContests([]);
      }
    } catch (err) {
      console.error(err);
      setError("공모전 데이터를 불러오지 못했습니다.");
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 공모전 삭제
  const deleteContest = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch("/api/contests", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("삭제 실패");
      }

      // 🔥 다시 목록 불러오기
      fetchContests();
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>로딩 중...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>관리자 페이지</h1>

      {contests.length === 0 && (
        <p>등록된 공모전이 없습니다.</p>
      )}

      {contests.map((contest) => (
        <div
          key={contest.id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 10,
          }}
        >
          <div><strong>{contest.title}</strong></div>

          {contest.startDate && contest.endDate && (
            <div>
              {contest.startDate} ~ {contest.endDate}
            </div>
          )}

          <button
            style={{
              marginTop: 8,
              background: "red",
              color: "white",
              border: "none",
              padding: "6px 10px",
              cursor: "pointer",
            }}
            onClick={() => deleteContest(contest.id)}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
