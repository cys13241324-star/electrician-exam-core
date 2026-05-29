import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressTabs from "./ProgressTabs";

export const metadata: Metadata = {
  title: "학습 현황 — 독끝 전기기능사 필기 v4",
  description:
    "플립 암기카드·5분 핵심 오디오북·이론 시뮬레이터·CBT 모의고사. 도구별 탭으로 학습 현황을 확인합니다.",
};

export default function V4ProgressPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <ProgressTabs />
      <Footer />
    </div>
  );
}
