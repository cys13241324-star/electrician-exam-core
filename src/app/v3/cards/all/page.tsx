import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlashcardApp from "@/components/flashcards/FlashcardApp";
import { presetCards } from "@/lib/flashcards/data";

export const metadata: Metadata = {
  title: "전체보기 · 플립 암기카드",
  description: "전체 핵심 카드를 한 번에 회독합니다. 과목 칩으로 범위를 좁히고, 별 카드·다시 보기로 약점을 다집니다.",
};

export default function V3CardsAllPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50">
      <Header />
      <FlashcardApp
        cards={presetCards}
        mode="all"
        initialView="study"
        simplified
        header={{
          eyebrow: "FLIP CARD · 전체보기",
          title: "전체 카드 회독",
          subtitle: `전체 ${presetCards.length}장을 바로 넘기며 회독해요. 별 카드(즐겨찾기)·다시보기만 켜면 됩니다.`,
        }}
        topSlot={
          <div className="mb-4 flex items-center gap-3 text-xs">
            <Link
              href="/v3/cards"
              className="font-semibold text-zinc-500 hover:text-zinc-900"
            >
              ← 카드 허브
            </Link>
            <span className="text-zinc-300">·</span>
            <Link
              href="/v3"
              className="font-semibold text-zinc-500 hover:text-zinc-900"
            >
              독끝 필기
            </Link>
          </div>
        }
      />
      <Footer />
    </div>
  );
}
