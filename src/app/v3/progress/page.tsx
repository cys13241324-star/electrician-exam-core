import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { presetCards } from "@/lib/flashcards/data";
import { ALL_SUBJECTS } from "@/lib/flashcards/chapters";
import { topicsBySubject } from "@/lib/audiobook/data";
import { simulators } from "@/lib/simulators";
import type { Subject } from "@/lib/flashcards/types";

export const metadata: Metadata = {
  title: "학습 현황 — 독끝 전기기능사 필기",
  description:
    "플립 암기카드·5분 핵심 오디오북·이론 시뮬레이터를 어디까지 학습했는지 한눈에.",
};

type ToolBlock = {
  key: "cards" | "audio" | "sim";
  emoji: string;
  name: string;
  unit: string;
  gradient: string;
  ringBg: string;
  chip: string;
  hrefFor: (s: Subject) => string;
  totalFor: (s: Subject) => number;
};

const TOOL_BLOCKS: ToolBlock[] = [
  {
    key: "cards",
    emoji: "🃏",
    name: "플립 암기카드",
    unit: "장",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    ringBg: "from-amber-50 to-white",
    chip: "bg-amber-50 text-amber-700 ring-amber-100",
    hrefFor: (s) => `/v3/${encodeURIComponent(s)}/cards`,
    totalFor: (s) => presetCards.filter((c) => c.subject === s).length,
  },
  {
    key: "audio",
    emoji: "🎧",
    name: "5분 핵심 오디오북",
    unit: "챕터",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    ringBg: "from-rose-50 to-white",
    chip: "bg-rose-50 text-rose-700 ring-rose-100",
    hrefFor: (s) => `/audiobook/summary/${encodeURIComponent(s)}`,
    totalFor: (s) => topicsBySubject(s).length,
  },
  {
    key: "sim",
    emoji: "⚡",
    name: "이론 시뮬레이터",
    unit: "개",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    ringBg: "from-sky-50 to-white",
    chip: "bg-sky-50 text-sky-700 ring-sky-100",
    hrefFor: (s) => `/simulator/by-subject/${encodeURIComponent(s)}`,
    totalFor: (s) => simulators.filter((sim) => sim.subject === s).length,
  },
];

/** 진행 상태 — 현재는 빈 상태. 추후 localStorage 또는 백엔드 연동 */
function getDone(_tool: ToolBlock["key"], _subject: Subject): number {
  return 0;
}

export default function V3ProgressPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
        {/* breadcrumb */}
        <nav className="mb-6 text-xs">
          <Link
            href="/v3"
            className="inline-flex items-center gap-1 font-semibold text-zinc-500 hover:text-zinc-900"
          >
            ← 독끝 필기로
          </Link>
        </nav>

        {/* 헤더 */}
        <header className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-white">
            <span aria-hidden>📈</span>
            MY PROGRESS
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
            학습 현황
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">
            선택 학습 도구 3개를 과목별로 어디까지 학습했는지 모아봤어요.
            진행률은 학습이 쌓이면 자동으로 채워져요.
          </p>
        </header>

        {/* 도구 3블록 */}
        <div className="mt-10 space-y-5">
          {TOOL_BLOCKS.map((tool) => (
            <ToolProgressBlock key={tool.key} tool={tool} />
          ))}
        </div>

        {/* CBT 안내 */}
        <section className="mt-12 rounded-3xl border border-dashed border-zinc-300 bg-white/70 p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <span
              aria-hidden
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-sky-500 text-2xl shadow-md"
            >
              📝
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold tracking-[0.22em] text-indigo-600">
                CBT IS SEPARATE
              </p>
              <p className="mt-1 text-base font-bold text-zinc-900">
                CBT 모의고사 학습 기록은 별도 페이지에서
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600 sm:text-sm">
                회차별 점수·오답노트·학습 곡선은 CBT 전용 페이지에 정리돼
                있어요.
              </p>
            </div>
            <Link
              href="/cbt"
              className="hidden shrink-0 items-center gap-1 rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg sm:inline-flex"
            >
              CBT 페이지로
              <span aria-hidden>→</span>
            </Link>
          </div>
          <Link
            href="/cbt"
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5 sm:hidden"
          >
            CBT 페이지로
            <span aria-hidden>→</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ─────────────── 도구별 진행 블록 ─────────────── */

function ToolProgressBlock({ tool }: { tool: ToolBlock }) {
  // 전체 합산
  const totals = ALL_SUBJECTS.map((s) => ({
    subject: s,
    total: tool.totalFor(s),
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
      <div className="p-6 sm:p-7">
        {/* 블록 헤더 */}
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-2xl shadow-md`}
          >
            {tool.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.16em] ring-1 ${tool.chip}`}
            >
              TOOL
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
                    href={tool.hrefFor(subject)}
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

        {/* 하단 CTA — 어디서부터 시작할지 */}
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
