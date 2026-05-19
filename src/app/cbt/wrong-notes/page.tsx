import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubTabs from "@/components/cbt/SubTabs";
import WrongNotes from "@/components/cbt/WrongNotes";

export const metadata: Metadata = {
  title: "오답 노트",
  description: "지금까지 응시한 모의고사에서 틀린 문제만 모아 다시 풀어봅니다.",
};

export default function WrongNotesPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <SubTabs active="wrong-notes" />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-wide text-rose-700">
            오답 노트
          </p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
            틀린 문제만 다시
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            응시 기록에서 자동 추출된 오답을 한 곳에서 다시 확인하고,
            왜 틀렸는지 짚어보세요.
          </p>
        </div>

        <WrongNotes />
      </main>
      <Footer />
    </div>
  );
}
