import { notFound } from "next/navigation";
import ResultView from "@/components/cbt/ResultView";
import { getExamById } from "@/lib/cbt/mockData";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = getExamById(id);

  if (!exam) {
    notFound();
  }

  return <ResultView exam={exam} />;
}
