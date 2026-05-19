"use client";

import { useEffect, useState } from "react";

const EXAM_DATE = new Date("2026-06-01T09:00:00+09:00");
const EXAM_LABEL = "2026년 정기기능사 1회 (필기)";

function diffDays(target: Date, from: Date): number {
  const utcTarget = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const utcFrom = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((utcTarget - utcFrom) / (1000 * 60 * 60 * 24));
}

export default function DDayWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 시계 (외부 시간 시스템) 마운트 시 초기화 + 60초마다 갱신
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm text-zinc-500">
        시험일 계산 중...
      </div>
    );
  }

  const days = diffDays(EXAM_DATE, now);
  const labelLeft = days > 0 ? `D-${days}` : days === 0 ? "D-DAY" : `D+${Math.abs(days)}`;
  const tone =
    days > 30
      ? "bg-blue-50 border-blue-200 text-blue-700"
      : days > 7
        ? "bg-amber-50 border-amber-200 text-amber-700"
        : days >= 0
          ? "bg-rose-50 border-rose-200 text-rose-700"
          : "bg-zinc-50 border-zinc-200 text-zinc-600";

  const dateLabel = `${EXAM_DATE.getFullYear()}.${String(EXAM_DATE.getMonth() + 1).padStart(2, "0")}.${String(EXAM_DATE.getDate()).padStart(2, "0")}`;

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border bg-white px-5 py-3 shadow-sm ${tone.split(" ")[1]}`}
    >
      <div
        className={`flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg ${tone}`}
      >
        <span className="text-[10px] font-semibold leading-none">시험까지</span>
        <span className="text-xl font-black leading-tight">{labelLeft}</span>
      </div>
      <div className="text-xs">
        <p className="font-semibold text-zinc-900">{EXAM_LABEL}</p>
        <p className="mt-0.5 text-zinc-500">📅 {dateLabel}</p>
        {days > 0 && days <= 30 && (
          <p className="mt-1 font-medium text-rose-600">
            마지막 점검 시기예요. 모의고사 + 취약점 보강에 집중!
          </p>
        )}
        {days > 30 && days <= 60 && (
          <p className="mt-1 font-medium text-amber-700">
            본격 학습 단계. 매일 한 회차씩 풀어보세요.
          </p>
        )}
      </div>
    </div>
  );
}
