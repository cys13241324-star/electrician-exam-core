"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  computeLearningStats,
  formatHours,
  type LearningStats,
} from "@/lib/cbt/stats";
import RecentAttempts from "./RecentAttempts";
import CbtGuide from "./CbtGuide";
import BackgroundPattern from "@/components/BackgroundPattern";

export default function Dashboard() {
  const [stats, setStats] = useState<LearningStats | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage 집계 + window focus 이벤트 구독 재계산
    setStats(computeLearningStats());
    const handleFocus = () => setStats(computeLearningStats());
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      {/* 핵심 동선: 시작 / 이어풀기 */}
      <section className="relative mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-50 px-6 py-6 sm:px-8">
        <BackgroundPattern variant="circuit" color="#1e40af" opacity={0.05} />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-600">
              addto 온라인 · 전기기능사
            </p>
            <h2 className="mt-1 text-lg font-bold text-zinc-900 sm:text-xl">
              오늘도 합격에 한 걸음 더, 학습을 시작해 볼까요?
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/cbt/exams"
                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                CBT 응시하기
              </Link>
              <Link
                href="/cbt/study"
                className="rounded-md border border-blue-300 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                과목별 학습
              </Link>
              <Link
                href="/cbt/wrong-notes"
                className="rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                오답노트
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 학습 가이드 — 무엇에 집중 / 왜 중요한가 */}
      <CbtGuide />

      {/* 한눈에 보는 학습 요약 */}
      <SummaryStrip stats={stats} />

      {/* 최근 응시 기록 */}
      <div className="mb-6">
        <SectionCard
          title="최근 응시 기록"
          subtitle="최근 5회"
          action={
            <Link
              href="/cbt/exams"
              className="text-xs text-zinc-500 hover:text-zinc-900"
            >
              전체 →
            </Link>
          }
        >
          <RecentAttempts />
        </SectionCard>
      </div>

      {/* 취약 영역 (간결) */}
      <div className="mb-6">
        <SectionCard
          title="취약 영역"
          subtitle="점수 향상 효과가 가장 큰 토픽부터 보강하세요"
          action={
            <Link
              href="/cbt/study"
              className="text-xs text-zinc-500 hover:text-zinc-900"
            >
              과목별 학습 →
            </Link>
          }
        >
          <WeakPointDiagnosis stats={stats} />
        </SectionCard>
      </div>
    </main>
  );
}

function SectionCard({
  title,
  subtitle,
  action,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-zinc-900">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

function SummaryStrip({ stats }: { stats: LearningStats | null }) {
  const hasData = stats?.hasAnyAttempt ?? false;
  const accuracy = Math.round((stats?.averageAccuracy ?? 0) * 100);
  const attempts = stats?.totalAttempts ?? 0;
  const studyTime = formatHours(stats?.totalStudyMinutes ?? 0);

  const items = [
    {
      label: "평균 정답률",
      value: hasData ? `${accuracy}%` : "—",
      hint: hasData
        ? accuracy >= 60
          ? "합격선(60%)을 넘었어요"
          : "합격선까지 조금 더!"
        : "응시 후 표시됩니다",
    },
    {
      label: "응시 회차",
      value: hasData ? `${attempts}회` : "—",
      hint: hasData ? "꾸준함이 합격의 핵심" : "첫 회차를 풀어보세요",
    },
    {
      label: "누적 학습 시간",
      value: hasData ? studyTime : "—",
      hint: hasData ? "응시 기준 누적" : "—",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-medium text-zinc-500">{it.label}</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{it.value}</p>
          <p className="mt-1 text-xs text-zinc-500">{it.hint}</p>
        </div>
      ))}
    </div>
  );
}

function WeakPointDiagnosis({ stats }: { stats: LearningStats | null }) {
  if (!stats?.hasAnyAttempt) {
    return (
      <p className="rounded-md bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">
        모의고사를 풀고 나면 학습자님이 약한 토픽을 알려드릴게요.
      </p>
    );
  }

  if (stats.weakestTopics.length === 0) {
    return (
      <p className="rounded-md bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">
        아직 충분한 데이터가 모이지 않았습니다.
      </p>
    );
  }

  const top = stats.weakestTopics[0];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 lg:col-span-2">
        <p className="text-xs font-semibold tracking-wide text-rose-700">
          가장 취약한 토픽
        </p>
        <p className="mt-2 text-base font-bold text-zinc-900">
          [{top.subject}] · {top.topic}
        </p>
        <p className="mt-1 text-sm text-zinc-700">
          정답률{" "}
          <strong className="text-rose-700">
            {Math.round(top.accuracy * 100)}%
          </strong>{" "}
          ({top.correct} / {top.total})
        </p>
        <p className="mt-3 text-xs text-zinc-600">
          이 토픽을 우선 학습하면 점수 향상 효과가 가장 큽니다.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 p-4">
        <p className="text-xs font-semibold text-zinc-700">취약 토픽 TOP 3</p>
        <ol className="mt-3 space-y-2 text-sm">
          {stats.weakestTopics.map((t, i) => (
            <li
              key={`${t.subject}-${t.topic}`}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-600">
                  {i + 1}
                </span>
                <span className="truncate text-zinc-800">
                  {t.subject} · {t.topic}
                </span>
              </span>
              <span className="text-xs font-semibold text-rose-600">
                {Math.round(t.accuracy * 100)}%
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
