"use client";

import { useEffect, useRef, useState } from "react";
import type { Flashcard } from "@/lib/flashcards/types";
import { MathText } from "@/components/Math";
import {
  type ProgressMap,
  type CardStatus,
} from "@/lib/flashcards/favorites";

type Props = {
  deck: Flashcard[];
  favorites: Set<string>;
  progress: ProgressMap;
  onToggleFavorite: (id: string) => void;
  onRate: (id: string, status: CardStatus) => void;
  onExit: () => void;
};

export default function CardStudy({
  deck,
  favorites,
  progress,
  onToggleFavorite,
  onRate,
  onExit,
}: Props) {
  // 현재 보고 있는 덱 내 위치 (좌/우 이동의 기준)
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // 터치 스와이프
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [drag, setDrag] = useState({ dx: 0, active: false });

  useEffect(() => {
    // 덱(필터·셔플 결과)이 바뀌면 처음 카드부터 다시 본다.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deck prop 변경 시 학습 위치 초기화
    setPos(0);
    setFlipped(false);
    setDrag({ dx: 0, active: false });
  }, [deck]);

  const card = deck[pos];

  function goPrev() {
    if (pos <= 0) return;
    setPos((p) => Math.max(0, p - 1));
    setFlipped(false);
    setDrag({ dx: 0, active: false });
  }

  function goNext() {
    if (pos >= deck.length - 1) return;
    setPos((p) => Math.min(deck.length - 1, p + 1));
    setFlipped(false);
    setDrag({ dx: 0, active: false });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        if (!card) return;
        setFlipped((v) => !v);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key.toLowerCase() === "r" && card) {
        // 다시보기 토글: '다시보기' 표시 ↔ 해제
        onRate(
          card.id,
          progress[card.id]?.status === "unknown" ? "known" : "unknown",
        );
      } else if (e.key.toLowerCase() === "f" && card) {
        onToggleFavorite(card.id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, card, pos, deck.length, progress]);

  // ---- 빈 상태 ----
  if (!card) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-10 text-center shadow-sm">
        <div className="text-5xl" style={{ animation: "flashUp 400ms ease-out" }}>
          🗂️
        </div>
        <h2 className="mt-5 text-2xl font-bold text-emerald-900">
          학습할 카드가 없어요
        </h2>
        <p className="mt-3 text-sm text-emerald-800">
          필터 조건에 맞는 카드가 없습니다. 조건을 바꾸거나 목록에서 카드를
          선택해 보세요.
        </p>
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={onExit}
            className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:bg-zinc-50"
          >
            카드 목록 보기
          </button>
        </div>
      </div>
    );
  }

  const canPrev = pos > 0;
  const canNext = pos < deck.length - 1;
  const total = deck.length;
  const progressPct = total === 0 ? 0 : ((pos + 1) / total) * 100;
  const isFav = favorites.has(card.id);
  const prev = progress[card.id];
  // "복습 필요"로 표시된 카드 (대시보드 '오늘 복습' / 필터 '복습 필요'에 잡힘)
  const markedReview = prev?.status === "unknown";

  // 스와이프 변형
  const swipeDx = drag.dx;
  const rot = swipeDx / 26;
  const cardTransform = `translateX(${swipeDx}px) rotate(${rot}deg)`;
  const cardOpacity = 1 - Math.min(Math.abs(drag.dx) / 600, 0.5);

  function onTouchStart(e: React.TouchEvent) {
    // 스와이프는 카드 이동이므로 앞/뒷면 어디서나 가능
    const t = e.touches[0];
    dragStart.current = { x: t.clientX, y: t.clientY };
    setDrag({ dx: 0, active: true });
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!dragStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - dragStart.current.x;
    const dy = t.clientY - dragStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) setDrag({ dx, active: true });
  }
  function onTouchEnd() {
    if (!dragStart.current) return;
    const dx = drag.dx;
    dragStart.current = null;
    // 스와이프 = 카드 이동 (오른쪽 → 이전, 왼쪽 → 다음). 평가하지 않음.
    if (dx > 90) goPrev();
    else if (dx < -90) goNext();
    else setDrag({ dx: 0, active: false });
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* 상단 — 목록 / 위치 */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          ← 목록
        </button>
        <p className="text-sm font-medium text-zinc-600">
          <strong className="text-zinc-900">{pos + 1}</strong> / {total}
        </p>
      </div>
      <div
        className="mb-6 h-1.5 overflow-hidden rounded-full bg-zinc-200"
        role="progressbar"
        aria-label="카드 위치"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressPct)}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 카드 (3D flip + 스와이프) + 좌우 이동 화살표 */}
      <div className="flex items-stretch gap-2 sm:gap-3">
        <NavArrow dir="prev" disabled={!canPrev} onClick={goPrev} />
        <div className="relative min-w-0 flex-1">
          {/* 별 토글 (절대 위치, flip 외부) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(card.id);
            }}
            aria-label={isFav ? "별 표시 해제" : "별 표시"}
            className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition hover:scale-110 ${
              isFav
                ? "bg-amber-100 text-amber-500"
                : "bg-white/90 text-zinc-400 hover:bg-amber-50 hover:text-amber-400"
            }`}
          >
            <span className="text-base">{isFav ? "★" : "☆"}</span>
          </button>

          {/* 이전 학습 상태 배지 */}
          {prev && (
            <span
              className={`absolute left-4 top-4 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${
                prev.status === "known"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {prev.status === "known" ? "✓ 지난번 암기" : "↻ 다시보기 표시됨"}
            </span>
          )}

          {/* 스와이프 방향 힌트 — 카드 이동 */}
          {Math.abs(drag.dx) > 30 && (
            <div
              className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 rounded-2xl border-2 border-blue-400 px-4 py-2 text-lg font-bold text-blue-500 ${
                drag.dx > 0 ? "right-8" : "left-8"
              }`}
              style={{ opacity: Math.min(Math.abs(drag.dx) / 120, 1) }}
            >
              {drag.dx > 0 ? "← 이전" : "다음 →"}
            </div>
          )}

          <button
            type="button"
            onClick={() => setFlipped((v) => !v)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            aria-label={flipped ? "앞면으로 돌아가기" : "답 보기"}
            className="block w-full text-left [perspective:1600px]"
          >
            <div
              style={{
                transform: cardTransform,
                opacity: cardOpacity,
                transition: drag.active
                  ? "none"
                  : "transform 240ms ease-out, opacity 240ms ease-out",
              }}
            >
              <div
                key={card.id}
                className={`relative grid transition-transform duration-[520ms] [transform-style:preserve-3d] ${
                  flipped ? "[transform:rotateY(180deg)]" : ""
                }`}
                style={{
                  animation: "flashUp 280ms ease-out",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* 앞면 */}
                <div className="col-start-1 row-start-1 overflow-hidden rounded-[1.75rem] border border-zinc-200/70 bg-gradient-to-br from-white via-blue-50/40 to-violet-50/50 p-9 shadow-[0_10px_40px_-12px_rgba(59,130,246,0.25)] sm:p-14 [backface-visibility:hidden]">
                  <div className="flex items-center justify-center">
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wider text-blue-600 ring-1 ring-blue-100">
                      {card.subject} · {card.topic}
                    </span>
                  </div>
                  <div className="mt-7 flex min-h-[200px] items-center justify-center sm:min-h-[220px]">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold leading-relaxed text-zinc-900 sm:text-3xl">
                        <MathText>{card.front}</MathText>
                      </h2>
                      {card.hint && (
                        <p className="mt-5 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
                          💡 {card.hint}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="mt-4 text-center text-xs text-zinc-400">
                    카드를 누르거나 <KeyCap>Space</KeyCap> — 답 보기
                  </p>
                </div>

                {/* 뒷면 */}
                <div className="col-start-1 row-start-1 overflow-hidden rounded-[1.75rem] border border-zinc-200/70 bg-white p-9 shadow-[0_10px_40px_-12px_rgba(139,92,246,0.22)] sm:p-14 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wider text-blue-600">
                    {card.subject} · {card.topic}
                  </span>
                  <p className="mt-5 text-xs font-bold tracking-[0.18em] text-blue-600">
                    답
                  </p>
                  <div className="mt-2.5 whitespace-pre-line text-lg leading-9 text-zinc-900 sm:text-xl">
                    <MathText>{card.back}</MathText>
                  </div>

                  {card.example && (
                    <div className="mt-7 rounded-2xl bg-gradient-to-br from-amber-50 to-white p-5 ring-1 ring-amber-100">
                      <p className="text-xs font-bold tracking-wider text-amber-700">
                        예제
                      </p>
                      <p className="mt-2 text-sm leading-7 text-zinc-800 sm:text-base">
                        <MathText>{card.example.question}</MathText>
                      </p>
                      <p className="mt-3 text-xs font-bold tracking-wider text-emerald-700">
                        정답
                      </p>
                      <p className="mt-1 text-sm font-semibold text-emerald-700 sm:text-base">
                        <MathText>{card.example.answer}</MathText>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        </div>
        <NavArrow dir="next" disabled={!canNext} onClick={goNext} />
      </div>

      {/* 액션 — 즐겨찾기 / 복습하기 (카드는 그대로, 이동은 좌우 화살표) */}
      {flipped ? (
        <div
          className="mt-6"
          style={{ animation: "flashUp 280ms ease-out 200ms backwards" }}
        >
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onToggleFavorite(card.id)}
              aria-pressed={isFav}
              className={`rounded-2xl border-2 px-6 py-5 text-base font-semibold shadow-sm transition hover:-translate-y-0.5 ${
                isFav
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-amber-300 hover:bg-amber-50"
              }`}
            >
              {isFav ? "★ 즐겨찾기됨" : "☆ 즐겨찾기"}
              <KeyCap className="ml-2 border-amber-200 text-amber-500">F</KeyCap>
            </button>
            <button
              type="button"
              onClick={() =>
                onRate(card.id, markedReview ? "known" : "unknown")
              }
              aria-pressed={markedReview}
              className={`rounded-2xl border-2 px-6 py-5 text-base font-semibold shadow-sm transition hover:-translate-y-0.5 ${
                markedReview
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              {markedReview ? "🔁 다시보기 목록에 있음" : "🔁 다시보기"}
              <KeyCap className="ml-2 border-blue-200 text-blue-500">R</KeyCap>
            </button>
          </div>

          {/* 기능 설명 */}
          <div className="mt-3 grid gap-2.5 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 text-[13px] leading-6 text-zinc-600 sm:grid-cols-2">
            <p>
              <strong className="text-amber-700">★ 즐겨찾기</strong> — 다시 보고
              싶은 카드를 모아둡니다. 필터의{" "}
              <span className="font-semibold text-zinc-800">‘별 카드’</span>{" "}
              토글로 즐겨찾기한 카드만 골라 볼 수 있어요.
            </p>
            <p className="sm:border-l sm:border-zinc-200 sm:pl-4">
              <strong className="text-blue-700">🔁 다시보기</strong> — 헷갈리는
              카드를 다시보기 목록에 넣습니다. 대시보드의{" "}
              <span className="font-semibold text-zinc-800">‘오늘 다시보기’</span>{" "}
              · 필터의{" "}
              <span className="font-semibold text-zinc-800">‘다시보기’</span>
              에 잡혀 다시 출제됩니다. 한 번 더 누르면 목록에서 빠집니다.
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-center text-xs text-zinc-400">
          <KeyCap>←</KeyCap>/<KeyCap>→</KeyCap> 이전·다음 카드 ·{" "}
          <KeyCap>Space</KeyCap> 뒤집기 · <KeyCap>F</KeyCap> 즐겨찾기 ·{" "}
          <KeyCap>R</KeyCap> 다시보기 · 모바일은 좌우로 스와이프
        </p>
      )}
    </div>
  );
}

function KeyCap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={`inline-flex min-w-[1.4rem] items-center justify-center rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-500 ${className}`}
    >
      {children}
    </kbd>
  );
}

function NavArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const isPrev = dir === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "이전 카드" : "다음 카드"}
      className="flex w-9 shrink-0 items-center justify-center self-center rounded-2xl border border-zinc-200 bg-white text-xl font-bold text-zinc-500 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0 disabled:hover:border-zinc-200 disabled:hover:text-zinc-500 sm:w-12"
      style={{ minHeight: "9rem" }}
    >
      <span aria-hidden>{isPrev ? "◀" : "▶"}</span>
    </button>
  );
}
