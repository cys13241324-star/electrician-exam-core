import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "전기기능사 학습 대시보드",
  description:
    "전기기능사 필기 학습 진행 현황, 취약점 진단, 최근 응시 기록을 한 곳에서 확인합니다.",
};

import Footer from "@/components/Footer";
import CbtHub from "@/components/cbt/CbtHub";
import SubTabs from "@/components/cbt/SubTabs";
import TextbookFloatingPopup from "@/components/TextbookFloatingPopup";

export default function CbtPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <SubTabs active="main" />
      <CbtHub />
      <Footer />
      <TextbookFloatingPopup />
    </div>
  );
}
