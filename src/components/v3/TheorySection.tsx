"use client";

import Link from "next/link";
import { useState } from "react";
import { ALL_SUBJECTS } from "@/lib/flashcards/chapters";
import type { Subject } from "@/lib/flashcards/types";

type Tool = {
  emoji: string;
  name: string;
  desc: string;
  cta: string;
  gradient: string;
  hrefFor: (subject: Subject) => string;
};

const TOOLS: Tool[] = [
  {
    emoji: "🃏",
    name: "플립 암기카드",
    desc: "공식 한 줄·정의 한 문장. 핵심만 농축한 카드로 챕터를 회독해요.",
    cta: "카드 학습",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    hrefFor: (s) => `/v3/${encodeURIComponent(s)}/cards`,
  },
  {
    emoji: "🎧",
    name: "5분 핵심 오디오북",
    desc: "한 챕터 = 5분. 출퇴근·산책 중 흘려듣기만 해도 키워드가 남아요.",
    cta: "오디오 듣기",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    hrefFor: (s) => `/audiobook/summary/${encodeURIComponent(s)}`,
  },
  {
    emoji: "⚡",
    name: "이론 시뮬레이터",
    desc: "값을 움직여 그래프 변화를 손으로 체득. 외우지 않아도 이해돼요.",
    cta: "시뮬 열기",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
  hrefFor: (s) => `/simulator/by-subject/${encodeURIComponent(s)}`,
  },
];

export default function TheorySection() {
  const [active, setActive] = useState<Subject>(ALL_SUBJECTS[0]);

  return (
    <div className="space-y-4">
      {/* 과목 탭 */}
      <div
        role="tablist"
        aria-label="과목 선택"
        className="inline-flex rounded-full border border-zinc-200 bg-white p-1 shadow-sm"
      >
        {ALL_SUBJECTS.map((s) => {
          const isActive = active === s;
          return (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition sm:text-sm ${
                isActive
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* 도구 3개 — 컴팩트 가로형 카드 */}
      <div className="space-y-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.name}
            href={tool.hrefFor(active)}
            className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
          >
            <span
              aria-hidden
              className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${tool.gradient}`}
            />
            <span
              aria-hidden
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-2xl shadow-md`}
            >
              {tool.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-bold text-zinc-900 sm:text-base">
                  {tool.name}
                </h3>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {active}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                {tool.desc}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold transition group-hover:gap-1.5">
                <span
                  className={`bg-gradient-to-r ${tool.gradient} bg-clip-text text-transparent`}
                >
                  {tool.cta}
                </span>
                <span className="text-zinc-400 transition group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
