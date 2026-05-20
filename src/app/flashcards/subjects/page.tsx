import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlashcardApp from "@/components/flashcards/FlashcardApp";

export const metadata: Metadata = {
  title: "과목별 카드 보기 · 플립 암기카드",
  description:
    "전기이론·전기기기·전기설비를 과목·챕터 단위로 골라 회독합니다.",
};

export default function FlashcardsSubjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50">
      <Header />
      <FlashcardApp
        mode="subjects"
        initialView="list"
        header={{
          eyebrow: "FLIP CARD · 과목별",
          title: "과목별 카드 보기",
          subtitle:
            "위의 과목 칩을 눌러 챕터를 펼친 뒤, 챕터 칩으로 학습 범위를 좁혀 보세요.",
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
