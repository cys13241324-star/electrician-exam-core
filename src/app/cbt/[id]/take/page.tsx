import { notFound } from "next/navigation";
import ExamTaker from "@/components/cbt/ExamTaker";
import { getExamById } from "@/lib/cbt/mockData";

export default async function TakeExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = getExamById(id);

  if (!exam) {
    notFound();
  }

  return <ExamTaker exam={exam} />;
}
