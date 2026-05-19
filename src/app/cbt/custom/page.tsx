import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubTabs from "@/components/cbt/SubTabs";
import CustomExamBuilder from "@/components/cbt/CustomExamBuilder";

export const metadata: Metadata = {
  title: "나만의 시험",
  description:
    "과목·문항 수·제한 시간·난이도·빈출도를 직접 골라 맞춤 시험을 구성합니다.",
};

export default function CustomExamPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <SubTabs active="main" />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-wide text-violet-700">
            나만의 시험
          </p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
            원하는 조건으로 직접 시험을 만들어 보세요
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            과목·문항 수·제한 시간·난이도·빈출도를 골라 나에게 맞는 시험을
            구성합니다.
          </p>
        </div>

        <CustomExamBuilder />
      </main>
      <Footer />
    </div>
  );
}
