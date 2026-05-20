"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { presetCards } from "@/lib/flashcards/data";
import type { Flashcard, Subject } from "@/lib/flashcards/types";
import {
  CHAPTER_DEFS,
  RESIDUAL_CHAPTER,
  ALL_SUBJECTS,
  topicIsMapped,
} from "@/lib/flashcards/chapters";
import {
  loadFavorites,
  toggleFavorite as toggleFav,
  loadProgress,
  recordProgress,
  resetProgress,
  needsReview,
  summarize,
  type ProgressMap,
  type CardStatus,
} from "@/lib/flashcards/favorites";
import CardStudy from "./CardStudy";
import CardList from "./CardList";

type View = "study" | "list";

export type FlashcardAppHeader = {
  /** 윗줄(아주 작은 caps) */
  eyebrow?: string;
  title: string;
  /** 부제 (선택). 미지정시 카드 수 안내 자동 출력. */
  subtitle?: string;
};

export type FlashcardAppMode = "all" | "subjects" | "review" | "custom";

export type FlashcardAppProps = {
  /** 학습 대상 카드. 미지정시 전체 프리셋 카드. */
  cards?: Flashcard[];
  /** 모드별 대시보드·학습가이드 내용 분기. 기본 "all". */
  mode?: FlashcardAppMode;
  /** 헤더 텍스트 override */
  header?: FlashcardAppHeader;
  /** 초기 진입 시 "다시보기" 필터 ON (복습 모드용) */
  initialDueOnly?: boolean;
  /** 초기 진입 뷰 */
  initialView?: View;
  /** cards 가 비어 있을 때 학습 영역 대신 표시 */
  emptyState?: ReactNode;
  /** 헤더 위에 표시할 보조 영역 (예: 이전 화면 링크) */
  topSlot?: ReactNode;
};

// 챕터 선택 키 — "기타"가 과목마다 있을 수 있어 과목으로 네임스페이스 한다.
const CHAP_SEP = "│";
const chapKey = (subject: Subject, title: string) =>
  `${subject}${CHAP_SEP}${title}`;
const subjectOfKey = (key: string) => key.split(CHAP_SEP)[0] as Subject;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function FlashcardApp({
  cards: cardsProp,
  mode = "all",
  header,
  initialDueOnly = false,
  initialView = "study",
  emptyState,
  topSlot,
}: FlashcardAppProps = {}) {
  const cards = cardsProp ?? presetCards;
  const [view, setView] = useState<View>(initialView);
  // 과목·챕터 다중 선택. 과목 셋이 비면 = 전체. 챕터 셋이 비면 = 과목 전체.
  const [subjects, setSubjects] = useState<Set<Subject>>(new Set());
  const [chapters, setChapters] = useState<Set<string>>(new Set());
  const [starredOnly, setStarredOnly] = useState(false);
  const [dueOnly, setDueOnly] = useState(initialDueOnly);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<ProgressMap>({});
  const [deck, setDeck] = useState<Flashcard[]>(cards);
  const [hydrated, setHydrated] = useState(false);
  const [customN, setCustomN] = useState("");

  // localStorage 동기화 (클라이언트 마운트 시)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage 즐겨찾기·진도 하이드레이션
    setFavorites(loadFavorites());
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  // 선택한 과목들의 챕터별 카드 분배 (과목 칩 아래 노출용)
  const chapterGroups = useMemo(() => {
    if (subjects.size === 0)
      return [] as {
        subject: Subject;
        title: string;
        key: string;
        cards: Flashcard[];
      }[];
    const out: {
      subject: Subject;
      title: string;
      key: string;
      cards: Flashcard[];
    }[] = [];
    for (const subject of ALL_SUBJECTS) {
      if (!subjects.has(subject)) continue;
      const subjectCards = cards.filter((c) => c.subject === subject);
      for (const def of CHAPTER_DEFS[subject]) {
        out.push({
          subject,
          title: def.title,
          key: chapKey(subject, def.title),
          cards: subjectCards.filter((c) => def.topics.includes(c.topic)),
        });
      }
      const residual = subjectCards.filter(
        (c) => !topicIsMapped(subject, c.topic),
      );
      if (residual.length > 0)
        out.push({
          subject,
          title: RESIDUAL_CHAPTER,
          key: chapKey(subject, RESIDUAL_CHAPTER),
          cards: residual,
        });
    }
    return out;
  }, [subjects, cards]);

  // 선택된 챕터들의 카드 id 합집합 (없거나 비면 null = 챕터 제한 없음)
  const chapterCardIds = useMemo(() => {
    if (chapters.size === 0) return null;
    const ids = new Set<string>();
    for (const g of chapterGroups) {
      if (chapters.has(g.key)) for (const c of g.cards) ids.add(c.id);
    }
    return ids.size > 0 ? ids : null;
  }, [chapters, chapterGroups]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      if (subjects.size > 0 && !subjects.has(c.subject)) return false;
      if (chapterCardIds && !chapterCardIds.has(c.id)) return false;
      if (starredOnly && !favorites.has(c.id)) return false;
      if (dueOnly && !needsReview(progress, c.id)) return false;
      if (q) {
        const hay = `${c.front} ${c.back} ${c.topic} ${c.subject}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cards, subjects, chapterCardIds, starredOnly, dueOnly, query, favorites, progress]);

  // 덱을 새로 짜야 하는 "의도된" 조건만 모은 시그니처.
  // 주의: filtered 자체(favorites/progress 의존)를 deps 로 쓰면 즐겨찾기·평가
  // 때마다 객체가 새로 생성 → deck 교체 → CardStudy 가 첫 카드·앞면으로 리셋되는
  // 회귀가 생긴다. 그래서 즐겨찾기(favorites)는 '별 카드(starredOnly)', 진도
  // (progress)는 '다시보기(dueOnly)' 필터가 켜진 경우에만 시그니처에 포함한다.
  const deckKey = useMemo(() => {
    const base = [
      [...subjects].sort().join(","),
      [...chapters].sort().join(","),
      starredOnly ? "s" : "",
      dueOnly ? "d" : "",
      shuffleOn ? "x" : "",
      query.trim().toLowerCase(),
    ];
    if (starredOnly) base.push([...favorites].sort().join(","));
    if (dueOnly) base.push(JSON.stringify(progress));
    return base.join("|");
  }, [subjects, chapters, starredOnly, dueOnly, shuffleOn, query, favorites, progress]);

  // 필터가 바뀌면 학습 덱도 새로 짜기 (현재 학습 중이면 끊김 → 의도된 동작)
  useEffect(() => {
    // TODO(refactor): deck 을 useMemo 로 derived 처리하면 effect 불필요 (단 setDeck 다른 호출처 7곳 함께 정리 필요)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 필터 변경 시 deck 재생성 (shuffle 비결정성 때문에 useMemo 보다 useEffect 선택)
    setDeck(shuffleOn ? shuffle(filtered) : filtered);
    // deckKey 만 의존: 카드 평가(progress 변경)로는 덱이 재생성되지 않게 한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckKey]);

  const stats = useMemo(
    () => summarize(progress, cards.map((c) => c.id)),
    [progress, cards],
  );
  const filteredStats = useMemo(
    () => summarize(progress, filtered.map((c) => c.id)),
    [progress, filtered],
  );

  function startFromCard(card: Flashcard) {
    const base = filtered;
    const idx = base.findIndex((c) => c.id === card.id);
    if (idx < 0) {
      setDeck(shuffleOn ? shuffle(base) : base);
    } else {
      const ordered = [...base.slice(idx), ...base.slice(0, idx)];
      setDeck(ordered);
    }
    setView("study");
  }

  function startAll() {
    setDeck(shuffleOn ? shuffle(filtered) : filtered);
    setView("study");
  }

  /** 오늘 다시보기: 다시 볼 카드만 모아 학습 시작. (과목·챕터 선택 시 그 범위로 제한) */
  function startReview() {
    const due = cards.filter((c) => {
      if (subjects.size > 0 && !subjects.has(c.subject)) return false;
      if (chapterCardIds && !chapterCardIds.has(c.id)) return false;
      return needsReview(progress, c.id);
    });
    setDeck(shuffle(due));
    setView("study");
  }

  /** 과목 토글. 해제된 과목에 속한 챕터 선택은 함께 비운다. */
  function toggleSubject(s: Subject) {
    const next = new Set(subjects);
    if (next.has(s)) next.delete(s);
    else next.add(s);
    setSubjects(next);
    setChapters((cs) => {
      if (next.size === 0) return new Set();
      const out = new Set<string>();
      for (const k of cs) if (next.has(subjectOfKey(k))) out.add(k);
      return out;
    });
  }

  function clearSubjects() {
    setSubjects(new Set());
    setChapters(new Set());
  }

  function toggleChapter(key: string) {
    setChapters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function resetFilters() {
    setSubjects(new Set());
    setChapters(new Set());
    setStarredOnly(false);
    setDueOnly(false);
    setQuery("");
  }

  function handleToggleFavorite(id: string) {
    setFavorites((prev) => toggleFav(prev, id));
  }

  function handleRate(id: string, status: CardStatus) {
    setProgress((prev) => recordProgress(prev, id, status));
  }

  function handleResetProgress() {
    setProgress(resetProgress());
  }

  function handleStartChapter(chapterCards: Flashcard[]) {
    setDeck(shuffleOn ? shuffle(chapterCards) : chapterCards);
    setView("study");
  }

  /** 랜덤 출제: 현재 필터 결과 풀에서 무작위 N장(부족하면 전체) 뽑아 학습 시작. */
  function startRandom(n: number) {
    const pool = shuffle(filtered);
    setDeck(pool.slice(0, Math.min(n, pool.length)));
    setView("study");
  }

  const dueCount = stats.due;

  const eyebrow = header?.eyebrow ?? "FLIP CARD";
  const title = header?.title ?? "전기기능사 플립 암기카드";
  const subtitle =
    header?.subtitle ??
    `핵심 개념 ${cards.length}장을 뒤집으며 익히고, 헷갈리는 카드는 다시 보세요.`;
  const isEmpty = cards.length === 0;

  return (
    <main className="mx-auto max-w-5xl px-5 py-9 sm:px-6 sm:py-10">
      {topSlot}
      {/* 헤더 */}
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-blue-600">
          {eyebrow}
        </p>
        <div className="mt-1.5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[1.7rem] font-bold leading-tight text-zinc-900 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">{subtitle}</p>
          </div>

          {!isEmpty && (
            <div className="inline-flex shrink-0 rounded-full bg-zinc-100 p-1">
              <TabBtn active={view === "study"} onClick={() => setView("study")}>
                학습
              </TabBtn>
              <TabBtn active={view === "list"} onClick={() => setView("list")}>
                카드 목록
              </TabBtn>
            </div>
          )}
        </div>
      </header>

      {isEmpty && emptyState ? (
        <section className="mb-6">{emptyState}</section>
      ) : null}

      {!isEmpty && (
        <>
      {/* 필터·검색 (스티키) */}
      <section
        id="fc-filterbar"
        className="sticky top-2 z-20 mb-7 rounded-2xl border border-zinc-100 bg-white/85 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70 sm:p-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={subjects.size === 0} onClick={clearSubjects}>
            전체
          </Chip>
          {ALL_SUBJECTS.map((s) => (
            <Chip
              key={s}
              active={subjects.has(s)}
              onClick={() => toggleSubject(s)}
            >
              {s}
            </Chip>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-zinc-200 sm:inline-block" />
          <Toggle
            on={starredOnly}
            onClick={() => setStarredOnly((v) => !v)}
            icon={starredOnly ? "★" : "☆"}
          >
            별 카드
          </Toggle>
          <Toggle
            on={dueOnly}
            onClick={() => setDueOnly((v) => !v)}
            icon="🔁"
          >
            다시보기
          </Toggle>
          <Toggle on={shuffleOn} onClick={() => setShuffleOn((v) => !v)} icon="🔀">
            셔플
          </Toggle>

          <div className="relative ml-auto w-full sm:w-56">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              ⌕
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="카드 검색…"
              aria-label="카드 검색"
              className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-3 text-sm text-zinc-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {chapterGroups.length > 0 && (
          <div className="mt-3 space-y-2.5 rounded-xl bg-zinc-50 px-3 py-2.5 ring-1 ring-zinc-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-700">📚 챕터</span>
              <span className="text-[11px] text-zinc-400">
                여러 챕터를 선택하면 학습·랜덤 출제가 선택한 챕터 안에서만
                나옵니다
              </span>
              {chapters.size > 0 && (
                <button
                  type="button"
                  onClick={() => setChapters(new Set())}
                  className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline"
                >
                  챕터 선택 해제 ({chapters.size})
                </button>
              )}
            </div>
            {ALL_SUBJECTS.filter((s) => subjects.has(s)).map((subject) => {
              const groups = chapterGroups.filter((g) => g.subject === subject);
              if (groups.length === 0) return null;
              return (
                <div key={subject}>
                  <p className="mb-1.5 text-[11px] font-bold text-zinc-500">
                    {subject}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {groups.map((g) => {
                      const selected = chapters.has(g.key);
                      return (
                        <button
                          key={g.key}
                          type="button"
                          disabled={g.cards.length === 0}
                          aria-pressed={selected}
                          onClick={() => toggleChapter(g.key)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${
                            selected
                              ? "border-blue-500 bg-blue-600 text-white"
                              : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-400 hover:bg-blue-600 hover:text-white disabled:hover:bg-white disabled:hover:text-zinc-700"
                          }`}
                        >
                          {g.title}
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              selected
                                ? "bg-white/25 text-white"
                                : "bg-zinc-100 text-zinc-500"
                            }`}
                          >
                            {g.cards.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 랜덤 출제 — 현재 조건 풀에서 무작위 N장 */}
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-blue-50/60 px-3 py-2.5 ring-1 ring-blue-100">
          <span className="text-xs font-bold text-blue-700" aria-hidden>
            🎲 랜덤 출제
          </span>
          <span className="text-[11px] text-zinc-500">
            현재 조건에서 무작위로 뽑아 학습
          </span>
          <div
            role="group"
            aria-label="랜덤 출제 장수 선택"
            className="ml-auto flex flex-wrap items-center gap-2"
          >
            {[10, 20, 30].map((n) => {
              const enough = filtered.length >= n;
              const take = Math.min(n, filtered.length);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => startRandom(n)}
                  disabled={filtered.length === 0}
                  aria-label={
                    enough
                      ? `무작위 ${n}장 학습 시작`
                      : `카드 부족 — 가능한 ${take}장 학습 시작`
                  }
                  title={
                    enough
                      ? `무작위 ${n}장`
                      : `현재 조건이 ${n}장보다 적어 ${take}장만 출제됩니다`
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:text-blue-700"
                >
                  <span
                    aria-hidden
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border border-current text-[9px] leading-none"
                  >
                    {enough ? "" : "–"}
                  </span>
                  {n}장
                </button>
              );
            })}
          </div>

          {/* 사용자 직접 입력 N장 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = parseInt(customN, 10);
              if (Number.isFinite(n) && n > 0) startRandom(n);
            }}
            className="ml-auto flex items-center gap-1.5"
            aria-label="직접 입력해 출제"
          >
            <label
              htmlFor="fc-random-n"
              className="text-[11px] font-semibold text-zinc-600"
            >
              직접 입력
            </label>
            <input
              id="fc-random-n"
              type="number"
              inputMode="numeric"
              min={1}
              max={Math.max(1, filtered.length)}
              value={customN}
              onChange={(e) => setCustomN(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder={`1~${filtered.length || 0}`}
              disabled={filtered.length === 0}
              className="w-20 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={
                filtered.length === 0 ||
                !customN ||
                parseInt(customN, 10) <= 0
              }
              className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:hover:translate-y-0"
            >
              {customN
                ? `${Math.min(parseInt(customN, 10) || 0, filtered.length)}장 출제`
                : "출제"}
            </button>
          </form>

          {filtered.length > 0 && filtered.length < 10 && (
            <p className="w-full text-[11px] text-amber-700">
              현재 조건이 {filtered.length}장뿐이라, 선택한 장수보다 적으면
              가능한 만큼만 출제됩니다.
            </p>
          )}
        </div>

        <div className="mt-2.5 flex items-center gap-2 px-1 text-xs text-zinc-500">
          <span>
            현재 조건{" "}
            <strong className="text-zinc-800">{filtered.length}</strong>장
          </span>
          {hydrated && filtered.length > 0 && (
            <>
              <span className="text-zinc-300">·</span>
              <span>
                암기 완료 {filteredStats.known} / 다시보기 {filteredStats.due}
              </span>
            </>
          )}
          {(starredOnly ||
            dueOnly ||
            query ||
            subjects.size > 0 ||
            chapters.size > 0) && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto rounded-full px-2 py-0.5 font-medium text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline"
            >
              필터 초기화
            </button>
          )}
        </div>
      </section>

      {view === "study" ? (
        <CardStudy
          deck={deck}
          favorites={favorites}
          progress={progress}
          onToggleFavorite={handleToggleFavorite}
          onRate={handleRate}
          onExit={() => setView("list")}
        />
      ) : (
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-500">
              카드를 눌러 그 지점부터 학습을 시작할 수 있어요.
            </p>
            <button
              type="button"
              onClick={startAll}
              disabled={filtered.length === 0}
              className="rounded-full bg-gradient-to-br from-blue-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:from-blue-600 hover:to-violet-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              전체 {filtered.length}장 학습 시작 →
            </button>
          </div>
          <CardList
            cards={filtered}
            favorites={favorites}
            progress={progress}
            subjects={subjects.size > 0 ? [...subjects] : ALL_SUBJECTS}
            onPick={startFromCard}
            onToggleFavorite={handleToggleFavorite}
            onStartChapter={handleStartChapter}
          />
        </div>
      )}

      {/* 진도 대시보드 — 카드뷰 아래로 이동, 모드별 다른 내용 */}
      <div className="mt-10">
        <ProgressDashboard
          mode={mode}
          cards={cards}
          stats={stats}
          dueCount={dueCount}
          progress={progress}
          favorites={favorites}
          hydrated={hydrated}
          onStartReview={startReview}
          onReset={handleResetProgress}
        />
      </div>

      {/* 학습 가이드 — 모드별 다른 내용 */}
      <StudyGuide mode={mode} />
        </>
      )}
    </main>
  );
}

/* ---------------------------------------------------------------- */

type GuideBody = {
  howIcon: string;
  howTitle: string;
  howItems: string[];
  whyIcon: string;
  whyTitle: string;
  whyItems: string[];
  tone: "blue" | "emerald" | "rose" | "violet";
};

const GUIDE_BY_MODE: Record<FlashcardAppMode, GuideBody> = {
  all: {
    howIcon: "🔎",
    howTitle: "이렇게 외우세요",
    howItems: [
      "답이 막히면 바로 뒤집어 확인하고 “다시보기”로 표시하세요.",
      "한 번에 몰아서보다 짧게 자주 회독하는 편이 좋습니다.",
      "셔플 ON 으로 매번 순서를 바꿔 친숙함 함정을 피하세요.",
    ],
    whyIcon: "⭐",
    whyTitle: "왜 효과적인가",
    whyItems: [
      "답을 떠올렸다 확인하는 “능동 인출”은 다시 읽기보다 기억에 더 오래 남습니다.",
      "시간 간격을 두고 반복(분산 학습)하면 장기 기억이 강화됩니다.",
      "빈출 핵심 개념을 빠르게 회독해 필기 합격에 직접 도움이 됩니다.",
    ],
    tone: "blue",
  },
  subjects: {
    howIcon: "📚",
    howTitle: "과목별로 이렇게 회독하세요",
    howItems: [
      "한 번에 한 과목, 그 안에서 한 챕터씩만 펼쳐 끊김 없이 회독하세요.",
      "약한 과목은 챕터를 좁혀 매일 10~20장씩만 반복합니다.",
      "한 챕터 종료 후 다른 챕터로 넘어가기 전에 ‘다시보기’부터 비우세요.",
    ],
    whyIcon: "🧭",
    whyTitle: "왜 과목별 회독이 효과적인가",
    whyItems: [
      "유사한 개념(예: 직류·교류, 직류기·동기기) 을 묶어 보면 차이가 또렷해집니다.",
      "한 과목 안에서의 토픽 간 연결을 인식하면 인출 단서가 풍부해집니다.",
      "출제 비중이 큰 과목을 먼저 끝내 합격선 도달이 빨라집니다.",
    ],
    tone: "emerald",
  },
  review: {
    howIcon: "🔁",
    howTitle: "복습은 이렇게 돌리세요",
    howItems: [
      "다시보기 큐가 비어 있어도 하루 뒤에 다시 한 번 들춰보세요. 망각 곡선의 첫 골이 가장 깊습니다.",
      "두 번 연속 “알겠음” 이면 잠깐 비워 두고, 며칠 뒤 다시 만나세요.",
      "‘모르겠음’ 카드는 답을 적어보는 식으로 손도 함께 쓰면 기억이 강해집니다.",
    ],
    whyIcon: "🧠",
    whyTitle: "왜 복습 위주가 효과적인가",
    whyItems: [
      "에빙하우스의 망각 곡선: 24 시간 안에 70 % 가까이 잊지만, 한 번만 재학습해도 곡선이 완만해집니다.",
      "헷갈리는 카드만 모아 보면 학습 효율(시간당 외운 카드 수) 이 가장 높습니다.",
      "약점 카드의 반복 노출 빈도를 키워 시험장에서의 실수 폭을 줄입니다.",
    ],
    tone: "rose",
  },
  custom: {
    howIcon: "✍️",
    howTitle: "나만의 카드 잘 만드는 법",
    howItems: [
      "앞면은 ‘질문’ 형태로 짧게, 뒷면은 ‘공식·기준·단위’ 까지 모두 적으세요.",
      "한 카드에 한 개념. 두 개 이상이면 카드를 분리해야 회독이 빨라집니다.",
      "수식은 도우미의 ✨ 자동 변환을 눌러 보기 좋게 다듬으세요.",
    ],
    whyIcon: "🪄",
    whyTitle: "왜 직접 만들면 효과적인가",
    whyItems: [
      "‘카드로 만드는 과정’ 자체가 정리·요약·압축이라 한 번 만들면 어느 정도 외워집니다.",
      "내 약점에 맞춘 카드는 일반 카드보다 노출 빈도가 높아 회독 효율이 큽니다.",
      "오답·헷갈리는 기준은 시험 직전 ‘빠른 복습 덱’ 으로 곧장 활용됩니다.",
    ],
    tone: "violet",
  },
};

const GUIDE_TONE_CLASS: Record<
  GuideBody["tone"],
  { container: string; howText: string; whyText: string; divider: string }
> = {
  blue: {
    container:
      "border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-amber-50/40",
    howText: "text-blue-800",
    whyText: "text-amber-700",
    divider: "sm:border-blue-100",
  },
  emerald: {
    container:
      "border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/40",
    howText: "text-emerald-800",
    whyText: "text-blue-700",
    divider: "sm:border-emerald-100",
  },
  rose: {
    container:
      "border-rose-100 bg-gradient-to-br from-rose-50/70 via-white to-amber-50/40",
    howText: "text-rose-800",
    whyText: "text-amber-700",
    divider: "sm:border-rose-100",
  },
  violet: {
    container:
      "border-violet-100 bg-gradient-to-br from-violet-50/70 via-white to-blue-50/40",
    howText: "text-violet-800",
    whyText: "text-blue-700",
    divider: "sm:border-violet-100",
  },
};

function StudyGuide({ mode }: { mode: FlashcardAppMode }) {
  const guide = GUIDE_BY_MODE[mode];
  const tone = GUIDE_TONE_CLASS[guide.tone];
  return (
    <details
      className={`group mt-7 rounded-2xl border p-4 shadow-sm sm:p-5 ${tone.container}`}
    >
      <summary
        className={`flex cursor-pointer list-none items-center gap-2 text-sm font-bold marker:content-none [&::-webkit-details-marker]:hidden ${tone.howText}`}
      >
        <span aria-hidden>{guide.howIcon}</span> {guide.howTitle} · {guide.whyTitle}
        <span className="ml-auto text-xs font-medium text-zinc-400 transition group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p
            className={`flex items-center gap-1.5 text-sm font-bold ${tone.howText}`}
          >
            <span aria-hidden>{guide.howIcon}</span> {guide.howTitle}
          </p>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-6 text-zinc-700">
            {guide.howItems.map((it, i) => (
              <li key={i}>· {it}</li>
            ))}
          </ul>
        </div>
        <div className={`sm:border-l sm:pl-5 ${tone.divider}`}>
          <p
            className={`flex items-center gap-1.5 text-sm font-bold ${tone.whyText}`}
          >
            <span aria-hidden>{guide.whyIcon}</span> {guide.whyTitle}
          </p>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-6 text-zinc-700">
            {guide.whyItems.map((it, i) => (
              <li key={i}>· {it}</li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}

function ProgressDashboard({
  mode,
  cards,
  stats,
  dueCount,
  progress,
  favorites,
  hydrated,
  onStartReview,
  onReset,
}: {
  mode: FlashcardAppMode;
  cards: Flashcard[];
  stats: ReturnType<typeof summarize>;
  dueCount: number;
  progress: ProgressMap;
  favorites: Set<string>;
  hydrated: boolean;
  onStartReview: () => void;
  onReset: () => void;
}) {
  if (mode === "subjects") {
    return (
      <SubjectsDashboard
        cards={cards}
        progress={progress}
        hydrated={hydrated}
        onReset={onReset}
      />
    );
  }
  if (mode === "review") {
    return (
      <ReviewDashboard
        cards={cards}
        progress={progress}
        dueCount={dueCount}
        hydrated={hydrated}
        onReset={onReset}
      />
    );
  }
  // mode === "all" or "custom"
  return (
    <AllDashboard
      cards={cards}
      stats={stats}
      dueCount={dueCount}
      progress={progress}
      favoritesCount={favorites.size}
      hydrated={hydrated}
      onStartReview={onStartReview}
      onReset={onReset}
    />
  );
}

function AllDashboard({
  cards,
  stats,
  dueCount,
  progress,
  favoritesCount,
  hydrated,
  onStartReview,
  onReset,
}: {
  cards: Flashcard[];
  stats: ReturnType<typeof summarize>;
  dueCount: number;
  progress: ProgressMap;
  favoritesCount: number;
  hydrated: boolean;
  onStartReview: () => void;
  onReset: () => void;
}) {
  const pct = stats.masteredPct;
  // 도넛 (SVG conic 대신 stroke-dasharray)
  const R = 26;
  const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;

  // 과목별 mini-bar (전체 카드 기준)
  const subjectBreakdown = ALL_SUBJECTS.map((subject) => {
    const sCards = cards.filter((c) => c.subject === subject);
    const s = summarize(progress, sCards.map((c) => c.id));
    return { subject, ...s, total: sCards.length };
  });

  return (
    <>
    <section className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-stretch">
      <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
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
              stroke="url(#fcGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${hydrated ? dash : 0} ${C}`}
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="fcGrad" x1="0" y1="0" x2="1" y2="1">
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
          {hydrated && (
            <button
              type="button"
              onClick={onReset}
              className="mt-1 text-[11px] text-zinc-500 underline-offset-2 hover:text-zinc-700 hover:underline"
            >
              진도 초기화
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-violet-50/50 p-5 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Stat label="암기 완료" value={hydrated ? stats.known : 0} tone="emerald" />
          <span className="h-8 w-px bg-zinc-200" />
          <Stat label="다시보기" value={hydrated ? dueCount : 0} tone="amber" />
          <span className="h-8 w-px bg-zinc-200" />
          <Stat
            label="아직 안 본 카드"
            value={hydrated ? stats.unseen : stats.total}
            tone="zinc"
          />
        </div>
        <button
          type="button"
          onClick={onStartReview}
          disabled={!hydrated || dueCount === 0}
          className="shrink-0 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:hover:translate-y-0"
        >
          {hydrated && dueCount > 0
            ? `오늘 다시보기 ${dueCount}장 →`
            : "다시보기 완료 🎉"}
        </button>
      </div>
    </section>

    {/* 과목별 mini-bar (전체 카드 기준) */}
    <section className="mt-3 grid gap-3 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:grid-cols-3">
      {subjectBreakdown.map((s) => {
        const theme =
          s.subject === "전기이론"
            ? { bar: "from-blue-400 to-blue-600", dot: "bg-blue-500" }
            : s.subject === "전기기기"
              ? { bar: "from-violet-400 to-violet-600", dot: "bg-violet-500" }
              : { bar: "from-amber-400 to-amber-600", dot: "bg-amber-500" };
        return (
          <div key={s.subject}>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-zinc-800">
                <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
                {s.subject}
              </span>
              <span className="tabular-nums text-zinc-500">
                {hydrated ? `${s.known} / ${s.total}` : "—"}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-all duration-700 ease-out`}
                style={{ width: hydrated ? `${s.masteredPct}%` : "0%" }}
              />
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              {hydrated ? (
                <>
                  암기 {s.masteredPct}% · 다시보기{" "}
                  <span className="text-amber-700">{s.due}</span>
                </>
              ) : (
                "—"
              )}
            </p>
          </div>
        );
      })}
    </section>

    {/* 별 카드 한 줄 */}
    <p className="mt-2 text-right text-[11px] text-zinc-500">
      ⭐ 별 카드 <strong className="text-zinc-800">{hydrated ? favoritesCount : 0}</strong>
      장
    </p>
    </>
  );
}

function SubjectsDashboard({
  cards,
  progress,
  hydrated,
  onReset,
}: {
  cards: Flashcard[];
  progress: ProgressMap;
  hydrated: boolean;
  onReset: () => void;
}) {
  const rows = ALL_SUBJECTS.map((subject) => {
    const sCards = cards.filter((c) => c.subject === subject);
    const s = summarize(progress, sCards.map((c) => c.id));
    return { subject, ...s, total: sCards.length };
  });

  const SUBJECT_THEME = {
    전기이론: { bar: "from-blue-400 to-blue-600", dot: "bg-blue-500", text: "text-blue-700" },
    전기기기: { bar: "from-violet-400 to-violet-600", dot: "bg-violet-500", text: "text-violet-700" },
    전기설비: { bar: "from-amber-400 to-amber-600", dot: "bg-amber-500", text: "text-amber-700" },
  } as const;

  return (
    <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-blue-50/40 p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-emerald-700">
            과목별 진도
          </p>
          <p className="mt-0.5 text-sm text-zinc-500">
            과목 칩으로 회독 범위를 좁히고, 챕터 단위로 끊어 진도를 늘려가세요.
          </p>
        </div>
        {hydrated && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline"
          >
            진도 초기화
          </button>
        )}
      </div>

      <ul className="space-y-4">
        {rows.map((r) => {
          const theme = SUBJECT_THEME[r.subject];
          return (
            <li key={r.subject} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
              <div className="flex items-end justify-between">
                <p className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                  <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
                  {r.subject}
                  <span className="text-[11px] font-medium text-zinc-400">
                    {r.total}장
                  </span>
                </p>
                <p className={`text-sm font-bold tabular-nums ${theme.text}`}>
                  {hydrated ? `${r.masteredPct}%` : "—"}
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-all duration-700 ease-out`}
                  style={{ width: hydrated ? `${r.masteredPct}%` : "0%" }}
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                <span className="text-emerald-700">
                  암기 <strong>{hydrated ? r.known : 0}</strong>
                </span>
                <span className="text-amber-700">
                  다시보기 <strong>{hydrated ? r.due : 0}</strong>
                </span>
                <span className="text-zinc-500">
                  아직 안 본 카드 <strong>{hydrated ? r.unseen : r.total}</strong>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ReviewDashboard({
  cards,
  progress,
  dueCount,
  hydrated,
  onReset,
}: {
  cards: Flashcard[];
  progress: ProgressMap;
  dueCount: number;
  hydrated: boolean;
  onReset: () => void;
}) {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  let today = 0;
  let yesterday = 0;
  let older = 0;
  let unknownCount = 0;
  let neverSeen = 0;
  for (const c of cards) {
    const p = progress[c.id];
    if (!p) {
      neverSeen += 1;
      continue;
    }
    if (p.status === "unknown") unknownCount += 1;
    const delta = now - p.ts;
    if (delta < DAY) today += 1;
    else if (delta < 2 * DAY) yesterday += 1;
    else older += 1;
  }

  return (
    <section className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/60 via-white to-amber-50/40 p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-rose-700">
            복습 현황
          </p>
          <p className="mt-0.5 text-sm text-zinc-500">
            “모르겠음”·24시간 이상 지난 카드를 다시 만나며 망각 곡선을 누그러뜨리세요.
          </p>
        </div>
        {hydrated && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline"
          >
            진도 초기화
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <BigStat label="오늘 다시보기" value={hydrated ? dueCount : 0} tone="rose" big />
        <BigStat label="모르겠음 표시" value={hydrated ? unknownCount : 0} tone="amber" />
        <BigStat label="아직 안 본 카드" value={hydrated ? neverSeen : cards.length} tone="zinc" />
        <BigStat label="전체 카드" value={cards.length} tone="zinc" />
      </div>

      {/* 마지막 학습 시각 분포 */}
      <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-zinc-100">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          마지막으로 본 시점
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <TimeBucket label="오늘" value={hydrated ? today : 0} tone="emerald" />
          <TimeBucket label="어제" value={hydrated ? yesterday : 0} tone="amber" />
          <TimeBucket label="그 이전" value={hydrated ? older : 0} tone="rose" />
        </div>
        <p className="mt-3 text-[11px] text-zinc-500">
          24 시간 이상 지난 카드는 “다시보기” 큐로 자동 편입됩니다.
        </p>
      </div>
    </section>
  );
}

function BigStat({
  label,
  value,
  tone,
  big,
}: {
  label: string;
  value: number;
  tone: "rose" | "amber" | "emerald" | "zinc";
  big?: boolean;
}) {
  const color =
    tone === "rose"
      ? "text-rose-600"
      : tone === "amber"
        ? "text-amber-600"
        : tone === "emerald"
          ? "text-emerald-600"
          : "text-zinc-700";
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-zinc-100">
      <p className={`${big ? "text-3xl" : "text-2xl"} font-bold tabular-nums ${color}`}>
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-medium text-zinc-500">{label}</p>
    </div>
  );
}

function TimeBucket({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "rose";
}) {
  const color =
    tone === "emerald"
      ? "text-emerald-700 bg-emerald-50"
      : tone === "amber"
        ? "text-amber-700 bg-amber-50"
        : "text-rose-700 bg-rose-50";
  return (
    <div className={`rounded-lg px-3 py-2 ${color}`}>
      <p className="text-[11px] font-medium">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums">{value}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "zinc";
}) {
  const color =
    tone === "emerald"
      ? "text-emerald-600"
      : tone === "amber"
        ? "text-amber-600"
        : "text-zinc-500";
  return (
    <div>
      <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-zinc-500">{label}</p>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
        active
          ? "bg-white text-zinc-900 shadow-sm"
          : "text-zinc-600 hover:text-zinc-900"
      }`}
    >
      {children}
    </button>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-zinc-900 text-white shadow-sm"
          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({
  on,
  onClick,
  icon,
  children,
}: {
  on: boolean;
  onClick: () => void;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        on
          ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      }`}
    >
      <span aria-hidden>{icon}</span>
      {children}
    </button>
  );
}
