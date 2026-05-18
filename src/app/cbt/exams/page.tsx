import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "CBT 모의고사",
  description:
    "전기기능사 CBT 모의고사 5회차. 실제 시험 환경 그대로, 60문항 60분, 자동 채점과 과목별 분석.",
};

import Footer from "@/components/Footer";
import SubTabs from "@/components/cbt/SubTabs";
import TextbookFloatingPopup from "@/components/TextbookFloatingPopup";
import CbtGuide from "@/components/cbt/CbtGuide";
import {
  FocusGroupedGrid,
  type FocusGroup,
} from "@/components/cbt/FocusGrid";
import { mockExamSummaries } from "@/lib/cbt/mockData";
import type { ExamStatus, ExamSummary } from "@/lib/cbt/types";
import { TARGET_YEAR_RANGE } from "@/lib/cbt/curriculum";

const statusStyles: Record<ExamStatus, string> = {
  응시대기: "bg-zinc-100 text-zinc-700",
  응시중: "bg-amber-100 text-amber-800",
  완료: "bg-emerald-100 text-emerald-800",
};

export default function CbtExamsPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <SubTabs active="exams" />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-blue-600">CBT 응시</p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
            전기기능사 CBT 모의고사
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            대상 연도 <strong>{TARGET_YEAR_RANGE}</strong> · 실제 시험과 동일한
            환경으로 응시하고 자동 채점·과목별 분석을 받아보세요.
          </p>
        </div>

        {/* Spec strip */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "문항 수", value: "60문항" },
            { label: "제한 시간", value: "60분" },
            { label: "합격 기준", value: "36문항 이상" },
            { label: "과목 과락", value: "없음" },
          ].map((spec) => (
            <div
              key={spec.label}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3"
            >
              <p className="text-xs text-zinc-500">{spec.label}</p>
              <p className="mt-0.5 text-lg font-bold text-zinc-900">
                {spec.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <span className="text-base leading-none">⚠️</span>
          <p>
            <strong className="font-semibold">응시 안내</strong> · 시험 시작
            후에는 일시정지가 불가합니다. 제한 시간이 끝나면 작성된 답안이
            자동으로 제출됩니다.
          </p>
        </div>

        {/* 학습 가이드 — 무엇에 집중 / 왜 중요한가 */}
        <CbtGuide />

        {/* 집중 응시 — 빈출도·난이도별 골라 풀기 (소분류 그룹핑) */}
        <section className="mb-12">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">
                🎯 집중 응시
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                <strong className="text-zinc-800">이럴 때</strong> — 시간이
                부족하거나 특정 약점만 빠르게 다지고 싶을 때. 빈출도·난이도별로
                골라 짧게 집중 연습할 수 있어요.
              </p>
            </div>
          </div>
          <FocusGroupedGrid groups={FOCUS_GROUPS} />
        </section>

        <div className="mb-5">
          <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">
            📝 회차별 모의고사
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            <strong className="text-zinc-800">이럴 때</strong> — 실전 감각과
            시간 배분을 점검하고 싶을 때. 시험과 같은 60문항·60분 구성으로
            끝까지 풀어 합격 가능성을 가늠해 보세요.
          </p>
        </div>

        <div className="space-y-8">
          {groupExamsByRound(mockExamSummaries).map((group) => (
            <section key={group.title}>
              <div className="mb-3 flex items-baseline gap-2 border-b border-zinc-200 pb-2">
                <h3 className="text-sm font-bold text-zinc-800">
                  {group.title}
                </h3>
                <p className="text-xs text-zinc-500">
                  {group.exams.length}개 회차
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.exams.map((exam) => {
                  const isStarted = exam.status !== "응시대기";
                  const buttonLabel =
                    exam.status === "완료"
                      ? "결과 보기"
                      : exam.status === "응시중"
                        ? "이어서 응시"
                        : "응시하기";
                  const href =
                    exam.status === "완료"
                      ? `/cbt/${exam.id}/result`
                      : `/cbt/${exam.id}/take`;

                  return (
                    <div
                      key={exam.id}
                      className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <span className="text-[10px] font-medium leading-none">
                              회차
                            </span>
                            <span className="text-lg font-bold leading-tight">
                              {exam.round}
                            </span>
                          </span>
                          <div>
                            <p className="text-xs font-medium text-zinc-500">
                              전기기능사
                            </p>
                            <h3 className="mt-0.5 text-lg font-semibold text-zinc-900">
                              CBT 모의고사 {exam.round}회
                            </h3>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[exam.status]}`}
                        >
                          {exam.status}
                        </span>
                      </div>

                      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg bg-zinc-50 px-3 py-2.5">
                          <dt className="text-xs text-zinc-500">문항 수</dt>
                          <dd className="mt-0.5 font-semibold text-zinc-900">
                            {exam.totalQuestions}문항
                          </dd>
                        </div>
                        <div className="rounded-lg bg-zinc-50 px-3 py-2.5">
                          <dt className="text-xs text-zinc-500">제한 시간</dt>
                          <dd className="mt-0.5 font-semibold text-zinc-900">
                            {exam.durationMinutes}분
                          </dd>
                        </div>
                      </dl>

                      <Link
                        href={href}
                        className={`mt-6 flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition ${
                          isStarted
                            ? "bg-zinc-900 text-white hover:bg-zinc-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {buttonLabel}
                        <span className="transition group-hover:translate-x-0.5">
                          →
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
      <TextbookFloatingPopup />
    </div>
  );
}

/**
 * 집중 응시 프리셋 — 빈출 / 난이도 / 복합 소분류로 묶어 가독성↑.
 * 항목이 늘어도 한 줄 평면 나열이 되지 않게 헤더로 구분한다.
 */
const FOCUS_GROUPS: FocusGroup[] = [
  {
    title: "빈출도별",
    desc: "출제 빈도 기준으로 골라 풀기",
    cards: [
      {
        filter: { frequency: "high" },
        label: "빈출 문제만",
        desc: "시험에서 자주 출제되는 핵심 문항만 모아 빠르게 점검합니다.",
        emoji: "🔥",
        tone: "rose",
      },
      {
        filter: { frequency: "medium" },
        label: "보통 빈출 문제",
        desc: "출제 빈도가 보통인 문항으로 폭을 넓혀 학습합니다.",
        emoji: "📘",
        tone: "blue",
      },
    ],
  },
  {
    title: "난이도별",
    desc: "체감 난이도 기준으로 골라 풀기",
    cards: [
      {
        filter: { difficulty: "easy" },
        label: "쉬운 문제만",
        desc: "기본 개념·정의 위주의 문항으로 감을 잡습니다.",
        emoji: "🌱",
        tone: "emerald",
      },
      {
        filter: { difficulty: "medium" },
        label: "보통 난이도",
        desc: "실전 평균 수준의 문항으로 균형 있게 연습합니다.",
        emoji: "⚖️",
        tone: "indigo",
      },
      {
        filter: { difficulty: "hard" },
        label: "어려운 문제만",
        desc: "계산·고난도 문항으로 약점을 집중 공략합니다.",
        emoji: "🎯",
        tone: "violet",
      },
    ],
  },
  {
    title: "복합",
    desc: "빈출 × 난이도를 함께 거른 정예 세트",
    cards: [
      {
        filter: { frequency: "high", difficulty: "hard" },
        label: "빈출 × 어려운 문제",
        desc: "꼭 맞혀야 하는 빈출 고난도 문항만 추려서.",
        emoji: "💎",
        tone: "amber",
      },
    ],
  },
];

/**
 * 회차별 모의고사 그룹핑. mockData 에 연도 필드가 없어 회차 구간(5회 단위)으로
 * 묶는다. 최신(높은) 회차가 먼저 오도록 정렬한다. 연도 필드가 추가되면
 * 이 함수만 연도 기준으로 교체하면 된다.
 */
function groupExamsByRound(
  exams: ExamSummary[],
): { title: string; exams: ExamSummary[] }[] {
  const BUCKET = 5;
  const sorted = [...exams].sort((a, b) => b.round - a.round);
  const buckets = new Map<number, ExamSummary[]>();
  for (const exam of sorted) {
    const start = Math.floor((exam.round - 1) / BUCKET) * BUCKET + 1;
    if (!buckets.has(start)) buckets.set(start, []);
    buckets.get(start)!.push(exam);
  }
  return Array.from(buckets.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([start, list]) => ({
      title: `${start}~${start + BUCKET - 1}회`,
      exams: list,
    }));
}
