"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "textbook-floating-hide-until";

function endOfTodayMs(): number {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

export default function TextbookFloatingPopup() {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    try {
      const hideUntil = Number(localStorage.getItem(STORAGE_KEY) ?? "0");
      const shouldShow = !hideUntil || Date.now() > hideUntil;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage "오늘 하루 보지 않기" 만료 시간 하이드레이션
      setVisible(shouldShow);
      if (shouldShow) {
        // 페이지 로드 후 살짝 늦게 슬라이드 인
        const id = window.setTimeout(() => setEntered(true), 350);
        return () => window.clearTimeout(id);
      }
    } catch {
      setVisible(true);
      setEntered(true);
    }
  }, []);

  function hideForToday() {
    try {
      localStorage.setItem(STORAGE_KEY, String(endOfTodayMs()));
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  function hideThisSession() {
    setVisible(false);
  }

  if (!visible) return null;

  // Collapsed = 작은 탭만 보이는 상태
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label="교재 구매 배너 펼치기"
        className="fixed right-14 top-44 z-30 hidden flex-col items-center gap-1 rounded-l-xl bg-gradient-to-b from-amber-500 via-orange-500 to-rose-500 px-2 py-3 text-white shadow-xl transition hover:px-3 xl:flex"
      >
        <span className="text-2xl">📘</span>
        <span className="writing-mode-vertical text-[10px] font-bold tracking-widest" style={{ writingMode: "vertical-rl" }}>
          교재 구매
        </span>
      </button>
    );
  }

  return (
    <aside
      className={`fixed right-14 top-44 z-30 hidden w-56 xl:block ${entered ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"} transition-all duration-500 ease-out`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        {/* 상단 그라디언트 + 책 일러스트 */}
        <div className="relative bg-gradient-to-br from-zinc-900 via-amber-900 to-orange-900 px-5 pb-5 pt-7">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-400/30 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-rose-400/20 blur-2xl" />

          {/* 닫기 / 접기 버튼 */}
          <div className="absolute right-2 top-2 flex gap-1">
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="배너 접기"
              title="옆으로 접기"
              className="rounded p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <span aria-hidden="true">›</span>
            </button>
            <button
              type="button"
              onClick={hideThisSession}
              aria-label="배너 닫기"
              title="이번에만 닫기"
              className="rounded p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          {/* 책 일러스트 (2D, 살짝 비스듬) */}
          <div className="relative mx-auto h-32 w-24">
            {/* 뒤에 살짝 보이는 책 (그림자) */}
            <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-[6deg] rounded-r-md rounded-l-sm bg-zinc-700/50 blur-[1px]" />
            {/* 메인 책 커버 */}
            <div className="absolute inset-0 -rotate-[3deg] overflow-hidden rounded-r-md rounded-l-sm bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 shadow-lg">
              {/* 책등 (왼쪽 짙은 띠) */}
              <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-amber-900 to-amber-700" />
              {/* 상단 띠 */}
              <div className="absolute inset-x-2 top-3 border-b border-white/30 pb-1 text-center">
                <p className="text-[7px] font-black uppercase tracking-[0.25em] text-white/85">
                  ADDTO
                </p>
              </div>
              {/* 본문 영역 */}
              <div className="absolute inset-x-2 top-9 text-center">
                <p className="text-[8px] font-bold tracking-widest text-white/85">
                  독끝
                </p>
                <p className="mt-1 text-[11px] font-black leading-tight text-white">
                  전기
                  <br />
                  기능사
                </p>
                <p className="mt-1 text-[8px] font-bold text-white/90">필기</p>
              </div>
              {/* 하단 띠 */}
              <div className="absolute inset-x-2 bottom-3 rounded bg-zinc-900/80 px-1.5 py-1 text-center">
                <p className="text-[7px] font-black tracking-wider text-amber-300">
                  HIT 적중률
                </p>
              </div>
              {/* 페이지 두께 표현 */}
              <div className="absolute inset-y-0 right-0 w-0.5 bg-white/40" />
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="px-5 pb-5 pt-4">
          <p className="text-center text-[11px] font-semibold tracking-wider text-amber-700">
            ⚡ 합격을 책임지는 단 하나의 교재
          </p>
          <h3 className="mt-1 text-center text-base font-black leading-tight text-zinc-900">
            독끝 전기기능사 필기
          </h3>
          <p className="mt-2 text-center text-[11px] leading-5 text-zinc-600">
            <strong className="text-zinc-900">빅데이터 기반</strong> 고적중 기출문제로
            가장 빠른 합격 루트.
          </p>

          <button
            type="button"
            disabled
            title="구매 페이지를 준비 중이에요"
            className="group relative mt-3 w-full cursor-not-allowed overflow-hidden rounded-md bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-3 py-2.5 text-sm font-bold text-white shadow-md"
          >
            교재 구매하러 가기 →
            <span className="absolute inset-x-0 bottom-0 bg-zinc-900/40 py-0.5 text-[9px] font-semibold tracking-wider">
              준비중
            </span>
          </button>

          <p className="mt-2 text-center text-[10px] text-zinc-500">
            ※ 회원가입을 하시면 출시 알림을 받아보실 수 있어요.
          </p>

          <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2">
            <button
              type="button"
              onClick={hideForToday}
              className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900"
            >
              오늘 하루 보지 않기
            </button>
            <button
              type="button"
              onClick={hideThisSession}
              className="text-[11px] text-zinc-500 hover:text-zinc-800"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
