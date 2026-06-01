import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  topicsBySubject,
  totalDurationSec,
  formatDuration,
} from "@/lib/audiobook/data";
import { AUDIOBOOK_SUBJECTS } from "@/lib/audiobook/types";
import { SUBJECT_THEME } from "@/lib/v3/theme";
import WhyBox from "@/components/v3/WhyBox";

export const metadata: Metadata = {
  title: "5분 핵심 요약 오디오북 — 과목별로 듣기",
  description:
    "한 챕터를 5분으로 압축한 핵심 요약. 출퇴근·산책 중 과목별로 흘려듣기만 해도 합격 키워드가 남아요.",
};

export default function V3AudiobookPage() {
  const totalTopics = AUDIOBOOK_SUBJECTS.reduce(
    (sum, s) => sum + topicsBySubject(s).length,
    0,
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      {/* ============ HERO (PART A) ============ */}
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
              className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-black text-white shadow-sm"
            >
              A
            </span>
            <p className="text-[11px] font-bold tracking-[0.22em] text-violet-600">
              PART A · 이론 보조학습
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-[1.2] tracking-tight text-zinc-900 sm:text-4xl">
            5분 핵심 요약 오디오북
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
            한 챕터를{" "}
            <strong className="font-semibold text-zinc-800">약 5분</strong>으로
            압축한 핵심 요약. 콘텐츠는 5분 요약 하나라{" "}
            <strong className="font-semibold text-zinc-800">
              과목만 고르면 바로
            </strong>{" "}
            들을 수 있어요. 출퇴근·산책 중 흘려듣기만 해도 키워드가 남아요.
          </p>

          {/* 왜 좋은지 — 장점 */}
          <WhyBox
            tone="rose"
            title="왜 5분 요약 오디오북이 좋을까요?"
            points={[
              "눈이 바쁜 출퇴근·산책·운전 중에도 학습이 쌓여요 — 자투리 시간이 곧 회독.",
              "한 챕터 5분이라 부담 없이 반복 — 흘려들어도 합격 키워드가 남습니다.",
              "이미 본 챕터의 빠른 복습, 시험 직전 마지막 정리에 특히 강해요.",
            ]}
          />

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>🎧</span>
              {totalTopics}개 챕터
            </span>
            <span aria-hidden className="text-zinc-300">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>⚡</span>
              챕터당 약 5분
            </span>
            <span aria-hidden className="text-zinc-300">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>🎯</span>3 과목
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <header>
          <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold tracking-[0.2em] text-rose-700 ring-1 ring-rose-100">
            BY SUBJECT
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            과목을 골라 들어보세요
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
            과목을 누르면 5분 요약 챕터가 순서대로 재생돼요. 듣다가 약한 곳이
            보이면 그 챕터만 다시 들으면 됩니다.
          </p>
        </header>

        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {AUDIOBOOK_SUBJECTS.map((subject) => {
            const t = SUBJECT_THEME[subject];
            const topics = topicsBySubject(subject);
            const dur = formatDuration(totalDurationSec("summary", subject));
            return (
              <Link
                key={subject}
                href={`/audiobook/summary/${subject}`}
                className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ${t.ring} transition hover:-translate-y-1 hover:shadow-2xl`}
              >
                <div
                  className={`relative h-24 bg-gradient-to-br ${t.gradient} p-5 text-white`}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4), transparent 40%)",
                    }}
                  />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.18em] opacity-80">
                        5분 핵심 요약
                      </p>
                      <h3 className="mt-1 text-xl font-bold">{subject}</h3>
                    </div>
                    <span className="text-3xl">🎧</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500">
                    <span className="rounded-full bg-zinc-50 px-2 py-0.5 ring-1 ring-zinc-100">
                      {topics.length}개 챕터
                    </span>
                    <span className="rounded-full bg-zinc-50 px-2 py-0.5 ring-1 ring-zinc-100">
                      ⚡ {dur}
                    </span>
                  </div>

                  {/* 챕터 미리보기 — 앞 3개 */}
                  <ul className="mt-3 space-y-1.5">
                    {topics.slice(0, 3).map((tp) => (
                      <li
                        key={tp.id}
                        className="flex items-center gap-2 text-[13px] text-zinc-600"
                      >
                        <span
                          aria-hidden
                          className={`grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gradient-to-br ${t.gradient} text-[9px] font-black text-white`}
                        >
                          {tp.no}
                        </span>
                        <span className="truncate">{tp.title}</span>
                      </li>
                    ))}
                    {topics.length > 3 && (
                      <li className="pl-6 text-[12px] text-zinc-400">
                        + {topics.length - 3}개 더
                      </li>
                    )}
                  </ul>

                  <span
                    className={`mt-auto pt-4 inline-flex items-center gap-1 text-sm font-bold ${t.accent} transition group-hover:gap-1.5`}
                  >
                    이 과목 듣기 →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
