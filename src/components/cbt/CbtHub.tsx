"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  computeLearningStats,
  formatHours,
  type LearningStats,
} from "@/lib/cbt/stats";
import DDayWidget from "./DDayWidget";
import RecentAttempts from "./RecentAttempts";
import LearningCurve from "./LearningCurve";
import BackgroundPattern from "@/components/BackgroundPattern";

type HubCard = {
  no: number;
  href: string;
  title: string;
  desc: string;
  icon: string;
  accent: string; // tailwind classes for the icon chip
};

const CARDS: HubCard[] = [
  {
    no: 1,
    href: "/cbt/exams",
    title: "회차별 모의고사",
    desc: "60문항 60분, 실전과 동일하게 회차별로 응시합니다.",
    icon: "📝",
    accent: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    no: 2,
    href: "/cbt/study",
    title: "과목별 학습",
    desc: "전기이론·기기·설비를 과목 > 토픽 단위로 시간 제한 없이 연습합니다.",
    icon: "📚",
    accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    no: 3,
    href: "/cbt/wrong-notes",
    title: "오답 노트",
    desc: "틀린 문제만 모아 다시 보고, 약점을 집중 복습합니다.",
    icon: "🔁",
    accent: "bg-rose-50 text-rose-700 border-rose-100",
  },
  {
    no: 4,
    href: "/cbt/custom",
    title: "나만의 시험",
    desc: "과목·문항 수·제한 시간·난이도·빈출도를 직접 골라 맞춤 시험을 구성합니다.",
    icon: "🎛️",
    accent: "bg-violet-50 text-violet-700 border-violet-100",
  },
];

export default function CbtHub() {
  const [stats, setStats] = useState<LearningStats | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage 집계 + window focus 재계산
    setStats(computeLearningStats());
    const handleFocus = () => setStats(computeLearningStats());
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-wide text-blue-600">
          addto 온라인 · 전기기능사
        </p>
        <h1 className="mt-1 text-xl font-bold text-zinc-900 sm:text-2xl">
          무엇부터 시작할까요?
        </h1>
      </header>

      {/* 진입 카드 4개 — 메인 액션 영역 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.no}
            href={card.href}
            className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-7 pb-12 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg"
          >
            <div className="flex items-start gap-4 pr-8">
              <span
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border text-2xl ${card.accent}`}
              >
                {card.icon}
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-zinc-900">
                  {card.title}
                </h2>
                <p className="mt-1.5 text-[15px] leading-relaxed text-zinc-600">
                  {card.desc}
                </p>
              </div>
            </div>
            <span className="absolute bottom-5 right-5 inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-900">
              바로가기
              <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </Link>
        ))}
      </div>

      {/* 4-카드 ↔ 대시보드 시각적 분리 */}
      <div
        aria-hidden
        className="my-10 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-200" />
        내 학습 현황
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-200" />
      </div>

      {/* 대시보드 스트립 (압축) */}
      <DashboardStrip stats={stats} />

      {/* 학습 현황 상세 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard
          title="최근 응시 기록"
          subtitle="최근 5회"
          action={
            <Link
              href="/cbt/exams"
              className="text-xs text-zinc-500 transition hover:text-zinc-900"
            >
              전체 →
            </Link>
          }
        >
          <RecentAttempts />
        </SectionCard>

        <SectionCard title="학습 곡선" subtitle="응시별 점수 변화">
          <LearningCurve />
        </SectionCard>
      </div>
    </main>
  );
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-zinc-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

/**
 * 응시 기록 없을 때 보여줄 데모 통계 (RecentAttempts/LearningCurve 와 일관).
 * 4회 응시 평균 ~67%, 누적 학습 ~3시간 30분, 취약 영역 "전기설비 · 접지".
 */
const DEMO_STATS = {
  accuracy: 67,
  attempts: 4,
  studyMinutesText: "3시간 30분",
  weakest: { subject: "전기설비", topic: "접지", accuracy: 0.42 },
};

function DashboardStrip({ stats }: { stats: LearningStats | null }) {
  const hasData = stats?.hasAnyAttempt ?? false;
  const accuracy = hasData
    ? Math.round((stats?.averageAccuracy ?? 0) * 100)
    : DEMO_STATS.accuracy;
  const attempts = hasData
    ? stats?.totalAttempts ?? 0
    : DEMO_STATS.attempts;
  const studyTime = hasData
    ? formatHours(stats?.totalStudyMinutes ?? 0)
    : DEMO_STATS.studyMinutesText;
  const weakest = hasData
    ? stats?.weakestTopics?.[0] ?? null
    : DEMO_STATS.weakest;

  const metrics = [
    {
      label: "평균 정답률",
      value: `${accuracy}%`,
      tone: accuracy >= 60 ? "text-emerald-600" : "text-zinc-900",
    },
    { label: "응시 회차", value: `${attempts}회`, tone: "text-zinc-900" },
    { label: "누적 학습", value: studyTime, tone: "text-zinc-900" },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-50 px-6 py-5 sm:px-8">
      <BackgroundPattern variant="circuit" color="#1e40af" opacity={0.05} />
      {!hasData && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-100">
          데모 데이터
        </span>
      )}
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {metrics.map((m) => (
            <div key={m.label}>
              <p className="text-xs font-medium text-zinc-500">{m.label}</p>
              <p className={`mt-0.5 text-2xl font-bold ${m.tone}`}>{m.value}</p>
            </div>
          ))}
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-500">취약 영역</p>
            {weakest ? (
              <p className="mt-0.5 truncate text-sm font-semibold text-zinc-900">
                {weakest.subject} · {weakest.topic}{" "}
                <span className="text-rose-600">
                  {Math.round(weakest.accuracy * 100)}%
                </span>
              </p>
            ) : (
              <p className="mt-0.5 text-sm text-zinc-400">응시 후 표시</p>
            )}
          </div>
        </div>
        <DDayWidget />
      </div>
    </section>
  );
}
