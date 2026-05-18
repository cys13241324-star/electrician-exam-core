"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readAttempts } from "@/lib/cbt/stats";
import { mockExams } from "@/lib/cbt/mockData";
import type { Attempt, Exam } from "@/lib/cbt/types";

type Row = {
  attempt: Attempt;
  exam: Exam;
  correct: number;
  total: number;
  passed: boolean;
  score100: number;
};

function computeRows(): Row[] {
  const attempts = readAttempts()
    .filter((a) => a.submittedAt !== null)
    .sort((a, b) => (b.submittedAt ?? 0) - (a.submittedAt ?? 0))
    .slice(0, 5);

  return attempts
    .map<Row | null>((attempt) => {
      const exam = mockExams.find((e) => e.id === attempt.examId);
      if (!exam) return null;
      let correct = 0;
      exam.questions.forEach((q, i) => {
        if (attempt.answers[i] === q.answer) correct += 1;
      });
      const total = exam.totalQuestions;
      const score100 = Math.round((correct / total) * 100 * 10) / 10;
      const passed = correct >= 36;
      return { attempt, exam, correct, total, passed, score100 };
    })
    .filter((r): r is Row => r !== null);
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}일 전`;
  const d = new Date(ts);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

export default function RecentAttempts() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage attempts 읽기 + window focus 이벤트 재계산
    setRows(computeRows());
    const handler = () => setRows(computeRows());
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  if (rows === null) {
    return (
      <p className="rounded-md bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">
        불러오는 중...
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center">
        <p className="text-sm text-zinc-600">
          아직 응시한 모의고사가 없습니다.
        </p>
        <Link
          href="/cbt/exams"
          className="mt-3 inline-block rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          첫 모의고사 응시하기 →
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {rows.map((r) => (
        <li
          key={`${r.exam.id}-${r.attempt.submittedAt}`}
          className="flex items-center gap-3 py-3"
        >
          <div
            className={`flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-lg text-white ${
              r.passed ? "bg-emerald-500" : "bg-rose-500"
            }`}
          >
            <span className="text-[10px] font-semibold">
              {r.passed ? "PASS" : "FAIL"}
            </span>
            <span className="text-base font-bold leading-none">
              {Math.round(r.score100)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-900">
              {r.exam.title}
            </p>
            <p className="text-xs text-zinc-500">
              {r.correct} / {r.total} 정답 ·{" "}
              {r.attempt.submittedAt ? formatTimeAgo(r.attempt.submittedAt) : "—"}
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-1">
            <Link
              href={`/cbt/${r.exam.id}/result`}
              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
            >
              결과
            </Link>
            <Link
              href={`/cbt/${r.exam.id}/review`}
              className="rounded-md bg-blue-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700"
            >
              해설
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
