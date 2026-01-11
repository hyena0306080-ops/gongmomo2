"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!password) {
      alert("관리자 비밀번호를 입력하세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/admin";
      } else {
        alert("비밀번호가 틀렸습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2">🔐 관리자 로그인</h1>
        <p className="text-sm text-gray-500 mb-5">
          비밀번호를 입력하면 관리자 페이지에 접근할 수 있습니다.
        </p>

        <label className="text-sm font-medium">관리자 비밀번호</label>
        <input
          type="password"
          className="w-full border rounded-lg px-3 py-2 mt-1 mb-4"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") login();
          }}
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-black text-white rounded-lg py-2 font-medium disabled:opacity-60"
        >
          {loading ? "확인 중..." : "로그인"}
        </button>

        <p className="text-xs text-gray-400 mt-4">
          ※ 비밀번호는 Vercel 환경변수(ADMIN_PASSWORD)로 설정됩니다.
        </p>
      </div>
    </main>
  );
}
