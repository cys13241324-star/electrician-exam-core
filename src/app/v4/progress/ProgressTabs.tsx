"use client";

import Link from "next/link";
import { useState } from "react";
import { presetCards } from "@/lib/flashcards/data";
import { ALL_SUBJECTS } from "@/lib/flashcards/chapters";
import { topicsBySubject } from "@/lib/audiobook/data";
import { simulators } from "@/lib/simulators";
import type { Subject } from "@/lib/flashcards/types";

type ToolKey = "cards" | "audio" | "sim" | "cbt";

type ToolMeta = {
  key: ToolKey;
  emoji: string;
  name: string;
  short: string;
  unit: string;
  gradient: string;
  ringBg: string;
  chip: string;
};

const TOOLS: ToolMeta[] = [
  {
    key: "cards",
    emoji: "🃏",
    name: "플립 암기카드",
    short: "회독이 짧다",
    unit: "장",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    ringBg: "from-amber-50 to-white",
    chip: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  {
    key: "audio",
    emoji: "🎧",
    name: "5분 핵심 오디오북",
    short: "이동 시간도 학습",
    unit: "챕터",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    ringBg: "from-rose-50 to-white",
    chip: "bg-rose-50 text-rose-700 ring-rose-100",
  },
  {
    key: "sim",
    emoji: "⚡",
    name: "이론 시뮬레이터",
    short: "체득으로 안 사라짐",
    unit: "개",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    ringBg: "from-sky-50 to-white",
    chip: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  {
    key: "cbt",
    emoji: "📝",
    name: "CBT 모의고사",
    short: "점수가 안정됨",
    unit: "회차",
    gradient: "from-indigo-500 via-blue-500 to-sky-500",
    ringBg: "from-indigo-50 to-white",
    chip: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  },
];

function totalFor(key: ToolKey, s: Subject): number {
  switch (key) {
    case "cards":
      return presetCards.filter((c) => c.subject === s).length;
    case "audio":
      return topicsBySubject(s).length;
    case "sim":
      return simulators.filter((sim) => sim.subject === s).length;
    case "cbt":
      return 0;
  }
}

function hrefFor(key: ToolKey, s: Subject): string {
  switch (key) {
    case "cards":
      return `/v4/${encodeURIComponent(s)}/cards`;
    case "audio":
      return `/audiobook/summary/${encodeURIComponent(s)}`;
    case "sim":
      return `/simulator/by-subject/${encodeURIComponent(s)}`;
    case "cbt":
      return `/v4/cbt`;
  }
}

/** 임시 — 추후 localStorage / 백엔드 연동 */
function getDone(_key: ToolKey, _s: Subject): number {
  return 0;
}

export default function ProgressTabs() {
  const [active, setActive] = useState<ToolKey>("cards");
  const activeTool = TOOLS.find((t) => t.key === active)!;

  return (
    <main className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      {/* breadcrumb */}
      <nav className="mb-6 text-xs">
        <Link
          href="/v4"
          className="inline-flex items-center gap-1 font-semibold text-zinc-500 hover:text-zinc-900"
        >
          ← 독끝 필기로
        </Link>
      </nav>

      {/* 헤더 */}
      <header className="max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-white">
          <span aria-hidden>📈</span>
          MY PROGRESS · BY TOOL
        </p>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
          도구별 학습 현황
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">
          학습은 ‘도구 단위’로 끊어 봐요. 어떤 도구로 어디까지 했는지 한 탭에서
          하나씩.
        </p>
      </header>

      {/* 탭 — 4개 도구 */}
      <div
        role="tablist"
        aria-label="학습 도구 선택"
        className="mt-10 -mx-1 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
      >
        {TOOLS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.key)}
              className={`group inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition ${
                isActive
                  ? `border-transparent bg-gradient-to-r ${t.gradient} text-white shadow-md`
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              }`}
            >
              <span aria-hidden className="text-base">
                {t.emoji}
              </span>
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* 탭 콘텐츠 — 도구별 대시보드 */}
      <div className="mt-6">
        {active === "cbt" ? (
          <CbtBoard tool={activeTool} />
        ) : (
          <ToolBoard tool={activeTool} />
        )}
      </div>
    </main>
  );
}

/* ─────────────── 카드 / 오디오 / 시뮬 — 공통 대시보드 ─────────────── */

function ToolBoard({ tool }: { tool: ToolMeta }) {
  const totals = ALL_SUBJECTS.map((s) => ({
    subject: s,
    total: totalFor(tool.key, s),
    done: getDone(tool.key, s),
  }));
  const totalSum = totals.reduce((a, b) => a + b.total, 0);
  const doneSum = totals.reduce((a, b) => a + b.done, 0);
  const overallPct = totalSum === 0 ? 0 : Math.round((doneSum / totalSum) * 100);

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br ${tool.ringBg} shadow-sm`}
    >
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tool.gradient}`}
      />
      <div className="p-6 sm:p-8">
        {/* 블록 헤더 */}
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-2xl shadow-md`}
          >
            {tool.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.16em] ring-1 ${tool.chip}`}
            >
              {tool.short}
            </p>
            <h2 className="mt-1 text-lg font-bold text-zinc-900 sm:text-xl">
              {tool.name}
            </h2>
          </div>
          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              총 진행률
            </p>
            <p
              className={`bg-gradient-to-r ${tool.gradient} bg-clip-text text-2xl font-black text-transparent`}
            >
              {overallPct}%
            </p>
            <p className="text-[11px] text-zinc-500">
              {doneSum} / {totalSum} {tool.unit}
            </p>
          </div>
        </div>

        {/* 모바일: 총 진행률 한 줄 */}
        <div className="mt-3 flex items-center justify-between text-xs sm:hidden">
          <span className="font-bold text-zinc-500">총 진행률</span>
          <span
            className={`bg-gradient-to-r ${tool.gradient} bg-clip-text font-black text-transparent`}
          >
            {overallPct}% · {doneSum}/{totalSum}
            {tool.unit}
          </span>
        </div>

        {/* 과목별 진행 */}
        <div className="mt-6 space-y-4">
          {totals.map(({ subject, total, done }) => {
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);
            return (
              <div key={subject}>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <Link
                    href={hrefFor(tool.key, subject)}
                    className="font-semibold text-zinc-800 hover:underline"
                  >
                    {subject}
                  </Link>
                  <span className="shrink-0 text-xs font-bold text-zinc-500">
                    {done} / {total} {tool.unit}{" "}
                    <span className="text-zinc-400">· {pct}%</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${tool.gradient}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 빈 상태 안내 */}
        {doneSum === 0 && (
          <p className="mt-5 rounded-xl border border-dashed border-zinc-300 bg-white/80 px-3 py-2.5 text-center text-[12px] leading-relaxed text-zinc-600">
            아직 학습 기록이 없어요. 위 과목 이름을 누르면 바로{" "}
            <strong className="text-zinc-800">{tool.name}</strong>으로 이동해요.
          </p>
        )}
      </div>
    </section>
  );
}

/* ─────────────── CBT — 별도 대시보드 안내 ─────────────── */

function CbtBoard({ tool }: { tool: ToolMeta }) {
  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br ${tool.ringBg} shadow-sm`}
    >
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tool.gradient}`}
      />
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-2xl shadow-md`}
          >
            {tool.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.16em] ring-1 ${tool.chip}`}
            >
              {tool.short}
            </p>
            <h2 className="mt-1 text-lg font-bold text-zinc-900 sm:text-xl">
              {tool.name}
            </h2>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-zinc-700">
          CBT는 회차별·과목별·빈출도순 콘텐츠 위에 학습 코칭 대시보드와 나만의
          시험 빌더가 붙어 있어요. 점수 추이·취약 토픽·D-Day까지 한 페이지에서
          확인합니다.
        </p>

        <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
          {[
            { emoji: "📈", label: "평균 정답률 / 응시 회차 / 누적 학습" },
            { emoji: "🎯", label: "취약 토픽 TOP 3" },
            { emoji: "📉", label: "학습 곡선 (점수 추이 + 합격선)" },
            { emoji: "🎛️", label: "나만의 시험 — 빈출도·난이도·문항수 직접" },
          ].map((it) => (
            <li
              key={it.label}
              className="flex items-start gap-2 rounded-xl bg-white/70 px-3 py-2 ring-1 ring-zinc-100"
            >
              <span aria-hidden className="text-base">
                {it.emoji}
              </span>
              <span className="text-[13px] leading-relaxed text-zinc-700">
                {it.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/v4/cbt"
            className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${tool.gradient} px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg`}
          >
            CBT 코칭 페이지로
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/cbt/wrong-notes"
            className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            <span aria-hidden>🔁</span>
            오답 노트
          </Link>
        </div>
      </div>
    </section>
  );
}
