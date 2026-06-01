import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FreeLaunchModal from "@/components/v3/FreeLaunchModal";
import TheorySection from "@/components/v3/TheorySection";

export const metadata: Metadata = {
  title: "독끝 전기기능사 필기 — 최소한의 이론으로, 기출문제까지",
  description:
    "이론은 골라서 가볍게, 점수는 실전으로 굳히기. 카드·오디오·시뮬과 CBT·기출 강의 두 묶음을 자유롭게 오가며 학습.",
};

export default function V3HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/40 via-zinc-50 to-rose-50/30">
      <Header />
      <FreeLaunchModal />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-br from-violet-50 via-white to-rose-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 18%, rgba(139,92,246,0.18) 0px, transparent 45%), radial-gradient(circle at 88% 30%, rgba(244,63,94,0.16) 0px, transparent 48%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-24">
          <p className="text-xs font-bold tracking-[0.22em] text-zinc-500">
            독끝 · 전기기능사 필기
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-[1.2] tracking-tight text-zinc-900 sm:text-5xl">
            최소한의 이론으로,
            <br />
            <span className="text-zinc-500">기출문제까지.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
            독끝 전기기능사 필기를 학습하다 왔다면, 여기서는 이론을 풀로 외울
            필요가 없어요.{" "}
            <strong className="font-semibold text-zinc-800">
              필요한 만큼만 골라
            </strong>{" "}
            학습하고, 기출 회독으로 마무리하면 충분합니다.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        {/* ============ 두 단계로 끝나요 — 양갈래 ============ */}
        <section>
          <header className="mb-10 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-blue-700 ring-1 ring-blue-100">
              <span aria-hidden>🧭</span>
              HOW TO USE
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              합격하는 방법에는 여러 가지가 있어요
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-700 sm:text-xl">
              부족한 이론을 메우는{" "}
              <strong className="font-bold text-violet-700">PART A</strong>와
              실전으로 굳히는{" "}
              <strong className="font-bold text-rose-700">PART B</strong>. 정해진
              순서는 없어요. 막히는 쪽을{" "}
              <strong className="font-bold text-zinc-900">자유롭게 오가며</strong>{" "}
              서로 채워주면 됩니다.
            </p>

            {/* A ⇄ B 비주얼 — 순서가 아니라 상호 보완 */}
            <ExchangeVisual />
          </header>

          {/* 양갈래 본문 */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* LEFT BRANCH — 이론 */}
            <article className="relative overflow-hidden rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-violet-50/70 via-white to-white p-6 shadow-sm sm:p-8">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"
              />
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-black text-white shadow-sm"
                >
                  A
                </span>
                <p className="text-[11px] font-bold tracking-[0.18em] text-violet-700">
                  PART A · 이론 보조학습
                </p>
              </div>
              <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-2xl">
                부족한 부분, 여러 방법으로 메우기
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
                책으로만 공부하려니 어렵고 막막한 부분,{" "}
                <Hl>눈으로 보고</Hl> <Hl>귀로 듣고</Hl>{" "}
                <Hl>직접 만져보며</Hl> 이해해보세요. 같은 개념도 방법을 바꾸면
                다르게 들어와요.
              </p>

              <div className="mt-6">
                <TheorySection />
              </div>
            </article>

            {/* RIGHT BRANCH — 점수 */}
            <article className="relative overflow-hidden rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-rose-50/70 via-white to-white p-6 shadow-sm sm:p-8">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500"
              />
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-xs font-black text-white shadow-sm"
                >
                  B
                </span>
                <p className="text-[11px] font-bold tracking-[0.18em] text-rose-700">
                  PART B · 실전 학습
                </p>
              </div>
              <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-2xl">
                실전으로 부딪히며 굳히기
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                문제를 풀다 약한 곳이 보이면, 그 부분만 PART A에서 다시 다지고
                오면 돼요. 회차를 반복할수록 점수가 합격선 위에서 단단해집니다.
                부담 갖지 말고 일단 한 회차 풀어보는 것부터 시작해요.
              </p>

              <div className="mt-6 space-y-3">
                <FinishCard
                  emoji="📝"
                  name="CBT 모의고사"
                  desc="회차별·과목별·빈출도순 실전 문제를 풀고, 나만의 시험으로 약점만 좁혀 점수를 굳혀요."
                  meta="실전 회차"
                  cta="모의고사 풀기"
                  href="/v3/cbt"
                  gradient="from-indigo-500 via-blue-500 to-sky-500"
                />
                <FinishCard
                  emoji="🎬"
                  name="기출 해설 강의"
                  desc="교재 기출문제 학습과 CBT 오답에 연계된 영상 해설. 막힌 곳에서 정확히 잡아줘요."
                  meta="CBT 연계"
                  cta="해설 보기"
                  href="/lectures"
                  gradient="from-emerald-500 via-teal-500 to-cyan-500"
                />
              </div>
            </article>
          </div>
        </section>

        {/* ============ PART A·B 활용 가이드 — 눈에 띄게 ============ */}
        <section className="mt-20">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950 px-6 py-12 shadow-xl sm:px-10 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 20%, rgba(139,92,246,0.35) 0px, transparent 42%), radial-gradient(circle at 85% 30%, rgba(244,63,94,0.3) 0px, transparent 45%)",
              }}
            />
            <header className="relative text-center">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-[0.22em] text-amber-300 ring-1 ring-white/15 backdrop-blur">
                <span aria-hidden>💡</span>
                STUDY GUIDE
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                이렇게 학습하면 좋아요
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                정답은 없어요. 내 상황에 맞는 방식으로 PART A와 PART B를 엮어
                보세요. 대표적인 두 가지를 소개할게요.
              </p>
            </header>

            <div className="relative mt-10 grid gap-5 md:grid-cols-2">
              {/* 가이드 1 — 이론 병행형 (PART A가 먼저라 왼쪽) */}
              <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-7">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 px-2.5 py-1 text-white shadow-sm">
                    PART A
                  </span>
                  <span className="text-zinc-400">⇄</span>
                  <span className="rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 px-2.5 py-1 text-white shadow-sm">
                    PART B
                  </span>
                  <span className="text-zinc-400">병행</span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white sm:text-2xl">
                  이론·실전 병행형
                </h3>
                <p className="mt-2 text-base leading-relaxed text-zinc-300">
                  기초부터 차근차근이라면, <strong className="font-bold text-white">PART A로 한 챕터를 익히고 바로 PART B로 확인</strong>하세요.
                  막히면 다시 A로 돌아와 다지고, 또 B로. <strong className="font-bold text-white">A와 B를 번갈아</strong> 가며 한 단원씩 끝내요.
                </p>
                {/* 흐름 칩 */}
                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-bold">
                  <FlowChip label="PART A" tone="a" />
                  <FlowArrow two />
                  <FlowChip label="PART B" tone="b" />
                </div>
              </article>

              {/* 가이드 2 — 기출 위주 회독형 */}
              <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-7">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 px-2.5 py-1 text-white shadow-sm">
                    PART B
                  </span>
                  <span className="text-zinc-400">중심 +</span>
                  <span className="rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 px-2.5 py-1 text-white shadow-sm">
                    PART A
                  </span>
                  <span className="text-zinc-400">보강</span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white sm:text-2xl">
                  기출 위주 회독형
                </h3>
                <p className="mt-2 text-base leading-relaxed text-zinc-300">
                  이미 한 번 봤거나 실전형이라면, <strong className="font-bold text-white">PART B의 CBT·기출 해설을 반복</strong>해서 돌리세요.
                  돌리다 <strong className="font-bold text-white">자꾸 틀리는 부분만 PART A</strong>의 카드·오디오·시뮬로 콕 집어 메우면 돼요.
                </p>
                {/* 흐름 칩 */}
                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-bold">
                  <FlowChip label="PART B" tone="b" />
                  <FlowArrow />
                  <FlowChip label="약점만 A" tone="a" />
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ============ 도구 하나씩 들여다보기 — 기능 소개 ============ */}
        <section className="mt-20">
          <header className="mb-10 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-zinc-600 ring-1 ring-zinc-200">
              <span aria-hidden>🧰</span>
              ALL TOOLS
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              다섯 가지 학습 도구, 하나씩 들여다보기
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-600">
              교재만으로 부족한 부분, 사이트가 채웁니다. 각 도구가 어떻게
              도와주는지 하나씩 살펴보세요.
            </p>
          </header>

          <div className="space-y-5">
            {TOOL_SHOWCASE.map((tool, i) => (
              <ToolShowcaseBlock
                key={tool.name}
                tool={tool}
                reverse={i % 2 === 1}
              />
            ))}
          </div>
        </section>

        {/* ============ OUTRO ============ */}
        <section className="mt-20 rounded-3xl border border-zinc-200 bg-white p-8 text-center sm:p-12">
          <p className="text-[11px] font-bold tracking-[0.22em] text-zinc-500">
            ONE MORE THING
          </p>
          <h3 className="mt-3 text-2xl font-bold text-zinc-900 sm:text-3xl">
            이론 강의는 일부러 만들지 않았어요.
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
            카드·오디오·시뮬 세 도구로 충분히 체화할 수 있고, 그 위에 CBT와
            기출 해설을 얹으면 합격선까지 닿아요. 도구는 단순할수록 자주 펴게
            되니까요.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ─────────────── 특장점 하이라이트 ─────────────── */

function Hl({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-violet-100 px-1.5 py-0.5 font-bold text-violet-800">
      {children}
    </span>
  );
}

/* ─────────────── 활용 가이드 흐름 칩 ─────────────── */

function FlowChip({
  label,
  tone,
}: {
  label: string;
  tone: "a" | "b" | "neutral";
}) {
  const cls =
    tone === "a"
      ? "border-violet-400/40 bg-violet-500/15 text-violet-200"
      : tone === "b"
        ? "border-rose-400/40 bg-rose-500/15 text-rose-200"
        : "border-white/20 bg-white/10 text-zinc-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 ${cls}`}
    >
      {label}
    </span>
  );
}

function FlowArrow({ two = false }: { two?: boolean }) {
  return (
    <span aria-hidden className="text-zinc-500">
      {two ? "⇄" : "→"}
    </span>
  );
}

/* ─────────────── A ⇄ B 비주얼 — 순서가 아니라 상호 보완 ─────────────── */

function ExchangeVisual() {
  return (
    <div className="mx-auto mt-10 flex w-fit items-start justify-center gap-5 sm:gap-9">
      {/* PART A 노드 */}
      <div className="flex flex-col items-center">
        <span className="grid h-20 w-20 place-items-center rounded-[1.4rem] bg-gradient-to-br from-violet-500 to-fuchsia-500 text-3xl font-black text-white shadow-lg sm:h-24 sm:w-24 sm:text-4xl">
          A
        </span>
        <span className="mt-3 text-base font-extrabold text-violet-700 sm:text-lg">
          PART A
        </span>
        <span className="text-xs font-semibold text-zinc-500 sm:text-sm">
          이론 보조학습
        </span>
      </div>

      {/* 양방향 화살표 */}
      <div className="flex flex-col items-center pt-5 text-zinc-400 sm:pt-7">
        <span className="text-3xl leading-none sm:text-5xl">⇄</span>
        <span className="mt-1.5 text-xs font-bold tracking-wider sm:text-sm">
          자유롭게
        </span>
      </div>

      {/* PART B 노드 */}
      <div className="flex flex-col items-center">
        <span className="grid h-20 w-20 place-items-center rounded-[1.4rem] bg-gradient-to-br from-rose-500 to-pink-500 text-3xl font-black text-white shadow-lg sm:h-24 sm:w-24 sm:text-4xl">
          B
        </span>
        <span className="mt-3 text-base font-extrabold text-rose-700 sm:text-lg">
          PART B
        </span>
        <span className="text-xs font-semibold text-zinc-500 sm:text-sm">
          실전 학습
        </span>
      </div>
    </div>
  );
}

/* ─────────────── 마무리 학습 카드 (컴팩트 가로형) ─────────────── */

function FinishCard({
  emoji,
  name,
  desc,
  meta,
  cta,
  href,
  gradient,
}: {
  emoji: string;
  name: string;
  desc: string;
  meta: string;
  cta: string;
  href: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${gradient}`}
      />
      <span
        aria-hidden
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-2xl shadow-md`}
      >
        {emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-bold text-zinc-900 sm:text-base">
            {name}
          </h3>
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            {meta}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-zinc-600">{desc}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold transition group-hover:gap-1.5">
          <span
            className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {cta}
          </span>
          <span className="text-zinc-400 transition group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

/* ─────────────── 도구 하나씩 들여다보기 (기능 소개) ─────────────── */

type ToolShowcase = {
  part: "A" | "B";
  partLabel: string;
  emoji: string;
  name: string;
  tagline: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  gradient: string;
  partClass: string;
  visual: ReactNode;
};

const TOOL_SHOWCASE: ToolShowcase[] = [
  {
    part: "A",
    partLabel: "PART A · 이론 보조학습",
    emoji: "🃏",
    name: "플립 암기카드",
    tagline: "핵심 키워드, 자투리 시간을 합격으로",
    desc: "합격에 필요한 핵심 키워드를 카드로 정리했어요. 손가락 한 번이면 카드를 뒤집어 정답 확인. 즐겨찾기는 자동으로 모이고, 틀린 카드는 따로 모아 다시 학습합니다.",
    features: [
      "간격 반복으로 잊을 때쯤 다시 등장",
      "챕터별 회독 · 자가 평가",
      "CBT 오답이 자동으로 카드화",
      "즐겨찾기·취약 카드 모아보기",
    ],
    cta: "카드 학습 시작",
    href: "/v3/cards",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    partClass: "bg-violet-50 text-violet-700 ring-violet-100",
    visual: <CardMock />,
  },
  {
    part: "A",
    partLabel: "PART A · 이론 보조학습",
    emoji: "🎧",
    name: "5분 핵심 요약 오디오북",
    tagline: "출퇴근길에도 합격이 가까워져요",
    desc: "한 챕터를 5분으로 압축한 핵심 요약을 귀로 듣는 오디오북. 운전 중에도, 산책할 때도, 자기 전에도 자연스럽게 학습이 누적됩니다. 흘려듣기만 해도 합격 키워드가 남아요.",
    features: [
      "챕터당 약 5분 · 짧고 굵게",
      "이동·자투리 시간을 학습으로",
      "배속 재생 + 구간 반복",
      "백그라운드 재생 지원",
    ],
    cta: "오디오 들어보기",
    href: "/v3/audiobook",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    partClass: "bg-violet-50 text-violet-700 ring-violet-100",
    visual: <AudioMock />,
  },
  {
    part: "A",
    partLabel: "PART A · 이론 보조학습",
    emoji: "⚡",
    name: "이론 시뮬레이터",
    tagline: "글로 읽지 말고, 손으로 만져보세요",
    desc: "옴의 법칙·RLC 공진·3상·변압기까지 핵심 원리를 인터랙티브하게 직접 조작해요. 변수를 바꾸면 결과가 즉시 보이니, 외우려 애쓰지 않아도 식의 의미가 손에 잡힙니다.",
    features: [
      "값을 움직이면 그래프가 즉시 반응",
      "공식과 시각을 동시에",
      "과목·챕터별로 정리",
      "기출 개념과 연계",
    ],
    cta: "시뮬레이터 둘러보기",
    href: "/v3/simulator",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    partClass: "bg-violet-50 text-violet-700 ring-violet-100",
    visual: <SimMock />,
  },
  {
    part: "B",
    partLabel: "PART B · 실전 학습",
    emoji: "📝",
    name: "CBT 모의고사",
    tagline: "실제 시험장 그대로, 손에 익을 때까지",
    desc: "글자 크기·화면 배치·계산기 팝업까지 실제 시험과 똑같은 환경에서 풀어봐요. 응시 후엔 자동 채점으로 합격 여부와 약점을 한눈에. 약한 곳은 PART A에서 다시 다지고 오면 돼요.",
    features: [
      "회차별 모의고사 + 범위별 연습",
      "자동 채점 · 100점 환산",
      "과목별 약점 자동 진단",
      "오답은 노트·카드로 자동 연결",
    ],
    cta: "모의고사 풀기",
    href: "/v3/cbt",
    gradient: "from-indigo-500 via-blue-500 to-sky-500",
    partClass: "bg-rose-50 text-rose-700 ring-rose-100",
    visual: <CbtMock />,
  },
  {
    part: "B",
    partLabel: "PART B · 실전 학습",
    emoji: "🎬",
    name: "기출 해설 강의",
    tagline: "왜 이 답인지, 끝까지 알려드려요",
    desc: "기출 문항에 대한 영상 해설. 단순한 정답 표기가 아니라 단계별 풀이와 함정 포인트까지 짚어드려요. CBT에서 막힌 문제와 연계해, 정확히 그 자리에서 풀어줍니다.",
    features: [
      "문제별 단계 풀이 + 함정 포인트",
      "CBT 오답과 연계 해설",
      "회차·과목·문항별로 골라보기",
      "모바일·PC·태블릿 모두 지원",
    ],
    cta: "해설 보기",
    href: "/lectures",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    partClass: "bg-rose-50 text-rose-700 ring-rose-100",
    visual: <LectureMock />,
  },
];

function ToolShowcaseBlock({
  tool,
  reverse,
}: {
  tool: ToolShowcase;
  reverse: boolean;
}) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tool.gradient}`}
      />
      <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2 md:items-center md:gap-12">
        {/* 텍스트: 제목 + 설명 + 기능 (지그재그 — 홀수행은 오른쪽으로) */}
        <div className={reverse ? "md:order-2" : "md:order-1"}>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-2xl shadow-md`}
            >
              {tool.emoji}
            </span>
            <div className="min-w-0">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] ring-1 ${tool.partClass}`}
              >
                {tool.partLabel}
              </span>
              <h3 className="mt-1.5 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
                {tool.name}
              </h3>
            </div>
          </div>

          <p
            className={`mt-4 bg-gradient-to-r ${tool.gradient} bg-clip-text text-sm font-bold text-transparent`}
          >
            “{tool.tagline}”
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            {tool.desc}
          </p>

          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {tool.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-[13px] leading-relaxed text-zinc-700"
              >
                <span
                  aria-hidden
                  className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gradient-to-br ${tool.gradient} text-[9px] font-black text-white`}
                >
                  ✓
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href={tool.href}
            className="group mt-5 inline-flex items-center gap-1.5 text-sm font-bold transition"
          >
            <span
              className={`bg-gradient-to-r ${tool.gradient} bg-clip-text text-transparent`}
            >
              {tool.cta}
            </span>
            <span className="text-zinc-400 transition group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

        {/* 큰 그림: 도구 미리보기 (지그재그 — 홀수행은 왼쪽으로) */}
        <div className={reverse ? "md:order-1" : "md:order-2"}>
          {tool.visual}
        </div>
      </div>
    </article>
  );
}

/* ─────────────── 도구 미리보기 목업 ─────────────── */

function MockFrame({
  label,
  gradient,
  children,
}: {
  label: string;
  gradient: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg ring-1 ring-black/5">
      <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span
          className={`ml-2 bg-gradient-to-r ${gradient} bg-clip-text text-[11px] font-bold text-transparent`}
        >
          {label}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* 🃏 플립 암기카드 — 카드 뒤집기 */
function CardMock() {
  const gradient = "from-amber-500 via-orange-500 to-rose-500";
  return (
    <MockFrame label="플립 암기카드" gradient={gradient}>
      <div className="relative">
        <div
          aria-hidden
          className="absolute -right-2 -top-2 h-full w-full rounded-2xl border border-zinc-200 bg-zinc-50"
        />
        <div className="relative rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <span>전기이론 · 12 / 30</span>
            <span
              className={`rounded-full bg-gradient-to-r ${gradient} px-2 py-0.5 text-white`}
            >
              FLIP
            </span>
          </div>
          <div className="flex min-h-[5.5rem] flex-col items-center justify-center gap-1.5 py-3 text-center">
            <p className="text-xs text-zinc-400">Q. 옴의 법칙 공식은?</p>
            <p
              className={`bg-gradient-to-r ${gradient} bg-clip-text text-2xl font-black text-transparent`}
            >
              V = I × R
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-1.5">
        {["모름", "애매", "외움"].map((l, i) => (
          <span
            key={l}
            className={`rounded-full px-3 py-1 text-[11px] font-bold ${
              i === 2
                ? `bg-gradient-to-r ${gradient} text-white shadow-sm`
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {l}
          </span>
        ))}
      </div>
    </MockFrame>
  );
}

/* 🎧 오디오북 — 5분 플레이어 */
function AudioMock() {
  const gradient = "from-rose-500 via-pink-500 to-fuchsia-500";
  const bars = [40, 70, 30, 90, 55, 75, 35, 60, 80, 45, 65, 50, 85, 30, 70];
  return (
    <MockFrame label="5분 핵심 요약 오디오북" gradient={gradient}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
        전기기기 · CH 03
      </p>
      <p className="mt-1 text-sm font-bold text-zinc-900">변압기 핵심 요약</p>
      <div className="mt-4 flex h-12 items-end justify-between gap-[3px]">
        {bars.map((h, i) => (
          <span
            key={i}
            className={`flex-1 rounded-full ${
              i < 6 ? `bg-gradient-to-t ${gradient}` : "bg-zinc-200"
            }`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] font-bold text-zinc-500">01:58</span>
        <span
          className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${gradient} text-white shadow-md`}
        >
          ▶
        </span>
        <span className="text-[11px] font-bold text-zinc-400">05:00</span>
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {["0.8x", "1.0x", "1.5x"].map((s, i) => (
          <span
            key={s}
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              i === 1
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {s}
          </span>
        ))}
      </div>
    </MockFrame>
  );
}

/* ⚡ 시뮬레이터 — 슬라이더 + 곡선 */
function SimMock() {
  const gradient = "from-sky-500 via-blue-500 to-indigo-500";
  return (
    <MockFrame label="이론 시뮬레이터" gradient={gradient}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-bold text-zinc-900">RLC 공진</p>
        <p
          className={`bg-gradient-to-r ${gradient} bg-clip-text text-sm font-black text-transparent`}
        >
          f₀ = 60 Hz
        </p>
      </div>
      <svg viewBox="0 0 200 70" className="mt-3 h-20 w-full" aria-hidden>
        <line x1="0" y1="60" x2="200" y2="60" stroke="#e4e4e7" strokeWidth="1" />
        <path
          d="M0 58 C 60 58, 85 8, 100 8 C 115 8, 140 58, 200 58"
          fill="none"
          stroke="url(#simgrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="100" cy="8" r="3.5" fill="#3b82f6" />
        <defs>
          <linearGradient id="simgrad" x1="0" y1="0" x2="200" y2="0">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mt-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400">
          <span>주파수</span>
          <span>C = 4.7 µF</span>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-zinc-100">
          <div
            className={`relative h-full w-1/2 rounded-full bg-gradient-to-r ${gradient}`}
          >
            <span className="absolute -right-1.5 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-500 shadow" />
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

/* 📝 CBT 모의고사 — 문제 화면 */
function CbtMock() {
  const gradient = "from-indigo-500 via-blue-500 to-sky-500";
  return (
    <MockFrame label="CBT 모의고사" gradient={gradient}>
      <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400">
        <span>문제 7 / 60</span>
        <span className="rounded bg-zinc-900 px-2 py-0.5 text-white">
          ⏱ 47:12
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold text-zinc-900">
        24 V 전원에 8 Ω 저항이 연결될 때 흐르는 전류는?
      </p>
      <div className="mt-3 space-y-1.5">
        {[
          { l: "① 2 A", on: false },
          { l: "② 3 A", on: true },
          { l: "③ 4 A", on: false },
          { l: "④ 6 A", on: false },
        ].map((o) => (
          <div
            key={o.l}
            className={`flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs ${
              o.on
                ? "border-blue-400 bg-blue-50 font-bold text-blue-700"
                : "border-zinc-200 text-zinc-600"
            }`}
          >
            {o.l}
            {o.on && <span className="text-[10px]">선택</span>}
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

/* 🎬 기출 해설 강의 — 영상 플레이어 */
function LectureMock() {
  const gradient = "from-emerald-500 via-teal-500 to-cyan-500";
  return (
    <MockFrame label="기출 해설 강의" gradient={gradient}>
      <div className="relative overflow-hidden rounded-xl bg-zinc-900">
        <div
          aria-hidden
          className={`flex h-28 items-center justify-center bg-gradient-to-br ${gradient} opacity-90`}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-lg text-zinc-900 shadow-lg">
            ▶
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2">
          <div className="h-1 rounded-full bg-white/30">
            <div className="h-full w-1/3 rounded-full bg-white" />
          </div>
          <div className="mt-1 flex justify-between text-[9px] font-bold text-white/80">
            <span>04:12</span>
            <span>12:30</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
        2016년 1회 · 14번
      </p>
      <p className="mt-1 text-sm font-bold text-zinc-900">
        변압기 권수비 — 단계별 풀이
      </p>
    </MockFrame>
  );
}
