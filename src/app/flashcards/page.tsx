import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlashcardHub from "@/components/flashcards/FlashcardHub";

export const metadata: Metadata = {
  title: "플립 암기카드",
  description:
    "전기기능사 핵심 개념을 모든 카드·과목별·복습·나만의 카드 4가지 방식으로 학습합니다.",
};

export default function FlashcardsPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <FlashcardHub />
      <Footer />
    </div>
  );
}
