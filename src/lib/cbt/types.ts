export type ExamStatus = "응시대기" | "응시중" | "완료";

export type Subject = "전기이론" | "전기기기" | "전기설비";

export type Choice = 1 | 2 | 3 | 4;

/** 출제 빈도 — 시험에서 얼마나 자주 나오는지 */
export type Frequency = "high" | "medium" | "low";

/** 난이도 */
export type Difficulty = "easy" | "medium" | "hard";

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  high: "빈출",
  medium: "보통",
  low: "저빈출",
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

export type Question = {
  number: number;
  subjectId: string;
  subject: Subject;
  topicId: string;
  topic: string;
  subtopicId: string;
  subtopic: string;
  questionText: string;
  choices: [string, string, string, string];
  answer: Choice;
  explanation: string;
  /** 출제 빈도 (없으면 medium 으로 간주) */
  frequency?: Frequency;
  /** 난이도 (없으면 medium 으로 간주) */
  difficulty?: Difficulty;
};

export type Exam = {
  id: string;
  round: number;
  title: string;
  totalQuestions: number;
  durationMinutes: number;
  questions: Question[];
};

export type ExamSummary = {
  id: string;
  round: number;
  title: string;
  totalQuestions: number;
  durationMinutes: number;
  status: ExamStatus;
};

export type Attempt = {
  examId: string;
  examineeName: string;
  startedAt: number;
  endsAt: number;
  answers: (Choice | null)[];
  checked: boolean[];
  submittedAt: number | null;
};

export type LayoutMode = "single" | "double" | "one";

export type FontScale = 100 | 130 | 150;
