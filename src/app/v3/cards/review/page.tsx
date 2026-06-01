import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlashcardApp from "@/components/flashcards/FlashcardApp";
import { presetCards } from "@/lib/flashcards/data";

export const metadata: Metadata = {
  title: "다시 보는 카드 · 플립 암기카드",
  description: "‘모르겠음’ 표시했거나 24시간 이상 지난 카드만 모아 다시 봅니다.",
};

export default function V3CardsReviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-zinc-50">
      <Header />
      <FlashcardApp
        cards={presetCards}
        mode="review"
        initialDueOnly
        initialView="list"
        simplified
        header={{
          eyebrow: "FLIP CARD · 다시 보기",
          title: "🔁 다시 보는 카드",
          subtitle:
            "다시 볼 때가 된 카드만 모았어요. 비어 있다면 그만큼 잘 외우고 있다는 뜻이에요.",
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
