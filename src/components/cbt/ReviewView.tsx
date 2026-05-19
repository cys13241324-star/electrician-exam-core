"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import LecturePiP from "@/components/cbt/LecturePiP";
import type { Attempt, Choice, Exam } from "@/lib/cbt/types";

type FilterMode = "all" | "correct" | "wrong" | "checked";

export default function ReviewView({ exam }: { exam: Exam }) {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const questionRefs = useRef<Record<number, HTMLElement | null>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`cbt-attempt-${exam.id}`);
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage 응시 결과 하이드레이션 (해설 보기 화면)
        setAttempt(JSON.parse(saved));
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [exam.id]);

  const visibleIndices = useMemo(() => {
    if (!attempt) return exam.questions.map((_, i) => i);
    return exam.questions
      .map((q, i) => i)
      .filter((i) => {
        const correct = attempt.answers[i] === exam.questions[i].answer;
        if (filterMode === "correct") return correct;
        if (filterMode === "wrong") return !correct;
        if (filterMode === "checked") return attempt.checked[i];
        return true;
      });
  }, [attempt, exam.questions, filterMode]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        해설을 불러오는 중입니다...
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="text-xl font-bold text-zinc-900">응시 기록이 없습니다</h1>
        <p className="mt-3 text-sm text-zinc-600">
          응시 후에 해설을 볼 수 있습니다.
        </p>
        <Link
          href="/cbt"
          className="mt-6 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          모의고사 목록으로
        </Link>
      </div>
    );
  }

  const correctCount = exam.questions.filter(
    (q, i) => attempt.answers[i] === q.answer,
  ).length;
  const wrongCount = exam.totalQuestions - correctCount;
  const checkedCount = attempt.checked.filter(Boolean).length;

  function jumpToQuestion(qIdx: number) {
    // 현재 필터에 안 잡히는 문항이면 전체로 풀고 스크롤. 페이지 개념 없음.
    if (visibleIndices.indexOf(qIdx) < 0) {
      setFilterMode("all");
    }
    setTimeout(() => {
      questionRefs.current[qIdx]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">해설</p>
            <h1 className="mt-1 text-2xl font-bold text-zinc-900">
              {exam.title}
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/cbt/${exam.id}/result`}
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              결과로 돌아가기
            </Link>
          </div>
        </div>

        {/* Summary banner */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-emerald-700">
              {correctCount}
            </p>
            <p className="text-xs font-medium text-emerald-700">맞힌 문항</p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-rose-700">{wrongCount}</p>
            <p className="text-xs font-medium text-rose-700">틀린 문항</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center">
            <p className="text-2xl font-bold text-zinc-900">
              {Math.round((correctCount / exam.totalQuestions) * 100)}%
            </p>
            <p className="text-xs font-medium text-zinc-500">정답률</p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="sticky top-0 z-20 -mx-6 mb-6 flex flex-wrap gap-2 border-b border-zinc-200 bg-zinc-50/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-zinc-50/80">
          <FilterChip
            active={filterMode === "all"}
            onClick={() => setFilterMode("all")}
          >
            전체 ({exam.totalQuestions})
          </FilterChip>
          <FilterChip
            active={filterMode === "correct"}
            color="emerald"
            onClick={() => setFilterMode("correct")}
          >
            맞힌 문항 ({correctCount})
          </FilterChip>
          <FilterChip
            active={filterMode === "wrong"}
            color="rose"
            onClick={() => setFilterMode("wrong")}
          >
            틀린 문항 ({wrongCount})
          </FilterChip>
          <FilterChip
            active={filterMode === "checked"}
            color="amber"
            onClick={() => setFilterMode("checked")}
          >
            체크 문항 ({checkedCount})
          </FilterChip>
        </div>

        {/* Question map */}
        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-4">
          <p className="mb-3 text-xs text-zinc-500">
            번호를 클릭하면 해당 해설로 이동합니다.
          </p>
          <div className="grid grid-cols-10 gap-1.5">
            {exam.questions.map((_, i) => {
              const correct = attempt.answers[i] === exam.questions[i].answer;
              const isChecked = attempt.checked[i];
              const baseColor = correct
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-rose-50 border-rose-200 text-rose-700";
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => jumpToQuestion(i)}
                  className={`relative rounded border py-2 text-xs font-semibold transition hover:opacity-80 ${baseColor}`}
                >
                  {String(i + 1).padStart(2, "0")}
                  {isChecked && (
                    <span className="absolute right-0.5 top-0 text-[10px] text-amber-500">
                      ★
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-600">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-sm border border-emerald-200 bg-emerald-50" />
              맞힘
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-sm border border-rose-200 bg-rose-50" />
              틀림
            </span>
            <span className="flex items-center gap-1">
              <span className="text-amber-500">★</span>
              체크
            </span>
          </div>
        </div>

        {/* Count heading */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-zinc-600">
            {filterMode === "all"
              ? "전체"
              : filterMode === "correct"
                ? "맞힌 문항"
                : filterMode === "wrong"
                  ? "틀린 문항"
                  : "체크 문항"}{" "}
            <strong className="font-semibold text-zinc-900">
              {visibleIndices.length}개
            </strong>{" "}
            표시 중
          </p>
        </div>

        {/* Question explanations */}
        {visibleIndices.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white py-12 text-center text-sm text-zinc-500">
            해당 항목이 없습니다.
          </div>
        ) : (
          <div className="space-y-5">
            {visibleIndices.map((qIdx) => {
              const q = exam.questions[qIdx];
              const userAnswer = attempt.answers[qIdx];
              const isCorrect = userAnswer === q.answer;
              const isChecked = attempt.checked[qIdx];

              return (
                <article
                  key={qIdx}
                  ref={(el) => {
                    questionRefs.current[qIdx] = el;
                  }}
                  className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <header className="mb-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-zinc-900">
                        {String(q.number).padStart(2, "0")}
                      </span>
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                        [{q.subject}] {q.topic}
                      </span>
                      {q.frequency === "high" && (
                        <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
                          🔥 빈출
                        </span>
                      )}
                      {q.difficulty === "hard" && (
                        <span className="rounded-md bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700">
                          어려움
                        </span>
                      )}
                      {q.difficulty === "easy" && (
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          쉬움
                        </span>
                      )}
                      {isChecked && (
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          ★ 체크 문항
                        </span>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {isCorrect ? "정답" : "오답"}
                    </span>
                  </header>

                  <p className="text-base leading-7 text-zinc-900">
                    {q.questionText}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {q.choices.map((choice, i) => {
                      const value = (i + 1) as Choice;
                      const isAnswer = q.answer === value;
                      const isUserPick = userAnswer === value;
                      const wrongPick = isUserPick && !isAnswer;
                      return (
                        <li
                          key={i}
                          className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${
                            isAnswer
                              ? "border-emerald-300 bg-emerald-50"
                              : wrongPick
                                ? "border-rose-300 bg-rose-50"
                                : "border-zinc-200 bg-white"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                              isAnswer
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : wrongPick
                                  ? "border-rose-500 bg-rose-500 text-white"
                                  : "border-zinc-400 text-zinc-600"
                            }`}
                          >
                            {value}
                          </span>
                          <span className="flex-1 text-zinc-800">{choice}</span>
                          {isAnswer && (
                            <span className="text-xs font-semibold text-emerald-700">
                              정답
                            </span>
                          )}
                          {wrongPick && (
                            <span className="text-xs font-semibold text-rose-600">
                              내 선택
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white">
                        해설
                      </span>
                      <span className="text-xs font-semibold text-zinc-500">
                        정답 {q.answer}번
                      </span>
                      {userAnswer !== null && userAnswer !== q.answer && (
                        <span className="text-xs font-semibold text-rose-600">
                          · 내 선택 {userAnswer}번
                        </span>
                      )}
                      {userAnswer === null && (
                        <span className="text-xs font-semibold text-zinc-400">
                          · 미응답
                        </span>
                      )}
                    </div>
                    <p className="whitespace-pre-line text-sm leading-7 text-zinc-700">
                      {q.explanation}
                    </p>
                  </div>

                  <div className="mt-4">
                    <LecturePiP
                      title={`${q.subject} · ${q.topic} 강의`}
                      query={`전기기능사 ${q.subject} ${q.topic} 강의`}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function FilterChip({
  active,
  color = "blue",
  onClick,
  children,
}: {
  active: boolean;
  color?: "blue" | "emerald" | "rose" | "amber";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const activeMap = {
    blue: "border-blue-600 bg-blue-50 text-blue-700",
    emerald: "border-emerald-500 bg-emerald-50 text-emerald-700",
    rose: "border-rose-500 bg-rose-50 text-rose-700",
    amber: "border-amber-500 bg-amber-50 text-amber-700",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
        active
          ? activeMap[color]
          : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}
