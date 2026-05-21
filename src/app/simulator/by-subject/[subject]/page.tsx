import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimulatorList from "@/components/SimulatorList";
import { simulators, SIMULATOR_SUBJECTS } from "@/lib/simulators";
import type { Subject } from "@/lib/simulators";

export async function generateStaticParams() {
  return SIMULATOR_SUBJECTS.map((subject) => ({ subject }));
}

const SUBJECT_LABEL: Record<Subject, { eyebrow: string; subtitle: string }> = {
  전기이론: {
    eyebrow: "INTERACTIVE SIMULATOR · 전기이론",
    subtitle:
      "직류·교류·정전기·자기·회로망 정리까지, 전기자기학 포함 전기이론의 핵심을 시각화로 익힙니다.",
  },
  전기기기: {
    eyebrow: "INTERACTIVE SIMULATOR · 전기기기",
    subtitle:
      "변압기·유도전동기·동기기·정류기 — 회전기와 변환기의 동작을 직접 만져 봅니다.",
  },
  전기설비: {
    eyebrow: "INTERACTIVE SIMULATOR · 전기설비",
    subtitle:
      "전선·배선·접지·차단기 — 시공·운용 현장에서 쓰이는 설비 감각을 키웁니다.",
  },
};

function parseSubject(raw: string): Subject | null {
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    /* noop */
  }
  return (SIMULATOR_SUBJECTS as readonly string[]).includes(decoded)
    ? (decoded as Subject)
    : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>;
}): Promise<Metadata> {
  const { subject: rawSubject } = await params;
  const subject = parseSubject(rawSubject);
  if (!subject) return { title: "과목별 시뮬레이터" };
  return {
    title: `${subject} 시뮬레이터 · 이론 시뮬레이터`,
    description: SUBJECT_LABEL[subject].subtitle,
  };
}

export default async function SimulatorBySubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: rawSubject } = await params;
  const subject = parseSubject(rawSubject);
  if (!subject) notFound();

  const filtered = simulators.filter((s) => s.subject === subject);
  const meta = SUBJECT_LABEL[subject];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-6 sm:py-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/simulator"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
          >
            ← 시뮬레이터 허브
          </Link>
          <Link
            href="/simulator/all"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
          >
            전체 보기 →
          </Link>
        </div>

        <header className="mb-6">
          <p className="text-xs font-semibold tracking-wide text-sky-600">
            {meta.eyebrow}
          </p>
          <h1 className="mt-1 text-xl font-bold text-zinc-900 sm:text-2xl">
            {subject} 시뮬레이터
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-zinc-600">
            {meta.subtitle}
          </p>
        </header>

        <SimulatorList
          simulators={filtered}
          initialSubject={subject}
          compact
        />
      </main>
      <Footer />
    </div>
  );
}
