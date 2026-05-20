"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Flashcard } from "@/lib/flashcards/types";
import { MathText } from "@/components/Math";
import { getExample } from "@/lib/flashcards/example";
import {
  type ProgressMap,
  type CardStatus,
} from "@/lib/flashcards/favorites";

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

type NavAnim = { phase: "out" | "in"; dir: "next" | "prev" } | null;

function getNavAnimation(anim: NavAnim, outMs: number, inMs: number): string | undefined {
  if (!anim) return undefined;
  const exitEase = "cubic-bezier(0.55, 0, 0.55, 0.2)";
  const enterEase = "cubic-bezier(0.22, 1, 0.36, 1)";
  if (anim.phase === "out") {
    return anim.dir === "next"
      ? `cardExitLeft ${outMs}ms ${exitEase} forwards`
      : `cardExitRight ${outMs}ms ${exitEase} forwards`;
  }
  return anim.dir === "next"
    ? `cardEnterRight ${inMs}ms ${enterEase}`
    : `cardEnterLeft ${inMs}ms ${enterEase}`;
}

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
  // 점프 컨트롤 — 슬라이더 드래그 중 미리보기 / 숫자 입력 값
  const [jumpInput, setJumpInput] = useState("");
  const [sliderPreview, setSliderPreview] = useState<number | null>(null);
  const jumpInputRef = useRef<HTMLInputElement | null>(null);
  // 예제 패널 펼침 (카드별로 초기화)
  const [exampleOpen, setExampleOpen] = useState(false);
  // 좌우 페이지 트랜지션 — out 단계에서는 현재 카드가 화면 밖으로,
  // in 단계에서는 새 카드가 반대편에서 들어온다. null 이면 정적 상태.
  const [navAnim, setNavAnim] = useState<{
    phase: "out" | "in";
    dir: "next" | "prev";
  } | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const NAV_OUT_MS = 220;
  const NAV_IN_MS = 260;

  useEffect(() => {
    // 덱(필터·셔플 결과)이 바뀌면 처음 카드부터 다시 본다.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deck prop 변경 시 학습 위치 초기화
    setPos(0);
    setFlipped(false);
    setDrag({ dx: 0, active: false });
    setJumpInput("");
    setSliderPreview(null);
  }, [deck]);

  const card = deck[pos];

  // 모든 카드에 예제가 노출되도록 fallback 적용 (id 기반 deterministic)
  const effectiveExample = useMemo(
    () => (card ? getExample(card) : null),
    [card],
  );

  // 카드가 바뀌면 예제 패널 닫기
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 카드 변경 시 예제 패널 초기화
    setExampleOpen(false);
  }, [card?.id]);

  /**
   * 2단계 슬라이드 트랜지션: out (현재 카드 날아감) → pos 변경 → in (새 카드 들어옴).
   * 트랜지션 중 중복 호출은 무시(이전 타이머 취소 후 즉시 새 방향으로 재시작).
   */
  function navigateTo(targetPos: number, dir: "next" | "prev") {
    if (deck.length === 0) return;
    const next = clamp(targetPos, 0, deck.length - 1);
    if (next === pos) return;
    // 진행 중인 타이머 취소
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    setDrag({ dx: 0, active: false });
    setNavAnim({ phase: "out", dir });
    navTimerRef.current = setTimeout(() => {
      setPos(next);
      setFlipped(false);
      setNavAnim({ phase: "in", dir });
      navTimerRef.current = setTimeout(() => {
        setNavAnim(null);
        navTimerRef.current = null;
      }, NAV_IN_MS);
    }, NAV_OUT_MS);
  }

  function goPrev() {
    if (pos <= 0) return;
    navigateTo(pos - 1, "prev");
  }

  function goNext() {
    if (pos >= deck.length - 1) return;
    navigateTo(pos + 1, "next");
  }

  function jumpTo(target1Based: number) {
    if (deck.length === 0) return;
    const target = clamp(Math.floor(target1Based) - 1, 0, deck.length - 1);
    setJumpInput("");
    setSliderPreview(null);
    if (target === pos) return;
    navigateTo(target, target > pos ? "next" : "prev");
  }

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  function submitJump() {
    const v = parseInt(jumpInput, 10);
    if (Number.isFinite(v)) jumpTo(v);
  }

  function onProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    if (deck.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const target = Math.round(ratio * (deck.length - 1)) + 1;
    jumpTo(target);
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
      } else if (e.key.toLowerCase() === "g" && deck.length > 0) {
        e.preventDefault();
        jumpInputRef.current?.focus();
        jumpInputRef.current?.select();
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
      {/* 상단 — 목록 / 위치 / 점프 */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          ← 목록
        </button>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-zinc-600">
            <strong className="text-zinc-900">
              {sliderPreview ?? pos + 1}
            </strong>{" "}
            / {total}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitJump();
            }}
            className="flex items-center gap-1.5"
          >
            <input
              ref={jumpInputRef}
              type="number"
              min={1}
              max={total}
              inputMode="numeric"
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              placeholder="번호"
              aria-label={`카드 번호로 이동 (1 ~ ${total})`}
              className="h-8 w-20 rounded-lg border border-zinc-300 bg-white px-2 text-sm text-zinc-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              disabled={!jumpInput.trim()}
              className="h-8 rounded-lg border border-blue-300 bg-blue-50 px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              이동
            </button>
            <KeyCap className="hidden sm:inline-flex">G</KeyCap>
          </form>
        </div>
      </div>

      {/* 진행률 바 — 클릭 점프 + 슬라이더 오버레이 */}
      <div className="relative mb-6">
        <div
          onClick={onProgressClick}
          className="h-2 cursor-pointer overflow-hidden rounded-full bg-zinc-200 transition hover:h-2.5"
          role="progressbar"
          aria-label="카드 위치 (클릭해서 이동)"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPct)}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300"
            style={{
              width: `${
                sliderPreview != null
                  ? (sliderPreview / total) * 100
                  : progressPct
              }%`,
            }}
          />
        </div>
        <input
          type="range"
          min={1}
          max={total}
          step={1}
          value={sliderPreview ?? pos + 1}
          onChange={(e) => setSliderPreview(Number(e.target.value))}
          onMouseUp={() => {
            if (sliderPreview != null) jumpTo(sliderPreview);
          }}
          onTouchEnd={() => {
            if (sliderPreview != null) jumpTo(sliderPreview);
          }}
          onKeyUp={() => {
            if (sliderPreview != null) jumpTo(sliderPreview);
          }}
          aria-label="슬라이더로 카드 위치 이동"
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
        />
      </div>

      {/* 카드 (3D flip + 스와이프) + 좌우 이동 화살표
          — 방안 A: 카드 영역을 일정한 min-height 로 고정하여
            카드를 뒤집거나 카드별 텍스트 길이가 달라도 아래
            대시보드/학습가이드 위치가 흔들리지 않게 한다. */}
      <section
        aria-label="카드 학습 영역"
        className="flex items-stretch gap-2 sm:gap-3 min-h-[440px] sm:min-h-[520px]"
      >
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
            className="block h-full w-full text-left [perspective:1600px]"
          >
            <div
              className="h-full"
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
                className={`relative grid h-full min-h-[440px] sm:min-h-[520px] transition-transform duration-[520ms] [transform-style:preserve-3d] ${
                  flipped ? "[transform:rotateY(180deg)]" : ""
                }`}
                style={{
                  animation: getNavAnimation(navAnim, NAV_OUT_MS, NAV_IN_MS),
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* 앞면 — 카드 면적 고정. 내용은 세로 중앙 정렬, 텍스트가 길면 스크롤. */}
                <div className="col-start-1 row-start-1 flex h-full min-h-[440px] sm:min-h-[520px] flex-col overflow-hidden rounded-[1.75rem] border border-zinc-200/70 bg-gradient-to-br from-white via-blue-50/40 to-violet-50/50 p-9 shadow-[0_10px_40px_-12px_rgba(59,130,246,0.25)] sm:p-14 [backface-visibility:hidden]">
                  <div className="flex items-center justify-center">
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wider text-blue-600 ring-1 ring-blue-100">
                      {card.subject} · {card.topic}
                    </span>
                  </div>
                  <div className="mt-7 flex flex-1 items-center justify-center overflow-y-auto">
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

                {/* 뒷면 — 앞면과 동일 면적, 내용이 길면 내부 스크롤 */}
                <div className="col-start-1 row-start-1 flex h-full min-h-[440px] sm:min-h-[520px] flex-col overflow-hidden rounded-[1.75rem] border border-zinc-200/70 bg-white p-9 shadow-[0_10px_40px_-12px_rgba(139,92,246,0.22)] sm:p-14 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="inline-block self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wider text-blue-600">
                    {card.subject} · {card.topic}
                  </span>
                  <p className="mt-5 text-xs font-bold tracking-[0.18em] text-blue-600">
                    답
                  </p>
                  <div className="mt-2.5 flex-1 overflow-y-auto whitespace-pre-line text-lg leading-9 text-zinc-900 sm:text-xl">
                    <MathText>{card.back}</MathText>
                  </div>

                  {effectiveExample && (
                    <p className="mt-5 text-xs text-amber-700">
                      📝 카드 아래{" "}
                      <span className="font-semibold">‘예제로 확인하기’</span>
                      로 한 번 더 점검해 보세요.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </button>
        </div>
        <NavArrow dir="next" disabled={!canNext} onClick={goNext} />
      </section>

      {/* 예제 패널 — 질문 → 풀이 단계 → 정답.
          카드 영역(고정 높이) 바깥에 있어 토글로 펼쳐도 카드 위 위치는 그대로 유지된다. */}
      {effectiveExample && (
        <div
          className="mt-6 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-sm"
          style={{ animation: "flashUp 320ms ease-out" }}
        >
          <button
            type="button"
            onClick={() => setExampleOpen((v) => !v)}
            aria-expanded={exampleOpen}
            className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition hover:bg-amber-100/40"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">📝</span>
              <span className="text-sm font-bold tracking-wider text-amber-800">
                예제로 확인하기
              </span>
              {!card.example && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  자동 생성
                </span>
              )}
            </span>
            <span
              aria-hidden
              className={`text-amber-600 transition-transform duration-300 ${
                exampleOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
          {exampleOpen && (
            <div
              className="space-y-4 border-t border-amber-200/70 px-5 py-5"
              style={{ animation: "flashUp 260ms ease-out" }}
            >
              <section>
                <p className="text-[11px] font-bold tracking-[0.18em] text-amber-700">
                  📝 질문
                </p>
                <p className="mt-2 text-sm leading-7 text-zinc-800 sm:text-base">
                  <MathText>{effectiveExample.question}</MathText>
                </p>
              </section>

              {effectiveExample.solution.length > 0 && (
                <section>
                  <p className="text-[11px] font-bold tracking-[0.18em] text-blue-700">
                    🧮 풀이
                  </p>
                  <ol className="mt-2 space-y-2">
                    {effectiveExample.solution.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 rounded-xl bg-white/70 px-3 py-2 ring-1 ring-blue-100"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1 text-sm leading-7 text-zinc-800 sm:text-base">
                          <MathText>{step}</MathText>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              <section className="rounded-xl bg-emerald-50/80 px-4 py-3 ring-1 ring-emerald-200">
                <p className="text-[11px] font-bold tracking-[0.18em] text-emerald-700">
                  ✅ 정답
                </p>
                <p className="mt-1.5 text-sm font-semibold text-emerald-800 sm:text-base">
                  <MathText>{effectiveExample.answer}</MathText>
                </p>
              </section>
            </div>
          )}
        </div>
      )}

      {/* 액션 — 즐겨찾기 / 복습하기 (앞·뒷면 모두 표시 — 앞면만 보고도 결정할 수 있도록) */}
      <div className="mt-6">
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

        {/* 기능 설명 — 뒷면일 때만(앞면에선 카드 가독성 우선) */}
        {flipped && (
          <div
            className="mt-3 grid gap-2.5 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 text-[13px] leading-6 text-zinc-600 sm:grid-cols-2"
            style={{ animation: "flashUp 280ms ease-out 200ms backwards" }}
          >
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
        )}

        {!flipped && (
          <p className="mt-3 text-center text-xs text-zinc-400">
            <KeyCap>←</KeyCap>/<KeyCap>→</KeyCap> 이전·다음 ·{" "}
            <KeyCap>Space</KeyCap> 뒤집기 · <KeyCap>G</KeyCap> 번호로 이동 ·{" "}
            <KeyCap>F</KeyCap> 즐겨찾기 · <KeyCap>R</KeyCap> 다시보기 · 모바일은
            좌우로 스와이프
          </p>
        )}
      </div>
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
