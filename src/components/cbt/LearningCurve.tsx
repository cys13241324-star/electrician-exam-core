"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readAttempts } from "@/lib/cbt/stats";
import { mockExams } from "@/lib/cbt/mockData";

type Point = {
  ts: number;
  score: number;
};

export default function LearningCurve() {
  const [points, setPoints] = useState<Point[] | null>(null);

  useEffect(() => {
    const attempts = readAttempts().filter((a) => a.submittedAt !== null);
    const out: Point[] = [];
    for (const a of attempts) {
      const exam = mockExams.find((e) => e.id === a.examId);
      if (!exam) continue;
      let correct = 0;
      exam.questions.forEach((q, i) => {
        if (a.answers[i] === q.answer) correct++;
      });
      out.push({
        ts: a.submittedAt ?? 0,
        score: Math.round((correct / exam.totalQuestions) * 100),
      });
    }
    out.sort((a, b) => a.ts - b.ts);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage attempts 집계 → 학습 곡선 데이터
    setPoints(out);
  }, []);

  if (points === null) {
    return (
      <div className="rounded-md bg-zinc-50 px-4 py-6 text-center text-xs text-zinc-500">
        불러오는 중...
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="rounded-md bg-zinc-50 px-4 py-8 text-center">
        <p className="text-xs text-zinc-600">
          모의고사를 응시하면 점수 변화가 표시됩니다.
        </p>
        <Link
          href="/cbt/exams"
          className="mt-3 inline-block rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          첫 응시하기 →
        </Link>
      </div>
    );
  }

  const avg = Math.round(
    points.reduce((a, p) => a + p.score, 0) / points.length,
  );
  const trend =
    points.length >= 2
      ? points[points.length - 1].score - points[0].score
      : 0;
  const recent = points.slice(-6);

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-zinc-500">평균 점수</p>
          <p className="text-2xl font-bold text-zinc-900">{avg}점</p>
        </div>
        <span
          className={
            trend > 0
              ? "text-sm font-bold text-emerald-600"
              : trend < 0
                ? "text-sm font-bold text-rose-600"
                : "text-sm text-zinc-500"
          }
        >
          {trend > 0 ? `▲ +${trend}점` : trend < 0 ? `▼ ${trend}점` : "변동 없음"}
        </span>
      </div>

      <ul className="mt-4 divide-y divide-zinc-100 border-t border-zinc-100">
        {recent.map((p, i) => {
          const d = new Date(p.ts);
          const pass = p.score >= 60;
          return (
            <li
              key={i}
              className="flex items-center justify-between py-2 text-sm"
            >
              <span className="text-zinc-500">
                {d.getMonth() + 1}.{d.getDate()}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900">{p.score}점</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                    pass
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {pass ? "합격" : "불합격"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-2 text-[11px] text-zinc-500">
        총 {points.length}회 응시 · 합격선 60점
      </p>
    </div>
  );
}
