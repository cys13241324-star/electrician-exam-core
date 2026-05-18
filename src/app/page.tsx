import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전기기능사 핵심 학습 — CBT · 암기카드 · 시뮬레이터",
  description:
    "전기기능사 필기 합격에 꼭 필요한 핵심만. CBT 모의고사, 플립 암기카드, 인터랙티브 시뮬레이터.",
};

const cards = [
  {
    href: "/cbt",
    emoji: "📝",
    title: "CBT 모의고사",
    desc: "실전 CBT 방식 문제풀이 · 자동 채점 · 오답노트 · 취약영역 분석",
    cta: "응시하기",
    primary: true,
  },
  {
    href: "/flashcards",
    emoji: "🃏",
    title: "플립 암기카드",
    desc: "기출 핵심 개념을 카드로 빠르게 반복 암기 · 챕터별 학습",
    cta: "암기 시작",
  },
  {
    href: "/simulator",
    emoji: "⚡",
    title: "인터랙티브 시뮬레이터",
    desc: "옴의 법칙·회로종합·3상·변압기 등 핵심 개념을 직접 조작하며 이해",
    cta: "둘러보기",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
      <header className="text-center">
        <p className="text-sm font-semibold tracking-wide text-blue-600">
          전기기능사 필기
        </p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">
          합격에 꼭 필요한 핵심만
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600">
          군더더기 없이 세 가지. 문제로 실전, 카드로 암기, 시뮬로 이해.
        </p>
      </header>

      <section className="mt-12 grid gap-5 sm:grid-cols-3">
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
