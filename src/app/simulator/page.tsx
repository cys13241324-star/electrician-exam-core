import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimulatorHub from "@/components/simulator/SimulatorHub";

export const metadata: Metadata = {
  title: "이론 시뮬레이터",
  description:
    "전기이론·전기기기·전기설비 인터랙티브 시뮬레이터를 한 곳에서 골라 학습합니다.",
};

export default function SimulatorIndexPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <SimulatorHub />
      <Footer />
    </div>
  );
}
