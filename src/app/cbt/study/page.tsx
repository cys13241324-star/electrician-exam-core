import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "과목별 학습 — 전기이론·전기기기·전기설비",
  description:
    "원하는 범위만 골라 연습. 전기이론·전기기기·전기설비 3과목 × 28개 하위 토픽으로 세분화된 맞춤 학습.",
};

import Footer from "@/components/Footer";
import SubTabs from "@/components/cbt/SubTabs";
import StudyBrowser from "@/components/cbt/StudyBrowser";
import TextbookFloatingPopup from "@/components/TextbookFloatingPopup";
import { TARGET_YEAR_RANGE, curriculum } from "@/lib/cbt/curriculum";
import { countQuestionsBy } from "@/lib/cbt/mockData";

export default function StudyPage() {
  // Pre-compute question counts at each level so it stays a server component
  const tree = curriculum.map((subject) => ({
    id: subject.id,
    subject: subject.subject,
    questionCount: countQuestionsBy({ subjectId: subject.id }),
    topics: subject.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      questionCount: countQuestionsBy({
        subjectId: subject.id,
        topicId: topic.id,
      }),
      subtopics: topic.subtopics.map((sub) => ({
        id: sub.id,
        name: sub.name,
        questionCount: countQuestionsBy({
          subjectId: subject.id,
          topicId: topic.id,
          subtopicId: sub.id,
        }),
      })),
    })),
  }));

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <SubTabs active="study" />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            과목별 학습
          </p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
            원하는 범위만 골라 연습하기
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            대상 연도 <strong>{TARGET_YEAR_RANGE}</strong> · 과목 전체부터
            세부 항목까지, 학습하고 싶은 범위만 선택해 바로 풀 수 있습니다.
          </p>
        </div>

        <StudyBrowser tree={tree} />
      </main>
      <TextbookFloatingPopup />

      <Footer />
    </div>
  );
}
