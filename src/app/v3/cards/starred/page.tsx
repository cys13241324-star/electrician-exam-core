import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlashcardApp from "@/components/flashcards/FlashcardApp";
import { presetCards } from "@/lib/flashcards/data";

export const metadata: Metadata = {
  title: "즐겨찾기 별 카드 · 플립 암기카드",
  description: "전체·과목별 어디서든 별표한 카드를 한곳에 모아 빠르게 복습합니다.",
};

export default function V3CardsStarredPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-zinc-50">
      <Header />
      <FlashcardApp
        cards={presetCards}
        mode="all"
        initialStarredOnly
        initialView="list"
        simplified
        header={{
          eyebrow: "FLIP CARD · 즐겨찾기",
          title: "⭐ 별 카드 모아보기",
          subtitle:
            "별표한 카드만 모았어요. 별 카드 토글을 끄면 전체 카드로 돌아갑니다.",
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
              href="/v3/cards/all"
              className="font-semibold text-zinc-500 hover:text-zinc-900"
            >
              전체보기
            </Link>
          </div>
        }
      />
      <Footer />
    </div>
  );
}
