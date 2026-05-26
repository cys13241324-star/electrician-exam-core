import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomAudiobook from "@/components/audiobook/CustomAudiobook";

export const metadata: Metadata = {
  title: "골라 듣기 · 오디오북",
  description:
    "듣고 싶은 챕터만 골라 순서대로 연속 재생하는 나만의 오디오북 플레이리스트.",
};

export default function CustomAudiobookPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-teal-700">
              addto 온라인 · 전기기능사 · AUDIOBOOK
            </p>
            <h1 className="mt-1 text-xl font-bold text-zinc-900 sm:text-2xl">
              듣고 싶은 챕터만 골라보세요
            </h1>
            <p className="mt-1.5 text-[13px] leading-6 text-zinc-500">
              체크한 챕터들이 자동으로 큐에 담겨 순서대로 연속 재생됩니다. 선택은
              다음에 와도 그대로 유지돼요.
            </p>
          </div>
        </header>
        <CustomAudiobook />
      </main>
      <Footer />
    </div>
  );
}
