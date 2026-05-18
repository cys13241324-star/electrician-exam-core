"use client";

import type { Choice } from "@/lib/cbt/types";

type FilterMode = "all" | "remaining" | "checked";

const titleByMode: Record<FilterMode, string> = {
  all: "전체 문항",
  remaining: "남은 문항",
  checked: "체크 문항",
};

export default function QuestionMapDialog({
  total,
  answers,
  checked,
  currentIndex,
  filterMode,
  onJump,
  onClose,
}: {
  total: number;
  answers: (Choice | null)[];
  checked: boolean[];
  currentIndex: number;
  filterMode: FilterMode;
  onJump: (index: number) => void;
  onClose: () => void;
}) {
  const indices = Array.from({ length: total }, (_, i) => i).filter((i) => {
    if (filterMode === "remaining") return answers[i] === null;
    if (filterMode === "checked") return checked[i];
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <h2 className="text-lg font-bold text-zinc-900">
            {titleByMode[filterMode]}{" "}
            <span className="text-sm font-medium text-zinc-500">
              ({indices.length})
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-zinc-500 hover:text-zinc-900"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="mb-4 text-xs text-zinc-500">
            번호를 클릭하면 해당 문제로 이동합니다.
          </p>
          {indices.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              해당 항목이 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
              {indices.map((i) => {
                const isCurrent = i === currentIndex;
                const isAnswered = answers[i] !== null;
                const isChecked = checked[i];
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onJump(i)}
                    className={`relative rounded-md border px-0 py-3 text-sm font-semibold transition ${
                      isCurrent
                        ? "border-blue-600 bg-blue-600 text-white"
                        : isAnswered
                          ? "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                    {isChecked && (
                      <span
                        className="absolute right-1 top-0.5 text-amber-500"
                        title="체크됨"
                      >
                        ★
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-200 px-6 py-3 text-xs text-zinc-600">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm border border-blue-200 bg-blue-50" />
            답안 마킹됨
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm border border-zinc-200 bg-white" />
            미마킹
          </span>
          <span className="flex items-center gap-1">
            <span className="text-amber-500">★</span>
            체크 표시
          </span>
        </div>
      </div>
    </div>
  );
}
