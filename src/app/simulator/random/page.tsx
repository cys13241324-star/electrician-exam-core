import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RandomSimulatorLauncher from "@/components/simulator/RandomSimulatorLauncher";
import { simulators } from "@/lib/simulators";

export const metadata: Metadata = {
  title: "랜덤 시뮬레이터 · 이론 시뮬레이터",
  description:
    "사용 가능한 인터랙티브 시뮬레이터 중 무작위로 한 개를 골라 바로 실행합니다.",
};

export default function SimulatorRandomPage() {
  const availableIds = simulators
    .filter((s) => s.status === "available")
    .map((s) => s.id);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-6 sm:py-16">
        <RandomSimulatorLauncher availableIds={availableIds} />
      </main>
      <Footer />
    </div>
  );
}
