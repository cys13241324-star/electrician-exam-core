import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlashcardApp from "@/components/flashcards/FlashcardApp";

export const metadata: Metadata = {
  title: "모든 카드 보기 · 플립 암기카드",
  description:
    "전기기능사 전 과목 플립카드를 한 덱으로 모아 처음부터 끝까지 회독합니다.",
};

export default function FlashcardsAllPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50">
      <Header />
      <FlashcardApp
        mode="all"
        header={{
          eyebrow: "FLIP CARD · 모든 카드",
          title: "모든 카드 보기",
          subtitle: "전 과목 핵심 개념을 한 덱으로 처음부터 끝까지 회독하세요.",
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
