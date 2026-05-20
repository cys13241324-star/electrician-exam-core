"use client";

import { useEffect, useMemo, useState } from "react";
import type { Flashcard, Subject } from "@/lib/flashcards/types";
import {
  CHAPTER_DEFS,
  RESIDUAL_CHAPTER,
} from "@/lib/flashcards/chapters";
import { MathText } from "@/components/Math";
import { summarize, type ProgressMap } from "@/lib/flashcards/favorites";

type Props = {
  cards: Flashcard[];
  favorites: Set<string>;
  progress: ProgressMap;
  subjects: Subject[];
  onPick: (card: Flashcard) => void;
  onToggleFavorite: (id: string) => void;
  onStartChapter: (cards: Flashcard[]) => void;
};

const SUBJECT_STYLE: Record<
  Subject,
  { chip: string; emoji: string; ring: string; accent: string; bar: string }
> = {
  전기이론: {
    chip: "bg-blue-100 text-blue-700",
    emoji: "⚡",
    ring: "ring-blue-100",
    accent: "text-blue-700",
    bar: "from-blue-400 to-blue-600",
  },
  전기기기: {
    chip: "bg-violet-100 text-violet-700",
    emoji: "🔧",
    ring: "ring-violet-100",
    accent: "text-violet-700",
    bar: "from-violet-400 to-violet-600",
  },
  전기설비: {
    chip: "bg-amber-100 text-amber-700",
    emoji: "🏗️",
    ring: "ring-amber-100",
    accent: "text-amber-700",
    bar: "from-amber-400 to-amber-600",
  },
};

export default function CardList({
  cards,
  favorites,
  progress,
  subjects,
  onPick,
  onToggleFavorite,
  onStartChapter,
}: Props) {
  const groups = useMemo(() => {
    return subjects.flatMap((subject) => {
      const subjectCards = cards.filter((c) => c.subject === subject);
      const defs = CHAPTER_DEFS[subject];

      // 정의된 5개 상위 챕터로 묶기
      const mapped = defs.map((def) => ({
        subject,
        chapter: def.title,
        cards: subjectCards.filter((c) => def.topics.includes(c.topic)),
      }));

      // 어떤 챕터에도 안 들어간 잔여 topic 은 "기타" 챕터로 흡수 (빈자리 방지)
      const mappedTopics = new Set(defs.flatMap((d) => d.topics));
      const residualCards = subjectCards.filter(
        (c) => !mappedTopics.has(c.topic),
      );
      if (residualCards.length > 0) {
        mapped.push({
          subject,
          chapter: RESIDUAL_CHAPTER,
          cards: residualCards,
        });
      }

      return mapped.filter((g) => g.cards.length > 0);
    });
  }, [cards, subjects]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToSection(i: number) {
    setMenuOpen(false);
    const el = document.getElementById(`fc-sec-${i}`);
    if (!el) return;
    const bar = document.getElementById("fc-filterbar");
    const offset = (bar?.offsetHeight ?? 0) + 24;
    const top = window.scrollY + el.getBoundingClientRect().top - offset;
    window.scrollTo({ top: top < 0 ? 0 : top, behavior: "smooth" });
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-12 text-center">
        <p className="text-4xl">🧐</p>
        <p className="mt-3 text-sm font-medium text-zinc-700">
          조건에 맞는 카드가 없어요
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          상단에서 과목·검색어·필터를 바꾸거나 초기화해 보세요.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-7">
        {groups.map((g, i) => (
          <ChapterSection
            key={`${g.subject}-${g.chapter}`}
            id={`fc-sec-${i}`}
            subject={g.subject}
            chapter={g.chapter}
            cards={g.cards}
            favorites={favorites}
            progress={progress}
            onPick={onPick}
            onToggleFavorite={onToggleFavorite}
            onStart={() => onStartChapter(g.cards)}
          />
        ))}
      </div>

      {/* 우측 플로팅 — 목차 / 맨 위로 */}
      <div className="fixed bottom-5 right-4 z-30 flex flex-col items-end gap-2 sm:bottom-7 sm:right-7">
        {showTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="맨 위로"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-lg font-bold text-zinc-600 shadow-lg transition hover:-translate-y-0.5 hover:text-blue-600"
          >
            ↑
          </button>
        )}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="목차 열기"
          className="flex h-12 items-center gap-2 rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-zinc-800"
        >
          <span aria-hidden>{menuOpen ? "✕" : "≡"}</span> 목차
        </button>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/10"
            aria-hidden
            onClick={() => setMenuOpen(false)}
          />
          <nav
            aria-label="챕터 목차"
            className="fixed bottom-20 right-4 z-40 max-h-[70vh] w-72 overflow-y-auto overscroll-contain rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl sm:bottom-24 sm:right-7"
          >
            <p className="px-3 py-2 text-[11px] font-bold tracking-wider text-zinc-400">
              과목 · 챕터로 이동
            </p>
            {groups.map((g, i) => {
              const showSubject =
                i === 0 || groups[i - 1].subject !== g.subject;
              const style = SUBJECT_STYLE[g.subject];
              return (
                <div key={`${g.subject}-${g.chapter}`}>
                  {showSubject && (
                    <p className="mt-1 px-3 pb-1 pt-2 text-[11px] font-bold text-zinc-500">
                      {style.emoji} {g.subject}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => scrollToSection(i)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    <span className="truncate">{g.chapter}</span>
                    <span className="shrink-0 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500">
                      {g.cards.length}
                    </span>
                  </button>
                </div>
              );
            })}
          </nav>
        </>
      )}
    </>
  );
}

function ChapterSection({
  id,
  subject,
  chapter,
  cards,
  favorites,
  progress,
  onPick,
  onToggleFavorite,
  onStart,
}: {
  id: string;
  subject: Subject;
  chapter: string;
  cards: Flashcard[];
  favorites: Set<string>;
  progress: ProgressMap;
  onPick: (c: Flashcard) => void;
  onToggleFavorite: (id: string) => void;
  onStart: () => void;
}) {
  const [open, setOpen] = useState(false);
  const style = SUBJECT_STYLE[subject];
  const stats = useMemo(
    () => summarize(progress, cards.map((c) => c.id)),
    [progress, cards],
  );

  return (
    <section
      id={id}
      className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm"
    >
      {/* 챕터 헤더 */}
      <header className="flex items-center justify-between gap-3 p-4 sm:p-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "챕터 접기" : "챕터 펼치기"}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs text-zinc-500 transition-transform ${
              open ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style.chip}`}
          >
            {style.emoji} {subject}
          </span>
          <h3 className="text-base font-bold text-zinc-900 sm:text-lg">
            {chapter}
          </h3>
          <span className="text-xs font-medium text-zinc-500">
            {cards.length}장
          </span>
          {stats.known > 0 && (
            <span className="hidden text-xs font-semibold text-emerald-600 sm:inline">
              · {stats.masteredPct}% 암기
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onStart}
          className={`flex-shrink-0 rounded-full bg-zinc-50 px-3.5 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5 hover:bg-zinc-900 hover:text-white ${style.accent}`}
        >
          이 챕터만 학습 →
        </button>
      </header>

      {/* 챕터 진도 바 */}
      <div className="px-4 sm:px-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-500`}
            style={{ width: `${stats.masteredPct}%` }}
          />
        </div>
      </div>

      {/* 카드 그리드 */}
      {open && (
        <div className="grid grid-cols-1 gap-3 p-4 pt-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
          {cards.map((card) => {
            const isFav = favorites.has(card.id);
            const p = progress[card.id];
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onPick(card)}
                className={`group relative block w-full rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4 text-left ring-1 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${style.ring}`}
              >
                {/* 상태 표시 점 */}
                <span
                  className={`absolute left-3 top-3 h-2 w-2 rounded-full ${
                    !p
                      ? "bg-zinc-200"
                      : p.status === "known"
                        ? "bg-emerald-400"
                        : "bg-rose-400"
                  }`}
                  title={
                    !p
                      ? "아직 안 봄"
                      : p.status === "known"
                        ? "암기 완료"
                        : "다시보기"
                  }
                  aria-hidden
                />
                {/* 별표 버튼은 외부에 띄워 카드 클릭 영역과 분리 */}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(card.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleFavorite(card.id);
                    }
                  }}
                  aria-label={isFav ? "별 표시 해제" : "별 표시"}
                  className={`absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    isFav
                      ? "bg-amber-100 text-amber-500"
                      : "bg-white text-zinc-300 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {isFav ? "★" : "☆"}
                </span>
                <div className="pl-3 pr-8">
                  <p className="line-clamp-3 text-sm font-bold leading-6 text-zinc-900 group-hover:text-blue-700">
                    <MathText>{card.front}</MathText>
                  </p>
                  {card.hint && (
                    <p className="mt-2 line-clamp-1 text-[11px] text-zinc-500">
                      💡 {card.hint}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
