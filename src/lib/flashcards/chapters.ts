import type { Subject } from "./types";

/**
 * 플립카드 챕터 구성 — 과목당 약 5개의 상위 챕터.
 *
 * 카드 데이터(`subject`/`topic`)는 그대로 두고, 여기서 세부 topic 들을
 * 의미상 가까운 5개 상위 챕터로 "묶어서" 보여 줍니다(데이터 변경 없음).
 * 각 챕터의 `topics` 에 속한 카드들이 그 챕터로 모입니다.
 *
 * 카드 수가 한쪽으로 쏠리지 않도록(거의 빈 챕터/한 챕터 몰림 방지)
 * 실제 카드 개수를 세어 균형 있게 묶었습니다. 옆 주석의 숫자는 현재 카드 수.
 */
export type ChapterDef = {
  /** 화면에 보이는 챕터 이름 */
  title: string;
  /** 이 챕터로 묶이는 카드들의 원본 topic 목록 */
  topics: string[];
};

export const CHAPTER_DEFS: Record<Subject, ChapterDef[]> = {
  전기이론: [
    { title: "직류회로", topics: ["직류회로"] }, // ≈23
    { title: "정전기·전자기 유도", topics: ["정전기", "전자기 유도"] }, // ≈32
    { title: "자기·비정현파", topics: ["자기·자기회로", "비정현파 교류"] }, // ≈32
    { title: "교류·3상 회로", topics: ["교류회로", "3상 교류"] }, // ≈34
    { title: "회로망 정리", topics: ["회로망 정리"] }, // ≈16
  ],
  전기기기: [
    { title: "직류기·동기기", topics: ["직류기", "동기기"] }, // ≈29
    { title: "변압기", topics: ["변압기"] }, // ≈21
    { title: "유도전동기", topics: ["유도전동기"] }, // ≈19
    { title: "전력변환·제어기기", topics: ["정류·전력변환", "제어기기"] }, // ≈29
    { title: "특수기기·시험·정격", topics: ["특수기기", "시험·정격"] }, // ≈27
  ],
  전기설비: [
    {
      title: "전선·케이블·배선재료",
      topics: ["전선·케이블", "배선재료·공구"],
    }, // ≈34
    { title: "배선공사·옥내배선", topics: ["배선공사", "옥내배선"] }, // ≈30
    { title: "접지·피뢰보호", topics: ["접지", "피뢰·보호"] }, // ≈32
    { title: "차단기·보호장치", topics: ["차단기·보호장치"] }, // ≈17
    { title: "변전·배전", topics: ["변전·배전"] }, // ≈16
  ],
};

export const ALL_SUBJECTS: Subject[] = ["전기이론", "전기기기", "전기설비"];

/** 잔여(미분류) 카드를 흡수하는 챕터 이름. 빈자리 방지용. */
export const RESIDUAL_CHAPTER = "기타";

/**
 * 호환용: 과목별 챕터(상위 묶음) 이름 목록.
 * 기존에 CHAPTERS[subject] 를 문자열 배열로 쓰던 코드와 호환됩니다.
 */
export const CHAPTERS: Record<Subject, string[]> = {
  전기이론: CHAPTER_DEFS.전기이론.map((c) => c.title),
  전기기기: CHAPTER_DEFS.전기기기.map((c) => c.title),
  전기설비: CHAPTER_DEFS.전기설비.map((c) => c.title),
};

/** 카드 topic 이 정의된 상위 챕터 어디에 속하는지. 안 속하면 null. */
export function subjectOfChapter(chapter: string): Subject | null {
  for (const subject of ALL_SUBJECTS) {
    if (CHAPTERS[subject].includes(chapter)) return subject;
  }
  return null;
}

/** 어떤 카드 topic 이 그 과목 안에서 정의된 챕터 묶음에 속하는지 여부. */
export function topicIsMapped(subject: Subject, topic: string): boolean {
  return CHAPTER_DEFS[subject].some((def) => def.topics.includes(topic));
}
