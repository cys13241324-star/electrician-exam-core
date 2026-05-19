"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { buildFocusId, countByFocus } from "@/lib/cbt/mockData";
import type { Difficulty, Frequency } from "@/lib/cbt/types";

type Star = 0 | 1 | 2 | 3;
type Mode = "freq" | "diff";

// 별 개수 → 메타 매핑. 별이 많을수록 빈출↑ / 난이도↑
const FREQ_BY_STAR: Record<1 | 2 | 3, Frequency> = {
  1: "low",
  2: "medium",
  3: "high",
};
const DIFF_BY_STAR: Record<1 | 2 | 3, Difficulty> = {
  1: "easy",
  2: "medium",
  3: "hard",
};

const MODE_META: Record<
  Mode,
  { label: string; icon: string; hint: string; accent: string }
> = {
  freq: {
    label: "빈출문제",
    icon: "🔥",
    hint: "★1 저빈출 · ★2 보통 · ★3 빈출",
    accent: "text-rose-500",
  },
  diff: {
    label: "난이도별 문제",
    icon: "🎚️",
    hint: "★1 쉬움 · ★2 보통 · ★3 어려움",
    accent: "text-violet-500",
  },
};

function StarPicker({
  value,
  onChange,
  activeColor,
}: {
  value: Star;
  onChange: (v: Star) => void;
  activeColor: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            aria-label={`별 ${n}개`}
            aria-pressed={filled}
            // 같은 별을 다시 누르면 해제(0)
            onClick={() => onChange((value === n ? 0 : n) as Star)}
            className={`text-3xl leading-none transition ${
              filled ? activeColor : "text-zinc-300 hover:text-zinc-400"
            }`}
          >
            {filled ? "★" : "☆"}
          </button>
        );
      })}
      {value > 0 && (
        <button
          type="button"
          onClick={() => onChange(0)}
          className="ml-1 text-xs text-zinc-400 underline-offset-2 hover:text-zinc-600 hover:underline"
        >
          해제
        </button>
      )}
    </div>
  );
}

export default function YearExamGenerator({ year }: { year: number }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  // 어떤 모달이 열려 있는지(빈출/난이도 따로). null = 닫힘
  const [mode, setMode] = useState<Mode | null>(null);
  const [freqStar, setFreqStar] = useState<Star>(0);
  const [diffStar, setDiffStar] = useState<Star>(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mode) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMode(null);
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mode]);

  // <summary> 안에서 클릭해도 아코디언이 토글되지 않게 기본동작 차단
  function openModal(e: React.MouseEvent, m: Mode) {
    e.preventDefault();
    e.stopPropagation();
    setMode(m);
  }

  const star = mode === "freq" ? freqStar : diffStar;
  const setStar = mode === "freq" ? setFreqStar : setDiffStar;
  const frequency =
    mode === "freq" && freqStar ? FREQ_BY_STAR[freqStar] : undefined;
  const difficulty =
    mode === "diff" && diffStar ? DIFF_BY_STAR[diffStar] : undefined;
  const count = mode ? countByFocus({ frequency, difficulty }) : 0;
  const canGenerate = star > 0 && count > 0;

  function generate() {
    if (!mode || !canGenerate) return;
    // 단일 조건만 인코딩 → 빈출/난이도 따로 (AND 아님)
    const id = buildFocusId(
      mode === "freq" ? { frequency, year } : { difficulty, year },
    );
    router.push(`/cbt/${id}/take`);
  }

  const triggerClass =
    "rounded-full border border-[#e3e8ee] bg-white px-3 py-1.5 text-xs font-semibold text-[#273951] shadow-[0_1px_2px_rgba(13,37,61,0.04)] transition hover:border-[#c3b8fb] hover:bg-[#533afd]/10 hover:text-[#533afd]";

  const meta = mode ? MODE_META[mode] : null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => openModal(e, "freq")}
        className={triggerClass}
      >
        🔥 빈출문제
      </button>
      <button
        type="button"
        onClick={(e) => openModal(e, "diff")}
        className={triggerClass}
      >
        🎚️ 난이도별 문제
      </button>

      {mounted &&
        mode &&
        meta &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setMode(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${year}년 ${meta.label} 시험지 생성`}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between bg-[#533afd] px-5 py-3.5">
                <h2 className="text-sm font-bold text-white">
                  {year}년 · {meta.icon} {meta.label}
                </h2>
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  aria-label="닫기"
                  className="rounded-md p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="px-5 py-5">
                <p className="mb-4 text-xs text-zinc-500">
                  {year}년 문항 풀에서 <strong>{meta.label}</strong> 조건만으로
                  시험지를 생성합니다.
                </p>

                <div className="rounded-xl border border-zinc-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-zinc-900">
                        {meta.icon} {meta.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        {meta.hint}
                      </p>
                    </div>
                    <StarPicker
                      value={star}
                      onChange={setStar}
                      activeColor={meta.accent}
                    />
                  </div>
                </div>

                <p className="mt-4 text-center text-sm text-zinc-600">
                  {star > 0 ? (
                    <>
                      선택 조건{" "}
                      <strong className="font-semibold text-zinc-900">
                        {count}문항
                      </strong>{" "}
                      {count > 0
                        ? "· 1.5분/문항 자동 배정"
                        : "· 해당 조건 문항이 없습니다"}
                    </>
                  ) : (
                    "별을 1개 이상 선택하세요."
                  )}
                </p>
              </div>

              {/* 푸터 */}
              <div className="flex justify-end gap-2 border-t border-zinc-200 px-5 py-3">
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  disabled={!canGenerate}
                  onClick={generate}
                  className="rounded-full bg-[#533afd] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4434d4] disabled:cursor-not-allowed disabled:bg-[#c7cdd9]"
                >
                  시험지 생성하기 →
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
