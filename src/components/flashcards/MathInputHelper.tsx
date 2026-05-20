"use client";

import { useState, type RefObject } from "react";
import { MathText } from "@/components/Math";
import { autoWrapMath, SYMBOL_PALETTE } from "@/lib/flashcards/mathConvert";

type Props = {
  /** 대상 textarea ref */
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  /** textarea 값 (제어 컴포넌트) */
  value: string;
  onChange: (next: string) => void;
  /** 옵션: 미리보기 제목 */
  previewLabel?: string;
};

/**
 * 사용자가 LaTeX 문법을 몰라도 수식을 보기 좋게 입력할 수 있게 돕는 도우미.
 * - 기호 팔레트: 클릭 시 textarea 커서 위치에 LaTeX 명령 삽입
 * - 선택 영역을 $수식$ 으로 감싸기 (자동 변환 포함)
 * - 전체 자동 변환: 평문 수식을 LaTeX 로 일괄 변환
 * - 실시간 미리보기
 */
export default function MathInputHelper({
  textareaRef,
  value,
  onChange,
  previewLabel = "미리보기",
}: Props) {
  const [showHelp, setShowHelp] = useState(false);

  function focusAndUpdate(next: string, caret: number) {
    onChange(next);
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(caret, caret);
    });
  }

  function insertAtCursor(snippet: string) {
    const ta = textareaRef.current;
    const start = ta?.selectionStart ?? value.length;
    const end = ta?.selectionEnd ?? value.length;
    const before = value.slice(0, start);
    const after = value.slice(end);
    // 분수 / 제곱근 등 빈 중괄호가 두 개 있을 때 첫 중괄호 안으로 커서 이동
    const firstBrace = snippet.indexOf("{}");
    const next = before + snippet + after;
    const caret =
      firstBrace >= 0
        ? before.length + firstBrace + 1
        : before.length + snippet.length;
    focusAndUpdate(next, caret);
  }

  function wrapSelection() {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    if (start === end) {
      // 선택 없으면 자동변환과 동일하게 처리
      onChange(autoWrapMath(value));
      return;
    }
    const selected = value.slice(start, end);
    const wrapped = autoWrapMath(selected);
    const next = value.slice(0, start) + wrapped + value.slice(end);
    focusAndUpdate(next, start + wrapped.length);
  }

  function autoConvertAll() {
    onChange(autoWrapMath(value));
  }

  return (
    <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50/30 p-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[11px] font-bold text-blue-700">
          🪄 수식 도우미
        </span>
        {SYMBOL_PALETTE.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => insertAtCursor(s.insert)}
            title={s.desc ? `${s.label} — ${s.desc}` : s.label}
            aria-label={s.desc ? `${s.label} ${s.desc} 삽입` : `${s.label} 삽입`}
            className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md border border-zinc-200 bg-white px-1.5 text-[13px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-600 hover:text-white"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-blue-100/60 pt-2.5">
        <button
          type="button"
          onClick={wrapSelection}
          className="rounded-full border border-blue-200 bg-white px-3 py-1 text-[11px] font-semibold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-600 hover:text-white"
          title="textarea 에서 수식 부분만 드래그하면 그 부분만 변환됩니다"
        >
          🖱️ 선택 영역 → $수식$
        </button>
        <button
          type="button"
          onClick={autoConvertAll}
          className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
          title="전체 텍스트에서 수식처럼 보이는 부분을 자동으로 LaTeX 로 변환합니다"
        >
          ✨ 전체 자동 변환
        </button>
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          className="ml-auto text-[11px] font-semibold text-zinc-500 underline-offset-2 hover:text-zinc-900 hover:underline"
        >
          {showHelp ? "도움말 닫기" : "도움말 보기"}
        </button>
      </div>

      {showHelp && (
        <div className="mt-2.5 rounded-lg bg-white p-3 text-[12px] leading-6 text-zinc-700 ring-1 ring-blue-100">
          <p className="mb-1.5 font-bold text-zinc-800">평문 → 자동 변환 예</p>
          <ul className="space-y-0.5 text-zinc-600">
            <li>
              <code className="rounded bg-zinc-100 px-1">V = I * R</code> →{" "}
              <code className="rounded bg-zinc-100 px-1">
                $V = I \times R$
              </code>
            </li>
            <li>
              <code className="rounded bg-zinc-100 px-1">1/2</code> →{" "}
              <code className="rounded bg-zinc-100 px-1">\dfrac&#123;1&#125;&#123;2&#125;</code>
            </li>
            <li>
              <code className="rounded bg-zinc-100 px-1">sqrt(2)</code> →{" "}
              <code className="rounded bg-zinc-100 px-1">\sqrt&#123;2&#125;</code>
            </li>
            <li>
              <code className="rounded bg-zinc-100 px-1">x^10</code> →{" "}
              <code className="rounded bg-zinc-100 px-1">x^&#123;10&#125;</code>
            </li>
            <li>
              <code className="rounded bg-zinc-100 px-1">pi r^2</code> →{" "}
              <code className="rounded bg-zinc-100 px-1">\pi r^&#123;2&#125;</code>
            </li>
            <li>
              <code className="rounded bg-zinc-100 px-1">{"<="}, {">="}, !=</code> →{" "}
              <code className="rounded bg-zinc-100 px-1">\le, \ge, \ne</code>
            </li>
          </ul>
          <p className="mt-2 text-[11px] text-zinc-500">
            팁: 이미 <code className="rounded bg-zinc-100 px-1">$...$</code> 로
            감싸진 부분은 그대로 두고, 평문 수식만 변환합니다. 결과가 마음에
            안 들면 <kbd className="rounded bg-zinc-100 px-1">Ctrl/⌘+Z</kbd>{" "}
            로 되돌릴 수 있습니다.
          </p>
        </div>
      )}

      <div className="mt-2.5 rounded-lg bg-white p-3 ring-1 ring-zinc-200">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          {previewLabel}
        </p>
        {value.trim() ? (
          <div className="whitespace-pre-line text-sm leading-6 text-zinc-800">
            <MathText>{value}</MathText>
          </div>
        ) : (
          <p className="text-xs text-zinc-400">입력하면 여기에 미리보기가 표시됩니다.</p>
        )}
      </div>
    </div>
  );
}
