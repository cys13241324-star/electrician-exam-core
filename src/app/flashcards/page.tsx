import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlashcardApp from "@/components/flashcards/FlashcardApp";

export const metadata: Metadata = {
  title: "플립 암기카드",
  description: "전기기능사 핵심 개념을 플립 카드로 학습합니다.",
};

export default function FlashcardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50">
      <Header />
      <FlashcardApp />
      <Footer />
    </div>
  );
}
