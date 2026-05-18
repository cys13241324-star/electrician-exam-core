export type Subject = "전기이론" | "전기기기" | "전기설비";

export type CardExample = {
  question: string;
  solution: string[];
  answer: string;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  subject: Subject;
  topic: string;
  hint?: string;
  example?: CardExample;
  source?: string;
};
