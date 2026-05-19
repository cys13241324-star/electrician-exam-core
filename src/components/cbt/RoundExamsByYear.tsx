"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { mockExamSummaries } from "@/lib/cbt/mockData";
import type { Attempt, ExamStatus, ExamSummary } from "@/lib/cbt/types";
import YearExamGenerator from "./YearExamGenerator";

const statusStyles: Record<ExamStatus, string> = {
  응시대기: "bg-[#eef1f6] text-[#64748d]",
  응시중: "bg-[#533afd]/10 text-[#533afd]",
  완료: "bg-emerald-50 text-emerald-700",
};

type YearGroup = {
  year: number;
  exams: (ExamSummary & { roundInYear: number })[];
};

/**
 * 회차별 모의고사를 연도별로 묶는다. mockData 에 연도 필드가 없어 최신 회차부터
 * 한 해 4회씩 부여한다(올해부터 역순). 연도 내에서는 1~4회로 재번호.
 * mockData 에 실제 연도 필드가 생기면 이 함수만 교체.
 */
function groupExamsByYear(exams: ExamSummary[]): YearGroup[] {
  const PER_YEAR = 4;
  const CURRENT_YEAR = new Date().getFullYear();
  const sorted = [...exams].sort((a, b) => b.round - a.round);

  const groups: YearGroup[] = [];
  sorted.forEach((exam, i) => {
    const year = CURRENT_YEAR - Math.floor(i / PER_YEAR);
    let g = groups.find((x) => x.year === year);
    if (!g) {
      g = { year, exams: [] };
      groups.push(g);
    }
    g.exams.push({ ...exam, roundInYear: 0 });
  });

  for (const g of groups) {
    g.exams.sort((a, b) => a.round - b.round);
    g.exams.forEach((e, idx) => {
      e.roundInYear = idx + 1;
    });
  }
  return groups;
}

function readStatus(examId: string): ExamStatus {
  if (typeof window === "undefined") return "응시대기";
  try {
    const raw = localStorage.getItem(`cbt-attempt-${examId}`);
    if (!raw) return "응시대기";
    const a = JSON.parse(raw) as Attempt;
    return a.submittedAt !== null ? "완료" : "응시중";
  } catch {
    return "응시대기";
  }
}

export default function RoundExamsByYear() {
  const years = groupExamsByYear(mockExamSummaries);
  const [statusMap, setStatusMap] = useState<Record<string, ExamStatus>>({});

  const refresh = useCallback(() => {
    const next: Record<string, ExamStatus> = {};
    for (const e of mockExamSummaries) next[e.id] = readStatus(e.id);
    setStatusMap(next);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);

  function reset(examId: string, label: string) {
    if (
      !window.confirm(
        `${label} 응시 기록을 초기화할까요?\n작성한 답안·결과가 모두 삭제되며 되돌릴 수 없습니다.`,
      )
    )
      return;
    localStorage.removeItem(`cbt-attempt-${examId}`);
    refresh();
  }

  return (
    <div className="space-y-3">
      {years.map((group, gi) => (
        <details
          key={group.year}
          open={gi === 0}
          className="group/y overflow-hidden rounded-2xl border border-[#e3e8ee] bg-white shadow-[0_1px_2px_rgba(13,37,61,0.04)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-5 py-4 transition hover:bg-[#f6f9fc]">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[15px] font-medium tracking-[-0.2px] text-[#0d253d] tabular-nums">
                {group.year}년
              </span>
              <span className="rounded-full bg-[#533afd]/10 px-2.5 py-0.5 text-xs font-semibold text-[#533afd] tabular-nums">
                {group.exams.length}회차
              </span>
              <YearExamGenerator year={group.year} />
            </span>
            <span
              className="text-xs text-[#64748d] transition group-open/y:rotate-180"
              aria-hidden
            >
              ▾
            </span>
          </summary>

          <div className="grid grid-cols-1 gap-4 border-t border-[#e3e8ee] p-5 sm:grid-cols-2 lg:grid-cols-4">
            {group.exams.map((exam) => {
              const status = statusMap[exam.id] ?? "응시대기";
              const primaryLabel =
                status === "완료"
                  ? "결과 보기"
                  : status === "응시중"
                    ? "이어서 풀기"
                    : "응시하기";
              const primaryHref =
                status === "완료"
                  ? `/cbt/${exam.id}/result`
                  : `/cbt/${exam.id}/take`;
              const roundLabel = `${group.year}년 ${exam.roundInYear}회`;
              const isDone = status === "완료";
              const canReset = status !== "응시대기";

              return (
                <div
                  key={exam.id}
                  className="flex flex-col rounded-2xl border border-[#e3e8ee] bg-white p-4 shadow-[0_1px_2px_rgba(13,37,61,0.04)] transition hover:-translate-y-0.5 hover:border-[#c3b8fb] hover:shadow-[0_8px_24px_rgba(83,58,253,0.10)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 flex-col items-center justify-center rounded-xl bg-[#533afd]/8 text-[#533afd]">
                      <span className="text-[10px] font-medium leading-none tabular-nums">
                        {group.year}
                      </span>
                      <span className="text-base font-medium leading-tight tabular-nums">
                        {exam.roundInYear}회
                      </span>
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status]}`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-[#64748d] tabular-nums">
                    {exam.totalQuestions}문항 · {exam.durationMinutes}분
                  </p>

                  <Link
                    href={primaryHref}
                    className={`mt-3 flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-center text-sm font-semibold transition ${
                      status === "응시대기"
                        ? "bg-[#533afd] text-white hover:bg-[#4434d4]"
                        : "bg-[#0d253d] text-white hover:bg-[#273951]"
                    }`}
                  >
                    {primaryLabel}
                    <span aria-hidden>→</span>
                  </Link>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {isDone ? (
                      <Link
                        href={`/cbt/${exam.id}/wrong-notes`}
                        className="rounded-full border border-[#e3e8ee] px-3 py-2 text-center text-xs font-semibold text-[#273951] transition hover:bg-[#f6f9fc]"
                      >
                        오답노트
                      </Link>
                    ) : (
                      <span
                        className="cursor-not-allowed rounded-full border border-[#eef1f6] px-3 py-2 text-center text-xs font-semibold text-[#a8b3c4]"
                        title="응시 완료 후 확인할 수 있어요"
                      >
                        오답노트
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={!canReset}
                      onClick={() => reset(exam.id, roundLabel)}
                      className="rounded-full border border-[#e3e8ee] px-3 py-2 text-center text-xs font-semibold text-[#273951] transition hover:bg-[#f6f9fc] disabled:cursor-not-allowed disabled:border-[#eef1f6] disabled:text-[#a8b3c4]"
                    >
                      초기화
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      ))}
    </div>
  );
}
