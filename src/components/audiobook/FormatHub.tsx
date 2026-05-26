"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  formatDuration,
  subjectStatsForFormat,
  totalDurationSec,
} from "@/lib/audiobook/data";
import { AUDIOBOOK_SUBJECTS, FORMAT_META } from "@/lib/audiobook/types";
import type { Format, Subject } from "@/lib/audiobook/types";

const SUBJECT_ICON: Record<Subject, string> = {
  전기이론: "⚡",
  전기기기: "🔧",
  전기설비: "🏗️",
};

const SUBJECT_THEME: Record<
  Subject,
  { accent: string; dot: string; bar: string }
> = {
  전기이론: {
    accent: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-500",
    bar: "from-blue-400 to-blue-600",
  },
  전기기기: {
    accent: "bg-violet-50 text-violet-700 border-violet-100",
    dot: "bg-violet-500",
    bar: "from-violet-400 to-violet-600",
  },
  전기설비: {
    accent: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
    bar: "from-amber-400 to-amber-600",
  },
};

export default function FormatHub({ format }: { format: Format }) {
  const meta = FORMAT_META[format];
  const stats = useMemo(() => subjectStatsForFormat(format), [format]);
  const totalSec = useMemo(() => totalDurationSec(format), [format]);
  const totalChapters = stats.reduce((acc, s) => acc + s.total, 0);

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      {/* Breadcrumb */}
      <nav
        aria-label="위치"
        className="mb-3 flex min-w-0 items-center gap-1.5 text-xs text-zinc-500"
      >
        <Link
          href="/audiobook"
          className="shrink-0 rounded-md px-1 py-0.5 font-medium transition hover:bg-zinc-200/60 hover:text-zinc-800"
        >
          오디오북
        </Link>
        <span aria-hidden>›</span>
        <span className="shrink-0 font-semibold text-zinc-700">{meta.label}</span>
      </nav>

      {/* Format intro header */}
      <header
        className={`overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br ${
          format === "read"
            ? "from-blue-50 to-white"
            : format === "podcast"
              ? "from-rose-50 to-white"
              : "from-amber-50 to-white"
        } px-6 py-6 sm:px-8 sm:py-7`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-2xl ${meta.accent}`}
              >
                {meta.icon}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.chip}`}
              >
                AUDIOBOOK · {meta.short.toUpperCase()}
              </span>
            </div>
            <h1 className="mt-3 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
              {meta.label}
            </h1>
            <p className={`mt-1 text-sm font-semibold ${meta.text}`}>
              {meta.tagline}
            </p>
            <p className="mt-2 max-w-2xl text-[13px] leading-6 text-zinc-600">
              {meta.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 text-right">
            <span className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
              {totalChapters}챕터 · {formatDuration(totalSec)}
            </span>
            <span className="text-[11px] text-zinc-500">
              챕터당 약 {meta.avgMin}분
            </span>
          </div>
        </div>
      </header>

      {/* 3 subject cards */}
      <section className="mt-6 rounded-3xl bg-zinc-100/50 p-3 ring-1 ring-zinc-200/60 sm:p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {AUDIOBOOK_SUBJECTS.map((subject) => {
            const stat = stats.find((s) => s.subject === subject);
            const theme = SUBJECT_THEME[subject];
            return (
              <Link
                key={subject}
                href={`/audiobook/${format}/${encodeURIComponent(subject)}`}
                className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-7 pb-12 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border text-2xl ${theme.accent}`}
                  >
                    {SUBJECT_ICON[subject]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-zinc-900">
                        {subject}
                      </h2>
                      {stat && (
                        <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                          {stat.total}
                          <span className="text-zinc-400">챕터 · </span>
                          {formatDuration(stat.durationSec)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-zinc-600">
                      {SUBJECT_HINT[subject]}
                    </p>
                  </div>
                </div>
                <span className="absolute bottom-5 right-5 inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-900">
                  {subject} 듣기
                  <span className="transition group-hover:translate-x-1">→</span>
                </span>
              </Link>
            );
          })}

          {/* 4번째 칸: 골라듣기 진입 */}
          <Link
            href="/audiobook/custom"
            className="group relative flex flex-col rounded-2xl border border-dashed border-teal-300 bg-teal-50/40 p-7 pb-12 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-2xl text-teal-700">
                🎼
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-zinc-900">
                  다른 포맷도 골라보기
                </h2>
                <p className="mt-1.5 text-[15px] leading-relaxed text-zinc-600">
                  이 포맷에 얽매이지 않고, 다른 컨셉의 챕터도 함께 골라 플레이리스트로 만들 수 있어요.
                </p>
              </div>
            </div>
            <span className="absolute bottom-5 right-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition group-hover:text-teal-900">
              골라듣기로
              <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* 안내 카드 */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-xl">{meta.icon}</span>
          <div>
            <p className="text-sm font-bold text-zinc-900">
              {meta.label}을(를) 이렇게 쓰면 좋아요
            </p>
            <ul className="mt-2 space-y-1.5 text-[13px] leading-6 text-zinc-600">
              {FORMAT_TIPS[format].map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-zinc-400">·</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

const SUBJECT_HINT: Record<Subject, string> = {
  전기이론:
    "회로 해석의 기초부터 3상 교류까지. 전체 학습의 출발점이 되는 핵심 8챕터.",
  전기기기:
    "직류기·동기기·유도기·변압기·전력변환. 회전기와 변환기의 동작을 5챕터로.",
  전기설비:
    "전선·배선·차단·접지·수변전·KEC. 시공·운용·법규의 실무 감각 9챕터.",
};

const FORMAT_TIPS: Record<Format, string[]> = {
  read: [
    "처음 들을 때는 1.0배속으로 차분히 — 흐름을 머리에 새기는 게 우선.",
    "이미 들은 챕터는 1.25~1.5배속으로 회독 속도 ↑.",
    "출퇴근길 한 정거장이면 약 한 챕터가 끝납니다.",
  ],
  podcast: [
    "혼자 듣기 지루한 이론도 두 명의 대화 흐름을 따라가다 보면 부담이 적어요.",
    "졸리는 시간에 가장 잘 맞는 포맷 — 자연스러운 대화 톤이 집중을 유지시켜 줍니다.",
    "한 챕터에 두 번 이상 등장하는 키워드가 시험에 자주 나오는 포인트입니다.",
  ],
  summary: [
    "이미 한 번 들었던 챕터의 빠른 회독 용도로 가장 효과적.",
    "시험 보기 하루 전, 전 챕터를 한 시간 정도에 훑을 수 있어요.",
    "통근 시간이 짧을 때 — 5분이면 한 챕터 끝.",
  ],
};
