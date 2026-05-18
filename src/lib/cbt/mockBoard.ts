export type Notice = {
  id: string;
  title: string;
  date: string;
  pinned?: boolean;
  badge?: string;
};

export type BoardPost = {
  id: string;
  title: string;
  author: string;
  date: string;
  replies: number;
};

export const notices: Notice[] = [
  {
    id: "n1",
    title: "[리뷰이벤트] 후기 작성 시 상품권 지급 안내",
    date: "2026.05.05",
    badge: "이벤트",
  },
  {
    id: "n2",
    title: "1.0.3 업데이트 안내 | 해설 페이지 개선",
    date: "2026.04.27",
  },
  {
    id: "n3",
    title: "1.0.2 업데이트 안내 | 문항 이동 개선",
    date: "2026.04.18",
  },
  {
    id: "n4",
    title: "전기기능사 CBT 모의고사 정식 출시",
    date: "2026.04.10",
    pinned: true,
  },
  {
    id: "n5",
    title: "과목별 학습 기능 변경 안내",
    date: "2026.03.29",
  },
  {
    id: "n6",
    title: "성능 개선 안내",
    date: "2026.03.15",
  },
];

export const boardPosts: BoardPost[] = [
  {
    id: "b1",
    title: "전기기능사 첫 도전인데 어떤 순서로 공부하면 좋을까요?",
    author: "초보학습",
    date: "2026.05.07",
    replies: 12,
  },
  {
    id: "b2",
    title: "변압기 권수비 계산 문제 풀이 팁",
    author: "전기달인",
    date: "2026.05.06",
    replies: 8,
  },
  {
    id: "b3",
    title: "기출 5회분 풀고 86점 달성 후기",
    author: "합격기원",
    date: "2026.05.04",
    replies: 24,
  },
  {
    id: "b4",
    title: "오디오북으로 이론 정리 어떻게 활용하시나요?",
    author: "출퇴근러",
    date: "2026.05.02",
    replies: 5,
  },
  {
    id: "b5",
    title: "콘덴서 직병렬 결합 헷갈리는데...",
    author: "전기이론",
    date: "2026.04.30",
    replies: 9,
  },
];
