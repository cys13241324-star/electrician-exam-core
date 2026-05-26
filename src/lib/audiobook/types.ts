export type Subject = "전기이론" | "전기기기" | "전기설비";

export type Format = "read" | "podcast" | "summary";

/** 같은 주제를 가리키는 단위 (포맷에 독립) */
export type Topic = {
  /** topic 고유 ID (e.g. theory-01). format과 결합해 chapter ID 생성 */
  id: string;
  no: number;
  subject: Subject;
  title: string;
  summary: string;
};

/** 실제 재생 가능한 트랙: topic × format */
export type Chapter = Topic & {
  format: Format;
  /** unique: `${topic.id}--${format}` */
  chapterId: string;
  /** 음성 길이 (초) */
  durationSec: number;
  /** mp3 경로 */
  src: string;
  status: "available" | "coming_soon";
};

export const AUDIOBOOK_SUBJECTS: Subject[] = [
  "전기이론",
  "전기기기",
  "전기설비",
];

export const AUDIOBOOK_FORMATS: Format[] = ["read", "podcast", "summary"];

export type FormatMeta = {
  label: string;
  short: string;
  icon: string;
  tagline: string;
  description: string;
  /** 챕터 평균 길이(분) — 데이터 생성용 */
  avgMin: number;
  accent: string;
  chip: string;
  bar: string;
  ring: string;
  dot: string;
  text: string;
};

export const FORMAT_META: Record<Format, FormatMeta> = {
  read: {
    label: "읽어주는 오디오북",
    short: "읽어주기",
    icon: "📖",
    tagline: "차분한 단일 음성으로 한 챕터 약 20분",
    description:
      "교재를 그대로 낭독한 정통 오디오북. 출퇴근길이나 산책 시간에 정주행하기 좋은 포맷입니다.",
    avgMin: 20,
    accent: "bg-blue-50 text-blue-700 border-blue-100",
    chip: "bg-blue-50 text-blue-700",
    bar: "from-blue-400 to-blue-600",
    ring: "ring-blue-200",
    dot: "bg-blue-500",
    text: "text-blue-700",
  },
  podcast: {
    label: "팟캐스트 대화형",
    short: "팟캐스트",
    icon: "🎙️",
    tagline: "두 명의 자연스러운 대화로 풀어내는 약 25분",
    description:
      "호스트와 강사가 묻고 답하는 형식. 혼자 듣기 지루한 이론도 대화 흐름을 따라가다 보면 머리에 남습니다.",
    avgMin: 25,
    accent: "bg-rose-50 text-rose-700 border-rose-100",
    chip: "bg-rose-50 text-rose-700",
    bar: "from-rose-400 to-rose-600",
    ring: "ring-rose-200",
    dot: "bg-rose-500",
    text: "text-rose-700",
  },
  summary: {
    label: "5분 핵심 요약",
    short: "5분 요약",
    icon: "⚡",
    tagline: "한 챕터를 약 5분으로 압축",
    description:
      "이미 들었던 챕터의 빠른 회독, 시험 직전 마지막 정리에 최적. 핵심 키워드와 공식만 짚어줍니다.",
    avgMin: 5,
    accent: "bg-amber-50 text-amber-700 border-amber-100",
    chip: "bg-amber-50 text-amber-700",
    bar: "from-amber-400 to-amber-600",
    ring: "ring-amber-200",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
};
