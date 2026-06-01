import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CbtHub from "@/components/cbt/CbtHub";

export const metadata: Metadata = {
  title: "마무리 학습 · CBT 모의고사 — 독끝 전기기능사 필기",
  description:
    "학습하기(회차별·과목별·빈출별)와 복습하기(오답노트·나만의 시험) 두 섹션으로, 약점을 찍어 점수를 굳혀요.",
};

export default function V3CbtPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      {/* 페이지 헤더 — v3 톤 (화이트 미니멀) */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
          <nav className="mb-5 text-xs">
            <Link
              href="/v3"
              className="inline-flex items-center gap-1 font-semibold text-zinc-500 hover:text-zinc-900"
            >
              ← 독끝 필기로
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-xs font-black text-white shadow-sm"
            >
              B
            </span>
            <p className="text-[11px] font-bold tracking-[0.22em] text-rose-600">
              PART B · 실전 학습
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-[1.2] tracking-tight text-zinc-900 sm:text-4xl">
            점수, 약점부터 좁혀볼까요
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
            이론은 PART A에서 가볍게 다지셨어요. 이제{" "}
            <strong className="font-semibold text-zinc-800">
              약점을 찍어 점수를 굳히는 묶음
            </strong>
            이에요. 오늘까지의 학습 추이를 먼저 보고, 필요하면 ‘나만의 시험’으로
            좁혀 풀어요.
          </p>

          {/* 페이지 내 빠른 이동 — 두 섹션 안내 */}
          <div className="mt-7 flex flex-wrap gap-2 text-xs">
            <a
              href="#study"
              className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
            >
              <span aria-hidden>🎯</span>
              학습하기
            </a>
            <a
              href="#review"
              className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
            >
              <span aria-hidden>🔁</span>
              복습하기
            </a>
            <a
              href="#dashboard"
              className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1.5 font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              <span aria-hidden>📈</span>
              학습 현황
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {/* ============ 섹션 1 · 학습하기 ============ */}
        <section id="study" className="scroll-mt-20">
          <SectionHeading
            no={1}
            kicker="STUDY"
            title="학습하기"
            desc="실전 문제를 풀며 점수를 쌓는 곳. 회차로 통째로, 과목으로 좁게, 빈출로 효율적으로 — 원하는 방식으로 시작하세요."
            tone="indigo"
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {STUDY_CARDS.map((c) => (
              <LaunchCard key={c.title} {...c} />
            ))}
          </div>
        </section>

        {/* ============ 섹션 2 · 복습하기 ============ */}
        <section id="review" className="mt-16 scroll-mt-20">
          <SectionHeading
            no={2}
            kicker="REVIEW"
            title="복습하기"
            desc="틀린 곳을 다시 보고, 약점만 골라 나만의 시험으로 좁혀 푸는 곳. 점수를 합격선 위에서 굳혀요."
            tone="rose"
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {REVIEW_CARDS.map((c) => (
              <LaunchCard key={c.title} {...c} />
            ))}
          </div>
        </section>
      </main>

      {/* ============ 이용 현황판 (런처 숨김 대시보드) ============ */}
      <section
        id="dashboard"
        className="scroll-mt-20 border-y border-zinc-200 bg-white"
      >
        <CbtHub showLauncher={false} />
      </section>

      {/* 다음 단계 안내 */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center sm:p-10">
          <p className="text-[11px] font-bold tracking-[0.22em] text-zinc-500">
            ONE MORE THING
          </p>
          <h3 className="mt-3 text-xl font-bold text-zinc-900 sm:text-2xl">
            틀린 문제가 모이면, 거기서 다음 회차가 시작돼요.
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
            오답은 자동으로 노트에 쌓여요. 다음 시험은 그 노트의 빈출 토픽만 골라
            구성해 보세요. 점수가 합격선 위에서 흔들리지 않게 굳혀집니다.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/cbt/wrong-notes"
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span aria-hidden>🔁</span>
              오답 노트 열기
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/v3"
              className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              독끝 필기 메인으로
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ─────────────── 진입 카드 데이터 ─────────────── */

type LaunchCardProps = {
  emoji: string;
  title: string;
  desc: string;
  href: string;
  meta: string;
  gradient: string;
  external?: boolean;
};

const STUDY_CARDS: LaunchCardProps[] = [
  {
    emoji: "📝",
    title: "회차별 모의고사",
    desc: "60문항 60분, 실제 시험과 동일하게 회차 단위로 통째로 응시해요.",
    href: "/cbt/exams",
    meta: "실전 회차",
    gradient: "from-indigo-500 via-blue-500 to-sky-500",
  },
  {
    emoji: "📚",
    title: "과목별 학습",
    desc: "전기이론·기기·설비를 과목 > 토픽 단위로, 시간 제한 없이 연습해요.",
    href: "/cbt/study",
    meta: "과목 · 토픽",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    emoji: "🔥",
    title: "빈출 모의고사",
    desc: "자주 나오는 문제만 모아 풀어요. 짧은 시간에 합격 가능성을 빠르게 올려요.",
    href: "/cbt/frequent",
    meta: "빈출 우선",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
  },
];

const REVIEW_CARDS: LaunchCardProps[] = [
  {
    emoji: "🔁",
    title: "오답 노트",
    desc: "틀린 문제만 자동으로 모아 다시 보고, 약점을 집중 복습해요.",
    href: "/cbt/wrong-notes",
    meta: "틀린 문제 모음",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
  },
  {
    emoji: "🎛️",
    title: "나만의 시험 (커스터마이징)",
    desc: "과목·빈출도·난이도·문항 수·제한 시간을 직접 골라 약점만 좁혀 푸는 맞춤 시험을 구성해요.",
    href: "/cbt/custom",
    meta: "맞춤 구성",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
  },
];

/* ─────────────── 섹션 헤딩 ─────────────── */

function SectionHeading({
  no,
  kicker,
  title,
  desc,
  tone,
}: {
  no: number;
  kicker: string;
  title: string;
  desc: string;
  tone: "indigo" | "rose";
}) {
  const toneCls =
    tone === "indigo"
      ? "from-indigo-500 to-sky-500"
      : "from-rose-500 to-pink-500";
  const chipCls =
    tone === "indigo"
      ? "bg-indigo-50 text-indigo-700 ring-indigo-100"
      : "bg-rose-50 text-rose-700 ring-rose-100";
  return (
    <header>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={`grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br ${toneCls} text-sm font-black text-white shadow-sm`}
        >
          {no}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.2em] ring-1 ${chipCls}`}
        >
          {kicker}
        </span>
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
        {desc}
      </p>
    </header>
  );
}

/* ─────────────── 진입 카드 ─────────────── */

function LaunchCard({
  emoji,
  title,
  desc,
  href,
  meta,
  gradient,
}: LaunchCardProps) {
  const isAnchor = href.startsWith("#");
  const className =
    "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl";
  const inner = (
    <>
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`}
      />
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-2xl shadow-md transition group-hover:scale-110`}
        >
          {emoji}
        </span>
        <span className="rounded-full bg-zinc-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 ring-1 ring-zinc-100">
          {meta}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold tracking-tight text-zinc-900">
        {title}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-zinc-600">
        {desc}
      </p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold transition group-hover:gap-1.5">
        <span
          className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        >
          바로가기
        </span>
        <span className="text-zinc-400 transition group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </>
  );

  // 페이지 내 앵커(커스터마이징)는 a, 라우트 이동은 Link
  return isAnchor ? (
    <a href={href} className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
