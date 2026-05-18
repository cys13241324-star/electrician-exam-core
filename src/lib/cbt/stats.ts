import type { Attempt, Subject } from "./types";
import { mockExams } from "./mockData";

export type SubjectAggregate = {
  subject: Subject;
  correct: number;
  total: number;
};

export type TopicAggregate = {
  subject: Subject;
  topic: string;
  correct: number;
  total: number;
  accuracy: number;
};

export type LearningStats = {
  hasAnyAttempt: boolean;
  totalAttempts: number;
  recentAttemptsThisMonth: number;
  totalAnsweredQuestions: number;
  totalCorrectQuestions: number;
  averageAccuracy: number;
  subjects: SubjectAggregate[];
  weakestTopics: TopicAggregate[];
  totalStudyMinutes: number;
  recentMonthStudyMinutes: number;
};

const SUBJECT_ORDER: Subject[] = ["전기이론", "전기기기", "전기설비"];

export function readAttempts(): Attempt[] {
  if (typeof window === "undefined") return [];
  const attempts: Attempt[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith("cbt-attempt-")) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as Attempt;
      attempts.push(parsed);
    } catch {
      /* skip malformed */
    }
  }
  return attempts;
}

export function computeLearningStats(): LearningStats {
  const attempts = readAttempts();
  const submitted = attempts.filter((a) => a.submittedAt !== null);

  const subjectMap = new Map<Subject, SubjectAggregate>();
  SUBJECT_ORDER.forEach((s) => {
    subjectMap.set(s, { subject: s, correct: 0, total: 0 });
  });

  const topicMap = new Map<string, TopicAggregate>();

  let totalAnsweredQuestions = 0;
  let totalCorrectQuestions = 0;
  let totalStudyMinutes = 0;
  let recentMonthStudyMinutes = 0;

  const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  let recentAttemptsThisMonth = 0;

  for (const attempt of submitted) {
    const exam = mockExams.find((e) => e.id === attempt.examId);
    if (!exam) continue;

    const finishedAt = attempt.submittedAt ?? attempt.endsAt;
    const elapsedMin = Math.max(
      0,
      Math.round((finishedAt - attempt.startedAt) / 60000),
    );
    totalStudyMinutes += elapsedMin;

    if (finishedAt >= oneMonthAgo) {
      recentAttemptsThisMonth += 1;
      recentMonthStudyMinutes += elapsedMin;
    }

    exam.questions.forEach((q, i) => {
      const userAnswer = attempt.answers[i];
      if (userAnswer === null) return;
      totalAnsweredQuestions += 1;
      const isCorrect = userAnswer === q.answer;
      if (isCorrect) totalCorrectQuestions += 1;

      const sub = subjectMap.get(q.subject)!;
      sub.total += 1;
      if (isCorrect) sub.correct += 1;

      const topicKey = `${q.subject}::${q.topic}`;
      const existing = topicMap.get(topicKey);
      if (existing) {
        existing.total += 1;
        if (isCorrect) existing.correct += 1;
      } else {
        topicMap.set(topicKey, {
          subject: q.subject,
          topic: q.topic,
          total: 1,
          correct: isCorrect ? 1 : 0,
          accuracy: 0,
        });
      }
    });
  }

  const topics = Array.from(topicMap.values()).map((t) => ({
    ...t,
    accuracy: t.total > 0 ? t.correct / t.total : 0,
  }));

  const weakestTopics = topics
    .filter((t) => t.total >= 1)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const averageAccuracy =
    totalAnsweredQuestions > 0
      ? totalCorrectQuestions / totalAnsweredQuestions
      : 0;

  return {
    hasAnyAttempt: submitted.length > 0,
    totalAttempts: submitted.length,
    recentAttemptsThisMonth,
    totalAnsweredQuestions,
    totalCorrectQuestions,
    averageAccuracy,
    subjects: SUBJECT_ORDER.map((s) => subjectMap.get(s)!),
    weakestTopics,
    totalStudyMinutes,
    recentMonthStudyMinutes,
  };
}

export function formatHours(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const hours = minutes / 60;
  return `${hours.toFixed(1)}시간`;
}
