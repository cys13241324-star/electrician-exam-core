"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatChapterDuration } from "@/lib/audiobook/data";
import type { Chapter } from "@/lib/audiobook/types";

const LAST_PLAYED_KEY = "audiobook:lastPlayed";
const RATES = [0.8, 1, 1.25, 1.5, 1.75, 2] as const;

export default function SubjectChapterList({
  chapters,
  themeBar,
}: {
  chapters: Chapter[];
  themeBar: string;
}) {
  const searchParams = useSearchParams();
  const initialCh = searchParams.get("ch") ?? null;

  const [activeId, setActiveId] = useState<string | null>(initialCh);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState<(typeof RATES)[number]>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const active = chapters.find((c) => c.chapterId === activeId) ?? null;

  useEffect(() => {
    if (!active) return;
    setProgress(0);
    try {
      window.localStorage.setItem(LAST_PLAYED_KEY, active.chapterId);
    } catch {
      /* ignore */
    }
  }, [active]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.play().catch(() => setPlaying(false));
    } else {
      a.pause();
    }
  }, [playing, activeId]);

  useEffect(() => {
    const a = audioRef.current;
    if (a) a.playbackRate = rate;
  }, [rate, activeId]);

  function selectChapter(id: string) {
    if (id === activeId) {
      setPlaying((p) => !p);
      return;
    }
    setActiveId(id);
    setPlaying(true);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const a = audioRef.current;
    if (!a) return;
    const next = Number(e.target.value);
    a.currentTime = next;
    setProgress(next);
  }
  function skip(seconds: number) {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(
      0,
      Math.min((a.duration || 0) - 0.1, a.currentTime + seconds),
    );
  }
  function goNext() {
    if (!active) return;
    const idx = chapters.findIndex((c) => c.chapterId === active.chapterId);
    const next = chapters[idx + 1];
    if (next) {
      setActiveId(next.chapterId);
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }
  function goPrev() {
    if (!active) return;
    const idx = chapters.findIndex((c) => c.chapterId === active.chapterId);
    const prev = chapters[idx - 1];
    if (prev) {
      setActiveId(prev.chapterId);
      setPlaying(true);
    }
  }

  const progressPct = duration ? (progress / duration) * 100 : 0;

  return (
    <>
      <ul className="mt-6 space-y-2">
        {chapters.map((c) => {
          const isActive = c.chapterId === activeId;
          return (
            <li key={c.chapterId}>
              <div
                className={`overflow-hidden rounded-2xl border bg-white transition ${
                  isActive
                    ? "border-zinc-300 shadow-md"
                    : "border-zinc-200 shadow-sm hover:border-zinc-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectChapter(c.chapterId)}
                  aria-label={`${c.no}강 ${c.title} ${isActive && playing ? "일시정지" : "재생"}`}
                  className="flex w-full items-start gap-4 px-5 py-4 text-left"
                >
                  <span
                    className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition ${
                      isActive
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {isActive && playing ? <PauseIcon /> : <PlayIcon />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500">
                      <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 tabular-nums text-zinc-700">
                        {c.no}강
                      </span>
                      {c.status === "coming_soon" && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-700">
                          준비중
                        </span>
                      )}
                      <span className="ml-auto tabular-nums text-zinc-400">
                        {formatChapterDuration(c.durationSec)}
                      </span>
                    </span>
                    <span
                      className={`mt-1 block truncate text-base font-bold ${
                        isActive ? "text-zinc-900" : "text-zinc-800"
                      }`}
                    >
                      {c.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-6 text-zinc-500">
                      {c.summary}
                    </span>
                  </span>
                </button>

                {isActive && (
                  <div className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="이전 챕터"
                        onClick={goPrev}
                        disabled={chapters[0]?.chapterId === c.chapterId}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <PrevIcon />
                      </button>
                      <button
                        type="button"
                        aria-label="-15초"
                        onClick={() => skip(-15)}
                        className="flex h-9 items-center gap-0.5 rounded-full px-2.5 text-xs font-bold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
                      >
                        <ArrowBack /> 15
                      </button>
                      <button
                        type="button"
                        aria-label={playing ? "일시정지" : "재생"}
                        onClick={() => setPlaying((p) => !p)}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm transition hover:bg-zinc-800"
                      >
                        {playing ? <PauseIcon big /> : <PlayIcon big />}
                      </button>
                      <button
                        type="button"
                        aria-label="+15초"
                        onClick={() => skip(15)}
                        className="flex h-9 items-center gap-0.5 rounded-full px-2.5 text-xs font-bold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
                      >
                        15 <ArrowFwd />
                      </button>
                      <button
                        type="button"
                        aria-label="다음 챕터"
                        onClick={goNext}
                        disabled={
                          chapters[chapters.length - 1]?.chapterId === c.chapterId
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <NextIcon />
                      </button>

                      <div className="ml-auto flex items-center gap-1.5 rounded-full bg-white p-1 ring-1 ring-zinc-200">
                        {RATES.map((r) => (
                          <button
                            key={r}
                            onClick={() => setRate(r)}
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition ${
                              rate === r
                                ? "bg-zinc-900 text-white"
                                : "text-zinc-500 hover:text-zinc-800"
                            }`}
                          >
                            {r}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="w-10 text-right text-[11px] tabular-nums text-zinc-500">
                        {formatChapterDuration(Math.floor(progress))}
                      </span>
                      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${themeBar} transition-[width] duration-150`}
                          style={{ width: `${progressPct}%` }}
                        />
                        <input
                          type="range"
                          min={0}
                          max={duration || 1}
                          step={0.1}
                          value={progress}
                          onChange={handleSeek}
                          aria-label="재생 위치"
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </div>
                      <span className="w-10 text-[11px] tabular-nums text-zinc-500">
                        {formatChapterDuration(
                          Math.floor(duration || c.durationSec),
                        )}
                      </span>
                    </div>

                    <audio
                      ref={audioRef}
                      src={c.src}
                      preload="metadata"
                      onTimeUpdate={(e) =>
                        setProgress(e.currentTarget.currentTime)
                      }
                      onLoadedMetadata={(e) =>
                        setDuration(e.currentTarget.duration)
                      }
                      onEnded={goNext}
                      onError={() => setPlaying(false)}
                    />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-center text-[11px] text-zinc-400">
        ✦ 현재는 UI 데모입니다. 실제 음성 파일은 챕터별로 순차 업로드 예정.
      </p>
    </>
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
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}
function ArrowFwd() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
    </svg>
  );
}
