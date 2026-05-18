import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubTabs from "@/components/cbt/SubTabs";
import TextbookFloatingPopup from "@/components/TextbookFloatingPopup";
import { FocusGroupedGrid, type FocusGroup } from "@/components/cbt/FocusGrid";
import { TARGET_YEAR_RANGE } from "@/lib/cbt/curriculum";

export const metadata: Metadata = {
  title: "N회빈출 — 여러 회차 반복 출제 핵심 문항",
  description:
    "여러 회차에 반복 출제된 빈출 문항만 모아 풀어보는 집중 학습. 빈도 높은 핵심 문제부터 효율적으로 정리하세요.",
};

const FREQUENT_GROUPS: FocusGroup[] = [
  {
    title: "빈출도별",
    desc: "출제 빈도 기준으로 골라 풀기",
    cards: [
      {
        filter: { frequency: "high" },
        label: "최다 빈출 문제",
        desc: "여러 회차에 반복 출제된 핵심 문항만 모아 빠르게 점검합니다.",
        emoji: "🔥",
        tone: "rose",
      },
      {
        filter: { frequency: "medium" },
        label: "보통 빈출 문제",
        desc: "출제 빈도가 보통인 문항으로 학습 폭을 넓힙니다.",
        emoji: "📘",
        tone: "blue",
      },
    ],
  },
  {
    title: "빈출 × 난이도",
    desc: "빈출 문항을 난이도로 한 번 더 거른 정예 세트",
    cards: [
      {
        filter: { frequency: "high", difficulty: "easy" },
        label: "빈출 · 쉬운 문제",
        desc: "꼭 맞혀야 하는 빈출 기본 문항. 득점 안정화에 좋습니다.",
        emoji: "🌱",
        tone: "emerald",
      },
      {
        filter: { frequency: "high", difficulty: "medium" },
        label: "빈출 · 보통 문제",
        desc: "실전 평균 수준의 빈출 문항으로 균형 있게 연습합니다.",
        emoji: "⚖️",
        tone: "indigo",
      },
      {
        filter: { frequency: "high", difficulty: "hard" },
        label: "빈출 · 어려운 문제",
        desc: "자주 나오면서도 까다로운 함정 문항을 집중 공략합니다.",
        emoji: "💎",
        tone: "amber",
      },
    ],
  },
];

export default function CbtFrequentPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <SubTabs active="frequent" />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            N회빈출
          </p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
            여러 회차에 반복 출제된 빈출 문항
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            대상 연도 <strong>{TARGET_YEAR_RANGE}</strong> · 출제 빈도가 높은
            문제부터 우선순위로 정리했어요.{" "}
            <strong className="text-zinc-800">시험이 임박했거나 시간이 부족할
            때</strong>, 자주 나오는 문항부터 챙기면 같은 시간으로 더 많은
            점수를 확보할 수 있습니다.
          </p>
        </div>

        <FocusGroupedGrid groups={FREQUENT_GROUPS} />
      </main>

      <Footer />
      <TextbookFloatingPopup />
    </div>
  );
}
