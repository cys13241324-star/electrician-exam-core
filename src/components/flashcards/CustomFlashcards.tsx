"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ALL_SUBJECTS } from "@/lib/flashcards/chapters";
import type { Subject } from "@/lib/flashcards/types";
import {
  addCustomCard,
  loadCustomCards,
  removeCustomCard,
  updateCustomCard,
  type CustomCard,
  type CustomCardDraft,
} from "@/lib/flashcards/custom";
import { MathText } from "@/components/Math";
import FlashcardApp from "./FlashcardApp";
import MathInputHelper from "./MathInputHelper";

type Mode = "manage" | "study";

const EMPTY_DRAFT: CustomCardDraft = {
  front: "",
  back: "",
  subject: "전기이론",
  topic: "",
  hint: "",
};

export default function CustomFlashcards() {
  const [cards, setCards] = useState<CustomCard[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<Mode>("manage");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<CustomCardDraft>(EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const frontRef = useRef<HTMLTextAreaElement | null>(null);
  const backRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage 하이드레이션
    setCards(loadCustomCards());
    setHydrated(true);
  }, []);

  const groupedBySubject = useMemo(() => {
    const map: Record<Subject, CustomCard[]> = {
      전기이론: [],
      전기기기: [],
      전기설비: [],
    };
    for (const c of cards) map[c.subject].push(c);
    return map;
  }, [cards]);

  function startEdit(card: CustomCard) {
    setEditing(card.id);
    setDraft({
      front: card.front,
      back: card.back,
      subject: card.subject,
      topic: card.topic,
      hint: card.hint ?? "",
    });
    setError(null);
    requestAnimationFrame(() => {
      document
        .getElementById("custom-card-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function cancelEdit() {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
    setError(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const front = draft.front.trim();
    const back = draft.back.trim();
    if (!front || !back) {
      setError("앞면과 뒷면을 모두 입력해주세요.");
      return;
    }
    if (editing) {
      setCards((prev) => updateCustomCard(prev, editing, draft));
    } else {
      setCards((prev) => addCustomCard(prev, draft));
    }
    setDraft(EMPTY_DRAFT);
    setEditing(null);
    setError(null);
  }

  function remove(id: string) {
    if (!confirm("이 카드를 삭제할까요?")) return;
    setCards((prev) => removeCustomCard(prev, id));
    if (editing === id) cancelEdit();
  }

  if (mode === "study") {
    return (
      <FlashcardApp
        cards={cards}
        mode="custom"
        header={{
          eyebrow: "MY CARDS",
          title: "나만의 카드 학습",
          subtitle: `직접 만든 ${cards.length}장의 카드를 같은 방식으로 회독합니다.`,
        }}
        topSlot={
          <div className="mb-4 flex items-center justify-between gap-3">
            <Link
              href="/flashcards"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
            >
              ← 플립카드 허브
            </Link>
            <button
              type="button"
              onClick={() => setMode("manage")}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:border-violet-400 hover:text-violet-700"
            >
              ✍️ 카드 관리로 돌아가기
            </button>
          </div>
        }
      />
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-9 sm:px-6 sm:py-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href="/flashcards"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
        >
          ← 플립카드 허브
        </Link>
        <button
          type="button"
          onClick={() => setMode("study")}
          disabled={cards.length === 0}
          className="rounded-full bg-gradient-to-br from-violet-500 to-blue-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:from-violet-600 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {cards.length > 0
            ? `🃏 ${cards.length}장 학습 시작 →`
            : "카드를 먼저 만들어 주세요"}
        </button>
      </div>

      <header className="mb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-violet-600">
          MY CARDS
        </p>
        <h1 className="mt-1.5 text-[1.7rem] font-bold leading-tight text-zinc-900 sm:text-3xl">
          나만의 카드 만들기
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          시험장에서 자주 까먹는 공식·기준을 직접 카드로 만들어 회독하세요.
          앞·뒷면 모두 <code className="rounded bg-zinc-100 px-1">$수식$</code>{" "}
          LaTeX 가능합니다.
        </p>
      </header>

      {/* 입력 폼 */}
      <section
        id="custom-card-form"
        className="mb-7 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/50 via-white to-blue-50/40 p-5 shadow-sm sm:p-6"
      >
        <h2 className="text-sm font-bold text-violet-800">
          {editing ? "✏️ 카드 편집" : "➕ 새 카드 추가"}
        </h2>
        <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="과목" htmlFor="cf-subject">
            <select
              id="cf-subject"
              value={draft.subject}
              onChange={(e) =>
                setDraft((d) => ({ ...d, subject: e.target.value as Subject }))
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            >
              {ALL_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="토픽 (선택)"
            htmlFor="cf-topic"
            hint="예: 옴의 법칙, KEC 기준 등"
          >
            <input
              id="cf-topic"
              type="text"
              value={draft.topic}
              onChange={(e) =>
                setDraft((d) => ({ ...d, topic: e.target.value }))
              }
              placeholder="사용자 카드"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </Field>

          <Field label="앞면 (질문)" htmlFor="cf-front" required full>
            <textarea
              id="cf-front"
              ref={frontRef}
              required
              rows={3}
              value={draft.front}
              onChange={(e) =>
                setDraft((d) => ({ ...d, front: e.target.value }))
              }
              placeholder="예: 옴의 법칙은?"
              className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            <MathInputHelper
              textareaRef={frontRef}
              value={draft.front}
              onChange={(next) => setDraft((d) => ({ ...d, front: next }))}
              previewLabel="앞면 미리보기"
            />
          </Field>

          <Field label="뒷면 (답·설명)" htmlFor="cf-back" required full>
            <textarea
              id="cf-back"
              ref={backRef}
              required
              rows={4}
              value={draft.back}
              onChange={(e) =>
                setDraft((d) => ({ ...d, back: e.target.value }))
              }
              placeholder="평문으로 'V = I * R' 같이 써도 OK. 아래 ✨ 자동 변환을 누르면 LaTeX 로 바꿔줍니다."
              className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            <MathInputHelper
              textareaRef={backRef}
              value={draft.back}
              onChange={(next) => setDraft((d) => ({ ...d, back: next }))}
              previewLabel="뒷면 미리보기"
            />
          </Field>

          <Field
            label="힌트 (선택)"
            htmlFor="cf-hint"
            hint="앞면 아래 작게 표시됩니다"
            full
          >
            <input
              id="cf-hint"
              type="text"
              value={draft.hint ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, hint: e.target.value }))
              }
              placeholder="(선택)"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </Field>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 sm:col-span-2"
            >
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2 sm:col-span-2">
            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              >
                취소
              </button>
            )}
            <button
              type="submit"
              className="rounded-full bg-gradient-to-br from-violet-500 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:from-violet-600 hover:to-blue-600"
            >
              {editing ? "변경 저장" : "카드 추가"}
            </button>
          </div>
        </form>
      </section>

      {/* 카드 목록 */}
      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-sm font-bold text-zinc-800">
            내가 만든 카드{" "}
            <span className="ml-1 text-xs font-medium text-zinc-500">
              총 {cards.length}장
            </span>
          </h2>
        </div>

        {!hydrated ? (
          <p className="rounded-xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-400">
            불러오는 중…
          </p>
        ) : cards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/40 px-6 py-10 text-center">
            <p className="text-3xl">🃏</p>
            <p className="mt-2 text-sm font-semibold text-zinc-800">
              아직 만든 카드가 없습니다
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              위 폼에서 첫 카드를 만들어 보세요. 모든 카드는 이 브라우저에만
              저장됩니다.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {ALL_SUBJECTS.map((subject) => {
              const list = groupedBySubject[subject];
              if (list.length === 0) return null;
              return (
                <div key={subject}>
                  <p className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-700">
                    <SubjectDot subject={subject} />
                    {subject}
                    <span className="text-[10px] font-medium text-zinc-400">
                      {list.length}장
                    </span>
                  </p>
                  <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {list.map((card) => (
                      <li
                        key={card.id}
                        className={`group rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 ${
                          editing === card.id
                            ? "border-violet-400 ring-2 ring-violet-100"
                            : "border-zinc-200 hover:border-zinc-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                            {card.topic}
                          </span>
                          <div className="flex items-center gap-1 text-[11px]">
                            <button
                              type="button"
                              onClick={() => startEdit(card)}
                              className="rounded-full px-2 py-1 font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                            >
                              ✏️ 편집
                            </button>
                            <button
                              type="button"
                              onClick={() => remove(card.id)}
                              className="rounded-full px-2 py-1 font-semibold text-zinc-400 hover:bg-rose-50 hover:text-rose-700"
                            >
                              🗑 삭제
                            </button>
                          </div>
                        </div>
                        <div className="mt-2.5 text-sm font-semibold text-zinc-900">
                          <MathText>{card.front}</MathText>
                        </div>
                        <div className="mt-2 line-clamp-3 whitespace-pre-line text-[13px] text-zinc-600">
                          <MathText>{card.back}</MathText>
                        </div>
                        {card.hint && (
                          <p className="mt-2 text-[11px] text-zinc-400">
                            힌트: {card.hint}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
  required,
  full,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-xs font-semibold text-zinc-700"
      >
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
        {hint && <span className="ml-2 font-normal text-zinc-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function SubjectDot({ subject }: { subject: Subject }) {
  const tone =
    subject === "전기이론"
      ? "bg-blue-500"
      : subject === "전기기기"
        ? "bg-violet-500"
        : "bg-amber-500";
  return <span className={`h-2 w-2 rounded-full ${tone}`} />;
}
