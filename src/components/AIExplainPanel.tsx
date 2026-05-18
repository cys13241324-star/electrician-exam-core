"use client";

import { useState } from "react";
import { MathText } from "@/components/Math";
import { checkAndIncrement } from "@/lib/ai/rateLimit";

type ExplainContext =
  | {
      kind: "question";
      question: string;
      correctAnswer?: string;
      existingExplanation?: string;
      userWrongAnswer?: string;
    }
  | {
      kind: "card";
      cardFront: string;
      cardBack: string;
    };

/**
 * "다른 각도로 설명" 버튼 + 펼치는 패널.
 * 클릭하면 스트리밍으로 답변이 들어옴.
 */
export default function AIExplainPanel({
  context,
  className = "",
}: {
  context: ExplainContext;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setError(null);
    const check = checkAndIncrement();
    if (!check.ok) {
      setError("오늘 AI 호출 한도(50회)를 모두 사용했어요");
      return;
    }
    setOpen(true);
    setLoading(true);
    setText("");

    try {
      const body =
        context.kind === "question"
          ? {
              question: context.question,
              correctAnswer: context.correctAnswer,
              existingExplanation: context.existingExplanation,
              userWrongAnswer: context.userWrongAnswer,
            }
          : {
              cardFront: context.cardFront,
              cardBack: context.cardBack,
            };

      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "응답 실패");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        acc += chunk;
        setText(acc);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleStart}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 transition hover:border-violet-400 hover:bg-violet-100 ${className}`}
      >
        <span>💡</span>
        <span>AI에게 다른 각도로 설명 요청</span>
      </button>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-pink-50 p-4 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-gradient-to-br from-violet-600 to-pink-500 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
            ✨ AI 다른 해설
          </span>
          <span className="text-[10px] font-medium text-violet-600">
            Gemini 2.5 Flash
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="닫기"
          className="text-zinc-500 hover:text-zinc-900"
        >
          ✕
        </button>
      </div>

      {loading && text === "" && (
        <div className="mt-3 flex items-center gap-2 text-xs text-violet-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />
          <span>AI가 다른 각도로 풀어 쓰는 중...</span>
        </div>
      )}

      {text && (
        <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-800">
          <MathText>{text}</MathText>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          ⚠ {error}
        </div>
      )}

      {!loading && text && !error && (
        <div className="mt-3 flex items-center justify-between border-t border-violet-200/50 pt-3">
          <p className="text-[10px] text-violet-600">
            ※ AI 답변은 참고용입니다. 정확한 시험 정답은 교재를 확인하세요.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="text-[11px] font-bold text-violet-700 hover:underline"
          >
            🔄 다시 생성
          </button>
        </div>
      )}
    </div>
  );
}
