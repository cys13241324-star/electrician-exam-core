"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function FlashcardApp() {
  const [view, setView] = useState<View>("study");
  // 과목·챕터 다중 선택. 과목 셋이 비면 = 전체. 챕터 셋이 비면 = 과목 전체.
  const [subjects, setSubjects] = useState<Set<Subject>>(new Set());
  const [chapters, setChapters] = useState<Set<string>>(new Set());
  const [starredOnly, setStarredOnly] = useState(false);
  const [dueOnly, setDueOnly] = useState(false);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<ProgressMap>({});
  const [deck, setDeck] = useState<Flashcard[]>(presetCards);
  const [hydrated, setHydrated] = useState(false);

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
      const subjectCards = presetCards.filter((c) => c.subject === subject);
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
  }, [subjects]);

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
    return presetCards.filter((c) => {
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
  }, [subjects, chapterCardIds, starredOnly, dueOnly, query, favorites, progress]);

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
    () => summarize(progress, presetCards.map((c) => c.id)),
    [progress],
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
    const due = presetCards.filter((c) => {
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

  return (
    <main className="mx-auto max-w-5xl px-5 py-9 sm:px-6 sm:py-10">
      {/* 헤더 */}
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-blue-600">
          FLIP CARD
        </p>
        <div className="mt-1.5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[1.7rem] font-bold leading-tight text-zinc-900 sm:text-3xl">
              전기기능사 플립 암기카드
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              핵심 개념 {presetCards.length}장을 뒤집으며 익히고, 헷갈리는 카드는
              다시 보세요.
            </p>
          </div>

          <div className="inline-flex shrink-0 rounded-full bg-zinc-100 p-1">
            <TabBtn active={view === "study"} onClick={() => setView("study")}>
              학습
            </TabBtn>
            <TabBtn active={view === "list"} onClick={() => setView("list")}>
              카드 목록
            </TabBtn>
          </div>
        </div>
      </header>

      {/* 진도 대시보드 */}
      <ProgressDashboard
        stats={stats}
        dueCount={dueCount}
        hydrated={hydrated}
        onStartReview={startReview}
        onReset={handleResetProgress}
      />

      {/* 학습 가이드 — 무엇에 집중 / 왜 효과적인가 */}
      <StudyGuide />

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
    </main>
  );
}

/* ---------------------------------------------------------------- */

function StudyGuide() {
  return (
    <details className="group mb-7 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-amber-50/40 p-4 shadow-sm sm:p-5">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-blue-800 marker:content-none [&::-webkit-details-marker]:hidden">
        <span aria-hidden>🔎</span> 이렇게 외우세요 · 왜 효과적인가
        <span className="ml-auto text-xs font-medium text-zinc-400 transition group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-bold text-blue-800">
            <span aria-hidden>🔎</span> 이렇게 외우세요
          </p>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-6 text-zinc-700">
            <li>· 답이 막히면 바로 뒤집어 확인하고 “다시보기”로 표시하세요.</li>
            <li>
              · 다시보기 카드는 ‘오늘 다시보기’·‘다시보기’ 필터에서 모아 볼 수
              있어요.
            </li>
            <li>· 한 번에 몰아서보다, 짧게 자주 회독하는 편이 좋습니다.</li>
          </ul>
        </div>
        <div className="sm:border-l sm:border-blue-100 sm:pl-5">
          <p className="flex items-center gap-1.5 text-sm font-bold text-amber-700">
            <span aria-hidden>⭐</span> 왜 효과적인가
          </p>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-6 text-zinc-700">
            <li>
              · 답을 떠올렸다 확인하는 “능동 인출”은 다시 읽기보다 기억에 더
              오래 남습니다.
            </li>
            <li>
              · 시간 간격을 두고 반복(분산 학습)하면 장기 기억이 강화됩니다.
            </li>
            <li>
              · 빈출 핵심 개념을 빠르게 회독해 필기 합격에 직접 도움이 됩니다.
            </li>
          </ul>
        </div>
      </div>
    </details>
  );
}

function ProgressDashboard({
  stats,
  dueCount,
  hydrated,
  onStartReview,
  onReset,
}: {
  stats: ReturnType<typeof summarize>;
  dueCount: number;
  hydrated: boolean;
  onStartReview: () => void;
  onReset: () => void;
}) {
  const pct = stats.masteredPct;
  // 도넛 (SVG conic 대신 stroke-dasharray)
  const R = 26;
  const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;

  return (
    <section className="mb-7 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-stretch">
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
