import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlashcardApp from "@/components/flashcards/FlashcardApp";

export const metadata: Metadata = {
  title: "복습 카드 보기 · 플립 암기카드",
  description:
    "‘모르겠음’으로 표시했거나 시간이 지나 다시 볼 플립카드만 모아 봅니다.",
};

export default function FlashcardsReviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50">
      <Header />
      <FlashcardApp
        mode="review"
        initialDueOnly
        header={{
          eyebrow: "FLIP CARD · 복습",
          title: "복습 카드 보기",
          subtitle:
            "‘모르겠음’으로 표시했거나 하루 이상 지난 카드만 모아 빠르게 회독합니다.",
        }}
        topSlot={
          <div className="mb-4">
            <Link
              href="/flashcards"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
            >
              ← 플립카드 허브
            </Link>
          </div>
        }
      />
      <Footer />
    </div>
  );
}
