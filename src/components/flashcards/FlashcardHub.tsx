"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { presetCards } from "@/lib/flashcards/data";
import { ALL_SUBJECTS } from "@/lib/flashcards/chapters";
import {
  loadFavorites,
  loadProgress,
  needsReview,
  summarize,
  type ProgressMap,
} from "@/lib/flashcards/favorites";
import { loadCustomCards, type CustomCard } from "@/lib/flashcards/custom";
import type { Subject } from "@/lib/flashcards/types";

type HubCard = {
  no: number;
  href: string;
  title: string;
  desc: string;
  icon: string;
  accent: string; // tailwind classes for the icon chip
  cta: string;
};

const CARDS: HubCard[] = [
  {
    no: 1,
    href: "/flashcards/all",
    title: "모든 카드 보기",
    desc: "전 과목 핵심 개념을 한 덱으로 모아 처음부터 끝까지 회독합니다.",
    icon: "🗂️",
    accent: "bg-blue-50 text-blue-700 border-blue-100",
    cta: "전체 학습",
  },
  {
    no: 2,
    href: "/flashcards/subjects",
    title: "과목별 카드 보기",
    desc: "전기이론·전기기기·전기설비를 과목·챕터 단위로 골라 집중 회독합니다.",
    icon: "📚",
    accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
    cta: "과목 선택",
  },
  {
    no: 3,
    href: "/flashcards/review",
    title: "복습 카드 보기",
    desc: "‘모르겠음’으로 표시했거나 시간이 지나 다시 볼 카드만 모아 봅니다.",
    icon: "🔁",
    accent: "bg-rose-50 text-rose-700 border-rose-100",
    cta: "다시보기 시작",
  },
  {
    no: 4,
    href: "/flashcards/custom",
    title: "나만의 카드",
    desc: "직접 만든 암기카드를 추가·편집하고 같은 방식으로 학습합니다.",
    icon: "✍️",
    accent: "bg-violet-50 text-violet-700 border-violet-100",
    cta: "카드 만들기",
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

export default function FlashcardHub() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [customCards, setCustomCards] = useState<CustomCard[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
    setProgress(loadProgress());
    setFavorites(loadFavorites());
    setCustomCards(loadCustomCards());
    setHydrated(true);
  }, []);

  const stats = useMemo(
    () => summarize(progress, presetCards.map((c) => c.id)),
    [progress],
  );
  const dueCount = useMemo(
    () => presetCards.filter((c) => needsReview(progress, c.id)).length,
    [progress],
  );

  // 과목별 현황
  const subjectStats = useMemo(
    () =>
      ALL_SUBJECTS.map((subject) => {
        const sCards = presetCards.filter((c) => c.subject === subject);
        const s = summarize(progress, sCards.map((c) => c.id));
        return {
          subject,
          total: sCards.length,
          known: s.known,
          due: s.due,
          pct: s.masteredPct,
        };
      }),
    [progress],
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-wide text-blue-600">
          addto 온라인 · 전기기능사 · FLIP CARD
        </p>
        <h1 className="mt-1 text-xl font-bold text-zinc-900 sm:text-2xl">
          어떤 방식으로 외워볼까요?
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
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-zinc-900">
                    {card.title}
                  </h2>
                  <HubBadge card={card} stats={{ dueCount, customCount: customCards.length }} hydrated={hydrated} />
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

      {/* 전체 진도 스트립 */}
      <DashboardStrip
        stats={stats}
        dueCount={dueCount}
        favoritesCount={favorites.size}
        customCount={customCards.length}
        hydrated={hydrated}
      />

      {/* 과목별 현황 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard
          title="과목별 현황"
          subtitle="암기 완료율 / 다시보기 카드 수"
          action={
            <Link
              href="/flashcards/subjects"
              className="text-xs text-zinc-500 transition hover:text-zinc-900"
            >
              과목으로 →
            </Link>
          }
        >
          <ul className="space-y-3">
            {subjectStats.map((s) => {
              const theme = SUBJECT_THEME[s.subject];
              return (
                <li key={s.subject}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold text-zinc-800">
                      <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
                      {s.subject}
                      <span className="text-[11px] font-medium text-zinc-400">
                        {s.total}장
                      </span>
                    </span>
                    <span className="tabular-nums text-xs text-zinc-500">
                      {hydrated ? (
                        <>
                          <strong className="text-zinc-800">{s.known}</strong>
                          <span className="text-zinc-400"> / {s.total} · </span>
                          <span className="text-amber-600">
                            다시보기 {s.due}
                          </span>
                        </>
                      ) : (
                        "—"
                      )}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-all duration-700 ease-out`}
                      style={{ width: hydrated ? `${s.pct}%` : "0%" }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard
          title="학습 팁"
          subtitle="플립카드를 효과적으로 쓰는 방법"
        >
          <ul className="space-y-2.5 text-[13px] leading-6 text-zinc-700">
            <li>
              · <strong>능동 인출</strong> — 뒤집기 전에 1~2초라도 답을
              떠올려보세요. 다시 읽기보다 훨씬 오래 남습니다.
            </li>
            <li>
              · <strong>분산 학습</strong> — 한 번에 몰아 외우기보다 짧게 자주
              회독하는 편이 효과적입니다.
            </li>
            <li>
              · <strong>다시보기</strong> — 헷갈리면 ‘모르겠음’으로 표시하고,
              하루 뒤 “복습 카드 보기”에서 다시 만나세요.
            </li>
            <li>
              · <strong>나만의 카드</strong> — 시험장에서 자주 까먹는 공식·기준은
              직접 카드로 만들어 두면 회독이 빨라집니다.
            </li>
          </ul>
        </SectionCard>
      </div>
    </main>
  );
}

function HubBadge({
  card,
  stats,
  hydrated,
}: {
  card: HubCard;
  stats: { dueCount: number; customCount: number };
  hydrated: boolean;
}) {
  if (!hydrated) return null;
  if (card.href === "/flashcards/review" && stats.dueCount > 0) {
    return (
      <span className="ml-auto rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
        {stats.dueCount}장
      </span>
    );
  }
  if (card.href === "/flashcards/custom" && stats.customCount > 0) {
    return (
      <span className="ml-auto rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
        {stats.customCount}장
      </span>
    );
  }
  if (card.href === "/flashcards/all") {
    return (
      <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
        {presetCards.length}장
      </span>
    );
  }
  return null;
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

function DashboardStrip({
  stats,
  dueCount,
  favoritesCount,
  customCount,
  hydrated,
}: {
  stats: ReturnType<typeof summarize>;
  dueCount: number;
  favoritesCount: number;
  customCount: number;
  hydrated: boolean;
}) {
  const pct = stats.masteredPct;
  const R = 26;
  const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;

  const metrics = [
    {
      label: "암기 완료",
      value: hydrated ? `${stats.known}` : "—",
      sub: `/ ${stats.total}장`,
      tone: "text-emerald-600",
    },
    {
      label: "다시보기",
      value: hydrated ? `${dueCount}` : "—",
      sub: "장",
      tone: "text-amber-600",
    },
    {
      label: "별 카드",
      value: hydrated ? `${favoritesCount}` : "—",
      sub: "장",
      tone: "text-blue-600",
    },
    {
      label: "나만의 카드",
      value: hydrated ? `${customCount}` : "—",
      sub: "장",
      tone: "text-violet-600",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-violet-50 px-6 py-5 sm:px-8">
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative h-[68px] w-[68px] shrink-0">
            <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={R}
                fill="none"
                stroke="#f1f1f4"
                strokeWidth="8"
              />
              <circle
                cx="32"
                cy="32"
                r={R}
                fill="none"
                stroke="url(#hubGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${hydrated ? dash : 0} ${C}`}
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="hubGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-zinc-900">
                {hydrated ? `${pct}%` : "–"}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider text-zinc-500">
              전체 진도
            </p>
            <p className="mt-0.5 text-lg font-bold text-zinc-900">
              {hydrated ? (
                <>
                  {stats.known}
                  <span className="text-sm font-medium text-zinc-500">
                    {" "}
                    / {stats.total}장 암기
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-zinc-500">
                  불러오는 중…
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          {metrics.map((m) => (
            <div key={m.label}>
              <p className="text-xs font-medium text-zinc-500">{m.label}</p>
              <p className="mt-0.5">
                <span className={`text-xl font-bold tabular-nums ${m.tone}`}>
                  {m.value}
                </span>
                <span className="ml-1 text-xs text-zinc-400">{m.sub}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
