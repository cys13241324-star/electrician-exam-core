"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "v2:free-launch-modal:dismissed";

export default function FreeLaunchModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 첫 방문 여부 체크 (localStorage 하이드레이션)
    setMounted(true);
    const dismissed =
      typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY) === "1";
    if (!dismissed) {
      // 살짝 딜레이 후 노출 (히어로 먼저 보이게)
      const t = window.setTimeout(() => setOpen(true), 800);
      return () => window.clearTimeout(t);
    }
  }, []);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage 차단된 환경은 그냥 무시
    }
  }

  if (!mounted || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="free-launch-title"
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
    >
      {/* dim */}
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={close}
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
      />

      {/* card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
        {/* 상단 그라데이션 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-rose-500 to-fuchsia-600 px-6 py-7 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.5), transparent 45%)",
            }}
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wider backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              LIMITED TIME · FREE
            </span>
            <h2
              id="free-launch-title"
              className="mt-3 text-2xl font-bold leading-tight tracking-tight"
            >
              기간 한정,
              <br />
              <span className="text-3xl">100% 무료 배포 중.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              진단 · 카드 · CBT 모의고사 · 오디오북 · 시뮬레이터까지
              <br />
              가입도 결제도 없이 지금 전부 무료로 열어드려요.
            </p>
          </div>

          {/* 닫기 버튼 (X) */}
          <button
            type="button"
            onClick={close}
            aria-label="닫기"
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <span aria-hidden className="text-base leading-none">
              ✕
            </span>
          </button>
        </div>

        {/* 본문 */}
        <div className="space-y-4 px-6 py-6">
          <ul className="space-y-2">
            {[
              "전 기능 무료 — 결제 페이지 없음",
              "회원가입 없이 바로 시작",
              "정식 출시 후엔 일부 기능 유료 전환 예정",
            ].map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-sm text-zinc-700"
              >
                <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                  ✓
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Link
              href="/cbt"
              onClick={close}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              지금 무료로 시작하기 →
            </Link>
            <button
              type="button"
              onClick={close}
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              둘러보기
            </button>
          </div>
          <p className="text-center text-[11px] text-zinc-400">
            이 안내는 한 번만 표시돼요.
          </p>
        </div>
      </div>
    </div>
  );
}
