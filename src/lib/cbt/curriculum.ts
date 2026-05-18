import type { Subject } from "./types";

export type SubtopicMeta = {
  id: string;
  name: string;
};

export type TopicMeta = {
  id: string;
  name: string;
  subtopics: SubtopicMeta[];
};

export type SubjectMeta = {
  id: string;
  subject: Subject;
  topics: TopicMeta[];
};

export const TARGET_YEAR_RANGE = "2009~2016년";

export const curriculum: SubjectMeta[] = [
  {
    id: "theory",
    subject: "전기이론",
    topics: [
      {
        id: "dc_circuit",
        name: "직류회로",
        subtopics: [
          { id: "ohm", name: "옴의 법칙" },
          { id: "kirchhoff", name: "키르히호프 법칙" },
          { id: "series_parallel", name: "직병렬 회로" },
          { id: "power", name: "전력과 전력량" },
        ],
      },
      {
        id: "ac_circuit",
        name: "교류회로",
        subtopics: [
          { id: "sine_wave", name: "사인파 교류" },
          { id: "rlc", name: "RLC 회로" },
          { id: "resonance", name: "공진" },
        ],
      },
      {
        id: "electromagnetism",
        name: "전자기",
        subtopics: [
          { id: "magnetic_field", name: "자기장과 자기력" },
          { id: "induction", name: "전자유도" },
          { id: "mutual_induction", name: "상호유도" },
        ],
      },
    ],
  },
  {
    id: "machinery",
    subject: "전기기기",
    topics: [
      {
        id: "transformer",
        name: "변압기",
        subtopics: [
          { id: "principle", name: "원리와 구조" },
          { id: "turn_ratio", name: "권수비" },
          { id: "efficiency", name: "효율과 손실" },
          { id: "connection", name: "결선 방식" },
        ],
      },
      {
        id: "rotating",
        name: "회전기",
        subtopics: [
          { id: "dc_machine", name: "직류기" },
          { id: "induction_motor", name: "유도전동기" },
          { id: "synchronous", name: "동기기" },
        ],
      },
      {
        id: "rectifier",
        name: "정류기",
        subtopics: [
          { id: "diode", name: "다이오드" },
          { id: "thyristor", name: "사이리스터" },
        ],
      },
    ],
  },
  {
    id: "facility",
    subject: "전기설비",
    topics: [
      {
        id: "wire",
        name: "전선과 케이블",
        subtopics: [
          { id: "wire_type", name: "전선의 종류" },
          { id: "wire_size", name: "굵기 선정" },
        ],
      },
      {
        id: "wiring",
        name: "배선공사",
        subtopics: [
          { id: "metal_conduit", name: "금속관 공사" },
          { id: "plastic_conduit", name: "합성수지관 공사" },
          { id: "cable_tray", name: "케이블트레이" },
        ],
      },
      {
        id: "grounding",
        name: "접지",
        subtopics: [
          { id: "grounding_type", name: "접지의 종류" },
          { id: "grounding_resistance", name: "접지 저항" },
        ],
      },
      {
        id: "protection",
        name: "보호장치",
        subtopics: [
          { id: "circuit_breaker", name: "차단기" },
          { id: "elcb", name: "누전차단기" },
        ],
      },
    ],
  },
];

export function findSubject(subjectId: string): SubjectMeta | undefined {
  return curriculum.find((s) => s.id === subjectId);
}

export function findTopic(
  subjectId: string,
  topicId: string,
): TopicMeta | undefined {
  return findSubject(subjectId)?.topics.find((t) => t.id === topicId);
}

export function findSubtopic(
  subjectId: string,
  topicId: string,
  subtopicId: string,
): SubtopicMeta | undefined {
  return findTopic(subjectId, topicId)?.subtopics.find(
    (s) => s.id === subtopicId,
  );
}

export function findSubjectByDisplayName(
  display: Subject,
): SubjectMeta | undefined {
  return curriculum.find((s) => s.subject === display);
}
