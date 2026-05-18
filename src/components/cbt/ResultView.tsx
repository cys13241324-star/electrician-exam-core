"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type {
  Attempt,
  Difficulty,
  Exam,
  Frequency,
  Subject,
} from "@/lib/cbt/types";

const PASS_THRESHOLD = 36;

type SubjectStat = {
  name: Subject;
  correct: number;
  total: number;
};

type Bucket = { key: string; label: string; correct: number; total: number };

function computeStats(exam: Exam, attempt: Attempt) {
  const subjectMap = new Map<Subject, SubjectStat>();
  exam.questions.forEach((q) => {
    if (!subjectMap.has(q.subject)) {
      subjectMap.set(q.subject, { name: q.subject, correct: 0, total: 0 });
    }
    const stat = subjectMap.get(q.subject)!;
    stat.total += 1;
  });

  // 빈출도·난이도 별 정답률 — 학습 인사이트
  const freqMap = new Map<Frequency, Bucket>();
  const diffMap = new Map<Difficulty, Bucket>();
  const initFreq = (k: Frequency, label: string) =>
    freqMap.set(k, { key: k, label, correct: 0, total: 0 });
  const initDiff = (k: Difficulty, label: string) =>
    diffMap.set(k, { key: k, label, correct: 0, total: 0 });
  initFreq("high", "빈출");
  initFreq("medium", "보통 빈출");
  initFreq("low", "저빈출");
  initDiff("easy", "쉬움");
  initDiff("medium", "보통");
  initDiff("hard", "어려움");

  let totalCorrect = 0;
  exam.questions.forEach((q, idx) => {
    const isCorrect = attempt.answers[idx] === q.answer;
    const fb = freqMap.get(q.frequency ?? "medium")!;
    const db = diffMap.get(q.difficulty ?? "medium")!;
    fb.total += 1;
    db.total += 1;
    if (isCorrect) {
      const stat = subjectMap.get(q.subject)!;
      stat.correct += 1;
      totalCorrect += 1;
      fb.correct += 1;
      db.correct += 1;
    }
  });

  const subjects = Array.from(subjectMap.values());
  const frequencies = Array.from(freqMap.values()).filter((b) => b.total > 0);
  const difficulties = Array.from(diffMap.values()).filter((b) => b.total > 0);
  const passed = totalCorrect >= PASS_THRESHOLD;
  const score100 = Math.round((totalCorrect / exam.totalQuestions) * 100 * 100) / 100;
  const answeredCount = attempt.answers.filter((a) => a !== null).length;
  const margin = totalCorrect - PASS_THRESHOLD;

  return {
    totalCorrect,
    passed,
    score100,
    subjects,
    frequencies,
    difficulties,
    answeredCount,
    margin,
  };
}

function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}분 ${String(s).padStart(2, "0")}초`;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

export default function ResultView({ exam }: { exam: Exam }) {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  // 마운트 시 1회만 캡처해서 렌더 순도 유지 (Date.now()를 렌더 본문에서 직접 호출 금지)
  const [nowAtMount] = useState(() => Date.now());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`cbt-attempt-${exam.id}`);
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage 응시 결과 하이드레이션
        setAttempt(JSON.parse(saved));
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [exam.id]);

  // Hooks는 early return 이전에 모두 호출되어야 함 (React Rules of Hooks)
  const stats = useMemo(
    () => (attempt ? computeStats(exam, attempt) : null),
    [exam, attempt],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        결과를 불러오는 중입니다...
      </div>
    );
  }

  if (!attempt || !stats) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="text-xl font-bold text-zinc-900">응시 기록이 없습니다</h1>
        <p className="mt-3 text-sm text-zinc-600">
          해당 회차를 응시한 기록이 없습니다.
        </p>
        <Link
          href="/cbt"
          className="mt-6 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          모의고사 목록으로
        </Link>
      </div>
    );
  }

  // submittedAt이 null인 경우(미제출) "지금"을 한 번만 캡처해 렌더 순도 유지
  const submittedAt = attempt.submittedAt ?? nowAtMount;
  const elapsedMs = submittedAt - attempt.startedAt;
  const submittedDisplay = formatDate(submittedAt);

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Header strip */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">시험 결과</p>
            <h1 className="mt-1 text-2xl font-bold text-zinc-900">
              {exam.title}
            </h1>
          </div>
          <Link
            href="/cbt"
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            ← 목록으로
          </Link>
        </div>

        {/* Pass/Fail hero */}
        <section
          className={`mb-6 overflow-hidden rounded-2xl border ${
            stats.passed
              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white"
              : "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-white"
          }`}
        >
          <div className="flex flex-col items-center gap-8 px-6 py-10 sm:flex-row sm:justify-around sm:px-10">
            {/* Circular score gauge */}
            <ScoreGauge
              score={stats.score100}
              passed={stats.passed}
            />

            <div className="text-center sm:text-left">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${
                  stats.passed
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {stats.passed ? "✓ 합격" : "✕ 불합격"}
              </span>
              <p
                className={`mt-3 text-4xl font-bold tracking-tight sm:text-5xl ${
                  stats.passed ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {stats.passed ? "PASS" : "FAIL"}
              </p>
              <p className="mt-3 text-sm text-zinc-600">
                정답{" "}
                <strong className="text-zinc-900">
                  {stats.totalCorrect}
                </strong>{" "}
                / {exam.totalQuestions} · 합격 기준{" "}
                <strong>{PASS_THRESHOLD}문항</strong>
              </p>
              <p
                className={`mt-1 text-sm font-semibold ${
                  stats.passed ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {stats.passed
                  ? `합격선보다 ${stats.margin}문항 여유`
                  : `합격까지 ${-stats.margin}문항 부족`}
              </p>
            </div>
          </div>

          {/* Correct/answered bar */}
          <div className="border-t border-zinc-200/70 bg-white/60 px-6 py-4 sm:px-10">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>정답률</span>
              <span className="font-semibold tabular-nums text-zinc-700">
                {Math.round(
                  (stats.totalCorrect / exam.totalQuestions) * 100,
                )}
                % · 응답 {stats.answeredCount}/{exam.totalQuestions}
              </span>
            </div>
            <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-200">
              <div
                className={`h-full rounded-full ${
                  stats.passed ? "bg-emerald-500" : "bg-rose-500"
                }`}
                style={{
                  width: `${(stats.totalCorrect / exam.totalQuestions) * 100}%`,
                }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-zinc-700"
                style={{
                  left: `${(PASS_THRESHOLD / exam.totalQuestions) * 100}%`,
                }}
                title="합격선"
              />
            </div>
            <p className="mt-1 text-right text-[10px] text-zinc-400">
              ▲ 세로 선 = 합격 기준 {PASS_THRESHOLD}문항
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Examinee + Attempt info */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-base font-bold text-zinc-900">응시 정보</h2>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-zinc-500">수험자명</dt>
              <dd className="font-medium text-zinc-900">{attempt.examineeName}</dd>
              <dt className="text-zinc-500">시험명</dt>
              <dd className="font-medium text-zinc-900">전기기능사 (필기)</dd>
              <dt className="text-zinc-500">회차</dt>
              <dd className="font-medium text-zinc-900">{exam.round}회</dd>
              <dt className="text-zinc-500">제출 시각</dt>
              <dd className="font-medium text-zinc-900">{submittedDisplay}</dd>
              <dt className="text-zinc-500">소요 시간</dt>
              <dd className="font-medium text-zinc-900">
                {formatDuration(elapsedMs)}
              </dd>
            </dl>
          </section>

          {/* Subject radar chart */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-base font-bold text-zinc-900">
              과목별 분석
            </h2>
            <div className="flex items-center justify-center">
              <SubjectRadar subjects={stats.subjects} />
            </div>
          </section>
        </div>

        {/* Subject breakdown */}
        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-5 text-base font-bold text-zinc-900">
            과목별 점수
          </h2>
          <div className="space-y-5">
            {stats.subjects.map((s) => {
              const ratio = s.total > 0 ? s.correct / s.total : 0;
              const pct = Math.round(ratio * 1000) / 10;
              const diagnosis =
                ratio >= 0.8 ? "강점" : ratio >= 0.5 ? "보통" : "취약";
              const barColor =
                ratio >= 0.8
                  ? "bg-emerald-500"
                  : ratio >= 0.5
                    ? "bg-blue-500"
                    : "bg-rose-500";
              const badgeColor =
                ratio >= 0.8
                  ? "bg-emerald-50 text-emerald-700"
                  : ratio >= 0.5
                    ? "bg-zinc-100 text-zinc-600"
                    : "bg-rose-50 text-rose-700";
              return (
                <div key={s.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900">
                        {s.name}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeColor}`}
                      >
                        {diagnosis}
                      </span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-zinc-700">
                      {s.correct} / {s.total}{" "}
                      <span className="text-zinc-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className={`h-full rounded-full transition-[width] duration-700 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {stats.subjects.some(
            (s) => (s.total > 0 ? s.correct / s.total : 0) < 0.5,
          ) && (
            <p className="mt-5 rounded-lg bg-rose-50 px-4 py-3 text-xs text-rose-800">
              💡 정답률 50% 미만 과목이 있습니다. 해설과 오답노트로 약점
              과목을 우선 보강하세요.
            </p>
          )}
        </section>

        {/* 빈출도·난이도 분석 — 학습 인사이트 */}
        {(stats.frequencies.length > 0 || stats.difficulties.length > 0) && (
          <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-1 text-base font-bold text-zinc-900">
              빈출도·난이도 분석
            </h2>
            <p className="mb-5 text-xs text-zinc-600">
              어떤 유형에 강하고 약한지 한눈에 확인하세요.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <BucketGroup
                title="🔥 출제 빈도별"
                buckets={stats.frequencies}
                colorOf={(k) =>
                  k === "high" ? "rose" : k === "medium" ? "blue" : "zinc"
                }
              />
              <BucketGroup
                title="📊 난이도별"
                buckets={stats.difficulties}
                colorOf={(k) =>
                  k === "hard" ? "violet" : k === "medium" ? "indigo" : "emerald"
                }
              />
            </div>

            {(() => {
              const high = stats.frequencies.find((b) => b.key === "high");
              const hard = stats.difficulties.find((b) => b.key === "hard");
              const highRate = high && high.total > 0 ? high.correct / high.total : 1;
              const hardRate = hard && hard.total > 0 ? hard.correct / hard.total : 1;
              const tips: string[] = [];
              if (highRate < 0.7 && high) {
                tips.push(
                  "빈출 문항 정답률이 낮습니다. /cbt/exams 의 '빈출 문제만' 집중 응시로 다져보세요.",
                );
              }
              if (hardRate < 0.5 && hard) {
                tips.push(
                  "어려운 문항 정답률이 낮습니다. 해설을 꼼꼼히 보고 '어려운 문제만' 응시로 익숙해지세요.",
                );
              }
              if (tips.length === 0) return null;
              return (
                <ul className="mt-5 space-y-1.5">
                  {tips.map((t, i) => (
                    <li
                      key={i}
                      className="rounded-lg bg-amber-50 px-4 py-2.5 text-xs text-amber-900"
                    >
                      💡 {t}
                    </li>
                  ))}
                </ul>
              );
            })()}
          </section>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/cbt/wrong-notes"
            className="rounded-md border border-rose-200 bg-rose-50 px-6 py-3 text-center text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            오답 노트로 복습
          </Link>
          <Link
            href={`/cbt/${exam.id}/review`}
            className="rounded-md bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            전체 해설 보기
          </Link>
          <Link
            href="/cbt"
            className="rounded-md border border-zinc-300 bg-white px-6 py-3 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}

function ScoreGauge({
  score,
  passed,
}: {
  score: number;
  passed: boolean;
}) {
  const radius = 70;
  const stroke = 12;
  const circ = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circ - (clamped / 100) * circ;
  const color = passed ? "#10b981" : "#f43f5e";
  return (
    <div className="relative h-44 w-44">
      <svg viewBox="0 0 180 180" className="h-44 w-44 -rotate-90">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#e4e4e7"
          strokeWidth={stroke}
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight text-zinc-900">
          {score}
        </span>
        <span className="text-xs font-medium text-zinc-500">100점 환산</span>
      </div>
    </div>
  );
}

function SubjectRadar({ subjects }: { subjects: SubjectStat[] }) {
  const cx = 150;
  const cy = 150;
  const radius = 110;
  // Distribute vertices evenly: top first, then clockwise
  const angles = subjects.map((_, i) => {
    return (-Math.PI / 2) + (i * 2 * Math.PI) / subjects.length;
  });

  const outerPoints = angles.map(
    (a) => [cx + radius * Math.cos(a), cy + radius * Math.sin(a)] as const,
  );

  const innerPoints = angles.map((a, i) => {
    const ratio = subjects[i].total > 0 ? subjects[i].correct / subjects[i].total : 0;
    return [
      cx + radius * ratio * Math.cos(a),
      cy + radius * ratio * Math.sin(a),
    ] as const;
  });

  const innerPath = innerPoints.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox="0 0 300 300" className="h-64 w-64">
      {/* concentric reference triangles */}
      {[0.33, 0.66, 1].map((scale) => (
        <polygon
          key={scale}
          points={angles
            .map(
              (a) =>
                `${cx + radius * scale * Math.cos(a)},${cy + radius * scale * Math.sin(a)}`,
            )
            .join(" ")}
          fill="none"
          stroke="#e4e4e7"
          strokeWidth="1"
        />
      ))}
      {/* axes */}
      {outerPoints.map((p, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={p[0]}
          y2={p[1]}
          stroke="#e4e4e7"
          strokeWidth="1"
        />
      ))}
      {/* score polygon */}
      <polygon
        points={innerPath}
        fill="rgba(37, 99, 235, 0.2)"
        stroke="#2563eb"
        strokeWidth="2"
      />
      {innerPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#2563eb" />
      ))}
      {/* labels */}
      {subjects.map((s, i) => {
        const a = angles[i];
        const lx = cx + (radius + 25) * Math.cos(a);
        const ly = cy + (radius + 25) * Math.sin(a);
        const ratio = s.total > 0 ? s.correct / s.total : 0;
        return (
          <g key={s.name}>
            <text
              x={lx}
              y={ly - 6}
              textAnchor="middle"
              className="fill-zinc-700 text-xs font-semibold"
            >
              {s.name}
            </text>
            <text
              x={lx}
              y={ly + 8}
              textAnchor="middle"
              className="fill-zinc-500 text-[10px]"
            >
              {s.correct}/{s.total} ({Math.round(ratio * 100)}%)
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export type { SubjectStat };

const BUCKET_TONE: Record<string, { bar: string; bg: string; text: string }> = {
  rose: { bar: "bg-rose-500", bg: "bg-rose-50", text: "text-rose-700" },
  blue: { bar: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-700" },
  zinc: { bar: "bg-zinc-400", bg: "bg-zinc-100", text: "text-zinc-700" },
  violet: { bar: "bg-violet-500", bg: "bg-violet-50", text: "text-violet-700" },
  indigo: { bar: "bg-indigo-500", bg: "bg-indigo-50", text: "text-indigo-700" },
  emerald: { bar: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
};

function BucketGroup({
  title,
  buckets,
  colorOf,
}: {
  title: string;
  buckets: Bucket[];
  colorOf: (key: string) => string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-zinc-900">{title}</h3>
      <div className="space-y-3">
        {buckets.map((b) => {
          const ratio = b.total > 0 ? b.correct / b.total : 0;
          const pct = Math.round(ratio * 100);
          const tone = BUCKET_TONE[colorOf(b.key)] ?? BUCKET_TONE.zinc;
          return (
            <div key={b.key}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className={`font-semibold ${tone.text}`}>{b.label}</span>
                <span className="font-medium tabular-nums text-zinc-700">
                  {b.correct}/{b.total}{" "}
                  <span className="text-zinc-500">({pct}%)</span>
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={`h-full rounded-full transition-[width] duration-700 ${tone.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
