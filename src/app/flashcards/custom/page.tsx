import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomFlashcards from "@/components/flashcards/CustomFlashcards";

export const metadata: Metadata = {
  title: "나만의 카드 · 플립 암기카드",
  description: "직접 만든 암기카드를 추가·편집하고 같은 방식으로 학습합니다.",
};

export default function FlashcardsCustomPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50">
      <Header />
      <CustomFlashcards />
      <Footer />
    </div>
  );
}
