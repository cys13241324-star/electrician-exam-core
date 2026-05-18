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
  onReplayUnknown: (ids: string[]) => void;
};

type Snapshot = {
  queue: Flashcard[];
  pos: number;
  done: number;
  unknownIds: string[];
};

export default function CardStudy({
  deck,
  favorites,
  progress,
  onToggleFavorite,
  onRate,
  onExit,
  onReplayUnknown,
}: Props) {
  const [queue, setQueue] = useState<Flashcard[]>(deck);
  // 현재 보고 있는 큐 내 위치 (좌/우 이동의 기준)
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);
  const [unknownIds, setUnknownIds] = useState<string[]>([]);
  const [history, setHistory] = useState<Snapshot[]>([]);
  // 떠나는 카드 애니메이션 방향 (-1 모름 / 1 알겠음 / 0 없음)
  const [leaving, setLeaving] = useState<-1 | 0 | 1>(0);
  // 터치 스와이프
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [drag, setDrag] = useState({ dx: 0, active: false });

  useEffect(() => {
    // TODO(refactor): deck 변경 시 전체 리셋은 부모에서 key={deck.id} 로 unmount/remount 처리 권장
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deck prop 변경 시 학습 상태 초기화 (필터·셔플 변경 흡수)
    setQueue(deck);
    setPos(0);
    setFlipped(false);
    setDone(0);
    setUnknownIds([]);
    setHistory([]);
    setLeaving(0);
    setDrag({ dx: 0, active: false });
  }, [deck]);

  const card = queue[pos];

  function goPrev() {
    if (leaving !== 0 || pos <= 0) return;
    setPos((p) => Math.max(0, p - 1));
    setFlipped(false);
    setDrag({ dx: 0, active: false });
  }

  function goNext() {
    if (leaving !== 0 || pos >= queue.length - 1) return;
    setPos((p) => Math.min(queue.length - 1, p + 1));
    setFlipped(false);
    setDrag({ dx: 0, active: false });
  }

  function rate(result: CardStatus) {
    if (!card || leaving !== 0) return;
    setHistory((h) => [...h, { queue, pos, done, unknownIds }]);
    onRate(card.id, result);
    setLeaving(result === "known" ? 1 : -1);

    // 떠나는 애니메이션 후 큐 갱신
    window.setTimeout(() => {
      if (result === "unknown") {
        setUnknownIds((arr) =>
          arr.includes(card.id) ? arr : [...arr, card.id],
        );
        // 현재 카드를 큐 맨 뒤로 보냄. 큐 길이는 그대로이므로
        // pos 를 직접 보정해 "다음 카드"를 가리키게 한다.
        setQueue((q) => {
          const cur = q[pos];
          if (!cur) return q;
          const rest = [...q.slice(0, pos), ...q.slice(pos + 1)];
          return [...rest, cur];
        });
        setPos((p) => (p >= queue.length - 1 ? 0 : p));
      } else {
        // 현재 카드 제거. pos 는 그대로 두면 다음 카드를 가리킴.
        setQueue((q) => [...q.slice(0, pos), ...q.slice(pos + 1)]);
      }
      setDone((d) => d + 1);
      setFlipped(false);
      setLeaving(0);
      setDrag({ dx: 0, active: false });
    }, 220);
  }

  // 큐 길이가 바뀌어 pos 가 범위를 벗어나면 마지막 카드로 보정
  useEffect(() => {
    if (queue.length === 0) {
      if (pos !== 0) setPos(0);
    } else if (pos > queue.length - 1) {
      setPos(queue.length - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length]);

  function undo() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const last = h[h.length - 1];
      setQueue(last.queue);
      setPos(last.pos);
      setDone(last.done);
      setUnknownIds(last.unknownIds);
      setFlipped(false);
      setLeaving(0);
      return h.slice(0, -1);
    });
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
      } else if (e.key === "1" && flipped) {
        rate("unknown");
      } else if (e.key === "2" && flipped) {
        rate("known");
      } else if (e.key.toLowerCase() === "z" && history.length > 0) {
        undo();
      } else if (e.key.toLowerCase() === "f" && card) {
        onToggleFavorite(card.id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, queue, history, card, pos, leaving]);

  // ---- 완료 화면 ----
  if (!card) {
    const reviewed = done > 0 || unknownIds.length > 0;
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-10 text-center shadow-sm">
        <div className="text-5xl" style={{ animation: "flashUp 400ms ease-out" }}>
          {reviewed ? "🎉" : "🗂️"}
        </div>
        <h2 className="mt-5 text-2xl font-bold text-emerald-900">
          {reviewed ? "이번 세션을 모두 끝냈어요" : "학습할 카드가 없어요"}
        </h2>
        {reviewed ? (
          <p className="mt-3 text-emerald-800">
            총 <span className="font-semibold">{done}회</span> 응답 ·{" "}
            <span className="font-semibold">
              모르겠음 {unknownIds.length}장
            </span>
          </p>
        ) : (
          <p className="mt-3 text-sm text-emerald-800">
            필터 조건에 맞는 카드가 없습니다. 조건을 바꾸거나 목록에서 카드를
            선택해 보세요.
          </p>
        )}
        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {unknownIds.length > 0 && (
            <button
              type="button"
              onClick={() => onReplayUnknown(unknownIds)}
              className="rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-600"
            >
              모르겠다 한 {unknownIds.length}장 다시 풀기 →
            </button>
          )}
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

  const remaining = queue.length;
  const canPrev = pos > 0;
  const canNext = pos < queue.length - 1;
  const total = deck.length;
  const progressPct = Math.min(100, (done / Math.max(total, 1)) * 100);
  const isFav = favorites.has(card.id);
  const prev = progress[card.id];

  // 스와이프/떠남 변형
  const swipeDx = leaving !== 0 ? leaving * 520 : drag.dx;
  const rot = swipeDx / 26;
  const cardTransform = `translateX(${swipeDx}px) rotate(${rot}deg)`;
  const cardOpacity = leaving !== 0 ? 0 : 1 - Math.min(Math.abs(drag.dx) / 600, 0.5);

  function onTouchStart(e: React.TouchEvent) {
    if (!flipped) return;
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
    if (dx > 90) rate("known");
    else if (dx < -90) rate("unknown");
    else setDrag({ dx: 0, active: false });
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* 상단 진행률 */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          ← 목록
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={history.length === 0}
            className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↶ 되돌리기
          </button>
          <p className="text-sm font-medium text-zinc-600">
            남은 <strong className="text-zinc-900">{remaining}</strong> · 응답{" "}
            {done}
          </p>
        </div>
      </div>
      <div
        className="mb-6 h-1.5 overflow-hidden rounded-full bg-zinc-200"
        role="progressbar"
        aria-label="학습 진도"
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
        <NavArrow
          dir="prev"
          disabled={!canPrev}
          onClick={goPrev}
        />
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
        {prev && leaving === 0 && (
          <span
            className={`absolute left-4 top-4 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${
              prev.status === "known"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {prev.status === "known" ? "✓ 지난번 암기" : "↻ 지난번 헷갈림"}
          </span>
        )}

        {/* 스와이프 방향 힌트 */}
        {flipped && Math.abs(drag.dx) > 30 && (
          <div
            className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 rounded-2xl border-2 px-4 py-2 text-lg font-bold ${
              drag.dx > 0
                ? "right-8 border-blue-400 text-blue-500"
                : "left-8 border-rose-400 text-rose-500"
            }`}
            style={{ opacity: Math.min(Math.abs(drag.dx) / 120, 1) }}
          >
            {drag.dx > 0 ? "알겠음 🙂" : "😣 모르겠음"}
          </div>
        )}

        <button
          type="button"
          onClick={() => leaving === 0 && setFlipped((v) => !v)}
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
        <NavArrow
          dir="next"
          disabled={!canNext}
          onClick={goNext}
        />
      </div>

      {/* 카드 위치 표시 */}
      <p className="mt-3 text-center text-xs font-medium text-zinc-500">
        <strong className="text-zinc-800">{pos + 1}</strong> / {queue.length}
      </p>

      {/* 액션 */}
      {flipped ? (
        <div
          className="mt-6 grid grid-cols-2 gap-3"
          style={{ animation: "flashUp 280ms ease-out 200ms backwards" }}
        >
          <button
            type="button"
            onClick={() => rate("unknown")}
            className="group rounded-2xl border-2 border-rose-200 bg-white px-6 py-5 text-base font-semibold text-rose-600 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50"
          >
            😣 모르겠음
            <KeyCap className="ml-2 border-rose-200 text-rose-400">1</KeyCap>
          </button>
          <button
            type="button"
            onClick={() => rate("known")}
            className="rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 px-6 py-5 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:from-blue-600 hover:to-violet-600"
          >
            🙂 알겠음
            <KeyCap className="ml-2 border-white/40 text-white/80">2</KeyCap>
          </button>
        </div>
      ) : (
        <p className="mt-6 text-center text-xs text-zinc-400">
          <KeyCap>←</KeyCap>/<KeyCap>→</KeyCap> 이전·다음 카드 ·{" "}
          <KeyCap>Space</KeyCap> 뒤집기 · <KeyCap>1</KeyCap>/<KeyCap>2</KeyCap>{" "}
          평가 · <KeyCap>Z</KeyCap> 되돌리기 · <KeyCap>F</KeyCap> 즐겨찾기 ·
          모바일은 좌우로 스와이프
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
