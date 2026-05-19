import Link from "next/link";
import { notFound } from "next/navigation";
import WrongNotes from "@/components/cbt/WrongNotes";
import { getExamById } from "@/lib/cbt/mockData";

export default async function RoundWrongNotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = getExamById(id);

  if (!exam) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-rose-700">
              회차별 오답노트
            </p>
            <h1 className="mt-1 text-2xl font-bold text-zinc-900">
              {exam.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              이 회차에서 틀린 문제만 모았습니다. 전체 누적 오답은 상단{" "}
              <Link
                href="/cbt/wrong-notes"
                className="font-semibold text-rose-700 underline-offset-2 hover:underline"
              >
                오답노트
              </Link>{" "}
              탭에서 볼 수 있습니다.
            </p>
          </div>
          <Link
            href={`/cbt/${id}/result`}
            className="flex-shrink-0 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            ← 결과로
          </Link>
        </div>

        <WrongNotes examId={id} />
      </main>
    </div>
  );
}
