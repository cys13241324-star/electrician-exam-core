"use client";

import Link from "next/link";
import { useMemo } from "react";
import { simulators, SIMULATOR_SUBJECTS } from "@/lib/simulators";
import type { Subject } from "@/lib/simulators";

type HubCard = {
  no: number;
  href: string;
  title: string;
  desc: string;
  icon: string;
  accent: string;
  cta: string;
  /** 어떤 subject 의 카운트를 배지로 표시할지 (subject 카드용) */
  subject?: Subject;
  /** "랜덤" 같은 특수 액션 식별자 */
  kind?: "subject" | "random";
};

const CARDS: HubCard[] = [
  {
    no: 1,
    href: "/simulator/by-subject/%EC%A0%84%EA%B8%B0%EC%9D%B4%EB%A1%A0",
    title: "전기이론 시뮬레이터",
    desc: "옴의 법칙·KCL/KVL·RLC 공진·3상 전력 — 전기자기학 포함, 직류·교류 핵심 개념을 직접 만지며 익힙니다.",
    icon: "⚡",
    accent: "bg-blue-50 text-blue-700 border-blue-100",
    cta: "전기이론 둘러보기",
    subject: "전기이론",
    kind: "subject",
  },
  {
    no: 2,
    href: "/simulator/by-subject/%EC%A0%84%EA%B8%B0%EA%B8%B0%EA%B8%B0",
    title: "전기기기 시뮬레이터",
    desc: "변압기 권수비·유도전동기 회전 자계·슬립 — 회전기와 변환기의 동작을 시각화로 이해합니다.",
    icon: "🔧",
    accent: "bg-violet-50 text-violet-700 border-violet-100",
    cta: "전기기기 둘러보기",
    subject: "전기기기",
    kind: "subject",
  },
  {
    no: 3,
    href: "/simulator/by-subject/%EC%A0%84%EA%B8%B0%EC%84%A4%EB%B9%84",
    title: "전기설비 시뮬레이터",
    desc: "전선·케이블·배선·접지·보호장치 — 설비 시공·운용에 필요한 감각을 인터랙티브로 키웁니다.",
    icon: "🏗️",
    accent: "bg-amber-50 text-amber-700 border-amber-100",
    cta: "전기설비 둘러보기",
    subject: "전기설비",
    kind: "subject",
  },
  {
    no: 4,
    href: "/simulator/random",
    title: "랜덤 시뮬레이터",
    desc: "사용 가능한 시뮬레이터 중 무작위로 한 개를 골라 바로 실행합니다. 가볍게 둘러보고 싶을 때.",
    icon: "🎲",
    accent: "bg-teal-50 text-teal-700 border-teal-100",
    cta: "랜덤으로 한 판",
    kind: "random",
  },
];

const SUBJECT_THEME: Record<
  Subject,
  { dot: string; bar: string; chip: string }
> = {
  전기이론: {
    dot: "bg-blue-500",
    bar: "from-blue-400 to-blue-600",
    chip: "bg-blue-50 text-blue-700",
  },
  전기기기: {
    dot: "bg-violet-500",
    bar: "from-violet-400 to-violet-600",
    chip: "bg-violet-50 text-violet-700",
  },
  전기설비: {
    dot: "bg-amber-500",
    bar: "from-amber-400 to-amber-600",
    chip: "bg-amber-50 text-amber-700",
  },
};

export default function SimulatorHub() {
  const totals = useMemo(() => {
    const total = simulators.length;
    const available = simulators.filter((s) => s.status === "available").length;
    const comingSoon = total - available;
    const subjectsCount = SIMULATOR_SUBJECTS.length;
    return { total, available, comingSoon, subjectsCount };
  }, []);

  // 과목별 통계
  const subjectStats = useMemo(
    () =>
      SIMULATOR_SUBJECTS.map((subject) => {
        const items = simulators.filter((s) => s.subject === subject);
        const available = items.filter((s) => s.status === "available").length;
        const total = items.length;
        return { subject, total, available, comingSoon: total - available };
      }),
    [],
  );

  // 추천 시뮬레이터 — examFocus 가 있고 available 인 것 중 앞에서 4개
  const featured = useMemo(
    () =>
      simulators
        .filter((s) => s.status === "available" && s.examFocus?.why)
        .slice(0, 4),
    [],
  );

  // 진입 카드에 표시할 배지: 사용가능/전체
  const badgeFor = (card: HubCard) => {
    if (card.kind === "subject" && card.subject) {
      const s = subjectStats.find((x) => x.subject === card.subject);
      if (!s) return null;
      return { available: s.available, total: s.total };
    }
    if (card.kind === "random") {
      return { available: totals.available, total: totals.total };
    }
    return null;
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-sky-600">
            addto 온라인 · 전기기능사 · INTERACTIVE SIMULATOR
          </p>
          <h1 className="mt-1 text-xl font-bold text-zinc-900 sm:text-2xl">
            어떤 시뮬레이터로 만져볼까요?
          </h1>
        </div>
        <Link
          href="/simulator/all"
          className="rounded-full border border-zinc-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
        >
          전체 보기 →
        </Link>
      </header>

      {/* 진입 카드 4개 — 메인 액션 영역 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((card) => {
          const badge = badgeFor(card);
          return (
            <Link
              key={card.no}
              href={card.href}
              prefetch={card.kind !== "random"}
              className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-7 pb-12 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border text-2xl ${card.accent}`}
                >
                  {card.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-zinc-900">
                      {card.title}
                    </h2>
                    {badge && (
                      <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                        {badge.available}
                        <span className="text-zinc-400"> / {badge.total}</span>
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-zinc-600">
                    {card.desc}
                  </p>
                </div>
              </div>
              <span className="absolute bottom-5 right-5 inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-900">
                {card.cta}
                <span className="transition group-hover:translate-x-1">→</span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* 4-카드 ↔ 섹션 시각적 분리 */}
      <div
        aria-hidden
        className="my-10 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-200" />
        시뮬레이터 현황
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-200" />
      </div>

      {/* 섹션 카드 2개 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard
          title="과목별 시뮬레이터"
          subtitle="현재 사용 가능 / 전체 (준비중 포함)"
          action={
            <Link
              href="/simulator/all"
              className="text-xs text-zinc-500 transition hover:text-zinc-900"
            >
              전체 →
            </Link>
          }
        >
          <ul className="space-y-3">
            {subjectStats.map((s) => {
              const theme = SUBJECT_THEME[s.subject];
              const pct = s.total === 0 ? 0 : Math.round((s.available / s.total) * 100);
              return (
                <li key={s.subject}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold text-zinc-800">
                      <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
                      {s.subject}
                      <span className="text-[11px] font-medium text-zinc-400">
                        {s.total}개
                      </span>
                    </span>
                    <span className="tabular-nums text-xs text-zinc-500">
                      <strong className="text-zinc-800">{s.available}</strong>
                      <span className="text-zinc-400"> / {s.total} · </span>
                      {s.comingSoon > 0 ? (
                        <span className="text-amber-600">
                          준비중 {s.comingSoon}
                        </span>
                      ) : (
                        <span className="text-emerald-600">전부 사용가능</span>
                      )}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-all duration-700 ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard
          title="추천 시뮬레이터"
          subtitle="시험에 자주 나오는 핵심 개념"
        >
          {featured.length === 0 ? (
            <p className="text-sm text-zinc-500">추천할 시뮬레이터가 없어요.</p>
          ) : (
            <ul className="space-y-2">
              {featured.map((sim) => {
                const theme = SUBJECT_THEME[sim.subject];
                return (
                  <li key={sim.id}>
                    <Link
                      href={`/simulator/${sim.id}`}
                      className="group flex items-start gap-3 rounded-xl border border-zinc-100 bg-white p-3 transition hover:border-zinc-200 hover:bg-zinc-50/60"
                    >
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-50 text-lg ring-1 ring-zinc-100">
                        {sim.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${theme.chip}`}
                          >
                            {sim.subject}
                          </span>
                          <h3 className="truncate text-sm font-bold text-zinc-900 group-hover:text-sky-700">
                            {sim.title}
                          </h3>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
                          {sim.description}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="mt-1 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-zinc-600"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
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

