import { notFound } from "next/navigation";
import ReviewView from "@/components/cbt/ReviewView";
import { getExamById } from "@/lib/cbt/mockData";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = getExamById(id);

  if (!exam) {
    notFound();
  }

  return <ReviewView exam={exam} />;
}
