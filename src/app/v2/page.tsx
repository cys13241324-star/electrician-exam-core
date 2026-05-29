import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { presetCards } from "@/lib/flashcards/data";
import { ALL_SUBJECTS, CHAPTER_DEFS } from "@/lib/flashcards/chapters";
import { TOOL_LINKS } from "@/lib/v2/theme";
import FreeLaunchModal from "@/components/v2/FreeLaunchModal";

export const metadata: Metadata = {
  title: "전기기능사 — 5분 진단부터 합격까지",
  description:
    "샘플 진단으로 약점 찾고, 과목별로 채우고, 다시 풀어 확인하고. 강의 없이 합격까지의 가장 짧은 길.",
};

export default function V2HomePage() {
  const totalCards = presetCards.length;
  const totalChapters = ALL_SUBJECTS.reduce(
    (sum, s) => sum + CHAPTER_DEFS[s].length,
    0,
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <FreeLaunchModal />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(56,189,248,0.35) 0px, transparent 40%), radial-gradient(circle at 80% 30%, rgba(168,85,247,0.3) 0px, transparent 45%), radial-gradient(circle at 50% 80%, rgba(16,185,129,0.25) 0px, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-wider text-sky-300 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              전기기능사 필기 · 2026 출제기준
            </span>
            <span className="relative inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-500 px-3 py-1 text-[11px] font-bold tracking-wider text-white shadow-md">
              <span
                aria-hidden
                className="absolute -left-1 -top-1 flex h-2.5 w-2.5"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
              </span>
              <span aria-hidden>🎁</span>
              기간 한정 100% 무료
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[3.5rem]">
            전기기능사 필기 합격,
            <br />
            <span className="bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              처음부터 끝까지.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-300 sm:text-lg">
            5분 진단으로 시작해서, 합격선 위에서 끝납니다. 강의 없이도
            가능하도록 도구를 정교하게 짰어요.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#step1"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <span aria-hidden>⚡</span>
              지금 5분 진단 시작
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            <Link
              href="/v2/subjects"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              <span aria-hidden>📚</span>
              과목 먼저 둘러보기
            </Link>
          </div>

          {/* 지표 바 */}
          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            <Stat emoji="🃏" value={`${totalCards}+`} label="핵심 카드" />
            <Stat emoji="📚" value={`${totalChapters}`} label="챕터" />
            <Stat emoji="🎯" value="3" label="과목 커버" />
          </div>
        </div>
      </section>

      {/* 미세한 그라데이션 배경 + 점 패턴 */}
      <main className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 0% 0%, rgba(56,189,248,0.08), transparent 50%), radial-gradient(circle at 100% 20%, rgba(168,85,247,0.08), transparent 50%)",
          }}
        />

        {/* 학습 여정 — 서사 도입부 */}
        <header className="mb-20">
          <div className="flex flex-col items-center text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-blue-700 ring-1 ring-blue-100">
              <span aria-hidden>🗺️</span>
              LEARNING JOURNEY
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              처음 보는 분도,{" "}
              <span className="bg-gradient-to-r from-sky-600 via-violet-600 to-rose-600 bg-clip-text text-transparent">
                4단계로 끝
              </span>
              납니다.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-600">
              🩺 진단으로 시작해서 🏁 합격선 위까지.
              <br className="hidden sm:block" />
              한 줄로 이어지는 합격 시나리오를 직접 따라가 보세요.
            </p>
          </div>

          {/* 감정 곡선 + 이모지 (4점) */}
          <div className="mx-auto mt-12 max-w-xl">
            <div className="relative flex items-end justify-between">
              {/* 연결선 (배경) */}
              <span
                aria-hidden
                className="absolute left-7 right-7 top-7 h-0.5 rounded-full bg-gradient-to-r from-sky-300 via-violet-300 via-amber-300 to-rose-300"
              />
              {[
                {
                  emoji: "😵",
                  label: "막막함",
                  how: "일단 5분만 풀기",
                  bg: "bg-sky-500",
                  ring: "ring-sky-100",
                },
                {
                  emoji: "💡",
                  label: "발견",
                  how: "약점 과목 찾기",
                  bg: "bg-violet-500",
                  ring: "ring-violet-100",
                },
                {
                  emoji: "🛠",
                  label: "체득",
                  how: "도구 3겹 교차",
                  bg: "bg-amber-500",
                  ring: "ring-amber-100",
                },
                {
                  emoji: "🎯",
                  label: "안정",
                  how: "매일 한 회씩",
                  bg: "bg-rose-500",
                  ring: "ring-rose-100",
                },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="relative flex flex-col items-center"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[26px] shadow-md ring-4 ${s.ring} motion-safe:animate-journey-float`}
                    style={{ animationDelay: `${i * 0.25}s` }}
                  >
                    {s.emoji}
                  </div>
                  <span
                    className={`mt-2.5 inline-block h-1.5 w-1.5 rounded-full ${s.bg}`}
                  />
                  <span className="mt-2 text-sm font-bold tracking-wide text-zinc-800">
                    {s.label}
                  </span>
                  <span className="mt-1 max-w-[7.5rem] text-center text-[11px] leading-tight text-zinc-500">
                    {s.how}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* STEP 1 — 진단 */}
        <StepBlock
          id="step1"
          stepLabel="STEP 1"
          stepColor="from-sky-500 to-blue-600"
          emoji="🩺"
          tag="진단"
          quote="지금 풀면 몇 점이나 나올까…?"
          title="먼저 5분만 풀어보세요"
          lede="아무 준비 없이 그냥 풀어요. 어디가 약한지 우리가 정확히 짚어드릴게요."
          bullets={[
            "출제기준 반영 샘플 60문항 중 10문항 발췌",
            "객관식 자동 채점 · 결과는 STEP 2에서 연결",
            "회원가입 없이 바로 시작",
          ]}
          ctaPrimary={{ label: "샘플 CBT 풀기", href: "/cbt" }}
          ctaSecondary={{ label: "샘플 미리보기", href: "/cbt/exams" }}
          mock={<DiagnoseMock />}
          mockOnRight
        />

        <StepConnector
          emoji="🩹"
          label="진단지에 빨간 줄이 보이기 시작했죠"
          sub="다행히 우린, 어디가 빨간 줄인지 정확히 압니다"
        />

        {/* STEP 2 — 분석 / 과목 채움 */}
        <StepBlock
          id="step2"
          stepLabel="STEP 2"
          stepColor="from-violet-500 to-fuchsia-600"
          emoji="🧩"
          tag="채움"
          quote="어디부터 손대야 할지 모르겠어…"
          title="진단 결과로 내 과목을 골라보세요"
          lede="강점 과목은 회독으로 가볍게, 약점 과목은 카드·시뮬로 깊게. 진단에서 나온 데이터로 학습 강도를 자동으로 분기해요."
          bullets={[
            "과목별 정답률·취약 챕터 자동 분석",
            "강점은 회독 모드, 약점은 집중 모드",
            "추천 카드 묶음을 한 번에 학습",
          ]}
          ctaPrimary={{ label: "내 과목 보러가기", href: "/v2/subjects" }}
          mock={<AnalysisMock />}
        />

        <StepConnector
          emoji="📚"
          label="채웠는데도 자꾸 막히는 곳이 있죠"
          sub="약점은 한 번 더, 도구를 바꿔가며"
        />

        {/* STEP 3 — 도구 교차로 약점 보강 */}
        <StepBlock
          id="step3"
          stepLabel="STEP 3"
          stepColor="from-amber-500 to-orange-600"
          emoji="🛠"
          tag="보강"
          quote="이건 자꾸 막혀… 다른 방식으로 보면 보일까?"
          title="약점만 깊게, 도구를 바꿔가며"
          lede="같은 주제를 카드로 외우고, 오디오로 흘려듣고, 시뮬로 만져보세요. 기억의 결이 3겹으로 쌓여 절대 안 잊혀요."
          bullets={[
            "약점 토픽을 카드·오디오·시뮬 3가지로 교차",
            "기억의 결을 늘려 잊히지 않는 학습",
            "10분이면 한 토픽을 세 번 만나요",
          ]}
          ctaPrimary={{ label: "약점 보강 시작", href: "/v2/subjects" }}
          ctaSecondary={{ label: "오늘 약점만 모아보기", href: "/v2/today" }}
          mock={<ReinforceMock />}
          mockOnRight
        />

        <StepConnector
          emoji="🚀"
          label="체득이 끝나면, 회차 반복으로 안정"
          sub="합격선 위에서 점수가 안정될 때까지"
        />

        {/* STEP 4 — 회차 반복으로 합격선 안착 */}
        <StepBlock
          id="step4"
          stepLabel="STEP 4"
          stepColor="from-rose-500 to-pink-600"
          emoji="🔄"
          tag="반복"
          quote="한 번 풀어선 모르겠어… 점수가 안정될 때까지."
          title="회차 반복으로 합격선 위에 안착"
          lede="1주~4주 페이스로 CBT 회차를 매일 한 번씩. 오답마다 카드·시뮬·해설 강의가 자동 연결되며 점수가 합격선 위에서 안정돼요."
          bullets={[
            "연도별·회차별 60문항 매일 한 번씩",
            "오답 → 카드·시뮬·해설 강의 자동 연결",
            "합격선(60점) 위에서 점수 안정 추적",
          ]}
          ctaPrimary={{ label: "CBT 회차 시작", href: "/cbt/exams" }}
          ctaSecondary={{ label: "응시 기록 보기", href: "/cbt" }}
          mock={<RepeatMock />}
        />

        {/* 커리큘럼 — STEP 1~4 본 뒤, 페이스 선택 */}
        <section className="mt-16 sm:mt-20">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-amber-700 ring-1 ring-amber-100">
              <span aria-hidden>📅</span>
              HOW TO USE
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              4단계를 본 뒤,{" "}
              <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
                내 페이스를 골라보세요.
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
              시험까지 남은 시간에 맞춰 STEP 1→4의 반복 주기를 다르게 잡아요.
              같은 도구를, 다른 속도로.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {CURRICULUM.map((c) => (
              <CurriculumCard key={c.id} plan={c} />
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-zinc-500">
            💡 어떤 페이스든 4단계 시나리오를 그대로 따라가요. 반복 주기만
            달라져요.
          </p>
        </section>

        {/* OUTRO — 그리고, 매일 */}
        <section className="mt-12 sm:mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-7 py-9 sm:px-12 sm:py-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-br from-emerald-200/40 to-sky-200/40 blur-3xl"
            />
            <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-emerald-700 ring-1 ring-emerald-100">
                  <span aria-hidden>🌅</span>
                  AND EVERY DAY
                </p>
                <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-[28px]">
                  그리고,{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                    매일.
                  </span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-[15px]">
                  4단계를 한 번 돌고 나면, 이제 합격선 위에서 페이스만 유지하면
                  돼요. 어제 멈춘 곳·약점·다음 진도를 매일 골라 추천해드릴게요.
                </p>
              </div>
              <Link
                href="/v2/today"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                오늘의 학습 받기 <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative mt-20 overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-900 px-8 py-14 sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 90% 10%, rgba(56,189,248,0.35), transparent 40%), radial-gradient(circle at 10% 90%, rgba(168,85,247,0.25), transparent 45%)",
            }}
          />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-lg">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.22em] text-sky-300">
                <span aria-hidden>🚀</span>
                READY TO START?
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
                지금 풀어보면, 약점이 정리됩니다
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                결제도 가입도 없이 5분. 🎁 지금은 기간 한정으로 전 기능 무료예요.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/cbt"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                지금 진단 시작 →
              </Link>
              <Link
                href="/v2/subjects"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                과목부터 보기
              </Link>
            </div>
          </div>
        </section>

        {/* 하단 도구 */}
        <section className="mt-14 border-t border-zinc-200 pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] text-zinc-500">
              <span aria-hidden>🧰</span>
              ALL TOOLS
            </p>
            <p className="text-[11px] text-zinc-400">
              과목 구분 없이 도구로 둘러보기
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {TOOL_LINKS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
              >
                <span className="text-xl">{t.emoji}</span>
                <div className="flex-1 leading-tight">
                  <p className="text-[13px] font-bold text-zinc-900">{t.name}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{t.note}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-5 text-xs text-zinc-400">
            기존 메인은{" "}
            <Link href="/" className="underline hover:text-zinc-700">
              여기
            </Link>
            에서 그대로 사용할 수 있어요.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ──────────────── Curriculum (1주 / 2주 / 4주+) ──────────────── */

type CurriculumPlan = {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  daily: string;
  totalLabel: string;
  total: string;
  audience: string;
  schedule: { day: string; task: string }[];
  recommended?: boolean;
  accent: string; // gradient
  chip: string; // chip classes
  ringHover: string; // hover border
};

const CURRICULUM: CurriculumPlan[] = [
  {
    id: "1week",
    badge: "단기 마감 ⚡",
    badgeColor: "bg-rose-50 text-rose-700 ring-rose-100",
    title: "1주 단기 합격",
    subtitle: "시험이 코앞 — 핵심만 농축 회독",
    daily: "60분 / 일",
    totalLabel: "총 학습",
    total: "약 7시간",
    audience: "기능사 처음이지만 시간이 부족한 경우",
    schedule: [
      { day: "D-7", task: "STEP 1 진단 · 약점 즉시 파악" },
      { day: "D-5", task: "STEP 2 약점 과목 카드 집중 채움" },
      { day: "D-3", task: "STEP 3 약점 보강 · 도구 교차" },
      { day: "D-2~1", task: "STEP 4 회차 반복 · 합격선 안착" },
    ],
    accent: "from-rose-500 via-pink-500 to-fuchsia-500",
    chip: "bg-rose-50 text-rose-700 ring-rose-100",
    ringHover: "hover:border-rose-300",
  },
  {
    id: "2week",
    badge: "추천 ★",
    badgeColor: "bg-amber-50 text-amber-700 ring-amber-100",
    title: "2주 안정권",
    subtitle: "약점이 명확 — 균형 잡힌 페이스",
    daily: "30분 / 일",
    totalLabel: "총 학습",
    total: "약 7시간",
    audience: "한 번 풀어봤거나, 약점이 보이는 경우",
    recommended: true,
    schedule: [
      { day: "1주차", task: "STEP 1 진단 + STEP 2 약점 과목 채움" },
      { day: "1주차 말", task: "STEP 3 약점 토픽 도구 교차 보강" },
      { day: "2주차", task: "STEP 4 회차 매일 1회 + 자동 보강" },
      { day: "D-1", task: "최근 점수 안정 — 합격선 위 확인" },
    ],
    accent: "from-amber-500 via-orange-500 to-rose-500",
    chip: "bg-amber-50 text-amber-700 ring-amber-100",
    ringHover: "hover:border-amber-400",
  },
  {
    id: "4week",
    badge: "여유 누적 🌱",
    badgeColor: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    title: "4주 이상 체득",
    subtitle: "처음부터 차근차근 — 매일의 누적",
    daily: "20분 / 일",
    totalLabel: "총 학습",
    total: "약 10시간+",
    audience: "처음부터 준비하거나, 여유 있게 가는 경우",
    schedule: [
      { day: "1주차", task: "STEP 1 진단 + STEP 2 카드 회독 시작" },
      { day: "2주차", task: "STEP 2 5분 오디오·과목 채움 누적" },
      { day: "3주차", task: "STEP 3 약점 토픽 시뮬·카드 교차" },
      { day: "4주차", task: "STEP 4 회차 매일 1회 · 점수 안정" },
    ],
    accent: "from-emerald-500 via-teal-500 to-sky-500",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    ringHover: "hover:border-emerald-300",
  },
];

function CurriculumCard({ plan }: { plan: CurriculumPlan }) {
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl ${
        plan.recommended
          ? "border-amber-300 ring-2 ring-amber-100"
          : "border-zinc-200"
      } ${plan.ringHover}`}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${plan.accent}`} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${plan.badgeColor}`}
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

        {/* 메트릭 두 줄 */}
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
              {plan.totalLabel}
            </p>
            <p
              className={`mt-0.5 bg-gradient-to-r ${plan.accent} bg-clip-text text-base font-black text-transparent`}
            >
              {plan.total}
            </p>
          </div>
        </div>

        {/* 일정 */}
        <ol className="mt-5 space-y-2.5">
          {plan.schedule.map((s) => (
            <li
              key={s.day}
              className="flex items-start gap-3 text-[13px] leading-relaxed"
            >
              <span
                className={`mt-0.5 inline-flex h-6 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-r ${plan.accent} text-[10px] font-black tracking-wider text-white shadow-sm`}
              >
                {s.day}
              </span>
              <span className="text-zinc-700">{s.task}</span>
            </li>
          ))}
        </ol>

        {/* 적합 대상 */}
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

/* ──────────────── Reusable Blocks ──────────────── */

function Stat({
  emoji,
  value,
  label,
}: {
  emoji?: string;
  value: string;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        {emoji && (
          <span aria-hidden className="text-lg sm:text-xl">
            {emoji}
          </span>
        )}
        <p className="text-2xl font-bold text-white sm:text-3xl">{value}</p>
      </div>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-zinc-400">
        {label}
      </p>
    </div>
  );
}

type StepBlockProps = {
  id: string;
  stepLabel: string;
  stepColor: string;
  /** 헤더용 아이콘 이모지 */
  emoji: string;
  /** STEP 한 줄 태그 (예: "진단") */
  tag: string;
  /** 수험생 1인칭 독백 — 감정 한 줄 */
  quote: string;
  title: string;
  lede: string;
  bullets: string[];
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  mock: React.ReactNode;
  mockOnRight?: boolean;
};

function StepBlock({
  id,
  stepLabel,
  stepColor,
  emoji,
  tag,
  quote,
  title,
  lede,
  bullets,
  ctaPrimary,
  ctaSecondary,
  mock,
  mockOnRight = false,
}: StepBlockProps) {
  // "STEP 1" → "01"
  const stepNumber = stepLabel.replace(/[^0-9]/g, "").padStart(2, "0");

  const text = (
    <div className="max-w-xl">
      {/* 1인칭 독백 */}
      <div className="mb-5 flex items-stretch gap-3">
        <span
          aria-hidden
          className={`block w-[3px] shrink-0 rounded-full bg-gradient-to-b ${stepColor}`}
        />
        <blockquote className="text-base font-medium italic leading-snug text-zinc-500 sm:text-lg">
          <span className="mr-0.5 text-zinc-300">“</span>
          {quote}
          <span className="ml-0.5 text-zinc-300">”</span>
        </blockquote>
      </div>
      <h3 className="text-2xl font-bold leading-[1.2] tracking-tight text-zinc-900 sm:text-3xl">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">{lede}</p>
      <ul className="mt-5 space-y-2.5">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-3 text-[14px] leading-relaxed text-zinc-700"
          >
            <span
              className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r ${stepColor}`}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Link
          href={ctaPrimary.href}
          className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${stepColor} px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg`}
        >
          {ctaPrimary.label} <span aria-hidden>→</span>
        </Link>
        {ctaSecondary && (
          <Link
            href={ctaSecondary.href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
          >
            {ctaSecondary.label}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <section
      id={id}
      className="scroll-mt-24 relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
    >
      {/* 상단 컬러 띠 */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${stepColor}`} />

      {/* 헤더: STEP 번호 + 이모지 + 라벨 */}
      <div className="flex items-center gap-4 border-b border-zinc-100 px-7 py-5 sm:px-10">
        <div className="relative">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${stepColor} text-2xl shadow-md`}
            aria-hidden
          >
            {emoji}
          </div>
          <span
            className={`absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-lg border-2 border-white bg-zinc-900 text-[10px] font-black text-white shadow-sm`}
          >
            {stepNumber}
          </span>
        </div>
        <div className="flex-1 leading-tight">
          <p
            className={`bg-gradient-to-r ${stepColor} bg-clip-text text-sm font-black tracking-[0.2em] text-transparent sm:text-base`}
          >
            {stepLabel} · {tag}
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-500">
            합격 시나리오 · {stepNumber} / 04
          </p>
        </div>
        {/* 진행 4점 */}
        <div className="hidden items-center gap-1 sm:flex">
          {Array.from({ length: 4 }).map((_, i) => {
            const active = i < Number(stepNumber);
            return (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  active
                    ? `w-5 bg-gradient-to-r ${stepColor}`
                    : "w-1.5 bg-zinc-200"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 본문 */}
      <div className="grid items-center gap-10 px-7 py-10 sm:px-10 sm:py-12 md:grid-cols-2">
        {mockOnRight ? (
          <>
            {text}
            <div className="md:order-last">{mock}</div>
          </>
        ) : (
          <>
            <div>{mock}</div>
            {text}
          </>
        )}
      </div>

      {/* 워터마크 큰 숫자 — 더 연하게 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-2 select-none text-[8rem] font-black leading-none text-zinc-100/60"
      >
        {stepNumber}
      </span>
    </section>
  );
}

function StepConnector({
  emoji,
  label,
  sub,
}: {
  emoji?: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="my-10 flex flex-col items-center gap-4 sm:my-12">
      <span
        aria-hidden
        className="h-10 w-px bg-gradient-to-b from-transparent to-zinc-300"
      />
      {emoji && (
        <span
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-md ring-1 ring-zinc-100"
        >
          {emoji}
        </span>
      )}
      <div className="flex max-w-md flex-col items-center gap-1 text-center">
        <p className="text-sm font-bold text-zinc-700 sm:text-base">{label}</p>
        {sub && (
          <p className="text-xs leading-relaxed text-zinc-500">{sub}</p>
        )}
      </div>
      <span
        aria-hidden
        className="h-10 w-px bg-gradient-to-t from-transparent to-zinc-300"
      />
    </div>
  );
}

/* ──────────────── Mock Previews ──────────────── */

function DiagnoseMock() {
  return (
    <div className="overflow-hidden rounded-2xl bg-zinc-900 text-zinc-100 shadow-xl ring-1 ring-black/5">
      <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-950/60 px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-rose-400" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <p className="ml-2 text-[11px] text-zinc-400">샘플 진단 · 5분</p>
        <span className="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
          진행 3/10
        </span>
      </div>
      <div className="space-y-3 px-5 py-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
          전기이론 · 직류회로
        </p>
        <p className="text-sm font-semibold text-white">
          24 V 전원에 8 Ω의 저항이 연결되어 있을 때 흐르는 전류는?
        </p>
        <div className="space-y-1.5 pt-1">
          {[
            { l: "① 2 A", on: false },
            { l: "② 3 A", on: true },
            { l: "③ 4 A", on: false },
            { l: "④ 6 A", on: false },
          ].map((o) => (
            <div
              key={o.l}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                o.on
                  ? "border-sky-400 bg-sky-500/10 text-sky-200"
                  : "border-white/10 bg-white/5 text-zinc-300"
              }`}
            >
              {o.l}
              {o.on && <span className="ml-auto text-[10px]">선택됨</span>}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-zinc-400">
          <span>⏱ 02:14</span>
          <span className="rounded bg-white/10 px-2 py-0.5">다음 →</span>
        </div>
      </div>
    </div>
  );
}

function AnalysisMock() {
  const rows = [
    { name: "전기이론", score: 72, color: "from-sky-500 to-blue-600" },
    { name: "전기기기", score: 48, color: "from-violet-500 to-fuchsia-600" },
    { name: "전기설비", score: 55, color: "from-emerald-500 to-teal-500" },
  ];
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200">
      <div className="border-b border-zinc-100 bg-zinc-50 px-5 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          진단 리포트
        </p>
        <p className="mt-0.5 text-sm font-bold text-zinc-900">
          예상 점수 · 58점 / 100
        </p>
      </div>
      <div className="space-y-4 px-5 py-5">
        {rows.map((r) => (
          <div key={r.name}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-800">{r.name}</span>
              <span className="font-bold text-zinc-900">{r.score}점</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${r.color}`}
                style={{ width: `${r.score}%` }}
              />
            </div>
          </div>
        ))}
        <div className="mt-2 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
            우선 보강 추천
          </p>
          <p className="mt-0.5 text-sm font-semibold text-amber-900">
            전기기기 · 변압기 · 권수비
          </p>
        </div>
      </div>
    </div>
  );
}

function ReinforceMock() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200">
      <div className="border-b border-zinc-100 bg-amber-50 px-5 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
          오늘의 약점 보강
        </p>
        <p className="mt-0.5 text-sm font-bold text-zinc-900">
          전기기기 · 변압기 권수비
        </p>
      </div>
      <div className="space-y-2.5 px-5 py-5">
        {[
          {
            emoji: "🃏",
            tag: "카드 5장",
            title: "공식·기호 한 번에",
            note: "2분 — 회독",
            on: true,
          },
          {
            emoji: "🎧",
            tag: "오디오 5분",
            title: "변압기 핵심 요약",
            note: "걸으며 듣기 OK",
            on: false,
          },
          {
            emoji: "⚡",
            tag: "시뮬 1개",
            title: "권수비 직접 조작",
            note: "그래프로 체득",
            on: false,
          },
        ].map((r) => (
          <div
            key={r.tag}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
              r.on
                ? "border-amber-300 bg-amber-50/50 ring-2 ring-amber-100"
                : "border-zinc-200 bg-white"
            }`}
          >
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-lg shadow-sm">
              {r.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                {r.tag}
              </p>
              <p className="text-sm font-bold text-zinc-900">{r.title}</p>
              <p className="mt-0.5 text-[11px] text-zinc-500">{r.note}</p>
            </div>
            <span
              className={`text-xs font-bold ${
                r.on ? "text-amber-700" : "text-zinc-400"
              }`}
            >
              {r.on ? "지금" : "→"}
            </span>
          </div>
        ))}
        <div className="mt-1 rounded-xl bg-emerald-50 px-3 py-2 ring-1 ring-emerald-100">
          <p className="text-[11px] font-bold text-emerald-700">
            ✓ 같은 주제를 3겹으로 — 잊히지 않아요
          </p>
        </div>
      </div>
    </div>
  );
}

function RepeatMock() {
  const passLine = 60;
  const attempts = [
    { day: "D1", score: 52, label: "2024-1회" },
    { day: "D2", score: 58, label: "2024-2회" },
    { day: "D3", score: 64, label: "2023-3회" },
    { day: "D4", score: 71, label: "2023-1회" },
    { day: "D5", score: 76, label: "2022-2회" },
  ];
  const max = 100;
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200">
      <div className="flex items-center justify-between border-b border-zinc-100 bg-rose-50 px-5 py-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
            회차 반복 트래커
          </p>
          <p className="mt-0.5 text-sm font-bold text-zinc-900">
            최근 5회차 · 평균 <span className="text-emerald-600">+5점/회</span>
          </p>
        </div>
        <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-700">
          🔄 매일 1회
        </span>
      </div>
      <div className="px-5 py-5">
        {/* 점수 추이 바 차트 */}
        <div className="relative">
          <div className="flex h-32 items-end justify-between gap-1.5">
            {attempts.map((a) => {
              const pct = (a.score / max) * 100;
              const passed = a.score >= passLine;
              return (
                <div
                  key={a.day}
                  className="flex flex-1 flex-col items-center gap-1.5"
                >
                  <span
                    className={`text-[10px] font-black ${
                      passed ? "text-emerald-700" : "text-zinc-500"
                    }`}
                  >
                    {a.score}
                  </span>
                  <div className="relative flex w-full flex-1 items-end">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        passed
                          ? "bg-gradient-to-t from-emerald-500 to-emerald-400"
                          : "bg-gradient-to-t from-rose-400 to-pink-400"
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500">
                    {a.day}
                  </span>
                </div>
              );
            })}
          </div>
          {/* 합격선 라인 */}
          <div
            className="pointer-events-none absolute inset-x-0 flex items-center"
            style={{ bottom: `${(passLine / max) * 100 * 0.78}%` }}
            aria-hidden
          >
            <span className="h-px w-full border-t border-dashed border-emerald-500/70" />
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] font-bold text-emerald-700">
          ─ ─ ─ 합격선 60점 (D3부터 안정 진입)
        </p>

        {/* 자동 보강 라벨 */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-100">
          <span aria-hidden className="text-base">
            🛠
          </span>
          <p className="text-[12px] leading-relaxed text-amber-900">
            오답마다 <strong>카드 · 시뮬 · 해설 강의</strong>가 자동으로 따라
            붙어요.
          </p>
        </div>
      </div>
    </div>
  );
}


