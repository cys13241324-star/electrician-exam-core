import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimulatorList from "@/components/SimulatorList";
import { simulators } from "@/lib/simulators";

export const metadata: Metadata = {
  title: "전체 시뮬레이터 · 이론 시뮬레이터",
  description:
    "전기이론·전기기기·전기설비의 모든 인터랙티브 시뮬레이터를 한 페이지에서 검색·필터링합니다.",
};

export default function SimulatorAllPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-6 sm:py-10">
        <div className="mb-4">
          <Link
            href="/simulator"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
          >
            ← 시뮬레이터 허브
          </Link>
        </div>
        <SimulatorList simulators={simulators} />
      </main>
      <Footer />
    </div>
  );
}
