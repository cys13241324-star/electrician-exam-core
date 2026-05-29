import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlashcardApp from "@/components/flashcards/FlashcardApp";
import { presetCards } from "@/lib/flashcards/data";
import { ALL_SUBJECTS } from "@/lib/flashcards/chapters";
import type { Subject } from "@/lib/flashcards/types";

export async function generateStaticParams() {
  return ALL_SUBJECTS.map((subject) => ({ subject }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>;
}): Promise<Metadata> {
  const { subject } = await params;
  const decoded = decodeURIComponent(subject);
  if (!ALL_SUBJECTS.includes(decoded as Subject)) {
    return { title: "과목 없음" };
  }
  return {
    title: `${decoded} · 플립 암기카드`,
    description: `${decoded} 핵심 개념을 카드로 빠르게 회독합니다.`,
  };
}

export default async function v4SubjectCardsPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  const decoded = decodeURIComponent(subject);
  if (!ALL_SUBJECTS.includes(decoded as Subject)) notFound();
  const subj = decoded as Subject;
  const subjectCards = presetCards.filter((c) => c.subject === subj);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50">
      <Header />
      <FlashcardApp
        cards={subjectCards}
        mode="subjects"
        initialView="list"
        header={{
          eyebrow: `FLIP CARD · ${subj}`,
          title: `${subj} 카드 학습`,
          subtitle:
            "위쪽 챕터 칩으로 학습 범위를 좁히고, 카드를 눌러 학습을 시작하세요.",
        }}
        topSlot={
          <div className="mb-4 flex items-center gap-3 text-xs">
            <Link
              href={`/v4/${subj}`}
              className="font-semibold text-zinc-500 hover:text-zinc-900"
            >
              ← {subj} 허브
            </Link>
            <span className="text-zinc-300">·</span>
            <Link
              href="/v4"
              className="font-semibold text-zinc-500 hover:text-zinc-900"
            >
              학습 허브
            </Link>
          </div>
        }
      />
      <Footer />
    </div>
  );
}
