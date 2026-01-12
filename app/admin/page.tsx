"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [contests, setContests] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");

  // 공모전 불러오기
  const fetchContests = async () => {
    const res = await fetch("/api/contests");
    const data = await res.json();
    setContests(data);
  };

  useEffect(() => {
    fetchContests();
  }, []);

  // 공모전 추가
  const addContest = async () => {
    if (!title || !period) {
      alert("공모전 제목과 모집기간을 입력하세요");
      return;
    }

    await fetch("/api/contests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, period }),
    });

    setTitle("");
    setPeriod("");
    fetchContests(); // 🔥 다시 불러오기
  };

  // 공모전 삭제
  const deleteContest = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    await fetch("/api/contests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchContests(); // 🔥 이 줄이 핵심
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🛠 공모전 관리자 페이지</h1>

      <h2>공모전 추가</h2>
      <input
        placeholder="공모전 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <input
        placeholder="모집 기간"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
      />
      <br />
      <button onClick={addContest}>추가</button>

      <hr />

      <h2>공모전 목록</h2>
      {contests.length === 0 && <p>등록된 공모전이 없습니다.</p>}

      <ul>
        {contests.map((c) => (
          <li key={c.id}>
            {c.title} ({c.period}){" "}
            <button onClick={() => deleteContest(c.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
