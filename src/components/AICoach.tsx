"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  collectLearnerSnapshot,
  snapshotToPrompt,
} from "@/lib/ai/context";
import { checkAndIncrement, getRemaining } from "@/lib/ai/rateLimit";
import { InlineMath } from "@/components/Math";

const SUGGESTED_PROMPTS = [
  "오늘 뭐 공부할까요?",
  "RLC 직렬 공진 쉽게 설명해줘",
  "변압기 효율 시험에 어떻게 나와?",
  "약점 분석해줘",
];

// 답변 직후 노출되는 후속 질문 칩
const FOLLOW_UPS: { emoji: string; label: string; text: string }[] = [
  { emoji: "📐", label: "예제 보여줘", text: "예제 보여줘" },
  { emoji: "🔍", label: "더 자세히", text: "더 자세히 설명해줘" },
  { emoji: "📝", label: "시험엔?", text: "시험에는 어떻게 나와?" },
  { emoji: "🔗", label: "관련 도구", text: "관련 시뮬레이터나 카드 추천해줘" },
];

const HINT_KEY = "ai-coach-hint-seen";

export default function AICoach() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [learnerSummary, setLearnerSummary] = useState(
    "(아직 학습 기록 분석 안 됨)"
  );
  const [remaining, setRemaining] = useState<number | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 첫 방문자에게 힌트 노출 (한 번만)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(HINT_KEY)) return;
    const showT = window.setTimeout(() => setShowHint(true), 2200);
    const hideT = window.setTimeout(() => {
      setShowHint(false);
      localStorage.setItem(HINT_KEY, "1");
    }, 32000);
    return () => {
      window.clearTimeout(showT);
      window.clearTimeout(hideT);
    };
  }, []);

  // 챗 열면 힌트 영구 숨김
  useEffect(() => {
    if (open && showHint) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage 영구 저장과 함께 한 번만 적용
      setShowHint(false);
      localStorage.setItem(HINT_KEY, "1");
    }
  }, [open, showHint]);

  function dismissHint() {
    setShowHint(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(HINT_KEY, "1");
    }
  }

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/coach",
        body: () => ({ learnerSummary }),
      }),
    [learnerSummary]
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  useEffect(() => {
    if (open) {
      const snap = collectLearnerSnapshot();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage에서 학습 스냅샷 읽어와 동기화
      setLearnerSummary(snapshotToPrompt(snap));
      setRemaining(getRemaining());
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  function handleSend(text: string) {
    const t = text.trim();
    if (!t) return;
    const check = checkAndIncrement();
    if (!check.ok) {
      setBlocked(true);
      return;
    }
    setRemaining(check.remaining);
    sendMessage({ text: t });
    setInput("");
  }

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <>
      {/* 첫 방문자 가이드 말풍선 */}
      {!open && showHint && (
        <div
          className="fixed bottom-9 right-24 z-40 select-none"
          style={{
            animation:
              "hintEnter 400ms ease-out, hintBob 2.6s ease-in-out 400ms infinite",
          }}
        >
          <button
            type="button"
            onClick={() => {
              dismissHint();
              setOpen(true);
            }}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-4 py-2.5 pr-8 text-sm font-bold text-white shadow-2xl ring-2 ring-white/40 transition hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span className="text-base">✨</span>
              <span>AI 학습 코치를 이용해보세요</span>
            </span>
            {/* 빛 통과 셔머 */}
            <span
              aria-hidden="true"
              className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              style={{
                animation: "shimmerSlide 2.6s ease-in-out infinite",
              }}
            />
            {/* 풍선 꼬리 (오른쪽 → AI 버튼 방향) */}
            <span
              aria-hidden="true"
              className="absolute right-[-6px] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-gradient-to-br from-pink-500 to-pink-500"
            />
          </button>
          {/* 닫기 버튼 */}
          <button
            type="button"
            onClick={dismissHint}
            aria-label="가이드 닫기"
            className="absolute -top-1.5 -left-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-zinc-600 shadow-md ring-1 ring-zinc-200 hover:bg-zinc-50 hover:text-zinc-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* 떠있는 버튼 */}
      <button
        type="button"
        onClick={() => {
          dismissHint();
          setOpen((v) => !v);
        }}
        aria-label="AI 학습 코치 열기"
        className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-2xl text-white shadow-2xl ring-4 ring-violet-200/40 transition-all hover:scale-110 hover:shadow-violet-300 ${
          open ? "rotate-12" : ""
        } ${showHint && !open ? "animate-pulse" : ""}`}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* 채팅 패널 */}
      <div
        className={`fixed bottom-24 right-6 z-40 flex w-[calc(100vw-3rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl transition-all ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{ height: "min(580px, calc(100vh - 8rem))" }}
        aria-hidden={!open}
      >
        {/* 헤더 */}
        <header className="flex items-center justify-between border-b border-zinc-100 bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-3 text-white">
          <div>
            <p className="text-xs font-semibold tracking-wide text-violet-100">
              AI · Gemini 2.5 Flash
            </p>
            <h2 className="text-base font-bold">학습 코치</h2>
          </div>
          {remaining !== null && (
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold backdrop-blur">
              오늘 {remaining}회 남음
            </span>
          )}
        </header>

        {/* 메시지 영역 */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto bg-zinc-50 px-4 py-4"
        >
          {messages.length === 0 && (
            <WelcomeMessage onPick={(t) => handleSend(t)} />
          )}

          {messages.map((m) => (
            <MessageBubble key={m.id} role={m.role}>
              {m.parts.map((part, i) =>
                part.type === "text" ? (
                  <span key={i}>{part.text}</span>
                ) : null
              )}
            </MessageBubble>
          ))}

          {isLoading && (
            <MessageBubble role="assistant">
              <TypingIndicator />
            </MessageBubble>
          )}

          {/* 답변 끝난 직후 후속 질문 칩 */}
          {!isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "assistant" && (
              <FollowUpChips onPick={handleSend} />
            )}

          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              ⚠ AI 응답 실패. API 키 또는 네트워크를 확인해주세요.
            </div>
          )}

          {blocked && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              오늘 호출 한도(50회)를 모두 사용했어요. 내일 다시 시도해주세요.
            </div>
          )}
        </div>

        {/* 입력 영역 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="border-t border-zinc-100 bg-white p-3"
        >
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="궁금한 거 물어보세요…"
              rows={1}
              disabled={isLoading || blocked}
              className="max-h-24 min-h-[2.5rem] flex-1 resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400 focus:bg-white focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || blocked}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md transition hover:shadow-lg disabled:opacity-40"
              aria-label="전송"
            >
              ↑
            </button>
          </div>
          <p className="mt-1.5 text-[10px] text-zinc-400">
            Enter로 전송 · Shift+Enter로 줄바꿈
          </p>
        </form>
      </div>
    </>
  );
}

function WelcomeMessage({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm leading-6 text-zinc-800">
          안녕하세요! <strong>전기기능사 학습 코치</strong>예요. 🎓
        </p>
        <p className="mt-1.5 text-xs leading-5 text-zinc-600">
          개념 질문, 학습 추천, 문제 해설 등 무엇이든 물어보세요. 학습 기록을
          참고해 맞춤 답변 드립니다.
        </p>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        추천 질문
      </p>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPick(p)}
            className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs text-violet-700 transition hover:border-violet-400 hover:bg-violet-50"
          >
            {p}
          </button>
        ))}
      </div>
      <div className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-900">
        💡 채팅창은 추천일 뿐, 정답은 교재와 시뮬레이터에서 확인하세요.
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  children,
}: {
  role: "user" | "assistant" | "system";
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-6 shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
            : "border border-zinc-100 bg-white text-zinc-800"
        }`}
      >
        {!isUser ? (
          <FormattedAssistantText>
            {flattenText(children)}
          </FormattedAssistantText>
        ) : (
          <div className="whitespace-pre-wrap">{children}</div>
        )}
      </div>
    </div>
  );
}

function flattenText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(flattenText).join("");
  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    children.props &&
    typeof children.props === "object" &&
    "children" in children.props
  ) {
    return flattenText(children.props.children as React.ReactNode);
  }
  return "";
}

/**
 * AI 답변 마크다운(간단 버전):
 * - [텍스트](경로) → Next Link
 * - **굵게** → strong
 * - 줄바꿈 유지
 */
function FormattedAssistantText({ children }: { children: string }) {
  const lines = children.split("\n");
  return (
    <div className="whitespace-pre-wrap break-words">
      {lines.map((line, i) => (
        <div key={i}>
          {parseInline(line)}
          {i < lines.length - 1 && <br />}
        </div>
      ))}
    </div>
  );
}

function parseInline(text: string): React.ReactNode {
  // $...$ 수식을 먼저 분리, 나머지는 링크/굵게 처리
  const parts = text.split(/(\$[^$\n]+\$)/g);
  const out: React.ReactNode[] = [];
  parts.forEach((part, idx) => {
    if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
      out.push(<InlineMath key={`m${idx}`}>{part.slice(1, -1)}</InlineMath>);
    } else if (part) {
      out.push(parseLinksAndBold(part, `t${idx}`));
    }
  });
  return out;
}

function parseLinksAndBold(text: string, baseKey: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  let key = 0;
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(text)) !== null) {
    if (m.index > lastIdx) {
      out.push(parseBold(text.slice(lastIdx, m.index), `${baseKey}-b${key++}`));
    }
    const href = m[2];
    const isInternal = href.startsWith("/");
    if (isInternal) {
      out.push(
        <Link
          key={`${baseKey}-l${key++}`}
          href={href}
          className="font-semibold text-violet-700 underline underline-offset-2 hover:text-violet-900"
        >
          {m[1]}
        </Link>
      );
    } else {
      out.push(
        <a
          key={`${baseKey}-l${key++}`}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-violet-700 underline underline-offset-2 hover:text-violet-900"
        >
          {m[1]}
        </a>
      );
    }
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) {
    out.push(parseBold(text.slice(lastIdx), `${baseKey}-b${key++}`));
  }
  return out;
}

function parseBold(text: string, baseKey: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <strong key={`${baseKey}-${k++}`} className="font-bold">
        {m[1]}
      </strong>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 0 ? text : parts;
}

function FollowUpChips({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div
      className="flex flex-wrap gap-1.5 pl-1"
      style={{ animation: "flashUp 250ms ease-out 100ms backwards" }}
    >
      <p className="w-full text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        이어서 물어보기
      </p>
      {FOLLOW_UPS.map((f) => (
        <button
          key={f.label}
          type="button"
          onClick={() => onPick(f.text)}
          className="flex items-center gap-1 rounded-full border border-violet-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-violet-700 transition hover:border-violet-400 hover:bg-violet-50 hover:shadow-sm"
        >
          <span>{f.emoji}</span>
          <span>{f.label}</span>
        </button>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 [animation-delay:300ms]" />
    </div>
  );
}
