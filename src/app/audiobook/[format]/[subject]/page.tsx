import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubjectChapterList from "@/components/audiobook/SubjectChapterList";
import {
  chaptersByFormatAndSubject,
  formatDuration,
  totalDurationSec,
} from "@/lib/audiobook/data";
import {
  AUDIOBOOK_FORMATS,
  AUDIOBOOK_SUBJECTS,
  FORMAT_META,
} from "@/lib/audiobook/types";
import type { Format, Subject } from "@/lib/audiobook/types";

export async function generateStaticParams() {
  return AUDIOBOOK_FORMATS.flatMap((format) =>
    AUDIOBOOK_SUBJECTS.map((subject) => ({ format, subject })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ format: string; subject: string }>;
}): Promise<Metadata> {
  const { format, subject } = await params;
  const decoded = decodeURIComponent(subject);
  if (
    !AUDIOBOOK_FORMATS.includes(format as Format) ||
    !AUDIOBOOK_SUBJECTS.includes(decoded as Subject)
  ) {
    return { title: "오디오북" };
  }
  const meta = FORMAT_META[format as Format];
  return {
    title: `${decoded} · ${meta.short}`,
    description: `${decoded} ${meta.label} 챕터 목록.`,
  };
}

const SUBJECT_INTRO: Record<Subject, string> = {
  전기이론: "회로 해석의 기초부터 3상 교류까지 — 학습의 출발점.",
  전기기기: "직류기·동기기·유도기·변압기·전력변환의 핵심을 챕터별로.",
  전기설비: "전선·배선·차단·접지·수변전·KEC의 실무 기준과 시험 포인트.",
};

const SUBJECT_THEME: Record<
  Subject,
  { dot: string; bar: string }
> = {
  전기이론: { dot: "bg-blue-500", bar: "from-blue-400 to-blue-600" },
  전기기기: { dot: "bg-violet-500", bar: "from-violet-400 to-violet-600" },
  전기설비: { dot: "bg-amber-500", bar: "from-amber-400 to-amber-600" },
};

export default async function AudiobookFormatSubjectPage({
  params,
}: {
  params: Promise<{ format: string; subject: string }>;
}) {
  const { format, subject: rawSubject } = await params;
  const decoded = decodeURIComponent(rawSubject);
  if (
    !AUDIOBOOK_FORMATS.includes(format as Format) ||
    !AUDIOBOOK_SUBJECTS.includes(decoded as Subject)
  )
    notFound();

  const fmt = format as Format;
  const subject = decoded as Subject;
  const meta = FORMAT_META[fmt];
  const list = chaptersByFormatAndSubject(fmt, subject);
  const subjectTheme = SUBJECT_THEME[subject];
  const totalSec = totalDurationSec(fmt, subject);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-4 sm:px-6 sm:py-5">
        {/* Breadcrumb */}
        <nav
          aria-label="위치"
          className="flex min-w-0 items-center gap-1.5 text-xs text-zinc-500"
        >
          <Link
            href="/audiobook"
            className="shrink-0 rounded-md px-1 py-0.5 font-medium transition hover:bg-zinc-200/60 hover:text-zinc-800"
          >
            오디오북
          </Link>
          <span aria-hidden>›</span>
          <Link
            href={`/audiobook/${fmt}`}
            className="shrink-0 rounded-md px-1 py-0.5 font-medium transition hover:bg-zinc-200/60 hover:text-zinc-800"
          >
            {meta.short}
          </Link>
          <span aria-hidden>›</span>
          <span className="shrink-0 font-semibold text-zinc-700">{subject}</span>
        </nav>

        {/* Subject header */}
        <header className="mt-3 overflow-hidden rounded-3xl border border-zinc-200 bg-white px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.chip}`}
                >
                  {meta.icon} {meta.short}
                </span>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-bold text-zinc-700">
                  {subject}
                </span>
              </div>
              <h1 className="mt-3 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
                {subject} · {meta.label}
              </h1>
              <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-zinc-600">
                {SUBJECT_INTRO[subject]} · {meta.tagline}.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1 text-right">
              <span className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
                {list.length}챕터 · {formatDuration(totalSec)}
              </span>
              <span className="text-[11px] text-zinc-500">
                챕터당 약 {meta.avgMin}분
              </span>
            </div>
          </div>

          {/* Format switcher — 다른 포맷으로 같은 과목 듣기 */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-zinc-100 pt-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              포맷 전환
            </span>
            {AUDIOBOOK_FORMATS.map((f) => {
              const m = FORMAT_META[f];
              const active = f === fmt;
              return (
                <Link
                  key={f}
                  href={`/audiobook/${f}/${encodeURIComponent(subject)}`}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                    active
                      ? `${m.chip} ring-1 ${m.ring}`
                      : "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:text-zinc-800"
                  }`}
                >
                  {m.icon} {m.short}
                </Link>
              );
            })}
          </div>
        </header>

        {/* Chapter list (client) */}
        <SubjectChapterList chapters={list} themeBar={subjectTheme.bar} />

        {/* Bottom nav */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          <Link
            href={`/audiobook/${fmt}`}
            className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
          >
            ← {meta.short} 다른 과목
          </Link>
          <Link
            href="/audiobook"
            className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
          >
            오디오북 허브
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
