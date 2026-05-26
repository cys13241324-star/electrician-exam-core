import {
  AUDIOBOOK_FORMATS,
  AUDIOBOOK_SUBJECTS,
  FORMAT_META,
  type Chapter,
  type Format,
  type Subject,
  type Topic,
} from "./types";

const SAMPLE_SRC = "/audio/audiobook/sample.mp3";

/**
 * 음성 파일 base URL.
 * - 설정되어 있으면: 그 base 아래의 SRC_OVERRIDES 상대 경로를 합성 (Supabase Storage 등)
 *   예) https://xxxx.supabase.co/storage/v1/object/public/audiobook
 * - 비어 있으면: 로컬 /public/audio/audiobook/ 에서 서빙
 *
 * NEXT_PUBLIC_ 접두사라 클라이언트 번들에도 inline 됩니다.
 */
const AUDIO_BASE =
  process.env.NEXT_PUBLIC_AUDIO_BASE_URL?.replace(/\/$/, "") ??
  "/audio/audiobook";

/**
 * chapterId(`${topicId}--${format}`) → AUDIO_BASE 아래의 상대 경로.
 * 등록되지 않은 챕터는 SAMPLE_SRC 로 폴백.
 *
 * 폴더 컨벤션: `<format>/<파일명>.m4a|mp3`
 *   로컬: /audio/audiobook/podcast/foo.m4a
 *   Supabase: <base>/podcast/foo.m4a
 */
const SRC_OVERRIDES: Record<string, string> = {
  // 폴더 컨벤션: <format>/<topic-id>.m4a 권장.
  // 지금은 Supabase 버킷 루트에 올라가 있어 폴더 없이 매핑.
  "theory-01--podcast": "theory-01.m4a",
};

function resolveSrc(chapterId: string): string {
  const rel = SRC_OVERRIDES[chapterId];
  if (!rel) return SAMPLE_SRC;
  return `${AUDIO_BASE}/${encodeURI(rel)}`;
}

/**
 * 콘텐츠의 의미 단위 (22 topic).
 * 같은 topic은 3개의 format(읽기/팟캐/요약)으로 각각 트랙이 생성됩니다.
 */
export const topics: Topic[] = [
  // ─── 전기이론 (8) ───
  {
    id: "theory-01",
    no: 1,
    subject: "전기이론",
    title: "전기의 본질과 단위계",
    summary: "전하·전류·전압의 정의와 SI 단위. 회로 해석을 위한 기본 약속.",
  },
  {
    id: "theory-02",
    no: 2,
    subject: "전기이론",
    title: "직류회로 — 옴의 법칙과 저항 합성",
    summary: "옴의 법칙, 직·병렬 저항 합성, 분압·분류기의 원리.",
  },
  {
    id: "theory-03",
    no: 3,
    subject: "전기이론",
    title: "키르히호프 법칙과 회로 해석",
    summary: "KCL/KVL, 마디·메시 해석, 중첩의 원리.",
  },
  {
    id: "theory-04",
    no: 4,
    subject: "전기이론",
    title: "정전기와 콘덴서",
    summary: "전계·전위, 콘덴서 충방전, 정전 에너지의 의미.",
  },
  {
    id: "theory-05",
    no: 5,
    subject: "전기이론",
    title: "자기장·전자유도",
    summary: "자기력, 패러데이 법칙, 인덕터의 동작.",
  },
  {
    id: "theory-06",
    no: 6,
    subject: "전기이론",
    title: "교류회로의 기초",
    summary: "정현파의 표현, 위상·실효값·평균값.",
  },
  {
    id: "theory-07",
    no: 7,
    subject: "전기이론",
    title: "RLC 회로와 공진",
    summary: "임피던스, 직렬·병렬 공진, 역률과 무효전력.",
  },
  {
    id: "theory-08",
    no: 8,
    subject: "전기이론",
    title: "3상 교류와 전력",
    summary: "Y/Δ 결선, 선간·상전압, 3상 전력의 계산.",
  },

  // ─── 전기기기 (5) ───
  {
    id: "machine-01",
    no: 1,
    subject: "전기기기",
    title: "직류기 — 발전기와 전동기",
    summary: "정류자·계자·전기자의 역할과 직류기의 특성.",
  },
  {
    id: "machine-02",
    no: 2,
    subject: "전기기기",
    title: "유도전동기 — 회전 자계와 슬립",
    summary: "회전 자계 형성, 슬립의 의미, 토크·속도 특성.",
  },
  {
    id: "machine-03",
    no: 3,
    subject: "전기기기",
    title: "동기기 — 발전기·전동기",
    summary: "동기속도, 여자, 위상조정과 V곡선.",
  },
  {
    id: "machine-04",
    no: 4,
    subject: "전기기기",
    title: "변압기 — 권수비와 손실",
    summary: "이상 변압기, 등가회로, 효율과 전압강하.",
  },
  {
    id: "machine-05",
    no: 5,
    subject: "전기기기",
    title: "전력변환 — 정류·인버터",
    summary: "다이오드·SCR 정류, 인버터와 전력전자의 기초.",
  },

  // ─── 전기설비 (9) ───
  {
    id: "facility-01",
    no: 1,
    subject: "전기설비",
    title: "전선과 케이블",
    summary: "도체·절연체 분류, 허용전류와 굵기 선정.",
  },
  {
    id: "facility-02",
    no: 2,
    subject: "전기설비",
    title: "배선 공사 방법",
    summary: "금속관·합성수지관·케이블 공사의 적용 기준.",
  },
  {
    id: "facility-03",
    no: 3,
    subject: "전기설비",
    title: "차단기와 개폐기",
    summary: "차단기 종류, 동작 원리, 정격과 차단용량.",
  },
  {
    id: "facility-04",
    no: 4,
    subject: "전기설비",
    title: "접지와 등전위 본딩",
    summary: "접지의 목적, KEC 접지 체계, 접지저항.",
  },
  {
    id: "facility-05",
    no: 5,
    subject: "전기설비",
    title: "보호장치와 누전",
    summary: "과전류·누전 보호, 협조 설계의 원칙.",
  },
  {
    id: "facility-06",
    no: 6,
    subject: "전기설비",
    title: "조명 설비",
    summary: "광원의 종류, 조도 계산, 조명 설계의 기준.",
  },
  {
    id: "facility-07",
    no: 7,
    subject: "전기설비",
    title: "동력 설비",
    summary: "전동기 부하, 기동 방식, 역률 개선.",
  },
  {
    id: "facility-08",
    no: 8,
    subject: "전기설비",
    title: "수변전 설비",
    summary: "수전 방식, 변압기·차단기 구성, 단선도 읽기.",
  },
  {
    id: "facility-09",
    no: 9,
    subject: "전기설비",
    title: "안전 기준과 KEC",
    summary: "KEC 핵심 규정과 시험에 자주 나오는 안전 기준.",
  },
];

/** topic 번호로 약간의 길이 변형을 더해 자연스럽게 */
function makeDurationSec(format: Format, topicNo: number): number {
  const base = FORMAT_META[format].avgMin;
  // ±2분 변형 (요약은 ±1분으로 축소)
  const variance =
    format === "summary"
      ? [-1, 0, 1, 0, -1][topicNo % 5]
      : [-2, -1, 0, 1, 2][topicNo % 5];
  return Math.max(60, (base + variance) * 60);
}

/** topic × format 모든 조합으로 생성 (22 × 3 = 66) */
export const chapters: Chapter[] = AUDIOBOOK_FORMATS.flatMap((format) =>
  topics.map<Chapter>((t) => {
    const chapterId = `${t.id}--${format}`;
    return {
      ...t,
      format,
      chapterId,
      durationSec: makeDurationSec(format, t.no),
      src: resolveSrc(chapterId),
      status: "available",
    };
  }),
);

// ─── helpers ───────────────────────────────────────────────

export function chaptersByFormat(format: Format): Chapter[] {
  return chapters.filter((c) => c.format === format);
}

export function chaptersByFormatAndSubject(
  format: Format,
  subject: Subject,
): Chapter[] {
  return chapters.filter((c) => c.format === format && c.subject === subject);
}

export function topicsBySubject(subject: Subject): Topic[] {
  return topics.filter((t) => t.subject === subject);
}

export function chapterById(id: string): Chapter | undefined {
  return chapters.find((c) => c.chapterId === id);
}

export function topicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function totalDurationSec(
  format?: Format,
  subject?: Subject,
): number {
  let list: Chapter[] = chapters;
  if (format) list = list.filter((c) => c.format === format);
  if (subject) list = list.filter((c) => c.subject === subject);
  return list.reduce((acc, c) => acc + c.durationSec, 0);
}

export function formatStats() {
  return AUDIOBOOK_FORMATS.map((format) => {
    const list = chaptersByFormat(format);
    return {
      format,
      total: list.length,
      durationSec: list.reduce((a, c) => a + c.durationSec, 0),
    };
  });
}

export function subjectStatsForFormat(format: Format) {
  return AUDIOBOOK_SUBJECTS.map((subject) => {
    const list = chaptersByFormatAndSubject(format, subject);
    const available = list.filter((c) => c.status === "available").length;
    return {
      subject,
      total: list.length,
      available,
      durationSec: list.reduce((a, c) => a + c.durationSec, 0),
    };
  });
}

// ─── format helpers ────────────────────────────────────────

export function formatDuration(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
  if (h > 0) return `${h}시간`;
  if (m > 0) return `${m}분`;
  return `${totalSec}초`;
}

export function formatChapterDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
