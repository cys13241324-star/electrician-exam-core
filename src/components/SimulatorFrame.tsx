"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  title: string;
};

/**
 * 시뮬레이터 iframe 뷰포트.
 * - 로딩 스켈레톤
 * - 전체화면 토글(Fullscreen API)
 * - 새로고침(시뮬 초기화)
 * - 다크 시뮬과 라이트 셸 사이를 자연스럽게 잇는 프레임
 */
export default function SimulatorFrame({ src, title }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    function onFsChange() {
      const fsEl =
        document.fullscreenElement ||
        // Safari/구형 webkit 폴백
        (document as Document & { webkitFullscreenElement?: Element })
          .webkitFullscreenElement ||
        null;
      setIsFull(fsEl === wrapRef.current);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  // 사용자 클릭(제스처)에서만 호출 — 자동 전체화면은 브라우저가 차단
  async function toggleFullscreen() {
    const el = wrapRef.current as
      | (HTMLDivElement & {
          webkitRequestFullscreen?: () => Promise<void> | void;
        })
      | null;
    if (!el) return;
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      webkitExitFullscreen?: () => Promise<void> | void;
    };
    try {
      const active = document.fullscreenElement || doc.webkitFullscreenElement;
      if (active) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
    } catch {
      /* 일부 브라우저/iOS에서 차단 시 무시 */
    }
  }

  function reload() {
    setLoaded(false);
    setReloadKey((k) => k + 1);
  }

  return (
    <div
      ref={wrapRef}
      className={`group/frame relative overflow-hidden rounded-3xl border border-zinc-800 bg-slate-950 shadow-2xl ring-1 ring-black/5 ${
        isFull ? "flex h-screen flex-col rounded-none" : ""
      }`}
    >
      {/* 상단 바 — macOS 윈도우 톤 */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-slate-900/80 px-4 py-2.5 backdrop-blur">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </span>
        <span className="ml-2 truncate text-xs font-medium text-zinc-400">
          {title}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={reload}
            aria-label="시뮬레이터 초기화"
            title="초기화"
            className="rounded-lg px-2 py-1 text-xs text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            ↻
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFull ? "전체화면 종료" : "전체화면으로 보기"}
            title={isFull ? "전체화면 종료" : "전체화면"}
            className="rounded-lg px-2 py-1 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            {isFull ? "✕ 닫기" : "⛶ 전체화면"}
          </button>
        </div>
      </div>

      <div className={`relative ${isFull ? "flex-1" : ""}`}>
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-950">
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-400" />
            <p className="text-xs tracking-wide text-zinc-400">
              시뮬레이터 불러오는 중…
            </p>
          </div>
        )}
        <iframe
          key={reloadKey}
          ref={iframeRef}
          src={src}
          title={title}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          className={`w-full bg-slate-950 ${
            isFull ? "h-full" : "h-[78vh] min-h-[520px]"
          }`}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
