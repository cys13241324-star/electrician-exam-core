"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  chapterById,
  chapters,
  formatChapterDuration,
  formatDuration,
  formatStats,
} from "@/lib/audiobook/data";
import { AUDIOBOOK_FORMATS, FORMAT_META } from "@/lib/audiobook/types";
import type { Format } from "@/lib/audiobook/types";

const LAST_PLAYED_KEY = "audiobook:lastPlayed";

type HubCard = {
  no: number;
  href: string;
  title: string;
  desc: string;
  icon: string;
  accent: string;
  cta: string;
  format?: Format;
  kind: "format" | "custom";
};

export default function AudiobookHub() {
  const [hydrated, setHydrated] = useState(false);
  const [lastPlayedId, setLastPlayedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const id = window.localStorage.getItem(LAST_PLAYED_KEY);
      if (id) setLastPlayedId(id);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const stats = useMemo(formatStats, []);
  const totalSec = useMemo(
    () => stats.reduce((acc, s) => acc + s.durationSec, 0),
    [stats],
  );

  const formatCards: HubCard[] = AUDIOBOOK_FORMATS.map((format, i) => {
    const meta = FORMAT_META[format];
    return {
      no: i + 1,
      href: `/audiobook/${format}`,
      title: meta.label,
      desc: meta.description,
      icon: meta.icon,
      accent: meta.accent,
      cta: `${meta.short} 듣기`,
      format,
      kind: "format",
    };
  });

  const customCard: HubCard = {
    no: 4,
    href: "/audiobook/custom",
    title: "골라 듣기",
    desc: "컨셉·과목 상관없이 듣고 싶은 챕터만 골라 순서대로 연속 재생합니다. 통근길용·복습용 등 나만의 플레이리스트를 구성해 보세요.",
    icon: "🎼",
    accent: "bg-teal-50 text-teal-700 border-teal-100",
    cta: "플레이리스트 만들기",
    kind: "custom",
  };

  const allCards: HubCard[] = [...formatCards, customCard];

  const lastChapter =
    hydrated && lastPlayedId ? chapterById(lastPlayedId) : undefined;

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-amber-600">
            addto 온라인 · 전기기능사 · AUDIOBOOK
          </p>
          <h1 className="mt-1 text-xl font-bold text-zinc-900 sm:text-2xl">
            오늘은 어떤 방식으로 들을까요?
          </h1>
        </div>
        <span className="rounded-full border border-zinc-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700">
          전체 {chapters.length}트랙 · {formatDuration(totalSec)}
        </span>
      </header>

      {/* 진입 카드 4개 (3컨셉 + 골라듣기) */}
      <section className="rounded-3xl bg-zinc-100/50 p-3 ring-1 ring-zinc-200/60 sm:p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {allCards.map((card) => {
            const stat = card.format
              ? stats.find((s) => s.format === card.format)
              : null;
            return (
              <Link
                key={card.no}
                href={card.href}
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
                      {stat && (
                        <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                          {stat.total}
                          <span className="text-zinc-400">트랙 · </span>
                          {formatDuration(stat.durationSec)}
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
      </section>

      {/* divider */}
      <div aria-hidden className="my-12 flex items-center gap-4">
        <span className="h-px flex-1 bg-zinc-200" />
        <span className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.18em] text-zinc-600 shadow-sm">
          포맷별 현황
        </span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard
          title="포맷별 현황"
          subtitle="컨셉별 챕터 수 / 총 재생시간"
        >
          <ul className="space-y-3">
            {stats.map((s) => {
              const meta = FORMAT_META[s.format];
              const totalPossible = Math.max(...stats.map((x) => x.durationSec));
              const pct = totalPossible
                ? Math.round((s.durationSec / totalPossible) * 100)
                : 0;
              return (
                <li key={s.format}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold text-zinc-800">
                      <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                      {meta.label}
                      <span className="text-[11px] font-medium text-zinc-400">
                        {s.total}트랙
                      </span>
                    </span>
                    <span className="tabular-nums text-xs text-zinc-500">
                      <strong className="text-zinc-800">
                        {formatDuration(s.durationSec)}
                      </strong>
                      <span className="text-zinc-400"> · 챕터당 약 {meta.avgMin}분</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${meta.bar} transition-all duration-700 ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard
          title="듣기 학습 팁"
          subtitle="포맷을 섞어 쓸 때 가장 효과적"
        >
          <ul className="space-y-2.5 text-[13px] leading-6 text-zinc-700">
            <li>
              · <strong>처음 학습</strong>은 📖 읽어주기 — 차분히 한 챕터 끝까지.
            </li>
            <li>
              · <strong>두 번째 회독</strong>은 🎙️ 팟캐스트 — 다른 시점으로 들으면
              놓쳤던 부분이 보입니다.
            </li>
            <li>
              · <strong>시험 직전</strong>은 ⚡ 5분 요약 — 짧고 굵게 핵심만 빠르게
              훑기.
            </li>
            <li>
              · <strong>골라 듣기</strong>는 약점 챕터만 모아 반복하기에 좋아요.
            </li>
          </ul>
        </SectionCard>
      </div>

      {/* 이어듣기 미니 알림 */}
      {hydrated && lastChapter && (
        <section className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/50 px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-white">
              ▶
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                마지막으로 듣던 챕터
              </p>
              <p className="text-sm font-bold text-zinc-900">
                {FORMAT_META[lastChapter.format].icon}{" "}
                {FORMAT_META[lastChapter.format].short} · {lastChapter.subject}{" "}
                {lastChapter.no}강 — {lastChapter.title}
              </p>
            </div>
            <span className="text-xs tabular-nums text-zinc-500">
              {formatChapterDuration(lastChapter.durationSec)}
            </span>
            <Link
              href={`/audiobook/${lastChapter.format}/${encodeURIComponent(lastChapter.subject)}?ch=${lastChapter.chapterId}`}
              className="rounded-full bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              이어 재생
            </Link>
          </div>
        </section>
      )}
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
