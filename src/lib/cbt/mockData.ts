import { curriculum, findSubject, findTopic, findSubtopic } from "./curriculum";
import type {
  Choice,
  Difficulty,
  Exam,
  ExamSummary,
  Frequency,
  Question,
  Subject,
} from "./types";

/**
 * subtopic 별 출제 빈도·난이도 메타. 시험 출제 경향 기반의 휴리스틱.
 * 표에 없으면 frequency=medium, difficulty=medium 으로 간주.
 */
const SUBTOPIC_META: Record<string, { freq?: Frequency; diff?: Difficulty }> = {
  // 전기이론 — 직류회로 (가장 빈출)
  ohm: { freq: "high", diff: "easy" },
  kirchhoff: { freq: "high", diff: "medium" },
  series_parallel: { freq: "high", diff: "medium" },
  power: { freq: "high", diff: "medium" },
  // 전기이론 — 교류회로
  sine_wave: { freq: "medium", diff: "medium" },
  rlc: { freq: "high", diff: "hard" },
  resonance: { freq: "medium", diff: "hard" },
  // 전기이론 — 전자기
  magnetic_field: { freq: "high", diff: "medium" },
  induction: { freq: "high", diff: "medium" },
  mutual_induction: { freq: "medium", diff: "hard" },
  // 전기기기 — 변압기
  principle: { freq: "medium", diff: "easy" },
  turn_ratio: { freq: "high", diff: "medium" },
  efficiency: { freq: "high", diff: "hard" },
  connection: { freq: "medium", diff: "medium" },
  // 전기기기 — 회전기
  dc_machine: { freq: "medium", diff: "medium" },
  induction_motor: { freq: "high", diff: "medium" },
  synchronous: { freq: "medium", diff: "hard" },
};

function metaFor(subtopicId: string): { freq: Frequency; diff: Difficulty } {
  const m = SUBTOPIC_META[subtopicId] ?? {};
  return { freq: m.freq ?? "medium", diff: m.diff ?? "medium" };
}

type SlotMeta = {
  subjectId: string;
  subject: Subject;
  topicId: string;
  topic: string;
  subtopicId: string;
  subtopic: string;
};

function buildSlots(): SlotMeta[] {
  const slots: SlotMeta[] = [];
  for (const s of curriculum) {
    for (const t of s.topics) {
      for (const sub of t.subtopics) {
        slots.push({
          subjectId: s.id,
          subject: s.subject,
          topicId: t.id,
          topic: t.name,
          subtopicId: sub.id,
          subtopic: sub.name,
        });
      }
    }
  }
  return slots;
}

const slots = buildSlots(); // ~28 subtopics

const realPlacements: Record<
  number,
  Omit<Question, "number" | "subjectId" | "topicId" | "subtopicId" | "subject" | "topic" | "subtopic">
> = {
  // 상호유도 → 전기이론 / 전자기 / mutual_induction
  1: {
    questionText:
      "2개의 코일을 서로 근접시켰을 때 한 쪽 코일의 전류가 변화하면 다른 쪽 코일에 유도 기전력이 발생하는 현상을 무엇이라고 하는가?",
    choices: ["상호 결합", "자체유도", "상호 유도", "자체 결합"],
    answer: 3,
    explanation:
      "상호 유도는 한쪽 코일(1차)에 흐르는 전류가 변하면 자속이 변하고, 이 자속이 인접한 코일(2차)을 쇄교하면서 전압이 유도되는 현상을 의미한다.",
  },
  // 검류계(휘트스톤 브릿지) → 전기이론 / 직류회로 / series_parallel
  2: {
    questionText: "회로에서 검류계의 지시기가 0일 때 저항 X는 몇 [Ω]인가?",
    choices: ["10[Ω]", "40[Ω]", "100[Ω]", "400[Ω]"],
    answer: 4,
    explanation:
      "검류계의 지시값이 0이므로 브리지가 평형 상태임을 의미한다. 브리지가 평형인 경우 마주보는 저항의 곱은 서로 같으므로 PR=QX를 만족한다. X에 대해 식을 정리하고 대입하여 계산한다. X=PR/Q=100×40/10 = 400[Ω]",
  },
};

const realSlotMap: Record<number, { subjectId: string; topicId: string; subtopicId: string }> = {
  1: { subjectId: "theory", topicId: "electromagnetism", subtopicId: "mutual_induction" },
  2: { subjectId: "theory", topicId: "dc_circuit", subtopicId: "series_parallel" },
};

function buildSharedQuestions(): Question[] {
  // Distribute 60 questions across slots: 2 per slot first, then fill
  const total = 60;
  const baseAssignments: SlotMeta[] = [];
  // 2 per slot
  for (const slot of slots) {
    baseAssignments.push(slot, slot);
  }
  // Top up with extras (round-robin into popular topic 변압기)
  while (baseAssignments.length < total) {
    const idx = baseAssignments.length % slots.length;
    baseAssignments.push(slots[idx]);
  }
  // Trim to 60 (in case slots × 2 > 60)
  baseAssignments.length = total;

  const result: Question[] = [];
  for (let i = 0; i < total; i++) {
    const number = i + 1;
    let slot = baseAssignments[i];

    // If this number has a real placement, override
    const realPlace = realSlotMap[number];
    if (realPlace) {
      const sMeta = findSubject(realPlace.subjectId)!;
      const tMeta = findTopic(realPlace.subjectId, realPlace.topicId)!;
      const subMeta = findSubtopic(
        realPlace.subjectId,
        realPlace.topicId,
        realPlace.subtopicId,
      )!;
      slot = {
        subjectId: sMeta.id,
        subject: sMeta.subject,
        topicId: tMeta.id,
        topic: tMeta.name,
        subtopicId: subMeta.id,
        subtopic: subMeta.name,
      };
    }

    const real = realPlacements[number];
    const { freq, diff } = metaFor(slot.subtopicId);

    result.push({
      number,
      subjectId: slot.subjectId,
      subject: slot.subject,
      topicId: slot.topicId,
      topic: slot.topic,
      subtopicId: slot.subtopicId,
      subtopic: slot.subtopic,
      questionText:
        real?.questionText ??
        `[샘플 문항 ${number}] ${slot.topic} - ${slot.subtopic}에 관한 설명으로 옳은 것은?`,
      choices:
        real?.choices ??
        ([
          `${slot.subtopic} 보기 1번 설명입니다.`,
          `${slot.subtopic} 보기 2번 설명입니다.`,
          `${slot.subtopic} 보기 3번 설명입니다.`,
          `${slot.subtopic} 보기 4번 설명입니다.`,
        ] as [string, string, string, string]),
      answer: real?.answer ?? ((((number - 1) % 4) + 1) as Choice),
      explanation:
        real?.explanation ??
        `[${slot.subject}] ${slot.topic} - ${slot.subtopic}\n${slot.subtopic}에 대한 핵심 개념을 정리한 해설입니다. 실제 콘텐츠 입력 전 임시 데이터입니다.`,
      frequency: freq,
      difficulty: diff,
    });
  }
  return result;
}

const sharedQuestions = buildSharedQuestions();

export const mockExams: Exam[] = Array.from({ length: 5 }, (_, idx) => {
  const round = idx + 1;
  return {
    id: `exam-${round}`,
    round,
    title: `전기기능사 CBT 모의고사 ${round}회`,
    totalQuestions: 60,
    durationMinutes: 60,
    questions: sharedQuestions,
  };
});

export const mockExamSummaries: ExamSummary[] = mockExams.map((exam, idx) => ({
  id: exam.id,
  round: exam.round,
  title: exam.title,
  totalQuestions: exam.totalQuestions,
  durationMinutes: exam.durationMinutes,
  status: idx === 1 ? "완료" : idx === 2 ? "응시중" : "응시대기",
}));

export function getMockExam(id: string): Exam | undefined {
  return mockExams.find((e) => e.id === id);
}

export type PracticeFilter = {
  subjectId: string;
  topicId?: string;
  subtopicId?: string;
};

function parsePracticeId(id: string): PracticeFilter | null {
  if (!id.startsWith("practice-")) return null;
  const parts = id.slice("practice-".length).split("-");
  if (parts.length === 0) return null;
  return {
    subjectId: parts[0],
    topicId: parts[1],
    subtopicId: parts[2],
  };
}

function buildPracticeId(f: PracticeFilter): string {
  const segments = [f.subjectId];
  if (f.topicId) segments.push(f.topicId);
  if (f.subtopicId) segments.push(f.subtopicId);
  return `practice-${segments.join("-")}`;
}

function buildPracticeExam(filter: PracticeFilter): Exam | undefined {
  const subjectMeta = findSubject(filter.subjectId);
  if (!subjectMeta) return undefined;
  if (filter.topicId && !findTopic(filter.subjectId, filter.topicId))
    return undefined;
  if (
    filter.subtopicId &&
    !findSubtopic(filter.subjectId, filter.topicId!, filter.subtopicId)
  )
    return undefined;

  const matched = sharedQuestions.filter((q) => {
    if (q.subjectId !== filter.subjectId) return false;
    if (filter.topicId && q.topicId !== filter.topicId) return false;
    if (filter.subtopicId && q.subtopicId !== filter.subtopicId) return false;
    return true;
  });

  if (matched.length === 0) return undefined;

  const renumbered: Question[] = matched.map((q, i) => ({ ...q, number: i + 1 }));

  let title = `${subjectMeta.subject}`;
  if (filter.topicId) {
    const t = findTopic(filter.subjectId, filter.topicId)!;
    title += ` · ${t.name}`;
    if (filter.subtopicId) {
      const sub = findSubtopic(
        filter.subjectId,
        filter.topicId,
        filter.subtopicId,
      )!;
      title += ` · ${sub.name}`;
    }
  } else {
    title += " 전체";
  }

  // 1.5분/문항, 최소 10분, 최대 60분
  const durationMinutes = Math.min(
    60,
    Math.max(10, Math.round(matched.length * 1.5)),
  );

  return {
    id: buildPracticeId(filter),
    round: 0,
    title,
    totalQuestions: matched.length,
    durationMinutes,
    questions: renumbered,
  };
}

export type FocusFilter = {
  frequency?: Frequency;
  difficulty?: Difficulty;
  /** 회차 페이지에서 생성 시 연도 라벨. 문항 풀은 공유(라벨 용도). */
  year?: number;
};

function parseFocusId(id: string): FocusFilter | null {
  if (!id.startsWith("focus-")) return null;
  const rest = id.slice("focus-".length);
  const parts = rest.split("-");
  const filter: FocusFilter = {};
  for (let i = 0; i < parts.length; i += 2) {
    const key = parts[i];
    const value = parts[i + 1];
    if (key === "freq" && (value === "high" || value === "medium" || value === "low")) {
      filter.frequency = value;
    } else if (
      key === "diff" &&
      (value === "easy" || value === "medium" || value === "hard")
    ) {
      filter.difficulty = value;
    } else if (key === "year") {
      const n = parseInt(value, 10);
      if (!Number.isNaN(n)) filter.year = n;
    }
  }
  return filter;
}

export function buildFocusId(f: FocusFilter): string {
  const parts: string[] = [];
  if (f.frequency) parts.push("freq", f.frequency);
  if (f.difficulty) parts.push("diff", f.difficulty);
  if (f.year) parts.push("year", String(f.year));
  return `focus-${parts.join("-")}`;
}

const FREQ_KO: Record<Frequency, string> = {
  high: "빈출",
  medium: "보통",
  low: "저빈출",
};

const DIFF_KO: Record<Difficulty, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

function buildFocusExam(filter: FocusFilter): Exam | undefined {
  const matched = sharedQuestions.filter((q) => {
    if (filter.frequency && (q.frequency ?? "medium") !== filter.frequency)
      return false;
    if (filter.difficulty && (q.difficulty ?? "medium") !== filter.difficulty)
      return false;
    return true;
  });

  if (matched.length === 0) return undefined;

  const renumbered: Question[] = matched.map((q, i) => ({ ...q, number: i + 1 }));

  const titleParts: string[] = [];
  if (filter.frequency) titleParts.push(`${FREQ_KO[filter.frequency]} 문항`);
  if (filter.difficulty) titleParts.push(`${DIFF_KO[filter.difficulty]}`);
  const tagText = titleParts.length > 0 ? ` — ${titleParts.join(" · ")}` : "";
  const title = filter.year
    ? `${filter.year}년 생성 시험지${tagText}`
    : `집중 응시${tagText}`;

  // 1.5분/문항, 최소 10분, 최대 60분
  const durationMinutes = Math.min(
    60,
    Math.max(10, Math.round(matched.length * 1.5)),
  );

  return {
    id: buildFocusId(filter),
    round: 0,
    title,
    totalQuestions: matched.length,
    durationMinutes,
    questions: renumbered,
  };
}

export function countByFocus(filter: FocusFilter): number {
  return sharedQuestions.filter((q) => {
    if (filter.frequency && (q.frequency ?? "medium") !== filter.frequency)
      return false;
    if (filter.difficulty && (q.difficulty ?? "medium") !== filter.difficulty)
      return false;
    return true;
  }).length;
}

export function getExamById(id: string): Exam | undefined {
  if (id.startsWith("practice-")) {
    const filter = parsePracticeId(id);
    if (!filter) return undefined;
    return buildPracticeExam(filter);
  }
  if (id.startsWith("focus-")) {
    const filter = parseFocusId(id);
    if (!filter) return undefined;
    return buildFocusExam(filter);
  }
  if (id.startsWith("custom-")) {
    const filter = parseCustomId(id);
    if (!filter) return undefined;
    return buildCustomExam(filter);
  }
  return getMockExam(id);
}

export function countQuestionsBy(filter: PracticeFilter): number {
  return sharedQuestions.filter((q) => {
    if (q.subjectId !== filter.subjectId) return false;
    if (filter.topicId && q.topicId !== filter.topicId) return false;
    if (filter.subtopicId && q.subtopicId !== filter.subtopicId) return false;
    return true;
  }).length;
}

export { buildPracticeId };

// ── 나만의 시험 (custom) ──────────────────────────────────────────
// 설정을 라우트 id 에 인코딩해 take/result/review 가 동일 시험을 결정적으로 재구성.

export type CustomFilter = {
  subjects: string[]; // subjectId 배열 (빈 배열 = 전과목)
  frequency?: Frequency;
  difficulty?: Difficulty;
  count: number; // 목표 문항 수 (0 = 가능한 전부)
  minutes: number; // 제한 시간(분)
};

export function buildCustomId(f: CustomFilter): string {
  const subj = f.subjects.length ? [...f.subjects].sort().join(".") : "all";
  return [
    "custom",
    `s.${subj}`,
    `f.${f.frequency ?? "any"}`,
    `d.${f.difficulty ?? "any"}`,
    `n.${Math.max(0, Math.floor(f.count))}`,
    `m.${Math.max(1, Math.floor(f.minutes))}`,
  ].join("-");
}

function parseCustomId(id: string): CustomFilter | null {
  if (!id.startsWith("custom-")) return null;
  const f: CustomFilter = { subjects: [], count: 0, minutes: 0 };
  for (const part of id.slice("custom-".length).split("-")) {
    const dot = part.indexOf(".");
    if (dot < 0) continue;
    const k = part.slice(0, dot);
    const v = part.slice(dot + 1);
    if (k === "s") {
      f.subjects = v === "all" ? [] : v.split(".").filter(Boolean);
    } else if (k === "f" && (v === "high" || v === "medium" || v === "low")) {
      f.frequency = v;
    } else if (
      k === "d" &&
      (v === "easy" || v === "medium" || v === "hard")
    ) {
      f.difficulty = v;
    } else if (k === "n") {
      f.count = Math.max(0, parseInt(v, 10) || 0);
    } else if (k === "m") {
      f.minutes = Math.max(1, parseInt(v, 10) || 0);
    }
  }
  return f;
}

function matchCustom(f: CustomFilter): Question[] {
  return sharedQuestions.filter((q) => {
    if (f.subjects.length && !f.subjects.includes(q.subjectId)) return false;
    if (f.frequency && (q.frequency ?? "medium") !== f.frequency) return false;
    if (f.difficulty && (q.difficulty ?? "medium") !== f.difficulty)
      return false;
    return true;
  });
}

export function countCustom(f: CustomFilter): number {
  return matchCustom(f).length;
}

function buildCustomExam(f: CustomFilter): Exam | undefined {
  const matched = matchCustom(f);
  if (matched.length === 0) return undefined;

  const take =
    f.count > 0 ? Math.min(f.count, matched.length) : matched.length;
  const renumbered: Question[] = matched
    .slice(0, take)
    .map((q, i) => ({ ...q, number: i + 1 }));

  const subjKo = f.subjects.length
    ? f.subjects.map((id) => findSubject(id)?.subject ?? id).join("·")
    : "전과목";
  const tags: string[] = [];
  if (f.frequency) tags.push(FREQ_KO[f.frequency]);
  if (f.difficulty) tags.push(DIFF_KO[f.difficulty]);
  const title = `나만의 시험 — ${subjKo}${
    tags.length ? ` · ${tags.join(" · ")}` : ""
  } · ${renumbered.length}문항`;

  const durationMinutes = Math.min(180, Math.max(1, f.minutes));

  return {
    id: buildCustomId(f),
    round: 0,
    title,
    totalQuestions: renumbered.length,
    durationMinutes,
    questions: renumbered,
  };
}
