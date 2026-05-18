import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubTabs from "@/components/cbt/SubTabs";
import TextbookFloatingPopup from "@/components/TextbookFloatingPopup";
import { FocusGroupedGrid, type FocusGroup } from "@/components/cbt/FocusGrid";
import { TARGET_YEAR_RANGE } from "@/lib/cbt/curriculum";

export const metadata: Metadata = {
  title: "고난도모음 — 계산·함정 문항 집중 공략",
  description:
    "체감 난이도가 높은 계산·함정 문항만 모아 풀어보는 집중 학습. 약점을 정조준해 변별 문항을 잡으세요.",
};

const HARD_GROUPS: FocusGroup[] = [
  {
    title: "난이도별",
    desc: "체감 난이도가 높은 문항 위주",
    cards: [
      {
        filter: { difficulty: "hard" },
        label: "고난도 문제 전체",
        desc: "계산·해석이 까다로운 고난도 문항을 한 번에 모아 풉니다.",
        emoji: "🎯",
        tone: "violet",
      },
      {
        filter: { difficulty: "medium" },
        label: "보통 난이도 점검",
        desc: "고난도 진입 전 실전 평균 수준 문항으로 감을 잡습니다.",
        emoji: "⚖️",
        tone: "indigo",
      },
    ],
  },
  {
    title: "난이도 × 빈출",
    desc: "고난도 문항을 빈출 여부로 한 번 더 거른 정예 세트",
    cards: [
      {
        filter: { difficulty: "hard", frequency: "high" },
        label: "고난도 · 빈출 문제",
        desc: "어렵지만 자주 나오는, 합격을 가르는 변별 문항입니다.",
        emoji: "💎",
        tone: "amber",
      },
      {
        filter: { difficulty: "hard", frequency: "medium" },
        label: "고난도 · 보통 빈출",
        desc: "출제 빈도는 보통이지만 풀이가 까다로운 문항을 다집니다.",
        emoji: "🧩",
        tone: "rose",
      },
    ],
  },
];

export default function CbtHardPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <SubTabs active="hard" />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            고난도모음
          </p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
            계산·함정 문항 집중 공략
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            대상 연도 <strong>{TARGET_YEAR_RANGE}</strong> · 체감 난이도가 높은
            문항만 골랐어요.{" "}
            <strong className="text-zinc-800">기본기는 잡혔는데 점수가 한
            단계 안 오를 때</strong>, 합격을 가르는 계산·함정 문항을 집중
            공략해 약점을 정조준하세요.
          </p>
        </div>

        <FocusGroupedGrid groups={HARD_GROUPS} />
      </main>

      <Footer />
      <TextbookFloatingPopup />
    </div>
  );
}
