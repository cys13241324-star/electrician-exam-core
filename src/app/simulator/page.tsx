import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimulatorList from "@/components/SimulatorList";
import { simulators } from "@/lib/simulators";

export const metadata: Metadata = {
  title: "이론 시뮬레이터",
  description:
    "전기력선·자기력·RLC 공진·회전 자계까지 — 인터랙티브 시뮬레이터.",
};

export default function SimulatorIndexPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-6 sm:py-10">
        <SimulatorList simulators={simulators} />
      </main>
      <Footer />
    </div>
  );
}
