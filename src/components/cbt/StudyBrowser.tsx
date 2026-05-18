"use client";

import Link from "next/link";
import { useState } from "react";
import type { Subject } from "@/lib/cbt/types";
import Reveal from "@/components/Reveal";

type SubtopicNode = {
  id: string;
  name: string;
  questionCount: number;
};

type TopicNode = {
  id: string;
  name: string;
  questionCount: number;
  subtopics: SubtopicNode[];
};

type SubjectNode = {
  id: string;
  subject: Subject;
  questionCount: number;
  topics: TopicNode[];
};

const SUBJECT_ICON: Record<Subject, string> = {
  전기이론: "⚡",
  전기기기: "⚙️",
  전기설비: "🔌",
};

const SUBJECT_THEME: Record<
  Subject,
  { activeBg: string; activeText: string; accent: string; soft: string }
> = {
  전기이론: {
    activeBg: "bg-blue-600",
    activeText: "text-blue-600",
    accent: "border-l-blue-500",
    soft: "bg-blue-50",
  },
  전기기기: {
    activeBg: "bg-violet-600",
    activeText: "text-violet-600",
    accent: "border-l-violet-500",
    soft: "bg-violet-50",
  },
  전기설비: {
    activeBg: "bg-emerald-600",
    activeText: "text-emerald-600",
    accent: "border-l-emerald-500",
    soft: "bg-emerald-50",
  },
};

function buildPracticeHref(
  subjectId: string,
  topicId?: string,
  subtopicId?: string,
): string {
  const segments = [subjectId];
  if (topicId) segments.push(topicId);
  if (subtopicId) segments.push(subtopicId);
  return `/cbt/practice-${segments.join("-")}/take`;
}

export default function StudyBrowser({ tree }: { tree: SubjectNode[] }) {
  const [activeId, setActiveId] = useState<string>(tree[0]?.id ?? "");
  const active = tree.find((s) => s.id === activeId) ?? tree[0];
  if (!active) return null;
  const theme = SUBJECT_THEME[active.subject];

  return (
    <div>
      {/* Subject pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tree.map((s) => {
          const isActive = s.id === activeId;
          const t = SUBJECT_THEME[s.subject];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveId(s.id)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? `border-transparent ${t.activeBg} text-white shadow-sm`
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
              }`}
            >
              <span className="text-base leading-none">
                {SUBJECT_ICON[s.subject]}
              </span>
              <span>{s.subject}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-black/25 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
              >
                {s.questionCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subject summary banner */}
      <div
        className={`mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-zinc-200 ${theme.soft} p-6 sm:flex-row sm:items-center`}
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl leading-none">
            {SUBJECT_ICON[active.subject]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">
              {active.subject}
            </h2>
            <p className="mt-1 text-xs text-zinc-600">
              {active.topics.length}개 단원 · 총 {active.questionCount}문항
            </p>
          </div>
        </div>
        <Link
          href={buildPracticeHref(active.id)}
          className={`rounded-md px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 ${theme.activeBg}`}
        >
          {active.subject} 전체 응시 →
        </Link>
      </div>

      {/* Topic cards grid */}
      <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {active.topics.map((topic, idx) => (
          <Reveal key={`${active.id}-${topic.id}`} type="fade-up" delay={idx * 80}>
          <article
            className={`flex h-full flex-col rounded-xl border border-l-4 border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${theme.accent}`}
          >
            <header className="mb-3 flex items-start justify-between">
              <h3 className="text-lg font-bold text-zinc-900">{topic.name}</h3>
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                {topic.questionCount}문항
              </span>
            </header>

            {topic.subtopics.length > 0 ? (
              <ul className="mb-4 flex-1 space-y-1">
                {topic.subtopics.map((sub) => (
                  <li key={sub.id}>
                    {sub.questionCount > 0 ? (
                      <Link
                        href={buildPracticeHref(active.id, topic.id, sub.id)}
                        className="group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-blue-700"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${theme.activeBg}`}
                          />
                          <span className="truncate">{sub.name}</span>
                        </span>
                        <span className="flex flex-shrink-0 items-center gap-2">
                          <span className="text-[11px] text-zinc-400 group-hover:text-zinc-500">
                            {sub.questionCount}
                          </span>
                          <span className="text-zinc-300 opacity-0 transition group-hover:opacity-100">
                            →
                          </span>
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-400">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-300" />
                          <span className="truncate">{sub.name}</span>
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          준비중
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 flex-1 px-2 py-3 text-center text-xs text-zinc-400">
                세부 항목이 없습니다.
              </p>
            )}

            {topic.questionCount > 0 ? (
              <Link
                href={buildPracticeHref(active.id, topic.id)}
                className="mt-auto rounded-md border border-zinc-300 bg-white px-4 py-2 text-center text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
              >
                {topic.name} 전체 응시
              </Link>
            ) : (
              <span className="mt-auto rounded-md bg-zinc-100 px-4 py-2 text-center text-sm font-semibold text-zinc-400">
                문항 준비중
              </span>
            )}
          </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
