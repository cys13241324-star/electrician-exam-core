"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * 강의 박스 — 누르면 우하단에 PiP형 유튜브 미니 플레이어를 띄운다.
 * videoId 가 있으면 해당 강의를, 없으면 query 로 유튜브 검색 결과를 임베드.
 * (회차/문항별 실제 강의 videoId 가 연동되면 videoId 만 넘기면 됨)
 */
export default function LecturePiP({
  title,
  query,
  videoId,
}: {
  title: string;
  query: string;
  videoId?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const embedSrc = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
        query,
      )}`;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query,
  )}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#e3e8ee] bg-white px-4 py-3 text-left transition hover:border-[#c3b8fb] hover:bg-[#f6f9fc]"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-600 text-xs text-white">
            ▶
          </span>
          <span>
            <span className="block text-sm font-semibold text-[#0d253d]">
              강의로 이해하기
            </span>
            <span className="block text-[11px] text-[#64748d]">
              관련 강의를 PiP 플레이어로 바로 재생
            </span>
          </span>
        </span>
        <span className="text-xs font-semibold text-[#533afd]">열기 →</span>
      </button>

      {mounted &&
        open &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-[60] w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#e3e8ee] bg-white shadow-[0_12px_40px_rgba(13,37,61,0.22)]">
            <div className="flex items-center justify-between gap-2 bg-[#0d253d] px-3 py-2">
              <p className="truncate text-xs font-semibold text-white">
                🎬 {title}
              </p>
              <div className="flex flex-shrink-0 items-center gap-1">
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-1 text-[11px] text-white/80 transition hover:bg-white/15 hover:text-white"
                  title="유튜브에서 더 보기"
                >
                  ↗ 새 탭
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="강의 닫기"
                  className="rounded p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={embedSrc}
                title={title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
