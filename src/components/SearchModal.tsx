"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const POPULAR_KEYWORDS = [
  "옴의 법칙",
  "변압기 권수비",
  "전기력선",
  "키르히호프",
  "차단기",
  "유도전동기",
  "RLC 공진",
  "접지 저항",
];

const QUICK_LINKS = [
  { label: "이론 시뮬레이터", href: "/simulator", emoji: "⚡" },
];

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-4">
          <span className="text-zinc-400">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="시뮬레이터 이름이나 토픽을 검색해 보세요"
            className="flex-1 bg-transparent text-base text-zinc-900 placeholder-zinc-400 outline-none"
          />
          <kbd className="hidden rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500 sm:inline-block">
            ESC
          </kbd>
          <button
            type="button"
            onClick={onClose}
            aria-label="검색 닫기"
            className="ml-1 rounded-md p-1 text-zinc-500 hover:bg-zinc-100"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          {q.trim() ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
              <p className="text-sm text-zinc-600">
                &ldquo;<strong className="text-zinc-900">{q}</strong>&rdquo;에
                대한 검색 기능은 준비 중이에요.
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                지금은 인기 검색어와 빠른 이동만 사용할 수 있어요.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="mb-3 text-xs font-semibold tracking-wider text-zinc-500">
                  🔥 인기 검색어
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_KEYWORDS.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setQ(k)}
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold tracking-wider text-zinc-500">
                  🚀 빠른 이동
                </p>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {QUICK_LINKS.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 transition hover:border-blue-400 hover:bg-blue-50"
                      >
                        <span className="text-lg">{l.emoji}</span>
                        <span className="font-semibold">{l.label}</span>
                        <span className="ml-auto text-xs text-zinc-400">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-5 py-2.5 text-[11px] text-zinc-500">
          <span>전기기능사 검색 (베타)</span>
          <span className="hidden sm:inline">addto 온라인</span>
        </div>
      </div>
    </div>
  );
}
