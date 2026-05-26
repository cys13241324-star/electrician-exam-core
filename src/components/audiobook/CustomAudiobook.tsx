"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  chapters as ALL_CHAPTERS,
  formatChapterDuration,
  formatDuration,
  topicsBySubject,
} from "@/lib/audiobook/data";
import {
  AUDIOBOOK_FORMATS,
  AUDIOBOOK_SUBJECTS,
  FORMAT_META,
} from "@/lib/audiobook/types";
import type { Chapter, Format, Subject } from "@/lib/audiobook/types";

const SELECTION_KEY = "audiobook:customSelection";
const LAST_PLAYED_KEY = "audiobook:lastPlayed";
const RATES = [0.8, 1, 1.25, 1.5, 1.75, 2] as const;

const SUBJECT_THEME: Record<Subject, { dot: string; chip: string }> = {
  전기이론: { dot: "bg-blue-500", chip: "bg-blue-50 text-blue-700" },
  전기기기: { dot: "bg-violet-500", chip: "bg-violet-50 text-violet-700" },
  전기설비: { dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700" },
};

type Mode = "select" | "play";
type FormatFilter = "all" | Format;

const FILTER_TABS: { value: FormatFilter; label: string; icon?: string }[] = [
  { value: "all", label: "전체" },
  { value: "read", label: FORMAT_META.read.short, icon: FORMAT_META.read.icon },
  {
    value: "podcast",
    label: FORMAT_META.podcast.short,
    icon: FORMAT_META.podcast.icon,
  },
  {
    value: "summary",
    label: FORMAT_META.summary.short,
    icon: FORMAT_META.summary.icon,
  },
];

// chapter 빠른 조회: `${topicId}--${format}` → Chapter
const CHAPTER_MAP = new Map<string, Chapter>(
  ALL_CHAPTERS.map((c) => [c.chapterId, c]),
);

function chapterFor(topicId: string, format: Format) {
  return CHAPTER_MAP.get(`${topicId}--${format}`);
}

export default function CustomAudiobook() {
  const [hydrated, setHydrated] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FormatFilter>("all");
  const [mode, setMode] = useState<Mode>("select");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState<(typeof RATES)[number]>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SELECTION_KEY);
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        if (Array.isArray(ids)) {
          const valid = new Set(ids.filter((id) => CHAPTER_MAP.has(id)));
          setSelectedIds(valid);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        SELECTION_KEY,
        JSON.stringify(Array.from(selectedIds)),
      );
    } catch {
      /* ignore */
    }
  }, [selectedIds, hydrated]);

  // 큐 — 챕터 원래 순서(format 순 → subject·no 순)대로
  const queue = useMemo(
    () => ALL_CHAPTERS.filter((c) => selectedIds.has(c.chapterId)),
    [selectedIds],
  );

  const selectedSec = useMemo(
    () => queue.reduce((acc, c) => acc + c.durationSec, 0),
    [queue],
  );

  const active = activeId ? queue.find((c) => c.chapterId === activeId) : null;
  const activeIdx = active
    ? queue.findIndex((c) => c.chapterId === active.chapterId)
    : -1;

  useEffect(() => {
    const a = audioRef.current;
    if (a) a.playbackRate = rate;
  }, [rate, activeId]);

  // 큐가 비면 select 모드로 복귀
  useEffect(() => {
    if (mode !== "play") return;
    if (!active && queue.length === 0) {
      setMode("select");
      setActiveId(null);
      setPlaying(false);
    }
  }, [queue, active, mode]);

  // iOS Safari 호환: src 변경 + play 호출을 click 핸들러 동기 흐름 안에서.
  function playChapter(chapter: Chapter) {
    const a = audioRef.current;
    if (!a) return;
    const absolute =
      typeof window !== "undefined"
        ? new URL(chapter.src, window.location.origin).href
        : chapter.src;
    if (a.src !== absolute) {
      a.src = chapter.src;
      a.playbackRate = rate;
      a.load();
    }
    const p = a.play();
    if (p) {
      p.then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      setPlaying(true);
    }
    try {
      window.localStorage.setItem(LAST_PLAYED_KEY, chapter.chapterId);
    } catch {
      /* ignore */
    }
  }

  function pauseAudio() {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    setPlaying(false);
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleTopicAllFormats(topicId: string) {
    const ids = AUDIOBOOK_FORMATS.map((f) => `${topicId}--${f}`);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allOn = ids.every((id) => next.has(id));
      ids.forEach((id) => (allOn ? next.delete(id) : next.add(id)));
      return next;
    });
  }
  function toggleSubjectFormat(subject: Subject, format: Format) {
    const ids = topicsBySubject(subject).map((t) => `${t.id}--${format}`);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allOn = ids.every((id) => next.has(id));
      ids.forEach((id) => (allOn ? next.delete(id) : next.add(id)));
      return next;
    });
  }
  function selectAll() {
    setSelectedIds(new Set(ALL_CHAPTERS.map((c) => c.chapterId)));
  }
  function clearAll() {
    setSelectedIds(new Set());
  }
  function selectAllOfFormat(format: Format) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ALL_CHAPTERS.filter((c) => c.format === format).forEach((c) =>
        next.add(c.chapterId),
      );
      return next;
    });
  }

  function startPlayback() {
    if (queue.length === 0) return;
    setMode("play");
    setActiveId(queue[0].chapterId);
    setProgress(0);
    playChapter(queue[0]);
  }
  function backToSelect() {
    pauseAudio();
    setMode("select");
  }
  function togglePlay() {
    const a = audioRef.current;
    if (!a || !active) return;
    if (a.paused) playChapter(active);
    else pauseAudio();
  }
  function jumpTo(id: string) {
    const chapter = queue.find((c) => c.chapterId === id);
    if (!chapter) return;
    setActiveId(id);
    setProgress(0);
    playChapter(chapter);
  }
  function goNext() {
    if (activeIdx < 0) return;
    const next = queue[activeIdx + 1];
    if (next) jumpTo(next.chapterId);
    else setPlaying(false);
  }
  function goPrev() {
    if (activeIdx <= 0) return;
    const prev = queue[activeIdx - 1];
    if (prev) jumpTo(prev.chapterId);
  }
  function skip(seconds: number) {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(
      0,
      Math.min((a.duration || 0) - 0.1, a.currentTime + seconds),
    );
  }
  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const a = audioRef.current;
    if (!a) return;
    const next = Number(e.target.value);
    a.currentTime = next;
    setProgress(next);
  }

  const visibleFormats: Format[] =
    filter === "all" ? AUDIOBOOK_FORMATS : [filter];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      {/* 좌측: 선택 영역 */}
      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {/* 상단 액션 바 */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 px-5 py-3.5 sm:px-6">
          <div className="text-sm font-bold text-zinc-900">
            챕터 선택
            {hydrated && (
              <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-zinc-600">
                {selectedIds.size} / {ALL_CHAPTERS.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={selectAll}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              모두 선택
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-500 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              모두 해제
            </button>
          </div>
        </div>

        {/* Format 필터 탭 */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-100 bg-zinc-50/40 px-5 py-3 sm:px-6">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            포맷
          </span>
          {FILTER_TABS.map((tab) => {
            const active = filter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold transition ${
                  active
                    ? "bg-zinc-900 text-white"
                    : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:text-zinc-900"
                }`}
              >
                {tab.icon && <span className="mr-0.5">{tab.icon}</span>}
                {tab.label}
              </button>
            );
          })}
          {filter !== "all" && (
            <button
              type="button"
              onClick={() => selectAllOfFormat(filter as Format)}
              className="ml-auto rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 transition hover:bg-zinc-200"
            >
              이 포맷 전체 선택
            </button>
          )}
        </div>

        {/* 과목별 → topic별 그룹 */}
        <div className="divide-y divide-zinc-100">
          {AUDIOBOOK_SUBJECTS.map((subject) => {
            const topics = topicsBySubject(subject);
            const theme = SUBJECT_THEME[subject];
            return (
              <div key={subject} className="px-5 py-5 sm:px-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
                  <h3 className="text-[15px] font-bold text-zinc-900">
                    {subject}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${theme.chip}`}
                  >
                    {topics.length}개 주제
                  </span>
                  {filter !== "all" && (
                    <button
                      type="button"
                      onClick={() => toggleSubjectFormat(subject, filter as Format)}
                      className="ml-auto text-[11px] font-semibold text-zinc-500 transition hover:text-zinc-900"
                    >
                      이 과목의 {FORMAT_META[filter as Format].short} 모두 토글
                    </button>
                  )}
                </div>

                <ul className="space-y-2">
                  {topics.map((topic) => {
                    const visibleChapters = visibleFormats
                      .map((f) => chapterFor(topic.id, f))
                      .filter((c): c is Chapter => Boolean(c));
                    const ids = visibleChapters.map((c) => c.chapterId);
                    const allOn = ids.every((id) => selectedIds.has(id));
                    const someOn = ids.some((id) => selectedIds.has(id));
                    return (
                      <li
                        key={topic.id}
                        className="rounded-xl border border-zinc-200 bg-white p-3 transition hover:border-zinc-300"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-[12px] font-semibold text-zinc-500">
                            <span className="rounded bg-zinc-100 px-1.5 py-0.5 tabular-nums text-zinc-700">
                              {topic.no}강
                            </span>
                            <span className="truncate text-[14px] text-zinc-900">
                              {topic.title}
                            </span>
                          </div>
                          {filter === "all" && (
                            <button
                              type="button"
                              onClick={() => toggleTopicAllFormats(topic.id)}
                              className="text-[11px] font-semibold text-zinc-500 transition hover:text-zinc-900"
                            >
                              {allOn
                                ? "모든 포맷 해제"
                                : someOn
                                  ? "모든 포맷 선택"
                                  : "모든 포맷 선택"}
                            </button>
                          )}
                        </div>
                        <p className="mt-1 line-clamp-1 text-[12px] leading-5 text-zinc-500">
                          {topic.summary}
                        </p>

                        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                          {visibleFormats.map((f) => {
                            const ch = chapterFor(topic.id, f);
                            if (!ch) return null;
                            const meta = FORMAT_META[f];
                            const on = selectedIds.has(ch.chapterId);
                            const isActive =
                              mode === "play" && active?.chapterId === ch.chapterId;
                            return (
                              <button
                                key={f}
                                type="button"
                                onClick={() => toggleOne(ch.chapterId)}
                                className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
                                  on
                                    ? `border-zinc-300 bg-zinc-50 ring-1 ${meta.ring}`
                                    : "border-zinc-200 bg-white hover:border-zinc-300"
                                } ${isActive ? "shadow-md" : ""}`}
                              >
                                <span
                                  aria-hidden
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                    on
                                      ? "border-zinc-900 bg-zinc-900 text-white"
                                      : "border-zinc-300 bg-white"
                                  }`}
                                >
                                  {on && <CheckIcon />}
                                </span>
                                <span
                                  className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${meta.chip}`}
                                >
                                  {meta.icon} {meta.short}
                                </span>
                                <span className="ml-auto shrink-0 text-[10px] tabular-nums text-zinc-500">
                                  {formatChapterDuration(ch.durationSec)}
                                </span>
                                {isActive && (
                                  <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                                    ▶
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* 우측: 요약/플레이어 패널 */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        {mode === "select" ? (
          <SelectionPanel
            queue={queue}
            selectedSec={selectedSec}
            hydrated={hydrated}
            onStart={startPlayback}
            onClear={clearAll}
          />
        ) : (
          active && (
            <PlayerPanel
              active={active}
              activeIdx={activeIdx}
              queue={queue}
              progress={progress}
              duration={duration}
              playing={playing}
              rate={rate}
              onTogglePlay={togglePlay}
              onPrev={goPrev}
              onNext={goNext}
              onSkip={skip}
              onSeek={handleSeek}
              onRate={setRate}
              onJump={jumpTo}
              onBack={backToSelect}
            />
          )
        )}

        {/* 단일 audio element — src 는 imperative 로만 관리 (iOS Safari 대응) */}
        <audio
          ref={audioRef}
          preload="none"
          playsInline
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={goNext}
          onError={() => setPlaying(false)}
        />
      </aside>
    </div>
  );
}

function SelectionPanel({
  queue,
  selectedSec,
  hydrated,
  onStart,
  onClear,
}: {
  queue: Chapter[];
  selectedSec: number;
  hydrated: boolean;
  onStart: () => void;
  onClear: () => void;
}) {
  const canStart = queue.length > 0;
  // 포맷별 카운트
  const byFormat: Record<Format, number> = { read: 0, podcast: 0, summary: 0 };
  queue.forEach((c) => (byFormat[c.format] += 1));

  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-6">
      <p className="text-sm font-bold text-teal-800">내 플레이리스트</p>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-zinc-500">선택 챕터</dt>
          <dd className="font-bold tabular-nums text-zinc-900">
            {hydrated ? queue.length : "—"}개
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-zinc-500">총 재생시간</dt>
          <dd className="font-bold tabular-nums text-zinc-900">
            {hydrated ? formatDuration(selectedSec) : "—"}
          </dd>
        </div>
        {hydrated && queue.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {AUDIOBOOK_FORMATS.map((f) => {
              const meta = FORMAT_META[f];
              const count = byFormat[f];
              if (count === 0) return null;
              return (
                <span
                  key={f}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.chip}`}
                >
                  {meta.icon} {count}
                </span>
              );
            })}
          </div>
        )}
      </dl>

      <button
        type="button"
        onClick={onStart}
        disabled={!canStart}
        className={`mt-5 w-full rounded-full py-2.5 text-sm font-bold shadow-sm transition ${
          canStart
            ? "bg-teal-600 text-white hover:bg-teal-700"
            : "cursor-not-allowed bg-zinc-200 text-zinc-400"
        }`}
      >
        {canStart ? "▶ 선택한 챕터 연속 재생" : "챕터를 1개 이상 선택하세요"}
      </button>

      {hydrated && queue.length > 0 && (
        <>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            재생 순서 미리보기
          </p>
          <ol className="mt-2 max-h-64 space-y-1 overflow-y-auto pr-1 text-[12px]">
            {queue.slice(0, 12).map((c, i) => {
              const meta = FORMAT_META[c.format];
              return (
                <li
                  key={c.chapterId}
                  className="flex items-center gap-2 truncate text-zinc-600"
                >
                  <span className="w-5 shrink-0 text-right text-[10px] tabular-nums text-zinc-400">
                    {i + 1}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${meta.chip}`}
                  >
                    {meta.icon}
                  </span>
                  <span className="truncate">
                    <span className="text-zinc-400">{c.subject} ·</span>{" "}
                    {c.title}
                  </span>
                </li>
              );
            })}
            {queue.length > 12 && (
              <li className="pl-7 text-[11px] text-zinc-400">
                외 {queue.length - 12}개 더…
              </li>
            )}
          </ol>

          <button
            type="button"
            onClick={onClear}
            className="mt-4 w-full rounded-full border border-zinc-200 bg-white py-2 text-[11px] font-semibold text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-700"
          >
            전체 해제하고 다시 고르기
          </button>
        </>
      )}

      <p className="mt-4 text-[11px] leading-5 text-zinc-500">
        ✦ 선택은 다음 방문 때도 유지됩니다. 챕터는 포맷(읽기→팟캐→요약) ·
        과목(이론→기기→설비) 순으로 재생돼요.
      </p>

      <div className="mt-4 border-t border-teal-200/60 pt-4 text-center">
        <Link
          href="/audiobook"
          className="text-[12px] font-semibold text-teal-700 hover:underline"
        >
          ← 오디오북 허브로
        </Link>
      </div>
    </div>
  );
}

function PlayerPanel({
  active,
  activeIdx,
  queue,
  progress,
  duration,
  playing,
  rate,
  onTogglePlay,
  onPrev,
  onNext,
  onSkip,
  onSeek,
  onRate,
  onJump,
  onBack,
}: {
  active: Chapter;
  activeIdx: number;
  queue: Chapter[];
  progress: number;
  duration: number;
  playing: boolean;
  rate: (typeof RATES)[number];
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSkip: (s: number) => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRate: (r: (typeof RATES)[number]) => void;
  onJump: (id: string) => void;
  onBack: () => void;
}) {
  const progressPct = duration ? (progress / duration) * 100 : 0;
  const upcoming = queue.slice(activeIdx + 1);
  const meta = FORMAT_META[active.format];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 text-white shadow-lg">
      <div className="border-b border-white/10 px-5 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-300">
            재생 중 · {activeIdx + 1} / {queue.length}
          </span>
          <button
            type="button"
            onClick={onBack}
            className="text-[11px] font-semibold text-zinc-400 transition hover:text-white"
          >
            선택 화면으로 ←
          </button>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="flex items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.chip}`}
          >
            {meta.icon} {meta.short}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            · {active.subject} · {active.no}강
          </span>
        </div>
        <p className="mt-2 text-base font-bold leading-snug">{active.title}</p>
        <p className="mt-1.5 text-[12px] leading-5 text-zinc-400">
          {active.summary}
        </p>

        <div className="mt-5">
          <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-[width] duration-150"
              style={{ width: `${progressPct}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={progress}
              onChange={onSeek}
              aria-label="재생 위치"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] tabular-nums text-zinc-400">
            <span>{formatChapterDuration(Math.floor(progress))}</span>
            <span>
              {formatChapterDuration(
                Math.floor(duration || active.durationSec),
              )}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <CtrlBtn label="이전" onClick={onPrev} disabled={activeIdx === 0}>
            <PrevIcon />
          </CtrlBtn>
          <CtrlBtn label="-15초" onClick={() => onSkip(-15)}>
            <span className="flex items-center gap-0.5 text-[10px] font-bold">
              <ArrowBack /> 15
            </span>
          </CtrlBtn>
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={playing ? "일시정지" : "재생"}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-zinc-900 shadow-md transition hover:scale-105"
          >
            {playing ? <PauseIcon big /> : <PlayIcon big />}
          </button>
          <CtrlBtn label="+15초" onClick={() => onSkip(15)}>
            <span className="flex items-center gap-0.5 text-[10px] font-bold">
              15 <ArrowFwd />
            </span>
          </CtrlBtn>
          <CtrlBtn
            label="다음"
            onClick={onNext}
            disabled={activeIdx >= queue.length - 1}
          >
            <NextIcon />
          </CtrlBtn>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-white/5 p-1">
          {RATES.map((r) => (
            <button
              key={r}
              onClick={() => onRate(r)}
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition ${
                rate === r
                  ? "bg-white text-zinc-900"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {r}x
            </button>
          ))}
        </div>
      </div>

      {upcoming.length > 0 && (
        <div className="border-t border-white/10 bg-black/20 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            다음 큐 · {upcoming.length}곡
          </p>
          <ol className="mt-2 max-h-44 space-y-1 overflow-y-auto pr-1 text-[12px]">
            {upcoming.slice(0, 6).map((c, i) => {
              const meta = FORMAT_META[c.format];
              return (
                <li key={c.chapterId}>
                  <button
                    type="button"
                    onClick={() => onJump(c.chapterId)}
                    className="flex w-full items-center gap-2 truncate rounded-md px-2 py-1 text-left text-zinc-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <span className="w-5 shrink-0 text-right text-[10px] tabular-nums text-zinc-500">
                      {i + 1}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${meta.chip}`}
                    >
                      {meta.icon}
                    </span>
                    <span className="truncate">
                      <span className="text-zinc-500">{c.subject} ·</span>{" "}
                      {c.title}
                    </span>
                    <span className="ml-auto shrink-0 text-[10px] tabular-nums text-zinc-500">
                      {formatChapterDuration(c.durationSec)}
                    </span>
                  </button>
                </li>
              );
            })}
            {upcoming.length > 6 && (
              <li className="pl-7 text-[10px] text-zinc-500">
                외 {upcoming.length - 6}개 더…
              </li>
            )}
          </ol>
        </div>
      )}
    </div>
  );
}

function CtrlBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" aria-hidden>
      <path d="M5 13l4 4 10-10" />
    </svg>
  );
}
function PlayIcon({ big }: { big?: boolean }) {
  const s = big ? 16 : 14;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon({ big }: { big?: boolean }) {
  const s = big ? 16 : 14;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function PrevIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 6h2v12H6zM10 12l9-6v12z" />
    </svg>
  );
}
function NextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 6h2v12h-2zM5 6v12l9-6z" />
    </svg>
  );
}
function ArrowBack() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}
function ArrowFwd() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
    </svg>
  );
}
