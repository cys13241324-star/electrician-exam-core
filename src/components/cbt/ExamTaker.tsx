"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Attempt,
  Choice,
  Exam,
  FontScale,
  LayoutMode,
} from "@/lib/cbt/types";
import CalculatorDialog from "./CalculatorDialog";
import QuestionMapDialog from "./QuestionMapDialog";
import PageGuide from "@/components/PageGuide";

type FilterMode = "all" | "remaining" | "checked";

const FONT_SCALES: FontScale[] = [100, 130, 150];
const LAYOUT_MODES: { value: LayoutMode; label: string }[] = [
  { value: "single", label: "1단" },
  { value: "double", label: "2단" },
  { value: "one", label: "1문제" },
];

export default function ExamTaker({ exam }: { exam: Exam }) {
  const router = useRouter();
  const storageKey = `cbt-attempt-${exam.id}`;
  const examineeName = "홍길동";

  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<(Choice | null)[]>(() =>
    Array(exam.totalQuestions).fill(null),
  );
  const [checked, setChecked] = useState<boolean[]>(() =>
    Array(exam.totalQuestions).fill(false),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startedAt] = useState<number>(() => Date.now());
  const [endsAt, setEndsAt] = useState<number>(
    () => Date.now() + exam.durationMinutes * 60 * 1000,
  );
  const [now, setNow] = useState<number>(() => Date.now());

  const [fontScale, setFontScale] = useState<FontScale>(100);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("single");
  const [showCalculator, setShowCalculator] = useState(false);
  const [showQuestionMap, setShowQuestionMap] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const [confirmStage, setConfirmStage] = useState<
    "none" | "warn-unanswered" | "final"
  >("none");
  const [showMobileSheet, setShowMobileSheet] = useState(false);

  const submittingRef = useRef(false);

  // Hydrate from localStorage once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data: Attempt = JSON.parse(saved);
        if (data.submittedAt) {
          router.replace(`/cbt/${exam.id}/result`);
          return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage에서 미제출 응시 진행 상태 하이드레이션
        setAnswers(data.answers);
        setChecked(data.checked);
        setEndsAt(data.endsAt);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [storageKey, exam.id, router]);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    const attempt: Attempt = {
      examId: exam.id,
      examineeName,
      startedAt,
      endsAt,
      answers,
      checked,
      submittedAt: null,
    };
    localStorage.setItem(storageKey, JSON.stringify(attempt));
  }, [
    hydrated,
    exam.id,
    examineeName,
    startedAt,
    endsAt,
    answers,
    checked,
    storageKey,
  ]);

  // Tick clock
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Scroll question area to top when navigating
  useEffect(() => {
    if (!hydrated) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex, hydrated]);

  const remainingMs = Math.max(0, endsAt - now);
  const remainingMinutes = Math.floor(remainingMs / 60000);
  const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
  const remainingDisplay = `${String(remainingMinutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

  const submitNow = useCallback(() => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    const attempt: Attempt = {
      examId: exam.id,
      examineeName,
      startedAt,
      endsAt,
      answers,
      checked,
      submittedAt: Date.now(),
    };
    localStorage.setItem(storageKey, JSON.stringify(attempt));
    router.push(`/cbt/${exam.id}/result`);
  }, [
    exam.id,
    examineeName,
    startedAt,
    endsAt,
    answers,
    checked,
    storageKey,
    router,
  ]);

  // Auto-submit on timer end
  useEffect(() => {
    if (hydrated && remainingMs === 0 && !submittingRef.current) {
      submitNow();
    }
  }, [hydrated, remainingMs, submitNow]);

  const answeredCount = answers.filter((a) => a !== null).length;
  const remainingCount = exam.totalQuestions - answeredCount;
  const checkedCount = checked.filter(Boolean).length;

  const visibleIndices = useMemo(() => {
    if (filterMode === "remaining")
      return answers.map((a, i) => (a === null ? i : -1)).filter((i) => i >= 0);
    if (filterMode === "checked")
      return checked.map((c, i) => (c ? i : -1)).filter((i) => i >= 0);
    return answers.map((_, i) => i);
  }, [filterMode, answers, checked]);

  function selectAnswer(qIdx: number, choice: Choice) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = next[qIdx] === choice ? null : choice;
      return next;
    });
  }

  function toggleCheck(qIdx: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[qIdx] = !next[qIdx];
      return next;
    });
  }

  function goTo(idx: number) {
    setCurrentIndex(Math.max(0, Math.min(exam.totalQuestions - 1, idx)));
  }

  function goPrev() {
    const step = layoutMode === "double" ? 2 : 1;
    goTo(currentIndex - step);
  }

  function goNext() {
    const step = layoutMode === "double" ? 2 : 1;
    goTo(currentIndex + step);
  }

  const goToNextUnanswered = useCallback(() => {
    const order: number[] = [];
    for (let i = 1; i <= exam.totalQuestions; i++) {
      order.push((currentIndex + i) % exam.totalQuestions);
    }
    const target = order.find((i) => answers[i] === null);
    if (target !== undefined) {
      setCurrentIndex(target);
    }
  }, [answers, currentIndex, exam.totalQuestions]);

  function handleSubmitClick() {
    if (answeredCount < exam.totalQuestions) {
      setConfirmStage("warn-unanswered");
    } else {
      setConfirmStage("final");
    }
  }

  // Keyboard shortcuts: ←/→ navigate, 1-4 select, c check, m map
  useEffect(() => {
    if (!hydrated) return;
    function onKey(e: KeyboardEvent) {
      if (confirmStage !== "none" || showCalculator || showQuestionMap) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const step = layoutMode === "double" ? 2 : 1;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((p) => Math.max(0, p - step));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((p) =>
          Math.min(exam.totalQuestions - 1, p + step),
        );
      } else if (["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        selectAnswer(currentIndex, Number(e.key) as Choice);
      } else if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        toggleCheck(currentIndex);
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        setShowQuestionMap(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    hydrated,
    confirmStage,
    showCalculator,
    showQuestionMap,
    layoutMode,
    currentIndex,
    exam.totalQuestions,
  ]);

  const fontSizeClass =
    fontScale === 150
      ? "text-xl leading-9"
      : fontScale === 130
        ? "text-lg leading-8"
        : "text-base leading-7";

  const visibleQuestions =
    layoutMode === "double"
      ? [exam.questions[currentIndex], exam.questions[currentIndex + 1]].filter(
          Boolean,
        )
      : [exam.questions[currentIndex]];

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-sm text-zinc-500">
        시험을 준비하고 있습니다...
      </div>
    );
  }

  const positionLabel = `${currentIndex + 1}/${exam.totalQuestions}`;
  const progressPct = Math.round(
    (answeredCount / exam.totalQuestions) * 100,
  );
  const timeFractionLeft =
    endsAt > startedAt
      ? remainingMs / (exam.durationMinutes * 60 * 1000)
      : 0;
  const timerUrgency =
    remainingMs < 60000
      ? "critical"
      : remainingMs < 5 * 60000
        ? "warning"
        : "normal";
  const timerClass =
    timerUrgency === "critical"
      ? "bg-rose-600 text-white animate-pulse"
      : timerUrgency === "warning"
        ? "bg-amber-100 text-amber-800 ring-1 ring-amber-300"
        : "bg-zinc-900 text-white";

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100">
      {/* Top bar: title + timer + examinee */}
      <div className="sticky top-0 z-30 border-b border-zinc-300 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white sm:flex">
              CBT
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-zinc-900 sm:text-base">
                전기기능사 CBT 문제풀이
              </h1>
              <p className="hidden text-xs text-zinc-500 sm:block">
                {exam.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm sm:gap-5">
            <div className="hidden text-right text-zinc-700 sm:block">
              <span className="text-xs text-zinc-500">수험자</span>
              <p className="font-semibold leading-tight">{examineeName}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                남은 시간
              </span>
              <span
                className={`rounded-md px-3 py-1 font-mono text-base font-bold tabular-nums ${timerClass}`}
                role="timer"
                aria-live={timerUrgency === "critical" ? "assertive" : "off"}
                aria-label={`남은 시간 ${remainingMinutes}분 ${remainingSeconds}초`}
              >
                {remainingDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Time progress (depletes) */}
        <div className="h-1 w-full bg-zinc-200">
          <div
            className={`h-full transition-[width] duration-1000 ease-linear ${
              timerUrgency === "critical"
                ? "bg-rose-500"
                : timerUrgency === "warning"
                  ? "bg-amber-400"
                  : "bg-blue-500"
            }`}
            style={{ width: `${Math.max(0, timeFractionLeft * 100)}%` }}
          />
        </div>

        {/* Toolbar */}
        <div className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 py-2 text-sm">
            <ToolGroup label="글자크기">
              {FONT_SCALES.map((scale) => (
                <ToolButton
                  key={scale}
                  active={fontScale === scale}
                  onClick={() => setFontScale(scale)}
                >
                  {scale}%
                </ToolButton>
              ))}
            </ToolGroup>

            <ToolGroup label="화면배치">
              {LAYOUT_MODES.map((mode) => (
                <ToolButton
                  key={mode.value}
                  active={layoutMode === mode.value}
                  onClick={() => setLayoutMode(mode.value)}
                >
                  {mode.label}
                </ToolButton>
              ))}
            </ToolGroup>

            <ToolButton onClick={() => setShowCalculator(true)}>
              🔢 계산기
            </ToolButton>

            <button
              type="button"
              onClick={() => setShowMobileSheet(true)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 lg:hidden"
            >
              답안지 ({answeredCount}/{exam.totalQuestions})
            </button>

            <div className="ml-auto flex items-center gap-1">
              <div className="mr-1 hidden items-center gap-2 rounded-md bg-white px-3 py-1.5 sm:flex">
                <span className="text-xs text-zinc-500">진행</span>
                <div
                  className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-200"
                  role="progressbar"
                  aria-valuenow={progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="답안 작성 진행률"
                >
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold tabular-nums text-zinc-700">
                  {progressPct}%
                </span>
              </div>
              <FilterButton
                active={filterMode === "all"}
                onClick={() => {
                  setFilterMode("all");
                  setShowQuestionMap(true);
                }}
              >
                전체문제 ({exam.totalQuestions})
              </FilterButton>
              <FilterButton
                active={filterMode === "remaining"}
                onClick={() => {
                  setFilterMode("remaining");
                  setShowQuestionMap(true);
                }}
              >
                남은문제 ({remainingCount})
              </FilterButton>
              <FilterButton
                active={filterMode === "checked"}
                onClick={() => {
                  setFilterMode("checked");
                  setShowQuestionMap(true);
                }}
              >
                체크 문제 ({checkedCount})
              </FilterButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-6 py-6">
        {/* Question area */}
        <div className="flex flex-1 flex-col gap-4">
          <PageGuide
            storageKey="cbt-take"
            tone="blue"
            defaultOpen={false}
            title="CBT 응시 안내 — 처음이라면 펼쳐보세요"
            subtitle="실제 시험과 동일한 환경입니다. 타이머·계산기·체크박스 활용법을 확인하세요."
            items={[
              {
                icon: "⏱",
                title: "제한시간 60분, 자동 제출",
                body: "상단 우측 타이머가 0이 되면 자동 제출됩니다. 남은 시간이 1분 이하면 빨간색으로 강조됩니다.",
              },
              {
                icon: "🔢",
                title: "계산기 사용 가능",
                body: "상단 툴바의 '계산기'를 누르면 화면 위에 계산기가 떠 있습니다. 실제 시험에서도 동일하게 제공됩니다.",
              },
              {
                icon: "📐",
                title: "화면배치 · 글자크기 조절",
                body: "툴바에서 1단/2단/1문제 모드와 100%/130%/150% 글자크기를 선택할 수 있습니다. 가독성에 맞춰 조절하세요.",
              },
              {
                icon: "☑",
                title: "헷갈리는 문제는 '체크'",
                body: "문제 상단 체크박스를 누르면 나중에 다시 볼 문제로 표시됩니다. 우측 상단 '체크 문제' 버튼으로 모아 보기.",
              },
              {
                icon: "🗺",
                title: "전체문제 / 남은문제로 이동",
                body: "우측 상단 버튼으로 문제 맵을 열어 미응답 문제만 추려 빠르게 이동할 수 있습니다.",
              },
              {
                icon: "💾",
                title: "답안은 자동 저장",
                body: "체크와 답안은 실시간으로 이 브라우저에 저장됩니다. 실수로 새로고침해도 이어서 풀 수 있습니다.",
              },
            ]}
            footer={
              <>
                ⚠️ <strong>미응답 문제가 있으면 제출 시 경고</strong>가 한 번 더 표시됩니다. 60문항 중 36문항 이상 정답이면 합격(과목별 과락 없음).
              </>
            }
          />

          <div
            className={`grid gap-4 ${
              layoutMode === "double" && visibleQuestions.length > 1
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {visibleQuestions.map((q) => {
              const qIdx = q.number - 1;
              return (
                <article
                  key={q.number}
                  className={`flex flex-col rounded-xl border bg-white p-5 shadow-sm transition sm:p-6 ${
                    answers[qIdx] !== null
                      ? "border-blue-200"
                      : "border-zinc-200"
                  }`}
                >
                  <header className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                        {String(q.number).padStart(2, "0")}
                      </span>
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                        {q.subject}
                      </span>
                      {answers[qIdx] !== null && (
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          답안 표기됨
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCheck(qIdx)}
                      className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
                        checked[qIdx]
                          ? "border-amber-300 bg-amber-50 text-amber-700"
                          : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {checked[qIdx] ? "★ 체크됨" : "☆ 체크"}
                    </button>
                  </header>

                  <p className={`text-zinc-900 ${fontSizeClass}`}>
                    {q.questionText}
                  </p>

                  <ul className={`mt-6 space-y-3 ${fontSizeClass}`}>
                    {q.choices.map((choice, i) => {
                      const value = (i + 1) as Choice;
                      const isSelected = answers[qIdx] === value;
                      return (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => selectAnswer(qIdx, value)}
                            className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
                              isSelected
                                ? "border-blue-600 bg-blue-50"
                                : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                                isSelected
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-zinc-400 text-zinc-600"
                              }`}
                            >
                              {value}
                            </span>
                            <span className="flex-1 text-zinc-800">
                              {choice}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>

        {/* Answer sheet sidebar */}
        {layoutMode !== "one" && (
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-zinc-900">
                    답안 표기란
                  </h2>
                  <span className="text-xs font-semibold tabular-nums text-zinc-500">
                    {answeredCount}/{exam.totalQuestions}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
              <div className="max-h-[58vh] overflow-y-auto px-2 py-2">
                {visibleIndices.map((qIdx) => {
                  const isCurrent = qIdx === currentIndex;
                  const isChecked = checked[qIdx];
                  return (
                    <div
                      key={qIdx}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                        isCurrent ? "bg-blue-50" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => goTo(qIdx)}
                        className={`w-7 text-left text-xs font-mono font-semibold ${
                          isCurrent ? "text-blue-600" : "text-zinc-500"
                        }`}
                      >
                        {String(qIdx + 1).padStart(2, "0")}
                      </button>
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4].map((c) => {
                          const sel = answers[qIdx] === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => selectAnswer(qIdx, c as Choice)}
                              className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold transition ${
                                sel
                                  ? "border-zinc-900 bg-zinc-900 text-white"
                                  : "border-zinc-300 text-zinc-500 hover:border-zinc-500"
                              }`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                      {isChecked && (
                        <span className="text-amber-500" title="체크됨">
                          ★
                        </span>
                      )}
                    </div>
                  );
                })}
                {visibleIndices.length === 0 && (
                  <p className="px-2 py-6 text-center text-xs text-zinc-500">
                    표시할 문항이 없습니다.
                  </p>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 z-30 border-t border-zinc-300 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
          >
            ← 이전
          </button>

          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold tabular-nums text-zinc-900">
              {positionLabel}
            </span>
            <span className="hidden text-[10px] text-zinc-400 sm:block">
              ← → 이동 · 1~4 선택 · C 체크 · M 문제맵
            </span>
          </div>

          <div className="flex gap-2">
            {remainingCount > 0 && (
              <button
                type="button"
                onClick={goToNextUnanswered}
                className="hidden rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 sm:block"
              >
                미응답 {remainingCount} →
              </button>
            )}
            <button
              type="button"
              onClick={goNext}
              disabled={currentIndex >= exam.totalQuestions - 1}
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
            >
              다음 →
            </button>
            <button
              type="button"
              onClick={handleSubmitClick}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:px-5"
            >
              답안 제출
            </button>
          </div>
        </div>
      </div>

      {/* Mobile answer sheet drawer */}
      {showMobileSheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileSheet(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-hidden rounded-t-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
              <h2 className="text-sm font-bold text-zinc-900">
                답안 표기란{" "}
                <span className="font-medium text-zinc-500">
                  ({answeredCount}/{exam.totalQuestions})
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setShowMobileSheet(false)}
                aria-label="닫기"
                className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-3 py-3">
              {exam.questions.map((_, qIdx) => {
                const isCurrent = qIdx === currentIndex;
                const isChecked = checked[qIdx];
                return (
                  <div
                    key={qIdx}
                    className={`flex items-center gap-2 rounded-md px-2 py-2 ${
                      isCurrent ? "bg-blue-50" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        goTo(qIdx);
                        setShowMobileSheet(false);
                      }}
                      className={`w-7 text-left font-mono text-xs font-semibold ${
                        isCurrent ? "text-blue-600" : "text-zinc-500"
                      }`}
                    >
                      {String(qIdx + 1).padStart(2, "0")}
                    </button>
                    <div className="flex flex-1 gap-1.5">
                      {[1, 2, 3, 4].map((c) => {
                        const sel = answers[qIdx] === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() =>
                              selectAnswer(qIdx, c as Choice)
                            }
                            className={`flex h-8 flex-1 items-center justify-center rounded-md border text-xs font-semibold transition ${
                              sel
                                ? "border-zinc-900 bg-zinc-900 text-white"
                                : "border-zinc-300 text-zinc-500"
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                    {isChecked && (
                      <span className="text-amber-500" title="체크됨">
                        ★
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {showCalculator && (
        <CalculatorDialog onClose={() => setShowCalculator(false)} />
      )}

      {showQuestionMap && (
        <QuestionMapDialog
          total={exam.totalQuestions}
          answers={answers}
          checked={checked}
          currentIndex={currentIndex}
          filterMode={filterMode}
          onJump={(idx) => {
            goTo(idx);
            setShowQuestionMap(false);
          }}
          onClose={() => setShowQuestionMap(false)}
        />
      )}

      {confirmStage === "warn-unanswered" && (
        <ConfirmDialog
          title="답안 제출"
          message={`아직 풀지 않은 문제가 ${remainingCount}개 남아있습니다. 그래도 제출하시겠습니까?`}
          confirmLabel="확인"
          cancelLabel="더 풀기"
          onConfirm={() => setConfirmStage("final")}
          onCancel={() => setConfirmStage("none")}
        />
      )}

      {confirmStage === "final" && (
        <ConfirmDialog
          title="답안 제출"
          message="정말 답안을 제출하시겠습니까? 최종 제출 후에는 수정할 수 없습니다."
          confirmLabel="제출"
          cancelLabel="취소"
          onConfirm={submitNow}
          onCancel={() => setConfirmStage("none")}
        />
      )}
    </div>
  );
}

function ToolGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1">
      <span className="text-xs text-zinc-500">{label}</span>
      <div className="flex gap-0.5">{children}</div>
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs font-medium transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-zinc-600 hover:bg-zinc-100"
      }`}
    >
      {children}
    </button>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-blue-600 bg-blue-50 text-blue-700"
          : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
        </div>
        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-zinc-700">{message}</p>
        </div>
        <div className="flex justify-end gap-2 border-t border-zinc-200 px-6 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
