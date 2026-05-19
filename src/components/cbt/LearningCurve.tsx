"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readAttempts } from "@/lib/cbt/stats";
import { mockExams } from "@/lib/cbt/mockData";

type Point = {
  ts: number;
  score: number;
  examTitle: string;
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
      const score = Math.round((correct / exam.totalQuestions) * 100);
      out.push({
        ts: a.submittedAt ?? 0,
        score,
        examTitle: exam.title,
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
          모의고사를 응시하면 점수 변화가 그래프로 보입니다.
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

  // SVG line chart
  const W = 300;
  const H = 140;
  const padL = 28, padR = 8, padT = 12, padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxScore = 100;
  const passLineY = padT + plotH - (60 / maxScore) * plotH;
  const xs = points.map((_, i) =>
    points.length === 1
      ? padL + plotW / 2
      : padL + (i / (points.length - 1)) * plotW,
  );
  const ys = points.map((p) => padT + plotH - (p.score / maxScore) * plotH);
  const path = points
    .map((_, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${ys[i]}`)
    .join(" ");

  const trend =
    points.length >= 2
      ? points[points.length - 1].score - points[0].score
      : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[11px]">
        <span className="text-zinc-500">최근 점수 변화</span>
        <span
          className={
            trend > 0
              ? "font-bold text-emerald-600"
              : trend < 0
                ? "font-bold text-rose-600"
                : "text-zinc-500"
          }
        >
          {trend > 0 ? `▲ +${trend}점` : trend < 0 ? `▼ ${trend}점` : "변동 없음"}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full">
        {/* y axis ticks */}
        {[0, 50, 100].map((v) => {
          const y = padT + plotH - (v / maxScore) * plotH;
          return (
            <g key={v}>
              <line
                x1={padL}
                x2={padL + plotW}
                y1={y}
                y2={y}
                stroke="#f1f5f9"
              />
              <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                {v}
              </text>
            </g>
          );
        })}
        {/* pass line 60 */}
        <line
          x1={padL}
          x2={padL + plotW}
          y1={passLineY}
          y2={passLineY}
          stroke="#10b981"
          strokeWidth="1"
          strokeDasharray="3,3"
        />
        <text x={padL + plotW - 4} y={passLineY - 3} textAnchor="end" fontSize="9" fill="#10b981">
          합격선 60
        </text>
        {/* path */}
        <path d={path} fill="none" stroke="#2563eb" strokeWidth="2" />
        {/* points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={xs[i]} cy={ys[i]} r="4" fill="#2563eb" />
            <text
              x={xs[i]}
              y={ys[i] - 8}
              textAnchor="middle"
              fontSize="9"
              fontWeight="bold"
              fill="#1e3a8a"
            >
              {p.score}
            </text>
          </g>
        ))}
        {/* x labels */}
        {points.map((p, i) => {
          const d = new Date(p.ts);
          const lbl = `${d.getMonth() + 1}.${d.getDate()}`;
          return (
            <text
              key={i}
              x={xs[i]}
              y={padT + plotH + 14}
              textAnchor="middle"
              fontSize="9"
              fill="#64748b"
            >
              {lbl}
            </text>
          );
        })}
      </svg>
      <p className="mt-1 text-[11px] text-zinc-500">
        총 {points.length}회 응시 · 평균{" "}
        {Math.round(points.reduce((a, p) => a + p.score, 0) / points.length)}점
      </p>
    </div>
  );
}
