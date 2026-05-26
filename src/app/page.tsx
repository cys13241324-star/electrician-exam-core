import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전기기능사 핵심 학습 — 동영상강의 · CBT · 암기카드 · 오디오북 · 시뮬레이터",
  description:
    "전기기능사 필기 합격에 꼭 필요한 다섯 가지. 기출 동영상 강의, CBT 모의고사, 플립 암기카드, 오디오북, 인터랙티브 시뮬레이터.",
};

type Card = {
  href: string;
  emoji: string;
  title: string;
  desc: string;
  cta: string;
  primary?: boolean;
};

const cards: Card[] = [
  {
    href: "/lectures",
    emoji: "🎬",
    title: "동영상 강의",
    desc: "기출 전 문항 풀이 영상. 회차·과목·문항별로 골라보는 핵심 해설",
    cta: "시청하기",
    primary: true,
  },
  {
    href: "/cbt",
    emoji: "📝",
    title: "CBT 모의고사",
    desc: "실전 CBT 방식 문제풀이 · 자동 채점 · 오답노트 · 취약영역 분석",
    cta: "응시하기",
  },
  {
    href: "/flashcards",
    emoji: "🃏",
    title: "플립 암기카드",
    desc: "기출 핵심 개념을 카드로 빠르게 반복 암기 · 챕터별 학습",
    cta: "암기 시작",
  },
  {
    href: "/audiobook",
    emoji: "🎧",
    title: "오디오북",
    desc: "이론을 귀로 듣는다. 출퇴근·이동 중에도 학습이 누적되는 챕터 오디오",
    cta: "들어보기",
  },
  {
    href: "/simulator",
    emoji: "⚡",
    title: "이론 시뮬레이터",
    desc: "옴의 법칙·회로종합·3상·변압기 등 핵심 개념을 직접 조작하며 이해",
    cta: "둘러보기",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <header className="text-center">
        <p className="text-sm font-semibold tracking-wide text-blue-600">
          전기기능사 필기
        </p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">
          합격에 꼭 필요한 핵심만
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600">
          군더더기 없이 다섯 가지. 영상으로 이해하고, 문제로 실전, 카드와
          오디오로 암기, 시뮬로 체화.
        </p>
      </header>

      <section className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`group flex flex-col rounded-2xl border p-6 transition hover:-translate-y-0.5 hover:shadow-md ${
              c.primary
                ? "border-blue-200 bg-blue-50/60"
                : "border-zinc-200 bg-white"
            }`}
          >
            <span className="text-3xl">{c.emoji}</span>
            <h2 className="mt-4 text-lg font-bold text-zinc-900">{c.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
              {c.desc}
            </p>
            <span
              className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold ${
                c.primary ? "text-blue-700" : "text-zinc-800"
              }`}
            >
              {c.cta}
              <span className="transition group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
