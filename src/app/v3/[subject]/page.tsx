import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { presetCards } from "@/lib/flashcards/data";
import { ALL_SUBJECTS, CHAPTER_DEFS } from "@/lib/flashcards/chapters";
import type { Subject } from "@/lib/flashcards/types";
import { topicsBySubject } from "@/lib/audiobook/data";
import { simulators } from "@/lib/simulators";
import { SUBJECT_THEME } from "@/lib/v3/theme";

export async function generateStaticParams() {
  return ALL_SUBJECTS.map((subject) => ({ subject }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>;
}): Promise<Metadata> {
  const { subject } = await params;
  const decoded = decodeURIComponent(subject);
  if (!ALL_SUBJECTS.includes(decoded as Subject)) {
    return { title: "과목 없음" };
  }
  return {
    title: `${decoded} · 학습 도구`,
    description: `${decoded}을(를) 카드·오디오·시뮬 세 가지 방식으로 학습합니다.`,
  };
}

const SUBJECT_INTRO: Record<Subject, string> = {
  전기이론:
    "회로 해석의 기초부터 3상 교류·전자기 유도까지. 이후 모든 과목의 기반이 되는 영역이에요.",
  전기기기:
    "직류기·동기기·유도전동기·변압기·전력변환을 출력 식과 효율 식 중심으로 정리해요.",
  전기설비:
    "전선·차단·접지·배선공사·KEC. 시험에도, 현장에서도 곧장 쓰이는 기준들이에요.",
};

const SECONDARY_TOOLS = [
  {
    href: "/cbt",
    emoji: "📝",
    name: "CBT 모의고사",
    note: "이 과목 회차 응시 · 오답노트",
  },
  {
    href: "/lectures",
    emoji: "🎬",
    name: "기출 강의",
    note: "오답 문항별 해설 영상",
  },
];

export default async function V3SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  const decoded = decodeURIComponent(subject);
  if (!ALL_SUBJECTS.includes(decoded as Subject)) notFound();
  const subj = decoded as Subject;
  const t = SUBJECT_THEME[subj];

  const cardCount = presetCards.filter((c) => c.subject === subj).length;
  const chapterCount = CHAPTER_DEFS[subj].length;
  const audioCount = topicsBySubject(subj).length;
  const simCount = simulators.filter((s) => s.subject === subj).length;

  const tools: ToolCardProps[] = [
    {
      emoji: "🃏",
      eyebrow: "TOOL 01",
      title: "플립 암기카드",
      summary:
        "공식 한 줄·정의 한 문장. 시험에 나오는 핵심만 카드로 농축했어요. 챕터별로 회독하면 점수가 따라옵니다.",
      features: [
        "챕터별 분류로 학습 범위 좁히기",
        "별표·다시보기로 약점만 다시",
        `${cardCount}장 카드 · ${chapterCount}개 챕터`,
      ],
      ctaLabel: "카드로 학습하기",
      ctaHref: `/v3/${subj}/cards`,
      accent: "from-amber-500 via-orange-500 to-rose-500",
      chip: "bg-amber-50 text-amber-700 ring-amber-100",
      hoverBorder: "hover:border-amber-300",
      ctaText: "text-amber-600",
      glow: "from-amber-400/30 via-orange-400/20",
      meta: `🃏 ${cardCount}장 / ${chapterCount}챕터`,
    },
    {
      emoji: "🎧",
      eyebrow: "TOOL 02",
      title: "5분 핵심 요약 오디오북",
      summary:
        "한 챕터를 5분으로 압축한 핵심 요약. 출퇴근·산책 중 한 챕터씩 흘려듣기만 해도 합격 키워드가 머리에 남아요.",
      features: [
        "챕터당 약 5분 · 짧고 굵게",
        "이동·자투리 시간을 학습으로 누적",
        `${audioCount}개 챕터 · 5분 요약본`,
      ],
      ctaLabel: "5분 요약 듣기",
      ctaHref: `/audiobook/summary/${subj}`,
      accent: "from-rose-500 via-pink-500 to-fuchsia-500",
      chip: "bg-rose-50 text-rose-700 ring-rose-100",
      hoverBorder: "hover:border-rose-300",
      ctaText: "text-rose-600",
      glow: "from-rose-400/30 via-pink-400/20",
      meta: `🎧 5분 × ${audioCount}챕터`,
    },
    {
      emoji: "⚡",
      eyebrow: "TOOL 03",
      title: "이론 시뮬레이터",
      summary:
        "값을 직접 움직여보면 공식이 손에 잡혀요. 그래프가 변하는 순간, 외우지 않아도 이해되는 학습.",
      features: [
        "RLC 공진·3상·변압기 등 인터랙티브",
        "단순 풀이가 아닌 직관적 체화",
        `${simCount}개 시뮬 제공`,
      ],
      ctaLabel: "시뮬레이터 열기",
      ctaHref: `/simulator/by-subject/${subj}`,
      accent: "from-sky-500 via-blue-500 to-indigo-500",
      chip: "bg-sky-50 text-sky-700 ring-sky-100",
      hoverBorder: "hover:border-sky-300",
      ctaText: "text-sky-600",
      glow: "from-sky-400/30 via-blue-400/20",
      meta: `⚡ ${simCount}개 시뮬`,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {/* breadcrumb */}
        <nav className="mb-4 text-xs">
          <Link
            href="/v3"
            className="inline-flex items-center gap-1 font-semibold text-zinc-500 hover:text-zinc-900"
          >
            ← 합격 시나리오로
          </Link>
        </nav>

        {/* 과목 헤더 */}
        <header
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${t.gradient} p-7 text-white shadow-lg sm:p-10`}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.4), transparent 40%)",
            }}
          />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-[0.18em] backdrop-blur">
              <span aria-hidden>{t.emoji}</span>
              SUBJECT · {t.short}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {subj}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
              {SUBJECT_INTRO[subj]}
            </p>
          </div>
        </header>

        {/* 3도구 안내 도입부 */}
        <section className="mt-12 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-blue-700 ring-1 ring-blue-100">
            <span aria-hidden>🧭</span>
            CHOOSE YOUR WAY
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            세 가지 방식,{" "}
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500 bg-clip-text text-transparent">
              어떻게 학습할까요?
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
            같은 {subj}을(를) 카드로 농축, 귀로 흘려듣기, 손으로 만져보기.
            <br className="hidden sm:block" />
            기분과 상황에 따라 골라 들어가세요.
          </p>
        </section>

        {/* 3도구 병렬 카드 */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </section>

        {/* 보조: CBT + 강의 */}
        <section className="mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 p-7 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 10% 10%, rgba(99,102,241,0.08), transparent 50%), radial-gradient(circle at 90% 90%, rgba(244,63,94,0.08), transparent 50%)",
              }}
            />
            <div className="relative">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-zinc-600 ring-1 ring-zinc-200">
                <span aria-hidden>🧰</span>
                EXTRA
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                {subj}을(를){" "}
                <span className="bg-gradient-to-r from-indigo-600 to-rose-600 bg-clip-text text-transparent">
                  다른 방식으로도
                </span>{" "}
                학습해보세요
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
                실전 감각이 필요하면 CBT 모의고사, 막힌 문제를 풀어줄 해설이
                필요하면 기출 강의. 두 도구가 카드·오디오·시뮬과 함께 합격선을
                완성해요.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {SECONDARY_TOOLS.map((tool, i) => {
                  const isFirst = i === 0;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${
                        isFirst
                          ? "border-indigo-200 hover:border-indigo-400"
                          : "border-rose-200 hover:border-rose-400"
                      }`}
                    >
                      <div
                        aria-hidden
                        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                          isFirst
                            ? "from-indigo-500 to-blue-600"
                            : "from-rose-500 to-pink-600"
                        }`}
                      />
                      <span
                        className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl shadow-md ${
                          isFirst
                            ? "bg-gradient-to-br from-indigo-500 to-blue-600"
                            : "bg-gradient-to-br from-rose-500 to-pink-600"
                        }`}
                        aria-hidden
                      >
                        {tool.emoji}
                      </span>
                      <div className="flex-1">
                        <p
                          className={`text-[10px] font-bold tracking-[0.18em] ${
                            isFirst ? "text-indigo-600" : "text-rose-600"
                          }`}
                        >
                          {isFirst ? "PRACTICE" : "EXPLAIN"}
                        </p>
                        <p className="mt-0.5 text-base font-bold text-zinc-900">
                          {tool.name}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {tool.note}
                        </p>
                      </div>
                      <span
                        className={`text-zinc-300 transition group-hover:translate-x-1 ${
                          isFirst
                            ? "group-hover:text-indigo-600"
                            : "group-hover:text-rose-600"
                        }`}
                      >
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ── ToolCard ── */

type ToolCardProps = {
  emoji: string;
  eyebrow: string;
  title: string;
  summary: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  accent: string; // bg-gradient-to-br classes
  chip: string;
  hoverBorder: string;
  ctaText: string;
  glow: string;
  meta: string;
};

function ToolCard({
  emoji,
  eyebrow,
  title,
  summary,
  features,
  ctaLabel,
  ctaHref,
  accent,
  chip,
  hoverBorder,
  ctaText,
  glow,
  meta,
}: ToolCardProps) {
  return (
    <Link
      href={ctaHref}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 ${hoverBorder} hover:shadow-2xl`}
    >
      {/* 상단 그라데이션 */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />

      {/* 비주얼 영역 */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-zinc-50 to-white">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glow} to-transparent opacity-90`}
        />
        <div className="relative flex h-full items-center justify-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${accent} text-4xl shadow-lg transition group-hover:scale-110`}
            aria-hidden
          >
            {emoji}
          </div>
        </div>
        <span
          className={`absolute right-4 top-4 inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-zinc-700 backdrop-blur ring-1 ring-zinc-100`}
        >
          {meta}
        </span>
      </div>

      {/* 본문 */}
      <div className="flex flex-1 flex-col p-6">
        <p
          className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.18em] ring-1 ${chip}`}
        >
          {eyebrow}
        </p>
        <h3 className="mt-3 text-xl font-bold tracking-tight text-zinc-900">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{summary}</p>

        <ul className="mt-5 space-y-2">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-[13px] leading-relaxed text-zinc-700"
            >
              <span
                aria-hidden
                className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r ${accent}`}
              />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <span
            className={`inline-flex items-center gap-1 text-sm font-bold ${ctaText} transition group-hover:gap-2`}
          >
            {ctaLabel}
            <span className="transition group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
