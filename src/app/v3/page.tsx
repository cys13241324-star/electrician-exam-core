import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { presetCards } from "@/lib/flashcards/data";
import { ALL_SUBJECTS, CHAPTER_DEFS } from "@/lib/flashcards/chapters";
import FreeLaunchModal from "@/components/v3/FreeLaunchModal";
import TheorySection from "@/components/v3/TheorySection";

export const metadata: Metadata = {
  title: "독끝 전기기능사 필기 — 최소한의 이론으로, 기출문제까지",
  description:
    "이론은 골라서 가볍게, 점수는 실전으로 굳히기. 카드·오디오·시뮬과 CBT·기출 강의로 두 단계 학습.",
};

export default function V3HomePage() {
  const totalCards = presetCards.length;
  const totalChapters = ALL_SUBJECTS.reduce(
    (sum, s) => sum + CHAPTER_DEFS[s].length,
    0,
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <FreeLaunchModal />

      {/* ============ HERO ============ */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
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
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>🃏</span>
              {totalCards}+ 핵심 카드
            </span>
            <span aria-hidden className="text-zinc-300">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>📚</span>
              {totalChapters} 챕터
            </span>
            <span aria-hidden className="text-zinc-300">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>🎯</span>3 과목 커버
            </span>
          </div>
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
              두 단계로 끝나요
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-600">
              먼저 이론을 가볍게 골라 익히고, 그 다음 점수를 실전으로 굳혀요.
              두 갈래가 분리돼 있다는 것만 기억하면 됩니다.
            </p>

            {/* Y-fork 비주얼 */}
            <ForkVisual />
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
                  STEP A · 선택 학습
                </p>
              </div>
              <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-2xl">
                이론은 골라서 가볍게
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                과목을 고르고 손이 가는 도구 하나만으로도 충분해요. 셋 다 안
                해도 되고, 하나만 깊게 파도 됩니다.
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
                  STEP B · 마무리 학습
                </p>
              </div>
              <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-2xl">
                점수는 실전으로 굳히기
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                이론은 가볍게 체득해도, 합격은 회차 반복과 해설 보강에서
                굳어져요. 약점을 측정하고 영상으로 풀어요.
              </p>

              <div className="mt-6 space-y-3">
                <FinishCard
                  emoji="📝"
                  name="CBT 모의고사 · 점수 코칭"
                  desc="회차별·과목별·빈출도 콘텐츠 위에, 학습 대시보드와 나만의 시험 빌더로 약점을 찍어 점수를 굳혀요."
                  meta="코칭 + 커스터마이즈"
                  cta="코칭부터 받기"
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

        {/* ============ 학습 현황 바로가기 ============ */}
        <section className="mt-20">
          <Link
            href="/v3/progress"
            className="group flex items-center gap-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md sm:p-7"
          >
            <span
              aria-hidden
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 text-2xl shadow-md"
            >
              📈
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold tracking-[0.22em] text-zinc-500">
                MY PROGRESS
              </p>
              <p className="mt-1 text-lg font-bold text-zinc-900 sm:text-xl">
                학습 현황 바로가기
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                플립카드·5분 오디오·시뮬 어디까지 했는지 한 페이지에서.
              </p>
            </div>
            <span className="hidden shrink-0 items-center gap-1 text-sm font-bold text-zinc-700 transition group-hover:translate-x-0.5 sm:inline-flex">
              바로가기
              <span aria-hidden>→</span>
            </span>
            <span
              aria-hidden
              className="text-xl text-zinc-400 transition group-hover:translate-x-0.5 sm:hidden"
            >
              →
            </span>
          </Link>
        </section>

        {/* ============ CURRICULUM — 맨 아래 ============ */}
        <section className="mt-20">
          <header className="mb-8 max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-amber-700 ring-1 ring-amber-100">
              <span aria-hidden>📅</span>
              CURRICULUM
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              기간별 학습 흐름
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">
              시험까지 남은 시간에 맞춰 페이스를 골라보세요. 같은 도구를, 다른
              속도로.
            </p>
          </header>

          <div className="grid gap-5 md:grid-cols-2">
            {CURRICULUM.map((plan) => (
              <CurriculumCard key={plan.id} plan={plan} />
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-zinc-500">
            💡 어떤 페이스든 선택 학습 → 마무리 학습 순서만 지키면 돼요.
          </p>
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

/* ─────────────── Y-fork 비주얼 ─────────────── */

function ForkVisual() {
  return (
    <svg
      viewBox="0 0 240 80"
      className="mx-auto mt-8 h-16 w-52 sm:h-20 sm:w-64"
      aria-hidden
    >
      {/* trunk */}
      <line x1="120" y1="0" x2="120" y2="32" stroke="#d4d4d8" strokeWidth="2" />
      {/* left branch */}
      <line
        x1="120"
        y1="32"
        x2="50"
        y2="74"
        stroke="#8b5cf6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* right branch */}
      <line
        x1="120"
        y1="32"
        x2="190"
        y2="74"
        stroke="#f43f5e"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* endpoint dots */}
      <circle cx="50" cy="74" r="5" fill="#8b5cf6" />
      <circle cx="190" cy="74" r="5" fill="#f43f5e" />
      {/* trunk dot */}
      <circle cx="120" cy="32" r="3" fill="#a1a1aa" />
    </svg>
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

/* ─────────────── 커리큘럼 ─────────────── */

type CurriculumPlan = {
  id: string;
  badge: string;
  badgeClass: string;
  title: string;
  subtitle: string;
  daily: string;
  total: string;
  audience: string;
  schedule: { when: string; what: string }[];
  recommended?: boolean;
  accent: string;
  hoverBorder: string;
};

const CURRICULUM: CurriculumPlan[] = [
  {
    id: "2week",
    badge: "추천 ★",
    badgeClass: "bg-amber-50 text-amber-700 ring-amber-100",
    title: "2주 핵심 집중",
    subtitle: "이론을 가볍게 한 번, CBT로 회독",
    daily: "30분 / 일",
    total: "약 7시간",
    audience: "한 번 풀어봤거나, 약점이 보이는 경우",
    recommended: true,
    schedule: [
      { when: "1주차 전반", what: "선택 학습 · 과목별 카드 1회독" },
      { when: "1주차 후반", what: "선택 학습 · 약점만 오디오·시뮬 교차" },
      { when: "2주차", what: "마무리 학습 · CBT 매일 1회 + 강의 보강" },
      { when: "D-1", what: "최근 점수 안정 — 합격선 위 확인" },
    ],
    accent: "from-amber-500 via-orange-500 to-rose-500",
    hoverBorder: "hover:border-amber-400",
  },
  {
    id: "4week",
    badge: "여유 누적 🌱",
    badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    title: "4주 안정 누적",
    subtitle: "이론을 여유 있게, 마무리도 충분히",
    daily: "20분 / 일",
    total: "약 10시간+",
    audience: "처음부터 차근차근 가는 경우",
    schedule: [
      { when: "1주차", what: "선택 학습 · 카드 회독 시작" },
      { when: "2주차", what: "선택 학습 · 오디오 + 시뮬로 약점 교차" },
      { when: "3주차", what: "마무리 학습 · CBT 회차 + 강의 해설" },
      { when: "4주차", what: "마무리 학습 · 점수 안정 + 약점 정리" },
    ],
    accent: "from-emerald-500 via-teal-500 to-sky-500",
    hoverBorder: "hover:border-emerald-400",
  },
];

function CurriculumCard({ plan }: { plan: CurriculumPlan }) {
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
        plan.recommended
          ? "border-amber-300 ring-2 ring-amber-100"
          : "border-zinc-200"
      } ${plan.hoverBorder}`}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${plan.accent}`} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${plan.badgeClass}`}
          >
            {plan.badge}
          </span>
          {plan.recommended && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black tracking-wider text-amber-800">
              BEST
            </span>
          )}
        </div>
        <h3 className="mt-3 text-xl font-bold tracking-tight text-zinc-900">
          {plan.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-600">{plan.subtitle}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-zinc-50 p-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              일일
            </p>
            <p
              className={`mt-0.5 bg-gradient-to-r ${plan.accent} bg-clip-text text-base font-black text-transparent`}
            >
              {plan.daily}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              총 학습
            </p>
            <p
              className={`mt-0.5 bg-gradient-to-r ${plan.accent} bg-clip-text text-base font-black text-transparent`}
            >
              {plan.total}
            </p>
          </div>
        </div>

        <ol className="mt-5 space-y-2.5">
          {plan.schedule.map((s) => (
            <li
              key={s.when}
              className="flex items-start gap-3 text-[13px] leading-relaxed"
            >
              <span
                className={`mt-0.5 inline-flex h-6 w-20 shrink-0 items-center justify-center rounded-md bg-gradient-to-r ${plan.accent} text-[10px] font-black tracking-wider text-white shadow-sm`}
              >
                {s.when}
              </span>
              <span className="text-zinc-700">{s.what}</span>
            </li>
          ))}
        </ol>

        <div className="mt-auto pt-5">
          <p className="rounded-xl border border-dashed border-zinc-200 bg-white px-3 py-2.5 text-[12px] leading-relaxed text-zinc-600">
            <span className="font-bold text-zinc-900">이런 분께</span> ·{" "}
            {plan.audience}
          </p>
        </div>
      </div>
    </article>
  );
}
